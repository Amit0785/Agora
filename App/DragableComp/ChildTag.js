import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  ImageBackground,
  Pressable,
  TouchableWithoutFeedback,
} from 'react-native';
import React from 'react';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnUI,
  runOnJS,
} from 'react-native-reanimated';
import {RFValue} from 'react-native-responsive-fontsize';

const ChildTag = ({item, index, removeLink2, onDataReceived}) => {
  const x = useSharedValue(0);
  const y = useSharedValue(0);

  var xValue = 0;
  var yValue = 0;

  function sendData() {
    onDataReceived(xValue, yValue); // Call the callback function in the parent component
  }
  const panGestureEvent = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.x = x.value;
      context.y = y.value;
    },
    onActive: (event, context) => {
      x.value = event.translationX + context.x;
      y.value = event.translationY + context.y;
    },
    onEnd: (event, context) => {
      xValue = event.translationX + context.x;
      yValue = event.translationY + context.y;
      runOnJS(sendData)(true);
    },
  });

  const panStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: x.value,
        },
        {
          translateY: y.value,
        },
      ],
    };
  }, [x, y]);
  return (
    <PanGestureHandler key={index} onGestureEvent={panGestureEvent}>
      <Animated.View
        style={[
          {
            position: 'absolute',
            left: item.positionX,
            top: item.positionY,
            backgroundColor: '#fff',
            borderRadius: 7,
            //height: 30,
            padding: 10,
            //width: 70,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 2,
            borderColor: '#2E4497',
          },
          panStyle,
        ]}>
        <Text
          numberOfLines={1}
          style={{
            fontSize: RFValue(15),
            color: '#2E4497',
            //fontFamily: FONTS.NunitoRegular,
            fontWeight: '400',
          }}>
          {item.name}
        </Text>

        <TouchableOpacity
          onPress={removeLink2}
          style={{
            width: 20,
            height: 20,
            borderRadius: 100,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
            // marginRight: 5,
            position: 'absolute',
            right: -5,
            top: -5,
          }}>
          <Image
            source={require('../Assets/Icons/closered.png')}
            style={{
              width: '90%',
              height: '90%',
              resizeMode: 'cover',
              borderRadius: 100,
              tintColor: 'red',
            }}
          />
        </TouchableOpacity>
      </Animated.View>
    </PanGestureHandler>
  );
};

export default ChildTag;

const styles = StyleSheet.create({});
