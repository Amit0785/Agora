import {StyleSheet, Text, View, I18nManager} from 'react-native';
import React from 'react';
import SwitchSelector from 'react-native-switch-selector';
import {useTranslation} from 'react-i18next';

const LanguageChange = props => {
  const {t, i18n} = useTranslation();
  const options = [
    {
      label: 'English',
      value: 'en',
    },
    {
      label: 'عربي',
      value: 'ar',
    },
    {
      label: 'Français',
      value: 'fr',
    },
    {
      label: 'हिंदी',
      value: 'hi',
    },
  ];

  console.log('===I18nManager===>', I18nManager.isRTL);
  return (
    <View style={{flex: 1, padding: 10, backgroundColor: '#fff'}}>
      <Text style={{marginVertical: 20}}>{t('Change Language')}</Text>
      <SwitchSelector
        options={options}
        initial={0}
        hasPadding
        onPress={value => {
          console.log(`Call onPress with value: ${value}`);
          i18n.changeLanguage(value);
        }}
      />

      <Text style={{fontSize: 22, alignSelf: 'center', marginVertical: 20}}>
        {t('Hello World')}
      </Text>
    </View>
  );
};

export default LanguageChange;

const styles = StyleSheet.create({});
