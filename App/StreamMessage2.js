import React, {Component, Fragment, useRef} from 'react';
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
} from 'react-native-agora';

const config = require('./Agora.json');
const {width, height} = Dimensions.get('window');

// interface State {
//   channelId: string;
//   isJoined: boolean;
//   remoteUid: number[];
//   message?: string;
// }

export default class StreamMessage2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channelId: config.channelId,
      remoteUid: [],
      isJoined: false,
      question: '',
    };
    this.engine = React.createRef();
  }

  UNSAFE_componentWillMount() {
    this.initEngine();
  }

  componentWillUnmount() {
    this.engine.destroy();
  }

  initEngine = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        'android.permission.RECORD_AUDIO',
        'android.permission.CAMERA',
      ]);
    }

    this.engine = await RtcEngine.createWithContext(
      new RtcEngineContext(config.appId),
    );
    this.addListeners();

    // enable video module and set up video encoding configs
    await this.engine.enableVideo();

    // make myself a broadcaster
    await this.engine.setChannelProfile(ChannelProfile.LiveBroadcasting);
    await this.engine.setClientRole(ClientRole.Broadcaster);

    // Set audio route to speaker
    await this.engine.setDefaultAudioRoutetoSpeakerphone(true);
  };

  addListeners = () => {
    this.engine.addListener('Warning', warningCode => {
      console.info('Warning', warningCode);
    });
    this.engine.addListener('Error', errorCode => {
      console.info('Error', errorCode);
    });
    this.engine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
      console.info('JoinChannelSuccess', channel, uid, elapsed);
      // RtcLocalView.SurfaceView must render after engine init and channel join
      this.setState({isJoined: true});
    });
    this.engine.addListener('LeaveChannel', stats => {
      console.info('LeaveChannel', stats);
      // RtcLocalView.SurfaceView must render after engine init and channel join
      this.setState({isJoined: false, remoteUid: []});
    });
    this.engine.addListener('UserJoined', (uid, elapsed) => {
      console.info('UserJoined', uid, elapsed);
      this.setState({remoteUid: [...this.state.remoteUid, uid]});
    });
    this.engine.addListener('UserOffline', (uid, reason) => {
      console.info('UserOffline', uid, reason);
      this.setState({
        remoteUid: this.state.remoteUid.filter(value => value !== uid),
      });
    });
    this.engine.addListener('StreamMessage', (uid, streamId, data) => {
      console.info('StreamMessage', uid, streamId, data);
      //this.state.question=data
      this.setState({question: data});
      Alert.alert(`Receive from uid:${uid}`, `StreamId ${streamId}:${data}`, [
        {
          text: 'Ok',
          onPress: () => {},
        },
      ]);
    });
    this.engine.addListener(
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

  joinChannel = async () => {
    // start joining channel
    // 1. Users can only see each other after they join the
    // same channel successfully using the same app id.
    // 2. If app certificate is turned on at dashboard, token is needed
    // when joining channel. The channel name and uid used to calculate
    // the token has to match the ones used for channel join
    await this.engine.joinChannel(
      config.token,
      this.state.channelId,
      null,
      config.uid,
    );
  };

  leaveChannel = async () => {
    await this.engine.leaveChannel();
  };

  render() {
    const {channelId, isJoined} = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.top}>
          <TextInput
            style={styles.input}
            onChangeText={text => this.setState({channelId: text})}
            placeholder={'Channel ID'}
            value={channelId}
          />
          <Button
            onPress={isJoined ? this.leaveChannel : this.joinChannel}
            title={`${isJoined ? 'Leave' : 'Join'} channel`}
          />
        </View>
        {isJoined && this.renderVideo()}
        {isJoined && this.renderToolBar()}
        <TouchableOpacity
          style={{
            //height: 80,
            width: width * 0.9,
            alignSelf: 'center',
            backgroundColor: '#FFFFFF',
            borderRadius: 10,
            padding: 15,
            marginTop: height * 0.03,
            position: 'absolute',
            top: height * 0.13,
          }}>
          <Text
            style={{
              fontSize: 17,
              fontWeight: '400',
              color: '#151143',
              marginBottom: 10,
            }}>
            Questions
          </Text>
          <Text style={{fontSize: 17, fontWeight: '400', color: '#151143'}}>
            {this.state.question}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderVideo = () => {
    const {remoteUid} = this.state;
    return (
      <View style={styles.videoContainer}>
        <RtcLocalView.SurfaceView
          style={styles.local}
          renderMode={VideoRenderMode.Hidden}
        />
        {remoteUid.length > 0 && (
          <RtcRemoteView.SurfaceView
            style={styles.remote}
            uid={remoteUid[remoteUid.length - 1]}
          />
        )}
      </View>
    );
  };

  renderToolBar = () => {
    const {message} = this.state;
    return (
      <Fragment>
        <Text style={styles.toolBarTitle}>Send Message</Text>
        <View style={styles.infoContainer}>
          <TextInput
            style={styles.input}
            onChangeText={text => this.setState({message: text})}
            placeholder={'Input Message'}
            value={message}
          />
          <Button title="Send" onPress={this.onPressSend} />
        </View>
      </Fragment>
    );
  };

  onPressSend = async () => {
    // const {message} = {
    //   messg: 'Hello',
    //   amt: '50$',
    // };
    const {message} = this.state;
    const msg = 'Hello';
    const Amt = '50';

    const data23 = {
      msg: 'Hello',
      Amt: '50',
    };

    if (!message) {
      return;
    }
    console.log('This.state==>', typeof message);
    const streamId = await this.engine.createDataStreamWithConfig(
      new DataStreamConfig(true, true),
    );

    await this.engine.sendStreamMessage(streamId, JSON.stringify(data23));
    this.setState({message: ''});
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 40,
  },
  top: {
    width: '100%',
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    color: 'black',
  },
  videoContainer: {
    width: '100%',
    flexDirection: 'row',
  },
  local: {
    width: '50%',
    aspectRatio: 1,
  },
  remote: {
    width: '50%',
    aspectRatio: 1,
  },
  toolBarTitle: {
    marginTop: 48,
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoContainer: {
    width: '100%',
    flexDirection: 'row',
  },
});

// import {StyleSheet, Text, View} from 'react-native';
// import React from 'react';

// const StreamMessage = () => {
//   return (
//     <View>
//       <Text>StreamMessage</Text>
//     </View>
//   );
// };

// export default StreamMessage;

// const styles = StyleSheet.create({});
