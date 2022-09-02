import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import {connect} from 'react-redux';
import {fetchUsers} from './Redux/Action/index';
const {width, height} = Dimensions.get('window');

const UserView = ({userData, fetchUsers}) => {
  useEffect(() => {
    fetchUsers();
  }, []);

  console.log('userData.loading', userData.loading);

  return (
    <SafeAreaView style={{flex: 1, alignItems: 'center'}}>
      {userData.loading ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size="large" color="#E92D87" />
        </View>
      ) : userData.loading ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{fontSize: 25, color: 'red', fontWeight: 'bold'}}>
            {userData.error}
          </Text>
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            //justifyContent: 'center',
            paddingVertical: 20,
          }}>
          <Text
            style={{
              fontSize: 25,
              color: '#000',
              fontWeight: 'bold',
              marginVertical: 10,
            }}>
            User List
          </Text>
          <FlatList
            data={userData.users}
            //horizontal={true}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <View
                //key={index}
                style={{
                  //height: height * 0.4,
                  height: 110,
                  width: width * 0.9,
                  backgroundColor: '#ffffff',
                  borderRadius: 10,
                  marginTop: height * 0.02,
                  elevation: 1,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    //nextPage(item);
                  }}
                  style={{
                    flexDirection: 'row',
                    margin: 5,
                    //margin: height * 0.01,
                    width: width * 0.85,
                    justifyContent: 'space-between',
                    //backgroundColor: 'red',
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <View
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 100,
                        //marginLeft: '2%',
                        //marginLeft: 10,
                        //marginHorizontal: '5%',
                        alignItems: 'center',
                        //backgroundColor:'red'
                      }}>
                      <Image
                        source={{
                          uri: 'https://source.unsplash.com/1024x768/?water',
                        }}
                        style={{
                          height: '100%',
                          width: '100%',
                          borderRadius: 100,
                        }}
                        resizeMode="cover"
                      />
                    </View>
                    <View
                      style={{
                        marginLeft: width * 0.01,
                        marginTop: height * 0.011,
                        alignItems: 'flex-start',
                      }}>
                      <View>
                        <Text
                          style={{
                            fontSize: 20,
                            color: '#000',
                            fontFamily: 'Roboto-Regular',
                            fontWeight: '400',
                            //fontWeight: 'bold',
                            //letterSpacing: 0.4,
                          }}>
                          #{item.username}
                        </Text>
                      </View>

                      <Text
                        style={{
                          fontSize: 14,
                          color: '#7B7B7B',
                          fontFamily: 'Roboto-Light',
                          fontWeight: '300',
                          //letterSpacing: 0.4,
                        }}>
                        {item.email}
                      </Text>
                    </View>
                  </View>

                  <View style={{}}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontFamily: 'Roboto - Medium',
                        color: '#151143',
                        fontWeight: '600',
                      }}>
                      {item.address.city}
                    </Text>
                  </View>
                </TouchableOpacity>
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
    fetchUsers: () => dispatch(fetchUsers()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(UserView);

const styles = StyleSheet.create({});
