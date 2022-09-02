export const BUY_CAKE = 'BUY_CAKE';
export const ADD_CAKE = 'ADD_CAKE';

export const buyCake = (number = 1) => {
  return {
    type: BUY_CAKE,
    info: 'First redux action',
    payload: number,
  };
};

export const addCake = () => {
  return {
    type: ADD_CAKE,
    info: 'Cake added into the store',
  };
};
