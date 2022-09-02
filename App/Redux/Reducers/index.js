import CakeReducer from './CakeReducer';
import IceCreamReducer from './IceCreamReducer';
import UserReducer from './UserReducer';
import {combineReducers} from 'redux';

const rootReducer = combineReducers({
  CakeReducer,
  IceCreamReducer,
  UserReducer,
});

export default rootReducer;
