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

const Live = props => {
  const AgoraEngine = React.createRef();
  const [joined, setJoined] = useState(false);
  const [channelId, setChannelId] = useState(props.route.params.channel);
  const [broadcasterVideoState, setBroadcasterVideoState] = useState(
    VideoRemoteState.Decoding,
  );
  const isBroadcaster = props.route.params.type === 'create';

  const onShare = async () => {
    try {
      await Share.share({message: channelId});
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
  const cnannelId = props.route.params.channel;
  const init = async () => {
    setChannelId(props.route.params.channel);
    AgoraEngine.current = await RtcEngine.createWithContext(
      new RtcEngineContext(config.appId),
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
    AgoraEngine.current.addListener('Warning', warningCode => {
      console.info('Warning', warningCode);
    });
    AgoraEngine.current.addListener('Error', errorCode => {
      console.info('Error', errorCode);
    });

    AgoraEngine.current.addListener('LeaveChannel', stats => {
      console.info('LeaveChannel', stats);
      // RtcLocalView.SurfaceView must render after engine init and channel join
      // this.setState({isJoined: false, remoteUid: []});
    });
    AgoraEngine.current.addListener('UserJoined', (uid, elapsed) => {
      console.info('UserJoined', uid, elapsed);
    });
    AgoraEngine.current.addListener('UserOffline', (uid, reason) => {
      console.info('UserOffline', uid, reason);
    });
    AgoraEngine.current.addListener('StreamMessage', (uid, streamId, data) => {
      console.info('StreamMessage', uid, streamId, data);

      Alert.alert(`Receive from uid:${uid}`, `StreamId ${streamId}:${data}`, [
        {
          text: 'Ok',
          onPress: () => {},
        },
      ]);
    });
  };
  useEffect(() => {
    // Function Body
    const uid = isBroadcaster ? 1 : 0;
    requestCameraAndAudioPermission();
    init().then(() =>
      AgoraEngine.current.joinChannel(null, channelId, null, uid),
    );

    return () => {
      // Cleanup Function
      AgoraEngine.current.destroy();
    };
  }, [channelId, setChannelId]);

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
              channelId={channelId}
            />
          ) : (
            <>
              {broadcasterVideoState === VideoRemoteState.Decoding ? (
                <RtcRemoteView.SurfaceView
                  uid={1}
                  style={styles.fullscreen}
                  channelId={channelId}
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
