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
import CheckboxExp from './CheckboxExp';
import CakeComponent from './CakeComponent';
import IceCreamComponent from './IceCreamComponent';
import ReduxComponentHooks from './ReduxComponentHooks';
import ItemContainer from './Redux/View/ItemContainer';
import UserView from './UserView';
import CallScreen2 from './CallScreen2';
import TicTok from './TicTok';
import ThumbnailImage from './ThumbnailImage';
import CardPaymentEx from './CardPaymentEx';

import ScreenRecording from './ScreenRecording';
import Chats from './Chat/Chats';

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
        <Stack.Screen name="CallScreen2" component={CallScreen2} />
        <Stack.Screen name="Recording" component={Recording} />
        <Stack.Screen name="LiveFunctional" component={LiveFunctional} />
        <Stack.Screen name="Reel" component={Reel} />

        <Stack.Screen name="NewVideoCall" component={NewVideoCall} />

        <Stack.Screen name="CountryCurrency" component={CountryCurrency} />
        <Stack.Screen name="PayPalPayment" component={PayPalPayment} />
        <Stack.Screen name="CheckboxExp" component={CheckboxExp} />

        <Stack.Screen name="CakeComponent" component={CakeComponent} />
        <Stack.Screen name="IceCreamComponent" component={IceCreamComponent} />
        <Stack.Screen
          name="ReduxComponentHooks"
          component={ReduxComponentHooks}
        />

        <Stack.Screen name="ItemContainer" component={ItemContainer} />
        <Stack.Screen name="UserView" component={UserView} />
        <Stack.Screen name="TicTok" component={TicTok} />
        <Stack.Screen name="ThumbnailImage" component={ThumbnailImage} />

        <Stack.Screen name="ScreenRecording" component={ScreenRecording} />

        <Stack.Screen name="CardPaymentEx" component={CardPaymentEx} />
        <Stack.Screen name="Chats" component={Chats} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigation;
