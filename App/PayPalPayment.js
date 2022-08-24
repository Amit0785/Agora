import React, {useState, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';

import Icons from 'react-native-vector-icons/Ionicons';
import {RFValue} from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconM from 'react-native-vector-icons/MaterialIcons';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';

import Stripe from 'react-native-stripe-api';

const {width, height} = Dimensions.get('window');

const PayPalPayment = props => {
  const numb = useRef();
  const mon = useRef();
  const yr = useRef();
  const ccv = useRef();
  const zipPostal = useRef();

  const [number, setNumber] = useState(null);
  const [name, setName] = useState(null);
  const [zipCode, setZipCode] = useState(null);
  const [expYear, setExpYear] = useState('');
  const [expMonth, setExpMonth] = useState('');
  const [cvv, setCvv] = useState(null);

  const params = {
    // mandatory
    number: number,
    expMonth: parseInt(expMonth),
    expYear: parseInt(expYear),
    cvc: cvv,
    // optional
    name: name,
    currency: 'usd',
    addressLine1: '123 Test Street',
    addressLine2: 'Apt. 5',
    addressCity: 'Test City',
    addressState: 'Test State',
    addressCountry: 'Test Country',
    addressZip: zipCode,
  };

  const month = JSON.stringify(expYear).substring(1, 3);
  const year = JSON.stringify(expYear).substring(3, 7);

  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

  const handleCardPayPress = async () => {
    // const options = {}
    // try {
    //   setLoading(true);
    //   const token = await stripe.createTokenWithCard(params);
    //   console.log('Token from Card ', token);
    //   setToken(token);
    //   setLoading(false);
    // } catch (error) {
    //   console.log('handleCardPayPress Error ', error);
    //   setLoading(false);
    // }
  };

  //console.log(typeof (parseInt(year)))

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: '#ffffff', alignItems: 'center'}}
      nestedScrollEnabled={true}>
      {/* <ScrollView>
        <View style={styles.whole}>
          <View style={styles.header}>
            <TouchableOpacity

            //    onPress={() => props.naviProps.openDrawer()}
            >
              <Icons name="menu" size={29} color={'blue'} />
            </TouchableOpacity>

            <Text style={styles.title}>Add Property</Text>

            <TouchableOpacity

            //    onPress={() => props.naviProps.openDrawer()}
            >
              <IconM
                name="notifications-active"
                size={25}
                color={'blueviolet'}
                style={{marginLeft: '40%'}}
              />
            </TouchableOpacity>
          </View>

          <View style={{height: '11%', margin: '5%'}}>
            <Text style={{fontSize: RFValue(20)}}>Pay With PayPal</Text>

            <View
              style={{
                width: '90%',
                borderColor: 'grey',
                marginTop: '5%',
                flexDirection: 'row',
                borderWidth: 1,
                borderStyle: 'dotted',
                borderRadius: 10,
              }}>
              <View style={{width: '50%', margin: '5%'}}>
                <Text
                  style={{
                    fontSize: RFValue(19),
                    alignSelf: 'center',
                  }}>
                  The Faster and Safer way to pay
                </Text>
              </View>
              <View
                style={{width: '50%', alignContent: 'flex-end', margin: '5%'}}>
                <Image
                  source={require('./Assets/Icon/PayPal.png')}
                  style={{width: '100%', height: '100%'}}
                />
              </View>
            </View>
          </View>

          <View style={{height: '4%', marginLeft: '-20%', marginTop: '5%'}}>
            <Text
              style={{
                fontSize: RFValue(22),
                alignSelf: 'center',
              }}>
              Pay With Credit Card or Debit Card
            </Text>
          </View>

          <View
            style={{
              borderColor: 'grey',
              height: '4%',
              marginLeft: '3%',
              flexDirection: 'row',
              alignSelf: 'flex-start',
            }}>
            <Image
              source={require('./Assets/Icon/Whole.jpg')}
              style={{width: '45%', height: '95%'}}
            />
          </View>

          <View
            style={{
              alignSelf: 'flex-start',
              marginLeft: '3%',
              borderBottomColor: 'darkgray',
              borderBottomWidth: 1,
            }}>
            <Text>Payment Amount</Text>
            <View style={{flexDirection: 'row'}}>
              <Text style={{fontSize: RFValue(22), fontWeight: 'bold'}}>
                $ 500.00
              </Text>

              <TouchableOpacity
                style={{marginLeft: '70%'}}
                //    onPress={() => props.naviProps.openDrawer()}
              >
                <Icon name="edit" size={23} color={'dimgrey'} />
              </TouchableOpacity>
            </View>
          </View>
          <TextInput
            style={styles.input}
            onChangeText={setName}
            value={name}
            placeholder="Name on Card"
            autoCapitalize="words"
            onSubmitEditing={() => {
              numb.current.focus();
            }}
          />

          <TextInput
            style={styles.input}
            onChangeText={setNumber}
            value={number}
            placeholder="Card Number"
            keyboardType="numeric"
            maxLength={16}
            ref={numb}
            onSubmitEditing={() => {
              mon.current.focus();
            }}
          />
          <View style={{flexDirection: 'row', ...styles.input}}>
            <Text style={{fontSize: RFValue(25), alignSelf: 'center'}}>
              Show Address
            </Text>
            <TextInput
              style={{marginLeft: '25%'}}
              onChangeText={setExpMonth}
              value={expMonth}
              placeholder="MM"
              maxLength={2}
              keyboardType="numeric"
              ref={mon}
              onSubmitEditing={() => {
                yr.current.focus();
              }}
            />
            <TextInput
              style={{}}
              onChangeText={setExpYear}
              value={expYear}
              placeholder="YY"
              maxLength={2}
              keyboardType="numeric"
              ref={yr}
              onSubmitEditing={() => {
                ccv.current.focus();
              }}
            />

            <TextInput
              style={{marginLeft: '5%'}}
              onChangeText={setCvv}
              value={cvv}
              placeholder="CVV"
              maxLength={3}
              keyboardType="numeric"
              ref={ccv}
              onSubmitEditing={() => {
                zipPostal.current.focus();
              }}
            />
          </View>

          <TextInput
            style={styles.input}
            onChangeText={setZipCode}
            value={zipCode}
            placeholder="ZIP/Postal Code"
            maxLength={6}
            keyboardType="numeric"
            ref={zipPostal}
          />
          <View
            style={{
              backgroundColor: 'blue',
              width: '90%',
              height: '5%',
              marginTop: '10%',
            }}>
            <TouchableOpacity
              style={{
                backgroundColor: 'navy',
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                flexDirection: 'row',
              }}
              onPress={handleCardPayPress}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 20,
                  margin: '1%',
                  alignSelf: 'center',
                }}>
                Pay $500.00
              </Text>
              <Icons
                name="arrow-forward"
                size={23}
                color={'white'}
                style={{alignSelf: 'center', marginLeft: '50%'}}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView> */}

      <KeyboardAvoidingScrollView
        bounces={false}
        //behavior="padding"
        showsVerticalScrollIndicator={false}
        style={{backgroundColor: '#ffffff', width: width * 0.9}}>
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            marginBottom: height * 0.15,
            marginTop: height * 0.01,
          }}>
          <View style={{width: '100%'}}>
            <Text style={{fontSize: RFValue(20)}}>Pay With PayPal</Text>
          </View>

          <View
            style={{
              width: '100%',
              height: height * 0.15,
              flexDirection: 'row',
              justifyContent: 'space-between',
              borderColor: 'grey',
              borderWidth: 1,
              borderStyle: 'dotted',
              borderRadius: 10,
              marginTop: height * 0.03,
              alignItems: 'center',
            }}>
            <View style={{width: '50%', paddingHorizontal: 10}}>
              <Text
                style={{
                  fontSize: RFValue(19),
                  alignSelf: 'center',
                }}>
                The Faster and Safer way to pay
              </Text>
            </View>
            <View
              style={{
                width: '50%',
                //alignContent: 'flex-end',
                //margin: '5%',
                height: '50%',
              }}>
              <Image
                source={require('./Assets/Icon/PayPal.png')}
                style={{width: '100%', height: '100%'}}
              />
            </View>
          </View>

          <Text
            style={{
              fontSize: RFValue(18),
              alignSelf: 'flex-start',
              marginVertical: 15,
            }}>
            Pay With Credit Card or Debit Card
          </Text>

          <View
            style={{
              width: '100%',
              height: height * 0.05,
              //backgroundColor: 'red',
            }}>
            <Image
              source={require('./Assets/Icon/Whole.jpg')}
              style={{width: '55%', height: '100%'}}
            />
          </View>

          <View
            style={{
              alignSelf: 'flex-start',
              width: '95%',
              borderBottomColor: 'darkgray',
              borderBottomWidth: 1,
              marginVertical: 10,
            }}>
            <Text>Payment Amount</Text>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-between',
              }}>
              <Text style={{fontSize: RFValue(22), fontWeight: 'bold'}}>
                {props.route.params.amount}
              </Text>

              <TouchableOpacity
                style={{}}
                //    onPress={() => props.naviProps.openDrawer()}
              >
                <Icon name="edit" size={23} color={'dimgrey'} />
              </TouchableOpacity>
            </View>
          </View>

          <TextInput
            style={styles.input}
            onChangeText={setName}
            value={name}
            placeholder="Name on Card"
            autoCapitalize="words"
            onSubmitEditing={() => {
              numb.current.focus();
            }}
          />
          <TextInput
            style={styles.input}
            onChangeText={setNumber}
            value={number}
            placeholder="Card Number"
            keyboardType="numeric"
            maxLength={16}
            ref={numb}
            onSubmitEditing={() => {
              mon.current.focus();
            }}
          />

          <View
            style={{
              flexDirection: 'row',
              ...styles.input,
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontSize: RFValue(25),
                alignSelf: 'center',
                width: '65%',
                //backgroundColor: 'red',
              }}>
              Show Address
            </Text>
            <View
              style={{
                width: '30%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TextInput
                style={{}}
                onChangeText={setExpMonth}
                value={expMonth}
                placeholder="MM"
                maxLength={2}
                keyboardType="numeric"
                ref={mon}
                onSubmitEditing={() => {
                  yr.current.focus();
                }}
              />
              <TextInput
                style={{}}
                onChangeText={setExpYear}
                value={expYear}
                placeholder="YY"
                maxLength={2}
                keyboardType="numeric"
                ref={yr}
                onSubmitEditing={() => {
                  ccv.current.focus();
                }}
              />

              <TextInput
                style={{}}
                onChangeText={setCvv}
                value={cvv}
                placeholder="CVV"
                maxLength={3}
                keyboardType="numeric"
                ref={ccv}
                onSubmitEditing={() => {
                  zipPostal.current.focus();
                }}
              />
            </View>
          </View>

          <TextInput
            style={styles.input}
            onChangeText={setZipCode}
            value={zipCode}
            placeholder="ZIP/Postal Code"
            maxLength={6}
            keyboardType="numeric"
            ref={zipPostal}
          />

          <TouchableOpacity
            style={{
              backgroundColor: 'navy',
              width: '90%',
              height: 50,
              marginTop: height * 0.05,
              justifyContent: 'center',
              flexDirection: 'row',
            }}
            // onPress={handleCardPayPress}
          >
            <Text
              style={{
                color: 'white',
                fontSize: 20,
                margin: '1%',
                alignSelf: 'center',
              }}>
              Pay {props.route.params.amount}
            </Text>
            <Icons
              name="arrow-forward"
              size={23}
              color={'white'}
              style={{alignSelf: 'center', marginLeft: '50%'}}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingScrollView>
    </SafeAreaView>
  );
};

export default PayPalPayment;

const styles = StyleSheet.create({
  whole: {
    alignItems: 'center',
    width: '100%',
    height: '100%',
    marginBottom: '100%',
  },
  header: {
    height: '5%',
    width: '100%',
    marginLeft: '-4%',
    flexDirection: 'row',
    alignItems: 'center',
    //backgroundColor: 'red',
    padding: 10,
  },

  title: {
    textAlign: 'center',
    color: 'black',
    fontSize: RFValue(20, 580),
    //fontWeight:'bold',
    marginLeft: '24%',
    fontFamily: 'Nunito-BoldItalic',
  },
  input: {
    //flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: 'darkgray',
    backgroundColor: 'white',
    height: RFValue(50),
    width: '100%',
  },
});
