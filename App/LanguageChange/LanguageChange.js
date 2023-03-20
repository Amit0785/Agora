import {StyleSheet, Text, View, I18nManager} from 'react-native';
import React from 'react';
import SwitchSelector from 'react-native-switch-selector';
import {useTranslation} from 'react-i18next';
import RNRestart from 'react-native-restart';
import * as RNLocalize from 'react-native-localize';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  console.log('==i18n.language====>', i18n);

  // console.log('======>', RNLocalize.getLocales());

  const initialLanguage = () => {
    if (i18n.language == 'en') {
      return 0;
    } else if (i18n.language == 'ar') {
      return 1;
    } else if (i18n.language == 'fr') {
      return 2;
    } else if (i18n.language == 'hi') {
      return 3;
    } else {
      return 0;
    }
  };
  return (
    <View style={{flex: 1, padding: 10, backgroundColor: '#fff'}}>
      <Text style={{marginVertical: 20}}>{t('Change Language')}</Text>
      <SwitchSelector
        options={options}
        initial={initialLanguage()}
        hasPadding
        onPress={async value => {
          console.log(`Call onPress with value: ${value}`);
          i18n.changeLanguage(value).then(async () => {
            AsyncStorage.setItem('appLanguage', value);

            if (value == 'ar') {
              await I18nManager.forceRTL(true);
            } else {
              await I18nManager.forceRTL(false);
            }
            RNRestart.Restart();
          });
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
