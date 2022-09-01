import CakeReducer from './CakeReducer';
import IceCreamReducer from './IceCreamReducer';
import {combineReducers} from 'redux';

const rootReducer = combineReducers({
  CakeReducer,
  IceCreamReducer,
});

export default rootReducer;
