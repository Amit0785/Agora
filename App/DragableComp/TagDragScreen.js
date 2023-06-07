// import React, {useRef} from 'react';
// import {
//   View,
//   PanResponder,
//   Animated,
//   TextInputFocusEventData,
//   Text,
//   TouchableWithoutFeedback,
// } from 'react-native';

// const TagDragScreen = () => {
//   const pan = useRef(new Animated.ValueXY()).current;

//   const panResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onPanResponderMove: Animated.event([null, {dx: pan.x, dy: pan.y}]),
//       onPanResponderRelease: () => {
//         // Handle release event if needed
//       },
//     }),
//   ).current;

//   const dragData = event => {
//     const {locationX, locationY} = event.nativeEvent;
//     console.log('======locationX, locationY=====>', locationX, locationY);
//   };

//   return (
//     <View style={{flex: 1}}>
//       <Animated.View
//         style={[
//           pan.getLayout(),
//           {width: 100, height: 100, backgroundColor: 'red'},
//         ]}
//         {...panResponder.panHandlers}>
//         {/* Add your tag content here */}
//         <TouchableWithoutFeedback
//           style={{width: '100%', height: '100%'}}
//           onPress={dragData}>
//           <Text>Hello</Text>
//         </TouchableWithoutFeedback>
//       </Animated.View>
//     </View>
//   );
// };

// export default TagDragScreen;

import React, {useRef, useState} from 'react';
import {View, PanResponder, Animated} from 'react-native';

const TagDragScreen = () => {
  const [tagPosition, setTagPosition] = useState({x: 0, y: 0});
  const pan = useRef(
    new Animated.ValueXY({x: tagPosition.x, y: tagPosition.y}),
  ).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        pan.setValue({x: gesture.dx, y: gesture.dy});
        setTagPosition({x: gesture.dx, y: gesture.dy});
        //console.log('=====tagPosition======>', tagPosition);
      },
      onPanResponderRelease: (event, gesture) => {
        // Handle release event if needed
        const {locationX, locationY} = event.nativeEvent;
        //pan.setValue({x: gesture.dx, y: gesture.dy});
        //setTagPosition({x: gesture.dx, y: gesture.dy});
        pan.setValue({x: gesture.dx, y: gesture.dy});
        setTagPosition({x: locationX, y: locationY});
        console.log('=====tagPosition======>', tagPosition, gesture);
      },
    }),
  ).current;

  return (
    <View style={{flex: 1}}>
      <Animated.View
        style={[
          pan.getLayout(),
          {width: 100, height: 100, backgroundColor: 'red'},
        ]}
        {...panResponder.panHandlers}>
        {/* Add your tag content here */}
      </Animated.View>
    </View>
  );
};

export default TagDragScreen;
