import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {connect} from 'react-redux';
import {addCake, buyCake, addIceCream, buyIceCream} from './Redux/Action';

const CakeComponent = props => {
  const buycake = () => {
    props.buyCake();
  };
  const addcake = () => {
    props.addCake();
  };

  //console.log('numOfCakes==>', props.numOfCakes);
  return (
    <SafeAreaView style={{flex: 1, alignItems: 'center'}}>
      <View style={{marginTop: 50}}>
        <Text>Number of cakes:{props.numOfCakes}</Text>
        <TouchableOpacity
          onPress={() => {
            buycake();
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
            addcake();
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
        <Text style={{marginTop: 20}}>
          Number of IceCreams:{props.numOfIceCreams}
        </Text>
        <TouchableOpacity
          onPress={() => {
            props.buyIceCream();
          }}
          style={{
            width: 150,
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
            marginVertical: 20,
            backgroundColor: 'red',
          }}>
          <Text>Buy Icecream</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            props.addIceCream();
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
    numOfCakes: state.CakeReducer.numOfCakes,
    numOfIceCreams: state.IceCreamReducer.numOfIceCreams,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    buyCake: () => dispatch(buyCake()),
    addCake: () => dispatch(addCake()),
    buyIceCream: () => dispatch(buyIceCream()),
    addIceCream: () => dispatch(addIceCream()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CakeComponent);

const styles = StyleSheet.create({});
