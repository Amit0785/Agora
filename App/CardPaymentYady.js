import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Modal,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {COLORS, FONT, HEIGHT, WIDTH} from '../../Utils/constants';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
//import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';
import Hud from '../../Common/hud';
import Loader from '../../Common/loader';
import Apis from '../../Services/apis';
import Toast from 'react-native-simple-toast';
import OptionsMenu from 'react-native-option-menu';
import {
  CreditCardInput,
  LiteCreditCardInput,
} from 'react-native-credit-card-input';
import stripe from 'tipsi-stripe';
import {PaymentIcon} from 'react-native-payment-icons';

const PaymentOption = props => {
  const [cardlist, setCardList] = useState([]);
  const [cardview, setCardView] = useState(false);
  const [cardvalue, setCardvalue] = useState(null);
  const [cardvalid, setCardvalid] = useState(false);
  const [loading, setLoading] = useState(false);
  stripe.setOptions({
    // publishableKey: 'pk_test_51KLOfwSF4Qr5K5AQSXTYKdDg96xOdVYa4fYSaHoJyjquf5unfrfRfRd432rqKqoU4lXZTCN1SnpcZSx1T1YYCRE9007J0zKtwi',
    publishableKey: 'pk_test_R1dALSLgt4yc3tlnmbvWrydg00ZQIZ6Qfb',
  });

  useEffect(() => {
    getCardList();
  }, []);

  const getCardList = async () => {
    let usertoken = await AsyncStorage.getItem('user_token');
    let token = JSON.parse(usertoken);
    console.log('token123=', token);
    Hud.showHud();
    await Apis.getAllCards(token)
      .then(async res => {
        console.warn('res', res);
        if (res.success == true) {
          Hud.hideHud();
          setCardList(res.data);
        } else {
          Hud.hideHud();
          setCardList([]);
          Toast.show(res.message);
        }
      })
      .catch(error => {
        Hud.hideHud();
        console.error(error);
      });
  };

  const _onChange = form => {
    // console.log('card',form)
    setCardvalue(form.values);
    setCardvalid(form.valid);
  };
  const doCardValidation = async () => {
    if (cardvalid == true) {
      const params = {
        // mandatory
        number: cardvalue.number,
        expMonth: parseInt(cardvalue.expiry.substring(0, 2)),
        expYear: parseInt(cardvalue.expiry.substring(3, 5)),
        cvc: cardvalue.cvc,
        // optional
        name: cardvalue.name,
      };
      //console.log('params',params)
      try {
        setLoading(true);
        const token = await stripe.createTokenWithCard(params);
        console.log('token', token);
        saveCard(token.tokenId);
      } catch (error) {
        console.log('handleCardPayPress Error ', error);
        setLoading(false);
      }
    } else {
      Alert.alert('Sorry', 'Please provide a valid card');
    }
  };
  const saveCard = async stripetoken => {
    let usertoken = await AsyncStorage.getItem('user_token');
    let UToken = JSON.parse(usertoken);
    const useremail = await AsyncStorage.getItem('user_email');
    const username = await AsyncStorage.getItem('user_name');
    if (stripetoken != null) {
      const data = {
        name: username,
        email: useremail,
        stripe_token: stripetoken,
      };
      console.warn('data', data);
      // Hud.showHud();
      await Apis.doSaveCard(UToken, data)
        .then(async res => {
          // Hud.hideHud();
          console.warn('ress', res);
          if (res.success == true) {
            Hud.hideHud();
            //console.warn('ress', res);
            setCardvalid(false);
            setCardvalue(null);
            setLoading(false);
            Toast.show(res.message);
            setCardView(false);
            getCardList();
          } else {
            Alert.alert('Sorry', res.message);
            setLoading(false);
            Hud.hideHud();
          }
        })
        .catch(error => {
          Hud.hideHud();
          console.error(error);
        });
    } else {
      setLoading(false);
      Toast.show('Sorry card cannot be saved');
    }
  };
  const doDeleteCard = (Id, last4) => {
    Alert.alert(
      //title
      'Delete',
      //body
      'Are you sure want to delete card ending with ' + last4 + '?',
      [
        {text: 'Yes', onPress: () => processDeleteCard(Id)},
        {text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel'},
      ],
      {cancelable: false},
      //clicking out side of alert will not cancel
    );
  };
  const processDeleteCard = async Id => {
    let usertoken = await AsyncStorage.getItem('user_token');
    let token = JSON.parse(usertoken);
    // console.log('token123=', token);
    const data = {
      stripe_card_id: Id,
    };
    Hud.showHud();
    await Apis.DeleteCard(token, data)
      .then(res => {
        // console.warn('res', res.data);
        if (res.success == true) {
          Hud.hideHud();
          Toast.show(res.message);
          getCardList();
        } else {
          Hud.hideHud();
          Toast.show(res.message);
        }
      })
      .catch(error => {
        Hud.hideHud();
        console.error(error);
      });
  };
  const SetDefault = async Id => {
    let usertoken = await AsyncStorage.getItem('user_token');
    let token = JSON.parse(usertoken);
    // console.warn('token123=',id);
    const data = {
      stripe_card_id: Id,
    };
    await Apis.doSetDefaultCard(token, data)
      .then(res => {
        // console.warn('res', res.data);
        if (res.success == true) {
          Hud.hideHud();
          Toast.show(res.message);
          getCardList();
        } else {
          Hud.hideHud();
          Toast.show(res.message);
        }
      })
      .catch(error => {
        Hud.hideHud();
        console.error(error);
      });
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: '#fff',
        flex: 1,
      }}>
      <View>
        <StatusBar
          backgroundColor={COLORS.APPCOLORS}
          barStyle="light-content"
        />
        <ImageBackground
          source={require('../../Assets/VectorIcon/header_background.png')}
          resizeMode="stretch"
          style={{
            width: '100%',
            height: HEIGHT * 0.15,
            justifyContent: 'flex-end',
          }}>
          <View
            style={{
              width: '100%',
              height: '85%',
              position: 'absolute',
              flexDirection: 'row',
              justifyContent: 'space-between',
              //  marginHorizontal:10
            }}>
            <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <Image
                source={require('../../Assets/VectorIcon/back-arrow.png')}
                style={{
                  height: 20,
                  width: 20,
                  tintColor: 'white',
                  marginLeft: 10,
                }}
              />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: RFValue(20),
                color: '#FFF',
                fontFamily: 'Rubik',
                fontStyle: 'normal',
                letterSpacing: 0.4,
              }}>
              Payment Options
            </Text>
            <View style={{height: 20, width: 20, marginRight: 10}} />
            {/* <Image
              source={require('../../Assets/VectorIcon/bell_icon_active.png')}
              style={{ height: 20, width: 20,marginRight:10 }}
            /> */}
          </View>
        </ImageBackground>
      </View>
      <View
        style={{justifyContent: 'center', alignItems: 'center', height: '73%'}}>
        {cardlist.length > 0 ? (
          <FlatList
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: 20,
              // justifyContent:'center',
              //alignItems:'center',
              paddingLeft: 8,
              paddingRight: 8,
              width: '90%',
            }}
            showsVerticalScrollIndicator={false}
            data={cardlist}
            keyExtractor={(item, index) => 'key' + index}
            renderItem={({item, index}) => {
              return (
                <View
                  style={{
                    // justifyContent: 'center',
                    // alignItems: 'center',
                    borderWidth: item.default_status == 1 ? 1.5 : 1,
                    borderColor:
                      item.default_status == 1 ? '#0E6060' : '#DCDCDC',
                    width: WIDTH - 60,
                    height: 90,
                    borderRadius: 10,
                    marginTop: '10%',
                  }}>
                  <View style={{height: 40, marginLeft: 10}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginLeft: '3%',
                      }}>
                      <View
                        style={{
                          width: '75%',
                          marginTop: '3%',
                          flexDirection: 'row',
                        }}>
                        <View style={{width: '75%'}}>
                          <Text
                            style={{
                              fontSize: RFValue(14),
                              color: '#0E6060',
                              fontWeight: 'bold',
                            }}
                            numberOfLines={1}>
                            {item.brand}
                          </Text>
                        </View>
                      </View>
                      <View style={{width: '5%', marginTop: '3%'}} />
                      <View
                        style={{
                          width: '20%',
                          justifyContent: 'flex-end',
                          alignItems: 'flex-end',
                        }}>
                        <OptionsMenu
                          button={require('../../Assets/VectorIcon/more.png')}
                          buttonStyle={{
                            width: 32,
                            height: 20,
                            marginTop: 5,
                            resizeMode: 'contain',
                            tintColor: '#0E6060',
                          }}
                          destructiveIndex={1}
                          options={['Set as Default', 'Delete', 'Cancel']}
                          actions={[
                            () => SetDefault(item.id),
                            () => doDeleteCard(item.id, item.last4),
                          ]}
                        />
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '80%',
                      marginLeft: 20,
                    }}>
                    <PaymentIcon type={item.brand.toLowerCase()} />
                    <View
                      style={{
                        width: '75%',
                        justifyContent: 'center',
                        marginLeft: 10,
                      }}>
                      <Text
                        style={{
                          fontSize: RFValue(15),
                          color: '#658B8B',
                          fontWeight: 'normal',
                          fontFamily: 'Rubik',
                        }}
                        numberOfLines={1}>
                        xxxx xxxx xxxx {item.last4}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            }}
          />
        ) : (
          <Text
            style={{
              fontSize: RFValue(15),
              color: '#808080',
              marginTop: 0,
            }}>
            No saved found
          </Text>
        )}
      </View>
      <View
        style={{
          height: 50,
          marginRight: 0,
          marginLeft: 0,
          position: 'absolute',
          bottom: 20,
          width: '80%',
          justifyContent: 'center',
          alignSelf: 'center',
        }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setCardView(true)}
          style={{height: 50}}>
          {/* <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            colors={['#00B2B2', '#0E6060']}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 50,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            }}> */}
          <Text style={{fontWeight: '700', color: '#fff', fontSize: 17}}>
            Add New Card
          </Text>
          {/* </LinearGradient> */}
        </TouchableOpacity>
      </View>

      <Modal visible={cardview} transparent={true} animationType="slide">
        <KeyboardAvoidingView
          style={styles.viewContent}
          behavior="height"
          enabled={false}>
          <View style={styles.contentContainer}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setCardView(false)}
              style={styles.closeIcon}>
              <Image
                source={require('../../Assets/VectorIcon/closeicon.png')}
                style={{width: 35, height: 35}}
              />
            </TouchableOpacity>
            <View style={{height: '10%'}} />

            <CreditCardInput
              requiresName
              requiresCVC
              labels={{
                name: 'Card Holder Name',
                number: 'Card Number',
                expiry: 'Expiry Date',
                cvc: 'CVV',
              }}
              placeholders={{
                name: 'Full Name',
                number: '1234 5678 1234 5678',
                expiry: 'MM/YY',
                cvc: 'CVV',
              }}
              invalidColor={'red'}
              onChange={_onChange}
            />

            <View
              style={{
                height: 40,
                marginRight: 0,
                marginLeft: 0,
                position: 'absolute',
                bottom: 20,
                width: '100%',
                justifyContent: 'center',
                alignSelf: 'center',
              }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => doCardValidation()}
                style={{height: 40}}>
                {/* <LinearGradient
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  colors={['#00B2B2', '#0E6060']}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 4,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}> */}
                <Text style={{fontWeight: '700', color: '#fff', fontSize: 17}}>
                  Add Card
                </Text>
                {/* </LinearGradient> */}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
        {loading && <Loader />}
      </Modal>
    </SafeAreaView>
  );
};
export default PaymentOption;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BACKGROUNDCOLOR,
    height: HEIGHT,
    width: WIDTH,
  },
  customButton: {
    marginTop: 30,
    width: '80%',
    height: 55,
    backgroundColor: '#00B2B2',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    elevation: 5,
  },
  buttonText: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 18,
    fontFamily: 'Rubik',
    letterSpacing: 0.4,
    lineHeight: 53,
  },
  viewContent: {
    backgroundColor: '#00000050',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  contentContainer: {
    backgroundColor: '#FFFFFF',
    height: HEIGHT * 0.9,
    width: WIDTH * 0.9,
    padding: 20,
    borderRadius: 5,
  },
  closeIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
    justifyContent: 'center',
    alignSelf: 'center',
    width: 30,
    height: 30,
  },
});
