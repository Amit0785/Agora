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
  RefreshControl,
  Alert,
} from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';
import Icons from 'react-native-vector-icons/Ionicons';
import {RFValue} from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconM from 'react-native-vector-icons/MaterialIcons';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';

import Stripe from 'react-native-stripe-api';

const {width, height} = Dimensions.get('window');

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const PayPalPayment = props => {
  const numb = useRef();
  const mon = useRef();
  const yr = useRef();
  const ccv = useRef();
  const zipPostal = useRef();

  const [number, setNumber] = useState('');
  const [name, setName] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [expYear, setExpYear] = useState('');
  const [expMonth, setExpMonth] = useState('');
  const [cvv, setCvv] = useState('');

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => {
      setRefreshing(false);
      console.log('Hello');
      setName('');
      setNumber('');
      setZipCode('');
      setExpYear('');
      setExpMonth('');
      setCvv('');
    });
  }, []);

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
  const [countryCode, setCountryCode] = useState('');
  const [country, setCountry] = useState('');
  const [withCountryNameButton, setWithCountryNameButton] = useState(false);
  const [currency, setCurrency] = useState('');
  const [withFlag, setWithFlag] = useState(true);

  const onSelect = country => {
    setCountryCode(country.cca2);
    setCountry(country.name);
    setWithCountryNameButton(true);
    setCurrency(country.currency[0]);
    console.log('Country Details===>', country);
  };

  const handleCardPayPress = async () => {
    // const options = {};
    // try {
    //   setLoading(true);
    //   const token = await Stripe.createTokenWithCard(params);
    //   console.log('Token from Card ', token);
    //   setToken(token);
    //   setLoading(false);
    // } catch (error) {
    //   console.log('handleCardPayPress Error ', error);
    //   setLoading(false);
    // }
    if (name.trim() == '') {
      return Alert.alert('Pls enter valid name');
    } else if (number.trim() == '') {
      return Alert.alert('Pls enter valid number');
    } else if (expMonth.trim() == '') {
      return Alert.alert('Pls enter valid expMonth');
    } else if (expYear.trim() == '') {
      return Alert.alert('Pls enter valid expMonth');
    } else if (cvv.trim() == '') {
      return Alert.alert('Pls enter valid cvv');
    } else if (currency.trim() == '') {
      return Alert.alert('Pls enter valid country');
    } else {
      const apiKey =
        'pk_test_51LVVOsSDxTeq9QrbzZZh9ChWwf0q1tBCSPmOeryf5b4ozxLOQOOVLZov12Q6X6HcoTQuaXrzstNr2mwCiQSOGf1U00S2gS4qTJ';
      const client = new Stripe(apiKey);
      console.log('customerData===>', customerData);
      console.log('client==>', client);
      const token = await client.createToken({
        number: '4242424242424242',
        exp_month: expMonth,
        exp_year: expYear,
        cvc: cvv,
      });

      console.log('token===>', token.id);

      if (token != null && token != undefined) {
        const customerData = {
          name: name,
          cardNumber: number,
          expiryMonth: expMonth,
          expiryYear: expYear,
          cvv: cvv,
          amount: props.route.params.amount,
          currency: currency,
        };
      }
    }
  };

  //console.log(typeof (parseInt(year)))

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: '#ffffff', alignItems: 'center'}}
      nestedScrollEnabled={true}>
      <KeyboardAvoidingScrollView
        bounces={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        //behavior="padding"
        showsVerticalScrollIndicator={false}
        style={{backgroundColor: '#ffffff', width: width * 0.9}}>
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            marginBottom: height * 0.05,
            marginTop: height * 0.01,
          }}>
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
                style={{}}
              />
            </TouchableOpacity>
          </View>
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
              alignItems: 'center',
              paddingRight: 10,
            }}>
            {/* <Text
              style={{
                fontSize: RFValue(25),
                alignSelf: 'center',
                width: '65%',
                //backgroundColor: 'red',
              }}>
              Show Address
            </Text> */}
            <CountryPicker
              {...{
                countryCode,
                withFlag,
                withCountryNameButton,

                onSelect,
              }}
              //visible={shownCountry}
            />
            <View
              style={{
                width: '35%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: '50%',
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
                <Text style={{color: 'grey'}}>/</Text>
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
              </View>

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

          {/* <View
            style={{
              borderBottomWidth: 0.5,
              borderBottomColor: 'darkgray',
              backgroundColor: '#fff',
              justifyContent: 'center',
              height: 50,
              width: '100%',
              marginVertical: height * 0.01,
            }}>
            <CountryPicker
              {...{
                countryCode,
                withFlag,
                withCountryNameButton,

                onSelect,
              }}
              //visible={shownCountry}
            />
          </View> */}

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
            onPress={() => handleCardPayPress()}>
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
    height: height * 0.1,
    width: '100%',
    //backgroundColor: 'red',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
  },

  title: {
    // textAlign: 'center',
    color: 'black',
    fontSize: RFValue(20, 580),
    //fontWeight:'bold',
    //marginLeft: '24%',
    fontFamily: 'Nunito-BoldItalic',
  },
  input: {
    //flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: 'darkgray',
    backgroundColor: 'white',
    height: 50,
    width: '100%',
  },
});
