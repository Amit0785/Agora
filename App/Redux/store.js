import rootReducer from './Reducers';
import redux, {createStore, applyMiddleware} from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

//const createStore = redux.createStore;

//const store = createStore(rootReducer, applyMiddleware(logger, thunk));
const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
