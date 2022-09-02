import {BUY_CAKE, ADD_CAKE} from '../Action/index';

const initialState = {
  numOfCakes: 100,
};

const CakeReducer = (state = initialState, action) => {
  switch (action.type) {
    case BUY_CAKE:
      return {
        ...state,
        numOfCakes: state.numOfCakes - action.payload,
      };

    case ADD_CAKE:
      return {
        ...state,
        numOfCakes: state.numOfCakes + 1,
      };

    default:
      return state;
  }
};

export default CakeReducer;
