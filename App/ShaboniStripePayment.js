import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  Switch,
  Alert,
  Dimensions,
} from 'react-native';
import colors from '../../asserts/colors.js/colors';

import IconAntDesign from 'react-native-vector-icons/dist/AntDesign';
import {RFValue} from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Hud from '../../utils/hud';
import axios from 'axios';

import {
  StripeProvider,
  CardForm,
  useStripe,
  initStripe,
  BillingDetails,
  CardField,
  useConfirmPayment,
  createPaymentMethod,
  PaymentSheetError,
} from '@stripe/stripe-react-native';
import {BASE_URL} from '../../utils/Api/apiName';
import {Button, HStack} from 'native-base';

// interface Props {
//   paymentMethod?: string;
//   onInit?(): void;
// }
const appearance = {
  font: {
    scale: 1.1,
  },
  colors: {
    light: {
      primary: '#F8F8F2',
      background: '#272822',
      componentBackground: '#E6DB74',
      componentBorder: '#FD971F',
      componentDivider: '#FD971F',
      primaryText: '#F8F8F2',
      secondaryText: '#75715E',
      componentText: '#AE81FF',
      placeholderText: '#E69F66',
      icon: '#F92672',
      error: '#F92672',
    },
    dark: {
      primary: '#00ff0099',
      background: '#ff0000',
      componentBackground: '#ff0080',
      componentBorder: '#62ff08',
      componentDivider: '#d6de00',
      primaryText: '#5181fc',
      secondaryText: '#ff7b00',
      componentText: '#00ffff',
      placeholderText: '#00ffff',
      icon: '#f0f0f0',
      error: '#0f0f0f',
    },
  },
  shapes: {
    borderRadius: 10,
    borderWidth: 1,
    shadow: {
      opacity: 1,
      color: '#ffffff',
      offset: {x: -5, y: -5},
      blurRadius: 1,
    },
  },
  primaryButton: {
    colors: {
      background: '#000000',
      text: '#ffffff',
      border: '#ff00ff',
    },
    shapes: {
      borderRadius: 10,
      borderWidth: 2,
      shadow: {
        opacity: 1,
        color: '#80ffffff',
        offset: {x: 5, y: 5},
        blurRadius: 1,
      },
    },
  },
};

const {width, height} = Dimensions.get('window');
const {calcW, calcH} = Dimensions.get('window');

