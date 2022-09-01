import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {addCake, buyCake} from './Redux/Action';
import {addIceCream, buyIceCream} from './Redux/Action';

const CakeComponentHooks = props => {
  const numOfCakes = useSelector(state => state.CakeReducer.numOfCakes);
  const numOfIcecream = useSelector(
    state => state.IceCreamReducer.numOfIceCreams,
  );

  const dispatch = useDispatch();

  return (
    <SafeAreaView style={{flex: 1, alignItems: 'center'}}>
      <View style={{marginTop: 50, alignItems: 'center', alignSelf: 'center'}}>
        <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 15}}>
          Redux using Hooks
        </Text>
        <Text style={{fontSize: 18, marginBottom: 15}}>
          Number of cakes:{numOfCakes}
        </Text>
        <TouchableOpacity
          onPress={() => {
            dispatch(buyCake());
          }}
          style={{
            width: 150,
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
            marginVertical: 20,
            backgroundColor: 'red',
          }}>
          <Text>Buy Cake</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            dispatch(addCake());
          }}
          style={{
            width: 150,
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
            marginVertical: 20,
            backgroundColor: '#8FBC8F',
          }}>
          <Text>Add Cake</Text>
        </TouchableOpacity>
      </View>
      <View style={{marginTop: 50, alignItems: 'center', alignSelf: 'center'}}>
        <Text style={{fontSize: 18, marginBottom: 15}}>
          Number of IceCream:{numOfIcecream}
        </Text>
        <TouchableOpacity
          onPress={() => {
            dispatch(buyIceCream());
          }}
          style={{
            width: 150,
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
            marginVertical: 20,
            backgroundColor: 'red',
          }}>
          <Text>Buy IceCream</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            dispatch(addIceCream());
          }}
          style={{
            width: 150,
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
            marginVertical: 20,
            backgroundColor: '#8FBC8F',
          }}>
          <Text>Add IceCream</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CakeComponentHooks;

const styles = StyleSheet.create({});
