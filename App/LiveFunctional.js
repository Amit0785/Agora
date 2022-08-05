import React, {useRef, useEffect} from 'react';
import {
  Alert,
  Button,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import RtcEngine, {
  ChannelProfile,
  ClientRole,
  DataStreamConfig,
  RtcEngineContext,
  RtcLocalView,
  RtcRemoteView,
  VideoRenderMode,
  VideoRemoteState,
} from 'react-native-agora';

const config = require('./Agora.json');
const {width, height} = Dimensions.get('window');

const LiveFunctional = () => {
  const engine = React.createRef();
  //const AgoraEngine = useRef();
  const [joined, setJoined] = useState(false);
  const [broadcasterVideoState, setBroadcasterVideoState] = useState(
    VideoRemoteState.Decoding,
  );
  const isBroadcaster = props.route.params.type === 'create';

  const init = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        'android.permission.RECORD_AUDIO',
        'android.permission.CAMERA',
      ]);
    }

    engine = await RtcEngine.createWithContext(
      new RtcEngineContext(config.appId),
    );
    addListeners();

    // enable video module and set up video encoding configs
    await engine.enableVideo();

    // make myself a broadcaster
    await engine.setChannelProfile(ChannelProfile.LiveBroadcasting);
    await engine.setClientRole(ClientRole.Broadcaster);

    // Set audio route to speaker
    await engine.setDefaultAudioRoutetoSpeakerphone(true);
  };

  const joinChannel = async () => {
    // start joining channel
    // 1. Users can only see each other after they join the
    // same channel successfully using the same app id.
    // 2. If app certificate is turned on at dashboard, token is needed
    // when joining channel. The channel name and uid used to calculate
    // the token has to match the ones used for channel join
    await engine.joinChannel(null, config.channelId, null, config.uid);
  };

  const addListeners = () => {
    engine.addListener('Warning', warningCode => {
      console.info('Warning', warningCode);
    });
    engine.addListener('Error', errorCode => {
      console.info('Error', errorCode);
    });
    engine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
      console.info('JoinChannelSuccess', channel, uid, elapsed);
      // RtcLocalView.SurfaceView must render after engine init and channel join
      this.setState({isJoined: true});
    });
    engine.addListener('LeaveChannel', stats => {
      console.info('LeaveChannel', stats);
      // RtcLocalView.SurfaceView must render after engine init and channel join
      this.setState({isJoined: false, remoteUid: []});
    });
    engine.addListener('UserJoined', (uid, elapsed) => {
      console.info('UserJoined', uid, elapsed);
      //   this.setState({remoteUid: [...this.state.remoteUid, uid]});
    });
    engine.addListener('UserOffline', (uid, reason) => {
      console.info('UserOffline', uid, reason);
      //   this.setState({
      //     remoteUid: this.state.remoteUid.filter(value => value !== uid),
      //   });
    });
    engine.addListener('StreamMessage', (uid, streamId, data) => {
      console.info('StreamMessage', uid, streamId, data);
      //this.state.question=data
      //this.setState({question: data});
      Alert.alert(`Receive from uid:${uid}`, `StreamId ${streamId}:${data}`, [
        {
          text: 'Ok',
          onPress: () => {},
        },
      ]);
    });
    engine.addListener(
      'StreamMessageError',
      (uid, streamId, error, missed, cached) => {
        console.info(
          'StreamMessageError',
          uid,
          streamId,
          error,
          missed,
          cached,
        );
      },
    );
  };

  useEffect(() => {
    init();

    // return () => {

    // }
  }, []);

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

export default LiveFunctional;

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
