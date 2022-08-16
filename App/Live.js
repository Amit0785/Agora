import React, {useEffect, useRef, useState} from 'react';
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

import RtcEngine, {
  ChannelProfile,
  ClientRole,
  RtcLocalView,
  RtcRemoteView,
  VideoRemoteState,
} from 'react-native-agora';
import database from '@react-native-firebase/database';

const dimensions = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};

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

async function requestCameraAndAudioPermission() {
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

export default function Live(props) {
  const isBroadcaster = props.route.params.type === 'create';

  const onShare = async () => {
    try {
      const result = await Share.share({message: props.route.params.channel});
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messageTag, setMessageTag] = useState('');
  const [index, setIndex] = useState(0);
  const [messageStatus, setMessageStatus] = useState(false);
  const [broadcasterVideoState, setBroadcasterVideoState] = useState(
    VideoRemoteState.Decoding,
  );
  const AgoraEngine = useRef();
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

  const onSwitchCamera = () => AgoraEngine.current.switchCamera();

  useEffect(() => {
    if (Platform.OS === 'android') requestCameraAndAudioPermission();
    const uid = isBroadcaster ? 1 : 0;
    init().then(() =>
      AgoraEngine.current.joinChannel(
        null,
        props.route.params.channel,
        null,
        uid,
      ),
    );
    const onChildAdd = database()
      .ref('/live/' + props.route.params.channel)
      .on('child_added', snapshot => {
        console.log('A new node has been added==>', snapshot.val());

        //console.log('------>', messages.length);
        //setMessages(state => [...state, snapshot.val()]);
        // var temp = [...messages, snapshot.val()];
        // setMessages(temp);
        messages.push(snapshot.val());

        console.log('------>', messages.length);
        console.log('messages===>', messages);
        if (messages.length !== 0) {
          //console.log('hello');
          setMessageStatus(true);
        }
      });
    return () => {
      AgoraEngine.current.destroy();
      database()
        .ref('/live' + props.route.params.channel)
        .off('child_added', onChildAdd);

      deleteChat();
    };
  }, [props.route.params.channel]);

  console.log('MESSAGES in .js==>', messages.length);

  const renderHost = () =>
    broadcasterVideoState === VideoRemoteState.Decoding ? (
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
    );

  const renderLocal = () => (
    <RtcLocalView.SurfaceView
      style={styles.fullscreen}
      channelId={props.route.params.channel}
    />
  );

  const onClose = async () => {
    props.navigation.goBack();
  };

  const replyAns = () => {
    console.log('messages.length====>', messages.length);
    if (messages.length !== 0) {
      console.log('Message===>', messages[0]);
      // setIndex(index + 1);
      database()
        .ref(`/live/${props.route.params.channel}/${messages[0].id}`)
        .remove()
        .then(() => {
          messages.pop();
          console.log('messages===>', messages);
          console.log('messages.length pop====>', messages.length);
          if (messages.length === 0) {
            setMessageStatus(false);
          }
        })
        .catch(() => {
          console.log('Error in deleting');
        });
    } else {
      setMessageStatus(false);
    }
  };
  const deleteChat = () => {
    console.log('Delete Chat');
    database()
      .ref('/live/' + props.route.params.channel)
      .remove()
      .then(() => {
        console.log('Data has been deleted');
        setMessages([]);
        //props.navigation.goBack();
      })
      .catch(() => {
        console.log('Error in deleting');
      });
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
          {isBroadcaster ? renderLocal() : renderHost()}
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
                {messageStatus ? (
                  <TouchableOpacity
                    onPress={() => {
                      replyAns();
                    }}
                    style={{
                      //height: 80,
                      width: dimensions.width * 0.9,
                      alignSelf: 'center',
                      backgroundColor: '#FFFFFF',
                      borderRadius: 10,
                      padding: 15,
                      marginTop: dimensions.height * 0.03,
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
                    <Text
                      style={{
                        fontSize: 17,
                        fontWeight: '400',
                        color: '#151143',
                      }}>
                      {messages[0].message}
                    </Text>
                  </TouchableOpacity>
                ) : null}
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#222',
  },
  fullscreen: {
    width: dimensions.width,
    height: dimensions.height,
  },
  buttonContainer: {
    //flexDirection: 'row',
    right: '6%',
    //alignSelf: 'flex-end',
    //width: width * 0.3,
    //height: height * 0.4,
    //backgroundColor: 'red',
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
