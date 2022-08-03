import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useEffect} from 'react';

const Recording = () => {
  const state = {
    appId: '<YourAppId>',
    URL: '<YourBackendURL>',
    channelName: 'test',
    // joinSucceed: false,
    joinSucceed: true,
    peerIds: [],
    rid: null,
    sid: null,
    recUid: null,
  };
  // useEffect(() => {
  //   startCall()

  //   return () => {

  //   }
  // }, [])

  const startCall = async () => {
    let that = this;
    fetch(URL + '/api/get/rtc/test')
      .then(function (response) {
        response.json().then(async function (data) {
          await that._engine?.joinChannel(
            data.rtc_token,
            that.channelName,
            null,
            data.uid,
          );
        });
      })
      .catch(function (err) {
        console.log('Fetch Error', err);
      });
  };

  const startRecording = async () => {
    let that = this;
    fetch(URL + '/api/start/call', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({channel: that.channelName}),
    })
      .then(function (response) {
        response.json().then(async function (res) {
          let data = res.data;
          that.setState({recUid: data.uid, sid: data.sid, rid: data.rid});
        });
      })
      .catch(function (err) {
        console.log('Fetch Error', err);
      });
  };

  const stopRecording = async () => {
    fetch(URL + '/api/stop/call', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        channel: channelName,
        rid: this.state.rid,
        sid: this.state.sid,
        uid: this.state.recUid,
      }),
    })
      .then(function (response) {
        response.json().then(async function (data) {
          console.log(data);
        });
      })
      .catch(function (err) {
        console.log('Fetch Error', err);
      });
  };

  const query = async () => {
    fetch(URL + '/api/status/call', {
      method: 'POST',
      body: JSON.stringify({rid: this.state.rid, sid: this.state.sid}),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(function (response) {
        response.json().then(async function (data) {
          console.log(data);
        });
      })
      .catch(function (err) {
        console.log('Fetch Error', err);
      });
  };
  return (
    <View style={{flex: 1}}>
      <Text>Hello</Text>
      {state.joinSucceed ? (
        <View style={styles.buttonHolder}>
          <Text style={styles.recordingText}>Recording:</Text>
          <TouchableOpacity onPress={startRecording} style={styles.button}>
            <Text style={styles.buttonText}> Start </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={stopRecording} style={styles.button}>
            <Text style={styles.buttonText}> End </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={query} style={styles.button}>
            <Text style={styles.buttonText}> Query </Text>
          </TouchableOpacity>
        </View>
      ) : null}
      {/* {renderVideos()} */}
    </View>
  );
};

export default Recording;

const styles = StyleSheet.create({});
