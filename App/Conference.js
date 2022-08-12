import React from 'react';
import {TouchableOpacity, Text, StyleSheet, Share} from 'react-native';
import AgoraUIKit, {VideoRenderMode, PropsInterface} from 'agora-rn-uikit';
//import {useNavigation} from '@react-navigation/native';

export default function Conference(props) {
  const onShare = async () => {
    try {
      await Share.share({message: props.route.params.channel});
    } catch (error) {
      console.log(error.message);
    }
  };

  //const navigation = useNavigation();

  const rtcProps = {
    appId: '1289a9be02f54740a9823af110034ffa',
    channel: props.route.params.channel,
  };

  const callbacks = {
    EndCall: () => props.navigation.goBack(),
  };

  const localButtonStyle = {
    backgroundColor: '#78b0ff',

    borderColor: '#78b0ff',
  };

  const styleProps = {
    iconSize: 30,
    theme: '#ffffffee',
    videoMode: {
      max: VideoRenderMode.Hidden,
      min: VideoRenderMode.Hidden,
    },
    overlayContainer: {
      backgroundColor: '#2edb8533',
      opacity: 1,
    },
    localBtnStyles: {
      muteLocalVideo: btnStyle,
      muteLocalAudio: btnStyle,
      switchCamera: btnStyle,
      endCall: {
        borderRadius: 0,
        width: 50,
        height: 50,
        backgroundColor: '#f66',
        borderWidth: 0,
      },
    },
    localBtnContainer: {
      backgroundColor: '#fff',
      bottom: 0,
      paddingVertical: 10,
      borderWidth: 4,
      borderColor: '#2edb85',
      height: 80,
    },
    maxViewRemoteBtnContainer: {
      top: 0,
      alignSelf: 'flex-end',
    },
    remoteBtnStyles: {
      muteRemoteAudio: remoteBtnStyle,
      muteRemoteVideo: remoteBtnStyle,
      remoteSwap: remoteBtnStyle,
      minCloseBtnStyles: remoteBtnStyle,
    },
    minViewContainer: {
      bottom: 80,
      top: undefined,
      backgroundColor: '#fff',
      borderColor: '#E92D87',
      borderWidth: 4,
      height: '26%',
    },
    minViewStyles: {
      height: '100%',
    },
    maxViewStyles: {
      height: '64%',
    },
    UIKitContainer: {height: '94%'},
  };

  const btnStyle = {
    borderRadius: 2,
    width: 40,
    height: 40,
    backgroundColor: '#E92D87',
    borderWidth: 0,
  };
  const remoteBtnStyle = {backgroundColor: '#E92D87'};

  return (
    <>
      <AgoraUIKit
        rtcProps={rtcProps}
        callbacks={callbacks}
        styleProps={styleProps}
      />
      <TouchableOpacity style={styles.shareButton} onPress={onShare}>
        <Text style={styles.shareButtonText}>Share</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  shareButton: {
    right: 0,
    width: 80,
    height: 40,
    margin: 25,
    borderRadius: 8,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#78b0ff',
  },
  shareButtonText: {
    fontSize: 16,
  },
});
