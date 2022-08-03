import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import AgoraUIKit from 'agora-rn-uikit';
import RtcEngine, {
  ChannelProfile,
  ClientRole,
  LocalVideoStreamError,
  RtcEngineContext,
  RtcLocalView,
  RtcRemoteView,
  VideoRenderMode,
} from 'react-native-agora';

export default function JoinConference(props) {
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', async () => {
      init();
    });
    return unsubscribe;
  }, []);

  const [videoCall, setVideoCall] = useState(true);
  const [isHost, setIsHost] = useState(false);
  const [joinSucceed, setJoinSucceed] = useState(false);
  const [peerIds, setPeerIds] = useState([]);

  const init = async () => {
    const app = {
      appId: '1289a9be02f54740a9823af110034ffa',
      channelName: props.route.params.channel,
      //token: 'yourToken',
      joinSucceed: false,
      peerIds: [],
    };

    console.log('App===>', typeof {app});
    console.log('App===>', {app});
    const engine = await RtcEngine.create({app});
    await engine.enableVideo();
    await engine.setChannelProfile(ChannelProfile.LiveBroadcasting);
    await engine.setClientRole(
      isHost ? ClientRole.Broadcaster : ClientRole.Audience,
    );

    engine.addListener('Warning', warn => {
      console.log('Warning', warn);
    });

    engine.addListener('Error', err => {
      console.log('Error', err);
    });

    engine.addListener('UserJoined', (uid, elapsed) => {
      console.log('UserJoined');
      console.log('UserJoined', uid, elapsed);
      // Get current peer IDs
      const {peerId} = {
        isHost: isHost,
        joinSucceed: joinSucceed,
        peerIds: peerIds,
      };
      console.log('====<>', peerId);
      // If new user
      if (peerId.indexOf(uid) === -1) {
        // Add peer ID to state array
        setPeerIds(...peerIds, uid);
        // this.setState({
        //   peerIds: [...peerIds, uid],
        // });
      }
    });

    engine.addListener('UserOffline', (uid, reason) => {
      console.log('UserOffline', uid, reason);
      const {peerIds} = {
        isHost: isHost,
        joinSucceed: joinSucceed,
        peerIds: peerIds,
      };
      // Remove peer ID from state array
      setPeerIds(peerIds.filter(id => id !== uid));
      // this.setState({
      //   peerIds: peerIds.filter(id => id !== uid),
      // });
    });

    // If Local user joins RTC channel
    engine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
      console.log('JoinChannelSuccess', channel, uid, elapsed);
      // Set state variable to true

      setJoinSucceed(true);
      // this.setState({
      //   joinSucceed: true,
      // });
    });
  };
  const rtcProps = {
    appId: '1289a9be02f54740a9823af110034ffa',
    channel: props.route.params.channel,
  };

  const callbacks = {
    EndCall: () => {
      props.navigation.goBack();
    },
    LocalMuteAudio: mute => console.log('Mute==>', mute),
  };
  return <AgoraUIKit rtcProps={rtcProps} callbacks={callbacks} />;
}
