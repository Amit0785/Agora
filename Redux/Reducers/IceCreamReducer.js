const initialState = {
  numOfIceCreams: 20,
};

const IceCreamReducer = (state = initialState, action) => {
  switch (action.type) {
    case BUY_ICECREAM:
      return {
        ...state,
        numOfIceCreams: state.numOfIceCreams - 1,
      };

    case ADD_ICECREAM:
      return {
        ...state,
        numOfIceCreams: state.numOfIceCreams + 1,
      };

    default:
      return state;
  }
};

export default IceCreamReducer;
