import i18next from 'i18next';
import english from './english.json';
import arabic from './arabic.json';
import french from './french.json';
import hindi from './hindi.json';
import {initReactI18next} from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: callback => {
    return callback(RNLocalize.getLocales()[0].languageCode);
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

i18next
  // .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    lng: 'en',
    //fallbackLng: 'en',
    resources: {
      en: english,
      ar: arabic,
      fr: french,
      hi: hindi,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18next;
