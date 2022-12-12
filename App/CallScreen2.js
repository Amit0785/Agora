// // import RNCallKeep, { AnswerCallPayload } from 'react-native-callkeep';
// // import { NativeModules } from "react-native";

// // export class CallKeep {
// //   static instance: CallKeep;
// //   callId: string;
// //   callerName: string;
// //    callerId: string;
// //   isAudioCall: string | undefined;
// //   deviceOS: string;
// //    endCallCallback: Function | undefined;
// //   muteCallback: Function | undefined;
// //    IsRinging: boolean = false;

// //   constructor(
// //     callId: string,
// //     callerName: string,
// //     callerId: string,
// //     deviceOS: string,
// //     isAudioCall?: string
// //   ) {
// //     this.callId = callId;
// //     this.callerName = callerName;
// //     this.callerId = callerId;
// //     this.isAudioCall = isAudioCall;
// //     this.deviceOS = deviceOS;

// //     CallKeep.instance = this;
// //     this.setupEventListeners();
// //   }

// //   public static getInstance(): CallKeep {
// //     return CallKeep.instance;
// //   }

// //   endCall = () => {

// //     RNCallKeep.endCall(this.callId);

// //     if (this.endCallCallback) {
// //       this.endCallCallback();
// //     }

// //     this.removeEventListeners();
// //   };

// //   displayCallAndroid = () => {
// //     this.IsRinging = true;
// //     RNCallKeep.displayIncomingCall(
// //       this.callId,
// //       this.callerName,
// //       this.callerName,
// //       'generic'
// //     );
// //     setTimeout(() => {
// //       if (this.IsRinging) {
// //         this.IsRinging = false;
// //         // 6 = MissedCall
// //         // https://github.com/react-native-webrtc/react-native-callkeep#constants
// //         RNCallKeep.reportEndCallWithUUID(this.callId, 6);
// //       }
// //     }, 15000);
// //   };

// //   answerCall = ({ callUUID }: AnswerCallPayload) => {
// //     if (this.deviceOS === "android") {
// //       const { CallkeepHelperModule } = NativeModules;
// //       CallkeepHelperModule.startActivity();
// //       RNCallKeep.endCall(this.callId);
// //     }
// //     this.IsRinging = false;
// //     navigate("somewhere");
// //   };

// //   didDisplayIncomingCall = (args: DidDisplayIncomingCallArgs) => {
// //     if (args.error) {
// //       logError({
// //         message: `Callkeep didDisplayIncomingCall error: ${args.error}`,
// //       });
// //     }

// //     this.IsRinging = true;
// //     RNCallKeep.updateDisplay(
// //       this.callId,
// //       `${this.callerName}`,
// //       this.callerId
// //     );

// //     setTimeout(() => {
// //       if (this.IsRinging) {
// //         this.IsRinging = false;
// //         // 6 = MissedCall
// //         // https://github.com/react-native-webrtc/react-native-callkeep#constants
// //         RNCallKeep.reportEndCallWithUUID(this.callId, 6);
// //       }
// //     }, 15000);
// //   };

// //   private setupEventListeners() {
// //     RNCallKeep.addEventListener('endCall', this.endCall);
// //     RNCallKeep.addEventListener(
// //       'didDisplayIncomingCall',
// //       this.didDisplayIncomingCall
// //     );

// //   private removeEventListeners() {
// //     RNCallKeep.removeEventListener('endCall');
// //     RNCallKeep.removeEventListener('didDisplayIncomingCall');
// //     this.endCallCallback = undefined;
// //   }
// // }

// import React, {useState, useEffect} from 'react';
// import {
//   Platform,
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   ScrollView,
// } from 'react-native';
// import {v4 as uuid} from 'uuid';
// import RNCallKeep, {AnswerCallPayload} from 'react-native-callkeep';
// import {NativeModules} from 'react-native';
// //import BackgroundTimer from 'react-native-background-timer';
// //import DeviceInfo from 'react-native-device-info';

// //BackgroundTimer.start();

