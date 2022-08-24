import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

import HomeScreen from './HomeScreen';
import Conference from './Conference';
import JoinConference from './JoinConference';
import Live from './Live';
import Live2 from './Live2';
import CallScreen from './CallScreen';
import StreamMessage from './StreamMessage';
import StreamMessage2 from './StreamMessage2';
import Recording from './Recording';
import LiveFunctional from './LiveFunctional';
import Reel from './Reel';
import NewVideoCall from './NewVideoCall';
import CountryCurrency from './CountryCurrency';
import PayPalPayment from './PayPalPayment';
const Stack = createStackNavigator();

const StackNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="HomeScreen">
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="Conference" component={Conference} />
        <Stack.Screen name="JoinConference" component={JoinConference} />
        <Stack.Screen name="Live" component={Live} />
        <Stack.Screen name="Live2" component={Live2} />
        <Stack.Screen name="StreamMessage" component={StreamMessage} />
        <Stack.Screen name="StreamMessage2" component={StreamMessage2} />

        <Stack.Screen name="CallScreen" component={CallScreen} />
        <Stack.Screen name="Recording" component={Recording} />
        <Stack.Screen name="LiveFunctional" component={LiveFunctional} />
        <Stack.Screen name="Reel" component={Reel} />

        <Stack.Screen name="NewVideoCall" component={NewVideoCall} />

        <Stack.Screen name="CountryCurrency" component={CountryCurrency} />
        <Stack.Screen name="PayPalPayment" component={PayPalPayment} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigation;
