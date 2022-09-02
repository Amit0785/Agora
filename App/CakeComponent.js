import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import React from 'react';
import {connect} from 'react-redux';
import {addCake, buyCake, addIceCream, buyIceCream} from './Redux/Action';
import ItemContainer from './Redux/View/ItemContainer';
const {width, height} = Dimensions.get('window');
const CakeComponent = props => {
  const buycake = num => {
    props.buyCake(num);
  };
  const addcake = () => {
    props.addCake();
  };

  //console.log('numOfCakes==>', props.numOfCakes);
  return (
    <SafeAreaView style={{flex: 1, alignItems: 'center'}}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 10,
          marginLeft: 0,
          borderWidth: 0,
          borderColor: 'blue',
          width: width,
          justifyContent: 'center',
          //marginTop: 30,
          alignItems: 'center',
        }}>
        <View
          style={{
            alignItems: 'center',
            paddingVertical: 30,
            width: width,
            // backgroundColor: 'blue',
          }}>
          <View style={{marginTop: 50}}>
            <Text>Number of cakes:{props.numOfCakes}</Text>
            <TouchableOpacity
              onPress={() => {
                buycake(5);
              }}
              style={{
                width: 150,
                height: 50,
                alignItems: 'center',
                justifyContent: 'center',
                marginVertical: 20,
                backgroundColor: 'red',
              }}>
              <Text>Buy 5 Cake</Text>
            </TouchableOpacity>

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
              <Text>Buy 1 Cake</Text>
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
                marginTop: 20,
                backgroundColor: '#8FBC8F',
              }}>
              <Text>Add IceCream</Text>
            </TouchableOpacity>
          </View>
          <ItemContainer cake />
          <ItemContainer />
        </View>
      </ScrollView>
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
    buyCake: number => dispatch(buyCake(number)),
    addCake: () => dispatch(addCake()),
    buyIceCream: () => dispatch(buyIceCream()),
    addIceCream: () => dispatch(addIceCream()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CakeComponent);

const styles = StyleSheet.create({});
