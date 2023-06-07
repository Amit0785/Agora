import React from 'react';
import {TextStyle} from 'react-native';
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
} from 'react-native-reanimated';

const DragableView = ({children, style, updatePosition, data}) => {
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const panGestureEvent = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.x = x.value;
      context.y = y.value;
    },
    onActive: (event, context) => {
      x.value = event.translationX + context.x;
      y.value = event.translationY + context.y;
    },
    onEnd: () => {
      // x.value = withSpring(0);
      // y.value = withSpring(0);
      //setCordinate();
      console.log('==>', x, y, data);
      //updatePosition(x, y);
      //someWorklet(x, y);
      //runOnUI(someWorklet)(x, y);
    },
  });
  function someWorklet(x, y) {
    'worklet';
    console.log("Hey I'm running on the UI thread");
    //updatePosition(x, y);
  }
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
    <PanGestureHandler onGestureEvent={panGestureEvent}>
      <Animated.View
        style={[
          {display: 'flex', justifyContent: 'center', alignItems: 'center'},
          panStyle,
          {...style},
        ]}>
        {children}
      </Animated.View>
    </PanGestureHandler>
  );
};

export {DragableView};
