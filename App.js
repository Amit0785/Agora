import {
  StyleSheet,
  Text,
  View,
  Modal,
  Animated,
  Dimensions,
  SafeAreaView,
  Pressable,
  Image,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import {Provider} from 'react-redux';
import store from './App/Redux/store';
import CallingScreen from './App/CallingScreen';
import StackNavigation from './App/StackNavigation';
import CommonToast from './App/CommonToast/index';
import {NotificationProvider} from './App/NotificationContext';
//import NewToast from './App/NewToast/index';
import {TouchableOpacity} from 'react-native-gesture-handler';

const {width, height} = Dimensions.get('window');
const App = () => {
  const [isCalling, setCalling] = useState(false);
  const [notificationData, setNotificationData] = useState([]);
  useEffect(() => {
    ConfigureFirebase();
  }, []);
  const ConfigureFirebase = async () => {
    // console.log(firebase.apps.length, 'firebase')

    const androidCredentials = {
      apiKey: 'AIzaSyApEpVoNU2kL5pPrbCQiKqOV8qxzfH1dgQ',
      authDomain: 'qpace-d9d63.firebaseapp.com',
      projectId: 'qpace-d9d63',
      databaseURL: 'https://qpace-d9d63-default-rtdb.firebaseio.com',
      storageBucket: 'qpace-d9d63.appspot.com',
      messagingSenderId: '442438432986',
      appId: '1:442438432986:android:81d8d2c962e2aa18fb0de3',
      measurementId: '',
    };

    // Your secondary Firebase project credentials for iOS...
    const iosCredentials = {
      clientId: '',
      appId: '',
      apiKey: '',
      databaseURL: '',
      storageBucket: '',
      messagingSenderId: '',
      projectId: '',
    };

    // Select the relevant credentials
    const credentials = Platform.select({
      android: androidCredentials,
      ios: iosCredentials,
    });

    //console.log('==firebase.apps.length==>', firebase.apps.length);

    //isReadyRef.current = false;
    requestUserPermission();
  };

  const requestUserPermission = async () => {
    //if (Platform.OS === 'ios') {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      //console.log('Authorization status:', authStatus);

      messaging()
        .getToken()
        .then(fcmToken => {
          if (fcmToken) {
            console.warn('have tok=====', fcmToken);
            //CommonToast.showToast('Invalid credentials', 'error');
          } else {
            console.warn('have tok=====', 'Not registered');
          }
        })
        .catch(error => {
          console.warn('have tok=====', 'Error occured');
        });
    }
    //}
  };

  //const windowHeight = Dimensions.get('window').height;

  const popAnim = useRef(new Animated.Value(height * -0.5)).current;
  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
  const popIn = () => {
    Animated.timing(popAnim, {
      toValue: height * 0.05,
      //duration: 300,
      useNativeDriver: true,
    }).start(popOut());
  };

  const popOut = () => {
    setTimeout(() => {
      Animated.timing(popAnim, {
        toValue: height * -1,
        // duration: 300,
        useNativeDriver: true,
      }).start();
    }, 2000);
  };

  const instantPopOut = () => {
    Animated.timing(popAnim, {
      toValue: height * -1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  return (
    <>
      <NotificationProvider
        value={{
          notificationData: notificationData,
          setNotificationData: setNotificationData,
          calling: isCalling,
          setCalling: setCalling,
          popIn: popIn,
        }}>
        <Provider store={store}>
          {!isCalling ? (
            <View>
              <Animated.View
                style={[
                  styles.toastContainer,
                  {
                    transform: [{translateY: popAnim}],
                  },
                ]}>
                <View style={styles.toastRow}>
                  <View
                    style={{
                      height: 40,
                      width: 40,
                      //backgroundColor: 'red',
                    }}>
                    <Image
                      source={require('./App/Assets/Icons/FitCheck.png')}
                      style={{
                        height: '100%',
                        width: '100%',
                        resizeMode: 'cover',
                      }}
                    />
                  </View>
                  <View style={styles.toastText}>
                    <Text style={{fontWeight: 'bold', fontSize: 15}}>
                      Notification
                    </Text>
                    <Text numberOfLines={1} style={{fontSize: 12}}>
                      success data
                    </Text>
                  </View>
                  {/* <TouchableOpacity
                    style={{width: 50, height: 40, backgroundColor: 'green'}}
                    onPress={() => {
                      // instantPopOut()
                      console.log('Hello');
                    }}>
                    <Text style={{color: 'red'}}>close</Text>
                  </TouchableOpacity> */}
                </View>
              </Animated.View>
            </View>
          ) : null}
          {/* <CallingScreen /> */}

          <StackNavigation />
        </Provider>
      </NotificationProvider>
    </>
  );
};

export default App;

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    height: 80,
    width: width * 0.9,
    //width: 350,
    alignSelf: 'center',
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    // paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: -1,
  },
  toastRow: {
    width: '97%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  toastText: {
    width: '70%',
    padding: 2,
    //backgroundColor: 'pink',
  },
});
