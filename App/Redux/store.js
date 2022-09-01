import rootReducer from './Reducers';
import redux, {createStore} from 'redux';

//const createStore = redux.createStore;

const store = createStore(rootReducer);

export default store;
