import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {connect} from 'react-redux';
import {addIceCream, buyIceCream} from './Redux/Action';

const IceCreamComponent = props => {
  const buy = () => {
    console.log('Buy IceCream');
    props.buyIceCream();
  };
  const add = () => {
    props.addIceCream();
  };

  console.log('numOfCakes==>', props.addIceCream);
  return (
    <SafeAreaView style={{flex: 1, alignItems: 'center'}}>
      <View style={{marginTop: 50}}>
        <Text>Number of IceCream:{props.numOfIceCreams}</Text>
        <TouchableOpacity
          onPress={() => {
            buy();
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
            add();
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

const mapStateToProps = state => {
  return {
    numOfIceCreams: state.IceCreamReducer.numOfIceCreams,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    buyIceCream: () => dispatch(buyIceCream()),
    addIceCream: () => dispatch(addIceCream()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(IceCreamComponent);

const styles = StyleSheet.create({});
