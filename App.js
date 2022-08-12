import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';

import StackNavigation from './App/StackNavigation';

const App = () => {
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

    if (!firebase.apps.length) {
      firebase.initializeApp(credentials);
      console.log(
        '==firebase.initializeApp(credentials)===>',
        firebase.initializeApp(credentials),
      );
    }

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
  return (
    <>
      <StackNavigation />
    </>
  );
};

export default App;

const styles = StyleSheet.create({});
