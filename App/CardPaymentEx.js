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
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import {
  CreditCardInput,
  LiteCreditCardInput,
} from 'react-native-credit-card-input';
import stripe from 'tipsi-stripe';
import {PaymentIcon} from 'react-native-payment-icons';
const {width, height} = Dimensions.get('window');
const CardPaymentEx = () => {
  const [cardlist, setCardList] = useState([]);
  const [cardview, setCardView] = useState(false);
  const [cardvalue, setCardvalue] = useState(null);
  const [cardvalid, setCardvalid] = useState(false);

  const stripeApiKey =
    'pk_test_51LVVOsSDxTeq9QrbzZZh9ChWwf0q1tBCSPmOeryf5b4ozxLOQOOVLZov12Q6X6HcoTQuaXrzstNr2mwCiQSOGf1U00S2gS4qTJ';

  stripe.setOptions({
    publishableKey: stripeApiKey,
  });

  const _onChange = form => {
    console.log('card===>', form);
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

      try {
        const token = await stripe.createTokenWithCard(params);
        console.log('token', token);
        saveCard(token);
      } catch (error) {
        console.log('handleCardPayPress Error ', error);
      }
    } else {
      Alert.alert('Sorry', 'Please provide a valid card');
    }
  };

  const saveCard = async stripetoken => {
    if (stripetoken.tokenId != null) {
      const data = {
        stripe_token: stripetoken,
      };
      console.warn('data', data);

      setCardvalid(false);
      setCardvalue(null);

      setCardView(false);
      getCardList(stripetoken);
    } else {
      //setLoading(false);
      Toast.show('Sorry card cannot be saved');
    }
  };
  const getCardList = cardData => {
    console.log('Hello===>', cardData);
    var temp = {
      brand: cardData.card.brand,
    };

    cardlist.push(temp);
    setCardList(cardlist);
  };

  const cardListData = [
    {type: 'Visa'},
    {type: 'american-express amex'},
    {type: 'discover'},
    {type: 'hiper'},
    {type: 'mastercard master'},
  ];
  return (
    <SafeAreaView
      style={{
        backgroundColor: '#fff',
        flex: 1,
        marginHorizontal: 20,
      }}>
      <Text
        style={{
          alignSelf: 'center',
          marginVertical: 10,
          fontSize: 20,
          fontWeight: 'bold',
          color: '#000',
        }}>
        Card List
      </Text>

      <TouchableOpacity
        onPress={() => setCardView(true)}
        style={{
          height: 50,
          width: 120,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'aqua',
          alignSelf: 'flex-end',
        }}>
        <Text
          style={{
            alignSelf: 'center',
            marginVertical: 10,
            fontSize: 20,
            fontWeight: 'bold',
            color: '#000',
          }}>
          Add Card
        </Text>
      </TouchableOpacity>

      <View style={{marginTop: 10}}>
        {cardListData.map((item, index) => {
          return (
            <View key={index} style={{height: 40, marginLeft: 10}}>
              <PaymentIcon
                type={item.type.toLowerCase()}
                height={30}
                width={50}
              />
              {/* <Text>Card number</Text> */}
            </View>
          );
        })}
      </View>
      {/* <View>
        <PaymentIcon type="visa" />
        <PaymentIcon type="master" width={50} />
        <PaymentIcon type="paypal" height="30%" />
      </View> */}
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
              {/* <Image
                source={require('../../Assets/VectorIcon/closeicon.png')}
                style={{width: 35, height: 35}}
              /> */}
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
                style={{height: 40, backgroundColor: '#00B2B2', width: 100}}>
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
      </Modal>
    </SafeAreaView>
  );
};

export default CardPaymentEx;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'blue',
    height: height,
    width: width,
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
    height: height * 0.9,
    width: width * 0.9,
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
