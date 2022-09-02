import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import {fetchUsers} from '../Action/UserApi';
const UserView = props => {
  useEffect(() => {
    props.fetchUsers();
    //fetchUsers();
  }, []);

  console.log('props.userData', props.userData.users);

  const fetchUsers = async () => {
    //fetchUserRequest();
    axios
      .get('https://jsonplaceholder.typicode.com/users')
      .then(response => {
        console.log('response.data==>', response.data);
        // response.data is the users
        //const users = response.data;
        // dispatch(fetchUserSuccess(response.data));
      })
      .catch(error => {
        // error.message is the error message
        //dispatch(fetchUsersFailure(error.message));
      });
  };

  return (
    <SafeAreaView style={{flex: 1, alignItems: 'center'}}>
      {props.userData.loading ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size="large" color="#E92D87" />
        </View>
      ) : props.userData.loading ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{fontSize: 25, color: 'red', fontWeight: 'bold'}}>
            {props.userData.error}
          </Text>
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            //justifyContent: 'center',
          }}>
          <Text style={{fontSize: 25, color: '#000', fontWeight: 'bold'}}>
            User List
          </Text>
          <FlatList
            data={props.userData.users}
            //horizontal={true}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <View style={{}}>
                <Text>{item.name}</Text>
              </View>
            )}
          />
        </View>
      )}
    </SafeAreaView>
  );
};
const mapStateToProps = state => {
  return {
    userData: state.UserReducer,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchUsers: () => dispatch(fetchUsers),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(UserView);

const styles = StyleSheet.create({});