export default function StripePayment({onInit, navigation}) {
  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  //const {confirmPayment, loading} = useConfirmPayment();

  const [name, setName] = useState('');
  const [focusName, setFocusName] = useState(false);
  const [cardDetails, setCardDetails] = useState();
  const [paymentSheetEnabled, setPaymentSheetEnabled] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function initialize() {
      const publishableKey =
        'pk_test_51J36emAb00z22fJ7QtepxE7PZGooTmDhyOn0HIhM22q3zev9SaWxL3fxONh4i04uttHyMhjEu7F7mOd0znbui1RW002zG9fw8J';
      if (publishableKey) {
        await initStripe({
          publishableKey,
          merchantIdentifier: 'merchant.identifier',
        });
        setLoading(false);
        initializePaymentSheet();
      }
    }
    initialize();
  }, []);

  const fetchPaymentSheetParams = async () => {
    try {
      const token = JSON.parse(await AsyncStorage.getItem('userToken'));
      const letToken = token.data.data.token;
      console.log('{token}', token.data.data.token);
      const response = await fetch(
        'https://kabou.us/api/rider/add-card-in-stripe',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: 'Bearer ' + letToken,
          },
        },
      );
      // console.log('response stripe', JSON.stringify(response.data));
      const {setupIntent, ephemeralKey, customer} = await response.json();
      console.log(
        'paymentIntent, ephemeralKey, customer',
        setupIntent,
        ephemeralKey,
        customer,
      );
      setClientSecret(setupIntent);
      return {
        setupIntent,
        ephemeralKey,
        customer,
      };
    } catch (error) {
      console.log('==========error=========', error);
    }
  };

  const initializePaymentSheet = async () => {
    const {setupIntent, ephemeralKey, customer} =
      await fetchPaymentSheetParams();
    console.log('setupIntent', setupIntent);

    const billingDetails = {
      name: 'Jane Doe',
      email: 'mailto:foo@bar.com',
      phone: '555-555-555',
      // address: address,
    };

    const {error, paymentOption} = await initPaymentSheet({
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      setupIntentClientSecret: setupIntent,
      customFlow: false,
      merchantDisplayName: 'Example Inc.',
      applePay: true,
      merchantCountryCode: 'US',
      style: 'automatic',
      googlePay: true,
      testEnv: true,
      defaultBillingDetails: billingDetails,
      allowsDelayedPaymentMethods: true,
      appearance,
    });
    if (!error) {
      console.log('paymentOption', paymentOption);
      setPaymentSheetEnabled(true);
    } else if (error.code === PaymentSheetError.Failed) {
      Alert.alert(
        `PaymentSheet init failed with error code: ${error.code}`,
        error.message,
      );
    } else if (error.code === PaymentSheetError.Canceled) {
      Alert.alert(
        `PaymentSheet init was canceled with code: ${error.code}`,
        error.message,
      );
    }
    // console.log('error', customer);
  };

  const openPaymentSheet = async () => {
    if (!clientSecret) {
      return;
    }
    setLoading(true);
    const {error, paymentOption} = await presentPaymentSheet();
    console.log(error, paymentOption);

    if (!error) {
      Alert.alert('Success', 'The payment was confirmed successfully', [
        {text: 'OK', onPress: () => props.navigation.navigate('Wallet')},
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel'),
          style: 'cancel',
        },
      ]);
    } else if (error.code === PaymentSheetError.Failed) {
      Alert.alert(
        `PaymentSheet present failed with error code: ${error.code}`,
        error.message,
      );
    } else if (error.code === PaymentSheetError.Canceled) {
      Alert.alert(
        `PaymentSheet present was canceled with code: ${error.code}`,
        error.message,
      );
    }
    setPaymentSheetEnabled(false);
    setLoading(false);
  };

  return (
    <SafeAreaView style={{flex: 1, padding: 10}}>
      <View style={{backgroundColor: '#fff'}}>
        <TouchableOpacity
          onPress={() => {
            openPaymentSheet;
          }}>
          <Text> Checkout</Text>
        </TouchableOpacity>
        {/* <Button
          width="full"
          variant="solid"
          isLoading={loading}
          disabled={!paymentSheetEnabled}
          onPress={openPaymentSheet}>
          Checkout
        </Button> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cardField: {
    width: '100%',
    ...Platform.select({
      ios: {
        height: 250,
      },
      android: {
        height: 260,
      },
    }),
    marginTop: height * 0.01,
  },
  container: {
    flex: 1,
  },
  viewOne: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  viewTwo: {
    flex: 2,
  },
  viewThree: {
    flex: 1,
  },
  headerContainer: {
    width: calcW(0.9),
    height: calcH(0.05),
    flexDirection: 'row',
    marginVertical: calcH(0.03),
    justifyContent: 'flex-start',
  },
  arrowIcon: {
    alignItems: 'center',
    marginTop: calcW(0.02),
    width: calcW(0.04),
    height: calcH(0.015),
  },
  instruction: {
    left: calcW(0.035),
    fontSize: 18,
    fontWeight: '500',
    color: colors.textHeader,
  },
  inActiveBorder: {
    width: calcW(0.9),
    borderColor: '#DCDCDC',
    borderWidth: 1,
    //borderRadius: allRadius,
    marginVertical: 10,
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
    paddingVertical: 2,
  },
  activeBorder: {
    width: calcW(0.9),
    borderColor: '#DCDCDC',
    borderWidth: 1,
    //borderRadius: allRadius,
    marginVertical: 10,
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
    paddingVertical: 2,
  },
  headerText: {
    fontSize: RFValue(28),
    color: colors.headerText,
    fontWeight: 'bold',
    // marginVertical: ,
  },
  subText: {
    fontSize: RFValue(19),
    color: colors.subHeader,
    marginVertical: calcH(0.03),
    textAlign: 'center',
    // marginVertical: calcH(0.035)
  },
  textInput: {
    fontSize: RFValue(18),
    flex: 1,
    paddingLeft: calcW(0.03),
  },
  buttonStyle: {
    width: calcW(0.9),
    backgroundColor: colors.buttonColor,
    height: 10,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    //marginTop: calcH(0.05),
  },
  buttonTextStyle: {
    fontSize: RFValue(20),
    color: colors.white,
    // marginVertical: 10,
    textAlign: 'center',
  },
  twoContainer: {
    width: calcW(0.9),
    flexDirection: 'row',
  },
  expiryContainer: {
    width: calcW(0.63),
  },
  cvvContainer: {
    left: calcW(0.03),
    width: calcW(0.24),
  },
});

const inputStyles = {
  backgroundColor: colors.background,
  textColor: '#A020F0',
  borderColor: '#000000',
  borderWidth: 0,
  borderRadius: 10,
  cursorColor: colors.activeBorder,
  fontSize: RFValue(18),
  placeholderColor: '#A020F0',
  textErrorColor: '#ff0000',
};