// const hitSlop = {top: 10, left: 10, right: 10, bottom: 10};
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     marginTop: 20,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   button: {
//     marginTop: 20,
//     marginBottom: 20,
//   },
//   callButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: 30,
//     width: '100%',
//   },
//   logContainer: {
//     flex: 3,
//     width: '100%',
//     backgroundColor: '#D9D9D9',
//   },
//   log: {
//     fontSize: 10,
//   },
// });

// RNCallKeep.setup({
//   ios: {
//     appName: 'CallKeepDemo',
//   },
//   android: {
//     alertTitle: 'Permissions required',
//     alertDescription: 'This application needs to access your phone accounts',
//     cancelButton: 'Cancel',
//     okButton: 'ok',
//   },
// });

// export default function CallScreen(props) {
//   const [IsRinging, setRinging] = useState(false);

//   const didDisplayIncomingCall = args => {
//     if (args.error) {
//       logError({
//         message: `Callkeep didDisplayIncomingCall error: ${args.error}`,
//       });
//     }

//     setRinging(true);
//     RNCallKeep.updateDisplay(this.callId, `${this.callerName}`, this.callerId);

//     setTimeout(() => {
//       if (IsRinging) {
//         setRinging(false);
//         // 6 = MissedCall
//         // https://github.com/react-native-webrtc/react-native-callkeep#constants
//         RNCallKeep.reportEndCallWithUUID(this.callId, 6);
//       }
//     }, 15000);
//   };

//   useEffect(() => {
//     RNCallKeep.addEventListener(
//       'didDisplayIncomingCall',
//       didDisplayIncomingCall,
//     );
//     //RNCallKeep.addEventListener('answerCall', answerCall);
//     RNCallKeep.addEventListener('endCall', endCall);

//     return () => {
//       RNCallKeep.addEventListener(
//         'didDisplayIncomingCall',
//         didDisplayIncomingCall,
//       );
//       //RNCallKeep.addEventListener('answerCall', answerCall);
//       RNCallKeep.removeEventListener('endCall', endCall);
//     };
//   }, []);

//   const displayCallAndroid = () => {
//     setRinging(true);
//     RNCallKeep.displayIncomingCall('1402', 'name', 'callerName', 'generic');
//     setTimeout(() => {
//       if (IsRinging) {
//         //this.IsRinging = false;
//         setRinging(false);
//         // 6 = MissedCall
//         // https://github.com/react-native-webrtc/react-native-callkeep#constants
//         RNCallKeep.reportEndCallWithUUID('1420', 6);
//       }
//     }, 15000);
//   };

//   const answerCall = ({callUUID}) => {
//     const {CallkeepHelperModule} = NativeModules;
//     CallkeepHelperModule.startActivity();
//     RNCallKeep.endCall(callUUID);

//     setRinging(false);
//     props.navigation.navigate('HomePage');
//   };

//   const endCall = ({callUUID}) => {
//     console.log('Hello end call');

//     //removeCall(callUUID);
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity
//         onPress={displayCallAndroid}
//         style={styles.button}
//         hitSlop={hitSlop}>
//         <Text>Display incoming call now</Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         //onPress={displayIncomingCallDelayed}
//         style={styles.button}
//         hitSlop={hitSlop}>
//         <Text>Display incoming call now in 3s</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import RNCallKeep, {AnswerCallPayload} from 'react-native-callkeep';
import {NativeModules} from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import DeviceInfo from 'react-native-device-info';
import SoundPlayer from 'react-native-sound-player';

const CallScreen2 = () => {
  const displayCallAndroid = () => {
    // RNCallKeep.displayIncomingCall('Amit', '15', '15', 'number', false);
    // RNCallKeep.answerIncomingCall('Amit');

    try {
      // play the file tone.mp3
      SoundPlayer.playSoundFile('ring', 'mp3');
      // or play from url
      // SoundPlayer.playUrl('https://example.com/music.mp3')

      SoundPlayer.addEventListener('FinishedPlaying', ({success}) => {
        console.log('finished playing', success);
        SoundPlayer.stop();
      });
    } catch (e) {
      console.log(`cannot play the sound file`, e);
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={displayCallAndroid}
        style={styles.button}
        //hitSlop={hitSlop}
      >
        <Text>Display incoming call now</Text>
      </TouchableOpacity>

      <TouchableOpacity
        //onPress={displayIncomingCallDelayed}
        style={styles.button}
        //hitSlop={hitSlop}
      >
        <Text>Display incoming call now in 3s</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CallScreen2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: 20,
    marginBottom: 20,
  },
  callButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    width: '100%',
  },
  logContainer: {
    flex: 3,
    width: '100%',
    backgroundColor: '#D9D9D9',
  },
  log: {
    fontSize: 10,
  },
});
