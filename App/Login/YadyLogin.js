import React, {useState, useEffect} from 'react';
import {
  View,
  StatusBar,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {COLORS, FONT, HEIGHT, WIDTH} from './../../Utils/constants';
import LinearGradient from 'react-native-linear-gradient';

import CommonToast from '../../Common/common-toast';
import Hud from '../../Common/hud';
import Apis from '../../Services/apis';
import AsyncStorage from '@react-native-community/async-storage';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import DeviceInfo, {getSystemName} from 'react-native-device-info';
import Toast from 'react-native-simple-toast';
import {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginButton,
} from 'react-native-fbsdk';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';

export default function LoginScreens(props) {
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');

  const refsArray = [
    {focusRef: React.createRef()},
    {focusRef: React.createRef()},
  ];

  useEffect(() => {
    //isLoggedIn();
    console.log('device_id ==========>', DeviceInfo.getUniqueId());
    console.log('Platform.OS ==========>', Platform.OS);
    _configureGoogleSignIn();
  }, []);

  const isLoggedIn = async () => {
    let token = await AsyncStorage.getItem('user_token');
    console.warn(token);
    if (token != null && token != '') {
      // props.navigation.navigate('Profile');
      props.navigation.navigate('MyDrawer');
    }
  };
  const handleEmail = value => {
    setEmail(value);
  };
  const handlePassword = value => {
    setPassword(value);
  };
  const submitTextInput = index => {
    console.warn('inex', index);
    if (index < refsArray.length) {
      refsArray[index].focusRef.current.focus();
    } else {
      // refsArray[index].focusRef.current.focus();
      console.warn('gg', 'kk');
    }
  };
  const validateEmail = () => {
    var regexp = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return regexp.test(email.trim());
  };
  const submitNextButton = () => {
    if (email.trim() == '') {
      CommonToast.showToast('Please enter email', 'error');
      // Alert.alert('Oops..', 'Please enter email');
      return;
    }
    if (!validateEmail()) {
      CommonToast.showToast('Please enter valid email', 'error');
      //Alert.alert('Oops..', 'Please enter valid email');
      return;
    }
    doLogin();
  };
  const doLogin = async () => {
    const fcm_token = await AsyncStorage.getItem('fcm_token');
    console.log('fcm_token ==========>', fcm_token);
    loginData = {
      email: email.trim(),
      password: password.trim(),
      device_id: DeviceInfo.getUniqueId(),
      device_token: fcm_token,
      device_type: Platform.OS,
    };
    console.warn('loginData', loginData);
    Hud.showHud();

    await Apis.Login(loginData)
      .then(async res => {
        console.warn('Login data res', res);

        if (res.success == true) {
          Hud.hideHud();
          //props.navigation.navigate('Slider');
          // Toast.show(res.message);
          //  CommonToast.showToast(res.message, 'success');
          Toast.show(res.message);

          await AsyncStorage.setItem('user_token', JSON.stringify(res.token));
          await AsyncStorage.setItem(
            'provider_name',
            res.userData.first_name + ' ' + res.userData.last_name,
          );
          await AsyncStorage.setItem(
            'provider_image',
            res.userData.profile_image,
          );
          await AsyncStorage.setItem('provider_email', res.userData.email);
          await AsyncStorage.setItem(
            'user_id',
            JSON.stringify(res.userData.service_provider_id),
          );
          //props.navigation.navigate('Profile');
          props.navigation.replace('MyDrawer');
        } else {
          Hud.hideHud();
          Toast.show(res.message);
          //  CommonToast.showToast(res.message, 'error');
        }
      })
      .catch(error => {
        console.error(error);
      });
  };
  const signUp = () => {
    props.navigation.navigate('Register');
  };
  const forgetpassword = () => {
    props.navigation.navigate('ForgotPassword');
  };

  // #### Google signin ####

  _configureGoogleSignIn = () => {
    GoogleSignin.configure({
      scopes: [
        'https://www.googleapis.com/auth/plus.me',
        'https://www.googleapis.com/auth/userinfo.email',
      ], // what API you want to access on behalf of the user, default is email and profile
      webClientId:
        '112614002267-urbq0ao3jt62ntmc3mlnjf86lvhk8qkr.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      hostedDomain: '', // specifies a hosted domain restriction
      loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
      forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login.
      accountName: '', // [Android] specifies an account name on the device that should be used
      iosClientId:
        '112614002267-urbq0ao3jt62ntmc3mlnjf86lvhk8qkr.apps.googleusercontent.com', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist) 299452138548-lmm88n9qrct2usc7d2ees3ouh28ktquj.apps.googleusercontent.com
    });
  };

  _signIn = async () => {
    Hud.showHud();
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const token = await GoogleSignin.getTokens();
      await GoogleSignin.revokeAccess();
      console.log('userInfo --->', userInfo);
      // console.log('google signin token --->', token);
      Hud.hideHud();
      submitSocialLogin(userInfo.user, 'google');
    } catch (error) {
      Hud.hideHud();
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // sign in was cancelled
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation in progress already
        console.log('in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        this.refs.toast.show('play services not available or outdated');
      } else {
        console.log('Something went wrong:', error.toString());
        // setError(error);
      }
    }
  };

  // ## Facebook Login ##

  const fblogin = async () => {
    //console.log('in at fb potal');
    Hud.showHud();
    try {
      LoginManager.setLoginBehavior('native_with_fallback');
      //  LoginManager.logOut();
      let fbResult = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
        'user_friends',
      ]);
      // console.warn(fbResult);
      if (!fbResult.isCancelled) {
        AccessToken.getCurrentAccessToken().then(data => {
          const accessToken = data.accessToken.toString();
          const responseInfoCallback = async (error, result) => {
            if (error) {
              Hud.hideHud();
              console.log('Error fetching data: ', error.toString());
            } else {
              Hud.hideHud();
              // SetFbLogin(result);
              submitSocialLogin(result, 'facebook');
              // setName(result.)
              console.log('my fb result', result);
            }
          };
          const infoRequest = new GraphRequest(
            '/me',
            {
              accessToken: accessToken,
              parameters: {
                fields: {
                  string: 'email,name,id,picture.type(large)',
                },
              },
            },
            responseInfoCallback,
          );
          // Start the graph request.
          new GraphRequestManager().addRequest(infoRequest).start();
        });
      } else {
        Hud.hideHud();
        LoginManager.logOut();
        console.log('facebook login failed.');
      }
    } catch (error) {
      Hud.hideHud();
      console.warn(error);
      console.log('ERROR WHILE LOGIN!');
    }
  };

  const submitSocialLogin = async (data, type) => {
    const fcm_token = await AsyncStorage.getItem('fcm_token');
    socialLoginData =
      type === 'google'
        ? {
            social_id: data.id,
            first_name: data.name.split(' ').slice(0, -1).join(' '),
            last_name: data.name.split(' ').slice(-1).join(' '),
            email: data.email,
            registered_from: 2,
            profile_image: data.photo,
            device_id: DeviceInfo.getUniqueId(),
            device_token: fcm_token,
            device_type: Platform.OS,
          }
        : {
            social_id: data.id,
            first_name: data.name.split(' ').slice(0, -1).join(' '),
            last_name: data.name.split(' ').slice(-1).join(' '),
            email: data.email,
            registered_from: 1,
            profile_image: data.picture.data.url,
            device_id: DeviceInfo.getUniqueId(),
            device_token: fcm_token,
            device_type: Platform.OS,
          };
    console.warn('Social login Data', socialLoginData);
    console.warn('Social id Data type', typeof data.id);
    Hud.showHud();
    await Apis.socialLogin(socialLoginData)
      .then(async res => {
        console.warn('social Login res', res);

        if (res.success == true) {
          Hud.hideHud();
          //props.navigation.navigate('Slider');
          // Toast.show(res.message);
          CommonToast.showToast(res.message, 'success');
          // if (type === 'google') {
          //   await AsyncStorage.setItem('user_image', data.photo);
          // } else {
          //   await AsyncStorage.setItem('user_image', data.picture.data.url);
          // }
          await AsyncStorage.setItem(
            'provider_name',
            res.data.first_name + ' ' + res.data.last_name,
          );
          await AsyncStorage.setItem('user_token', JSON.stringify(res.token));
          props.navigation.replace('MyDrawer');
        } else {
          Hud.hideHud();
          CommonToast.showToast(res.message, 'error');
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <>
      <SafeAreaView
        style={{flex: 0, backgroundColor: 'rgba(255, 255, 255, 0.95)'}}>
        <StatusBar
          backgroundColor={COLORS.APPCOLORS}
          barStyle="light-content"
        />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{flexGrow: 1}}
          style={styles.container}>
          <View>
            <View style={styles.imageContainer}>
              <Image
                source={require('../../Assets/LaunchScreen/logo.png')}
                resizeMode="contain"
                style={{height: HEIGHT * 0.1, width: WIDTH * 0.6}}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.loginTxt1}>Sign In</Text>
              <Text style={styles.loginTxt2}>
                Hi there! Nice to see you again
              </Text>
            </View>

            <View style={styles.loginForm}>
              <View>
                <TextInput
                  style={styles.loginFormInput}
                  placeholder="Enter your email"
                  onChangeText={handleEmail}
                  autoCorrect={false}
                  autoCapitalize="none"
                  submitTextInput={submitTextInput}
                  ref={refsArray[0].focusRef}
                  index={0}
                  placeholderTextColor={'grey'}
                />
              </View>
              <View>
                <TextInput
                  style={styles.loginFormInput}
                  placeholder="Enter your password"
                  onChangeText={handlePassword}
                  secureTextEntry={true}
                  submitTextInput={submitTextInput}
                  ref={refsArray[1].focusRef}
                  index={1}
                  placeholderTextColor={'grey'}
                />
              </View>
            </View>
            <View style={styles.loginForget}>
              <TouchableOpacity onPress={forgetpassword}>
                <Text style={styles.loginForgetText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.customButton} activeOpacity={0.7}>
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                colors={['#00B2B2', '#0E6060']}
                style={{width: '100%', height: '100%', borderRadius: 50}}>
                <TouchableOpacity onPress={submitNextButton}>
                  <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
            {/* <View style={styles.textContainerOr}>
              <Text style={styles.loginTxt3}>Or</Text>
              <Text style={styles.loginTxt4}>Sign in with</Text>
            </View> */}
            {/* <View style={styles.socailLogin}>
              <TouchableOpacity
                style={{
                  padding: 15,
                  alignItems: 'center',
                  marginRight: 5,
                  borderRadius: 100 / 2,
                  borderWidth: 2,
                  borderColor: '#E4E4E4',
                }}
                onPress={() => fblogin()}
              >
                <Image
                  source={require('../../Assets/VectorIcon/facebook.png')}
                  resizeMode="contain"
                  style={{ height: 20, width: 20 }}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  padding: 15,
                  alignItems: 'center',
                  marginLeft: 5,
                  borderRadius: 100 / 2,
                  borderWidth: 2,
                  borderColor: '#E4E4E4',
                }}
                onPress={() => _signIn()}
              >
                <Image
                  source={require('../../Assets/VectorIcon/google.png')}
                  style={{ height: 20, width: 20 }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View> */}
            <View style={styles.textRegister}>
              <Text style={{letterSpacing: 0.4, color: 'black'}}>
                New User?
              </Text>
              <TouchableOpacity onPress={signUp}>
                <Text
                  style={{
                    color: '#00B2B2',
                    fontSize: 18,
                    fontWeight: '600',
                    fontFamily: 'Rubik',
                    letterSpacing: 0.4,
                  }}>
                  {' '}
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BACKGROUNDCOLOR,
    height: HEIGHT,
    width: WIDTH,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: HEIGHT * 0.09,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: HEIGHT * 0.05,
    marginBottom: HEIGHT * 0.01,
  },
  loginTxt1: {
    fontSize: RFValue(20),
    color: '#054128',
    fontFamily: 'Rubik',
    fontStyle: 'normal',
    letterSpacing: 0.4,
    fontWeight: '700',
  },

  loginTxt2: {
    fontSize: RFValue(18),
    color: '#658B8B',
    fontFamily: 'Rubik',
    marginTop: 5,
    fontStyle: 'normal',
    letterSpacing: 0.4,
    fontWeight: '400',
  },

  loginForm: {
    marginTop: 5,
  },
  loginFormInput: {
    height: 50,
    margin: 8,
    marginHorizontal: 22,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    borderColor: '#BFBFBF',
    color: '#4C4D4F',
  },
  loginForget: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginForgetText: {
    fontSize: RFValue(17),
    color: '#032F2F',
    fontFamily: 'Rubik',
    fontStyle: 'normal',
    letterSpacing: 0.4,
    fontWeight: '700',
    textShadowColor: '#fff',
  },
  customButton: {
    marginTop: 30,
    width: '85%',
    height: 55,
    backgroundColor: '#00B2B2',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  buttonText: {
    textAlign: 'center',
    lineHeight: 53,
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: RFValue(22),
    fontFamily: 'Rubik',
    letterSpacing: 0.4,
  },
  textContainerOr: {
    alignItems: 'center',
    marginTop: 20,
  },
  loginTxt3: {
    fontSize: RFValue(16),
    fontFamily: 'Rubik',
    color: '#97BEBE',
    fontWeight: '400',
  },
  loginTxt4: {
    fontSize: RFValue(16),
    fontFamily: 'Rubik',
    color: '#97BEBE',
    fontWeight: '400',
  },
  socailLogin: {
    alignItems: 'center',
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    //width:"80%"
  },
  textRegister: {
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 45,
  },
});
