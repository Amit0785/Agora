import {
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  ActivityIndicator,
  Dimensions,
  Share,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';

import RtcEngine, {
  ChannelProfile,
  ClientRole,
  RtcLocalView,
  RtcRemoteView,
  VideoRemoteState,
} from 'react-native-agora';
const {width, height} = Dimensions.get('window');

const Live = (props, {navigation}) => {
  const AgoraEngine = useRef();
  const [joined, setJoined] = useState(false);
  const [broadcasterVideoState, setBroadcasterVideoState] = useState(
    VideoRemoteState.Decoding,
  );
  const isBroadcaster = props.route.params.type === 'create';

  const onShare = async () => {
    try {
      await Share.share({message: props.route.params.channel});
    } catch (error) {
      console.log(error.message);
    }
  };

  const onSwitchCamera = () => AgoraEngine.current.switchCamera();

  const videoStateMessage = state => {
    switch (state) {
      case VideoRemoteState.Stopped:
        return 'Video turned off by Host';

      case VideoRemoteState.Frozen:
        return 'Connection Issue, Please Wait';

      case VideoRemoteState.Failed:
        return 'Network Error';
    }
  };

  const init = async () => {
    AgoraEngine.current = await RtcEngine.create(
      '1289a9be02f54740a9823af110034ffa',
    );
    AgoraEngine.current.enableVideo();
    AgoraEngine.current.setChannelProfile(ChannelProfile.LiveBroadcasting);
    if (isBroadcaster)
      AgoraEngine.current.setClientRole(ClientRole.Broadcaster);
    AgoraEngine.current.addListener('RemoteVideoStateChanged', (uid, state) => {
      if (uid === 1) setBroadcasterVideoState(state);
    });
    AgoraEngine.current.addListener(
      'JoinChannelSuccess',
      (channel, uid, elapsed) => {
        console.log('JoinChannelSuccess', channel, uid, elapsed);
        setJoined(true);
      },
    );
  };
  useEffect(
    () => {
      // Function Body
      const uid = isBroadcaster ? 1 : 0;
      requestCameraAndAudioPermission();
      init().then(() =>
        AgoraEngine.current.joinChannel(
          null,
          props.route.params.channel,
          null,
          uid,
        ),
      );

      return () => {
        // Cleanup Function
        AgoraEngine.current.destroy();
      };
    },
    [
      /* State Elements */
    ],
  );

  async function requestCameraAndAudioPermission() {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);
        if (
          granted['android.permission.RECORD_AUDIO'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.CAMERA'] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('You can use the cameras & mic');
        } else {
          console.log('Permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  }

  const onClose = async () => {
    props.navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {!joined ? (
        <>
          <ActivityIndicator
            size={60}
            color="#222"
            style={styles.activityIndicator}
          />
          <Text style={styles.loadingText}>Joining Stream, Please Wait</Text>
        </>
      ) : (
        <>
          {isBroadcaster ? (
            <RtcLocalView.SurfaceView
              style={styles.fullscreen}
              channelId={props.route.params.channel}
            />
          ) : (
            <>
              {broadcasterVideoState === VideoRemoteState.Decoding ? (
                <RtcRemoteView.SurfaceView
                  uid={1}
                  style={styles.fullscreen}
                  channelId={props.route.params.channel}
                />
              ) : (
                <View style={styles.broadcasterVideoStateMessage}>
                  <Text style={styles.broadcasterVideoStateMessageText}>
                    {videoStateMessage(broadcasterVideoState)}
                  </Text>
                </View>
              )}
            </>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => onShare()}
              style={{
                width: 50,
                height: 50,
                marginVertical: 15,
                backgroundColor: '#3AB0FF',
                borderRadius: 100,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={require('../App/Assets/Icon/share.png')}
                style={{height: 27, width: 26, tintColor: '#FFF'}}
                resizeMode="contain"
              />
            </TouchableOpacity>

            {isBroadcaster ? (
              <>
                <TouchableOpacity
                  onPress={() => onSwitchCamera()}
                  style={{
                    width: 50,
                    height: 50,
                    marginVertical: 15,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#3AB0FF',
                    //backgroundColor: '#E1006E',
                    borderRadius: 100,
                  }}>
                  <Image
                    source={require('../App/Assets/Icon/camera.png')}
                    style={{
                      height: 30,
                      width: 25,
                      //tintColor: '#E1006E',
                      tintColor: '#fff',
                    }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </>
            ) : (
              <View
                style={{
                  width: 50,
                  height: 50,
                  marginVertical: 15,

                  //backgroundColor: '#3AB0FF',
                  //backgroundColor: '#E1006E',
                }}
              />
            )}
          </View>
          <View
            style={{
              position: 'absolute',
              alignSelf: 'center',
              bottom: '7%',

              //justifyContent: 'space-between',
              //width: '92%',
              //backgroundColor: 'red',
            }}>
            <TouchableOpacity
              onPress={() => {
                onClose();
              }}
              style={{
                width: 70,
                height: 70,
                //marginVertical: 15,
                alignItems: 'center',
                justifyContent: 'center',
                //backgroundColor: '#3AB0FF',
                //backgroundColor: '#E1006E',
                borderRadius: 100,
                osition: 'absolute',
                alignSelf: 'center',
                bottom: '7%',
              }}>
              <Image
                source={require('../App/Assets/Icon/closecall.png')}
                style={{
                  height: '100%',
                  width: '100%',
                  //tintColor: '#E1006E',
                  //tintColor: '#fff',
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

export default Live;

const styles = StyleSheet.create({
  loadingText: {
    fontSize: 18,
    color: '#222',
  },
  fullscreen: {
    width: width,
    height: height,
  },
  buttonContainer: {
    right: '6%',
    position: 'absolute',
    bottom: '7%',
    alignItems: 'flex-end',
  },
  button: {
    width: 150,
    backgroundColor: '#fff',
    marginBottom: 50,
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonText: {
    fontSize: 17,
  },
  broadcasterVideoStateMessage: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  broadcasterVideoStateMessageText: {
    color: '#fff',
    fontSize: 20,
  },
});
