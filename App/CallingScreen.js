// import React from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   SafeAreaView,
//   Animated,
//   Dimensions,
// } from 'react-native';
// const {width, height} = Dimensions.get('window');
// const CallingScreen = () => {
//   const animationY = new Animated.Value(-100);
//   return (
//     <Animated.View
//       style={[styles.container, {transform: [{translateY: animationY}]}]}>
//       <Text>Hello</Text>
//     </Animated.View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     //position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     alignItems: 'center',
//     justifyContent: 'center',
//     flexDirection: 'row',
//     height: 70,
//     width: 150,
//     backgroundColor: 'red',
//   },
// });

// export default CallingScreen;

import React, {useRef, useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Button,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {AntDesign, Entypo} from '@expo/vector-icons';

const Home = () => {
  const windowHeight = Dimensions.get('window').height;
  const [status, setStatus] = useState(null);
  const popAnim = useRef(new Animated.Value(windowHeight * -0.5)).current;
  const successColor = '#6dcf81';
  const successHeader = 'Success!';
  const successMessage = 'You pressed the success button';
  const failColor = '#bf6060';
  const failHeader = 'Failed!';
  const failMessage = 'You pressed the fail button';

  const popIn = () => {
    Animated.timing(popAnim, {
      toValue: windowHeight * 0.1,
      //duration: 300,
      useNativeDriver: true,
    }).start(popOut());
  };

  const popOut = () => {
    setTimeout(() => {
      Animated.timing(popAnim, {
        toValue: windowHeight * -1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, 10000);
  };

  const instantPopOut = () => {
    Animated.timing(popAnim, {
      toValue: windowHeight * -1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View>
      <Animated.View
        style={[
          styles.toastContainer,
          {
            transform: [{translateY: popAnim}],
          },
        ]}>
        <View style={styles.toastRow}>
          {/* <AntDesign
            name={status === "success" ? "checkcircleo" : "closecircleo"}
            size={24}
            color={status === "success" ? successColor : failColor}
          /> */}
          <View style={styles.toastText}>
            <Text style={{fontWeight: 'bold', fontSize: 15}}>
              {status === 'success' ? successHeader : failHeader}
            </Text>
            <Text style={{fontSize: 12}}>
              {status === 'success' ? successMessage : failMessage}
            </Text>
          </View>
          <TouchableOpacity
            onPress={instantPopOut}
            style={{height: 50, width: 50, backgroundColor: 'blue'}}>
            {/* <Entypo name="cross" size={24} color="black" /> */}
            <Text style={{color: 'red'}}>close</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Button
        title="Success Message"
        onPress={() => {
          setStatus('success');
          popIn();
        }}
        style={{marginTop: 30}}></Button>
    </View>
  );
};
export default Home;
const styles = StyleSheet.create({
  toastContainer: {
    //position: 'absolute',
    height: 60,
    width: 350,
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
  },
  toastRow: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  toastText: {
    width: '70%',
    padding: 2,
  },
});
