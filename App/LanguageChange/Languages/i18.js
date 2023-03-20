import i18next from 'i18next';
import english from './english.json';
import arabic from './arabic.json';
import french from './french.json';
import hindi from './hindi.json';
import {initReactI18next} from 'react-i18next';

i18next.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: 'en',
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
