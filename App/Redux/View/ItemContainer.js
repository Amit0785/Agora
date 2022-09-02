import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {connect} from 'react-redux';
import {buyIceCream, buyCake} from '../Action';

const ItemContainer = props => {
  //console.log('props.cake==>', props.route.params.cake);
  return (
    <SafeAreaView style={{flex: 1, alignItems: 'center'}}>
      <View style={{marginTop: 50, alignItems: 'center'}}>
        <Text style={{fontSize: 25, fontWeight: 'bold', color: '#000'}}>
          Example of Either Cake or IceCream
        </Text>
        {props.cake == undefined ? (
          <Text style={{fontSize: 20, fontWeight: 'bold', color: 'red'}}>
            Total IceCream
          </Text>
        ) : (
          <Text style={{fontSize: 20, fontWeight: 'bold', color: 'blue'}}>
            Total Cake
          </Text>
        )}
        <Text>Item:{props.item}</Text>
        <TouchableOpacity
          onPress={() => {
            props.buyItem();
          }}
          style={{
            width: 150,
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 20,
            backgroundColor: 'peru',
          }}>
          <Text>Buy</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const mapStateToProps = (state, ownProps) => {
  const itemState = ownProps.cake
    ? state.CakeReducer.numOfCakes
    : state.IceCreamReducer.numOfIceCreams;
  return {
    item: itemState,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const dispatchFunction = ownProps.cake
    ? number => dispatch(buyCake(number))
    : () => dispatch(buyIceCream());
  return {
    buyItem: dispatchFunction,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ItemContainer);

const styles = StyleSheet.create({});
