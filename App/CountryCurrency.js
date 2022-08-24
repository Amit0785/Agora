import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  PixelRatio,
  Switch,
  TextInput,
} from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';

const styles = StyleSheet.create({
  // ...
});

export default function CountryCurrency() {
  const [countryCode, setCountryCode] = useState('FR');
  const [country, setCountry] = useState(null);
  const [withCountryNameButton, setWithCountryNameButton] = useState(false);
  const [withFlag, setWithFlag] = useState(true);
  const [withEmoji, setWithEmoji] = useState(true);
  const [withFilter, setWithFilter] = useState(true);
  const [withAlphaFilter, setWithAlphaFilter] = useState(false);
  const [withCallingCode, setWithCallingCode] = useState(false);
  const onSelect = country => {
    console.log('country data===>', country);
    setCountryCode(country.cca2);
    setCountry(country);
  };
  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <Text style={{}}>Welcome to Country Picker !</Text>
      <TextInput
        title="With country name on button"
        value={withCountryNameButton}
        onValueChange={setWithCountryNameButton}
      />
      <TextInput
        title="With flag"
        value={withFlag}
        onValueChange={setWithFlag}
      />
      <TextInput
        title="With emoji"
        value={withEmoji}
        onValueChange={setWithEmoji}
      />
      <TextInput
        title="With filter"
        value={withFilter}
        onValueChange={setWithFilter}
      />
      <TextInput
        title="With calling code"
        value={withCallingCode}
        onValueChange={setWithCallingCode}
      />
      <TextInput
        title="With alpha filter code"
        value={withAlphaFilter}
        onValueChange={setWithAlphaFilter}
      />
      <CountryPicker
        {...{
          countryCode,
          withFilter,
          withFlag,
          withCountryNameButton,
          withAlphaFilter,
          withCallingCode,
          withEmoji,
          onSelect,
        }}
        //visible
      />
      <Text style={styles.instructions}>Press on the flag to open modal</Text>
      {country !== null && (
        <Text style={styles.data}>{JSON.stringify(country, null, 2)}</Text>
      )}
    </View>
  );
}
