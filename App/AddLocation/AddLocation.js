import {StyleSheet, Text, View, SafeAreaView, Dimensions} from 'react-native';
import React, {useContext} from 'react';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

import {RFValue} from 'react-native-responsive-fontsize';
const {width, height} = Dimensions.get('window');
import {ProfileContext} from '../../Services/ProfileProvider';

const AddLocation = props => {
  const onHandleFilterGooglePlace = (location, address) => {
    console.log('====address==>>', address);

    props.navigation.goBack();
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>
      <View style={{height: '100%', width: '100%'}}>
        <GooglePlacesAutocomplete
          keyboardShouldPersistTaps="always"
          placeholder="Search"
          placeholderTextColor="#ddd"
          minLength={2} // minimum length of text to search
          autoFocus={false}
          editable={true}
          returnKeyType={'search'}
          keyboardAppearance={'light'}
          listViewDisplayed={'auto'}
          fetchDetails={true}
          renderDescription={row => row.description}
          onPress={(data, details = null) => {
            // 'details' is provided when fetchDetails = true
            // console.log('===details==>', details.formatted_address);
            // console.log('===details==>', details.geometry.location);
            //console.log('====data==>', data);
            onHandleFilterGooglePlace(
              details.geometry.location,
              details.formatted_address,
            );
          }}
          query={{
            key: 'Google API key',
            language: 'en', // language of the results
            //	types: 'address', // default: 'geocode'
            //	components: 'country:AU'
          }}
          styles={{
            listView: {
              borderColor: '#BEBEBE',
              // borderColor: 'red',
              // borderWidth: 2,
              // position: 'absolute',
              // top: 52,
            },
            textInputContainer: {
              marginTop: height * 0.03,
              width: width,
              // borderColor: '#fff',
              backgroundColor: '#fff',
              paddingHorizontal: 5,
              // borderRadius: 5,
              height: 50,
              borderWidth: 0,
              alignSelf: 'center',
              borderTopWidth: 0,
              borderBottomWidth: 0,
            },
            description: {
              fontWeight: 'bold',
            },
            predefinedPlacesDescription: {
              color: '#66D6FF',
            },
            row: {
              backgroundColor: '#fff',
            },
            textInput: {
              marginTop: 0,
              fontSize: RFValue(14),
              alignSelf: 'center',
            },
            container: {
              width: '100%',
              borderColor: '#808080',
              borderWidth: 1,
              borderRadius: 4,
            },
          }}
          nearbyPlacesAPI="GooglePlacesSearch"
          GooglePlacesSearchQuery={{
            rankby: 'distance',
            type: 'street',
          }}
          listEmptyComponent={() => (
            <View style={{flex: 1}}>
              <Text>No results were found</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default AddLocation;

const styles = StyleSheet.create({});
