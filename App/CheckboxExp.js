import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CheckBox from '@react-native-community/checkbox';
import {RFValue} from 'react-native-responsive-fontsize';

const data = [
  {
    __v: 0,
    _id: '627cf811c9041f581ca90e25',
    createdAt: '2022-05-12T12:05:37.728Z',
    isActive: true,
    name: 'incorrect/invalid seller contact details',
    updatedAt: '2022-07-26T14:04:23.810Z',
  },
  {
    __v: 0,
    _id: '627cf887c9041f581ca90e38',
    createdAt: '2022-05-12T12:07:35.298Z',
    isActive: true,
    name: 'Contact Number Unreachable',
    updatedAt: '2022-07-26T14:03:53.434Z',
  },
  {
    __v: 0,
    _id: '627cf894c9041f581ca90e41',
    createdAt: '2022-05-12T12:07:48.709Z',
    isActive: true,
    name: 'Vehicle has been Sold',
    updatedAt: '2022-07-26T14:03:06.853Z',
  },
  {
    __v: 0,
    _id: '627cfae9371ef710acd92cae',
    createdAt: '2022-05-12T12:17:45.976Z',
    isActive: true,
    name: 'Seller did not respond',
    updatedAt: '2022-07-26T14:02:28.623Z',
  },
  {
    __v: 0,
    _id: '6283286cfcc21c551a1e1b48',
    createdAt: '2022-05-17T04:45:32.605Z',
    isActive: true,
    name: 'Seller not interested',
    updatedAt: '2022-05-17T04:45:32.605Z',
  },
  {
    __v: 0,
    _id: '628a77c88cc38c5787728e98',
    createdAt: '2022-05-22T17:50:00.060Z',
    isActive: true,
    name: 'The Vehicle is in ULEZ or Congestion Zone',
    updatedAt: '2022-05-22T17:50:43.243Z',
  },
];
//const {width, height} = Dimensions.get('window');
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const calcH = heightInPixel => {
  return Math.floor(screenHeight * heightInPixel);
};
const calcW = widthInPixel => {
  return Math.floor(screenWidth * widthInPixel);
};
const CheckboxExp = () => {
  const [select, setselect] = useState([]);

  const selectrejectReason = (value, index) => {
    console.log('reason', value);

    let newArr = [...select];
    newArr[index] = value;

    setselect(newArr);
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.cardStyle, styles.shadowProp]}>
        <View style={styles.nextcard}>
          <View style={styles.listMenuOne}>
            <Text>Checkbox</Text>
            <Text>Type</Text>
          </View>
          <View style={styles.listmenumiddle}>
            <Text>:</Text>
            <Text>:</Text>
          </View>
          <View style={styles.listmenu}>
            <Text>MultiSelect</Text>
            <Text>Checkbox</Text>
          </View>
        </View>
        <View
          style={{borderColor: '#000', borderWidth: 0, height: calcH(0.35)}}>
          <FlatList
            style={{marginTop: calcH(0.04)}}
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => {
              return (
                <View
                  style={{
                    // flex: 1,
                    flexDirection: 'row',
                    // justifyContent: 'center',
                    alignItems: 'center',
                    borderColor: '#000',
                    borderWidth: 0,
                  }}>
                  <CheckBox
                    disabled={false}
                    value={select[index]}
                    onValueChange={newValue =>
                      selectrejectReason(newValue, index)
                    }
                  />
                  <Text style={styles.reasonText}>{item.name}</Text>
                </View>
              );
            }}

            // ListFooterComponent={this.renderFooter}
          />
        </View>
        <View
          style={{
            width: calcW(0.85),
            height: calcH(0.2),
            borderRadius: 10,
            borderColor: '#ddd',
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',
            // marginTop: '10%',
          }}>
          <TextInput
            style={{
              width: calcW(0.8),
              height: calcH(0.24),
              borderWidth: 1,
              textAlignVertical: 'top',
              borderColor: '#fff',
              marginTop: calcH(0.05),
            }}
            // onChangeText={onChangeNumber}
            // value={number}
            placeholder="Message"
            // keyboardType="numeric"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CheckboxExp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  cardStyle: {
    top: calcH(0.01),
    flex: 1,
    // width: calcW(0.9),
    // flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: calcH(0.02),
  },
  shadowProp: {
    elevation: 2,
    shadowColor: '#000',
  },
  nextcard: {
    flexDirection: 'row',
  },
  listMenuOne: {
    width: calcW(0.35),
  },
  listmenumiddle: {
    width: calcW(0.1),
  },
  listmenu: {
    width: calcW(0.3),
  },
  reasonText: {
    fontSize: RFValue(15),
    fontWeight: '600',
  },
});
