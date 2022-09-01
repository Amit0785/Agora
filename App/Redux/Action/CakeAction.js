export const BUY_CAKE = 'BUY_CAKE';
export const ADD_CAKE = 'ADD_CAKE';

export const buyCake = () => {
  return {
    type: BUY_CAKE,
    info: 'First redux action',
  };
};

export const addCake = () => {
  return {
    type: ADD_CAKE,
    info: 'Cake added into the store',
  };
};
