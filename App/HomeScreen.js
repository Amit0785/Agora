import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ScrollView,
  RefreshControl,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import 'react-native-get-random-values';
import {v4 as uuid} from 'uuid';
import {
  getUniqueId,
  getManufacturer,
  getDeviceId,
} from 'react-native-device-info';
//import CallScreen from './CallScreen';
const {width, height} = Dimensions.get('window');

import NotificationContext from './NotificationContext';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const HomeScreen = props => {
  // const [joinChannel, setJoinChannel] = useState(
  //   '0d3c129f-e8b4-4615-8410-6ca491dfa658',
  // );

  useEffect(() => {
    console.log('getUniqueId ===>', getUniqueId());
    console.log('DeviceId ====>', getDeviceId());
    console.log('getManufacturer==>', getManufacturer());
  }, []);

  const [refreshing, setRefreshing] = React.useState(false);
  const notificationContext = useContext(NotificationContext);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const [value, setValue] = useState('d36ce652-a704-4092-a6a2-c79cda8094d7');
  const val = '78209773-8430-440a-9b73-31e12ff887a7';

  const joinChannel = uuid();
  console.log('joinchannel==>', typeof joinChannel);

  const createConference = () =>
    props.navigation.navigate('Conference', {channel: val});

  const joinConference = () =>
    props.navigation.navigate('Conference', {channel: val});

  const NewVideoCall = () =>
    props.navigation.navigate('NewVideoCall', {channel: val});

  const createLive = () =>
    props.navigation.navigate('Live', {type: 'create', channel: value});

  const joinLive = () =>
    props.navigation.navigate('Live', {type: 'join', channel: value});
  const joinLive2 = () =>
    props.navigation.navigate('Live2', {type: 'join', channel: value});

  const CallScreen = () => {
    props.navigation.navigate('CallScreen');
  };
  const StreamMessage = () => {
    props.navigation.navigate('StreamMessage');
  };
  const StreamMessage2 = () => {
    props.navigation.navigate('StreamMessage2');
  };
  const Recording = () => {
    props.navigation.navigate('Recording');
  };

  const ReelVideo = () => {
    props.navigation.navigate('Reel');
  };
  return (
    <SafeAreaView style={{flex: 1, alignItems: 'center'}}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{
          paddingBottom: 10,
          marginLeft: 0,
          borderWidth: 0,
          borderColor: 'blue',
          width: width,
          justifyContent: 'center',
          //marginTop: 30,
          alignItems: 'center',
        }}>
        <View
          style={{
            alignItems: 'center',
            paddingVertical: 30,
            width: width,
            // backgroundColor: 'blue',
          }}>
          <Text>Video Conference App</Text>

          <TouchableOpacity
            onPress={() => {
              createConference();
            }}
            style={{
              width: 150,
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: 20,
              backgroundColor: 'pink',
            }}>
            <Text>Video Start</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              joinConference();
            }}
            style={{
              width: 150,
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: 10,
              backgroundColor: 'peru',
            }}>
            <Text>Video Join</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              NewVideoCall();
            }}
            style={{
              width: 150,
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: 10,
              backgroundColor: 'peru',
            }}>
            <Text> New Video Call</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              createLive();
            }}
            style={{
              width: 150,
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: 10,
              backgroundColor: 'peru',
            }}>
            <Text>Live</Text>
          </TouchableOpacity>

          {/* <View style={styles.input}>
          <TextInput
            value={value}
            onChangeText={value => setValue(value)}
            placeholder="Enter Channel"
            placeholderTextColor={'#8E7B85'}
            autoCorrect={false}
          />
        </View> */}

          <TouchableOpacity
            onPress={() => {
              notificationContext.popIn();
            }}
            style={{
              width: 150,
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: 10,
              backgroundColor: '#00FF7F',
            }}>
            <Text>Calling Toast</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              joinLive();
            }}
            style={{
              width: 150,
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: 10,
              backgroundColor: 'peru',
            }}>
            <Text> Join Live</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              joinLive2();
            }}
            style={{
              width: 150,
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: 10,
              backgroundColor: 'peru',
            }}>
            <Text> Join Live2</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              StreamMessage();
            }}
            style={{
              width: 150,
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: 10,
              backgroundColor: 'peru',
            }}>
            <Text>StreamMessage</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              StreamMessage2();
            }}
            style={{
              width: 150,
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: 10,
              backgroundColor: 'peru',
            }}>
            <Text>StreamMessage2</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              CallScreen();
            }}
            style={{
              width: 150,
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: 10,
              backgroundColor: 'peru',
            }}>
            <Text>CallScreen</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('CallScreen2');
            }}
            style={{
              width: 150,
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: 10,
              backgroundColor: 'peru',
            }}>
            <Text>CallScreen2</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              Recording();
            }}
            style={{
              width: 150,
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: 10,
              backgroundColor: 'peru',
            }}>
            <Text>Recording</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              ReelVideo();
            }}
            style={{
              width: 150,
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: 10,
              backgroundColor: 'peru',
            }}>
            <Text>Reel Video</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('CountryCurrency');
            }}
            style={{
              width: 150,
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: 10,
              backgroundColor: 'peru',
            }}>
            <Text>CountryCurrency</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('PayPalPayment', {amount: '$500'});
            }}
            style={{
              width: 150,
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: 10,
              backgroundColor: 'peru',
            }}>
            <Text>PayPal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('CheckboxExp');
            }}
            style={{
              width: 150,
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: 10,
              backgroundColor: 'peru',
            }}>
            <Text>Checkbox Example</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('CakeComponent');
            }}
            style={{
              width: 150,
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: 10,
              backgroundColor: '#00FF7F',
            }}>
            <Text>Redux Cake Example</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('IceCreamComponent');
            }}
            style={{
              width: 150,
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: 10,
              backgroundColor: '#00FF7F',
            }}>
            <Text>Redux IceCream Example</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('ReduxComponentHooks');
            }}
            style={{
              width: 150,
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: 10,
              backgroundColor: '#B6D0E2',
            }}>
            <Text>Redux Example with Hooks</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('UserView');
            }}
            style={{
              width: 150,
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: 10,
              backgroundColor: '#B6D0E2',
            }}>
            <Text>Api through redux</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('TicTok');
            }}
            style={{
              width: 150,
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: 10,
              backgroundColor: 'peru',
            }}>
            <Text>TIcTok app</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('ThumbnailImage');
            }}
            style={{
              width: 150,
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: 10,
              backgroundColor: 'peru',
            }}>
            <Text>Thumbnail Image</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  input: {
    width: width * 0.8,
    backgroundColor: '#EBE0E5',
    height: 50,
    borderRadius: 10,

    //marginTop: height * 0.0,
    paddingLeft: 10,
  },
});
