export const BUY_ICECREAM = 'BUY_ICECREAM';
export const ADD_ICECREAM = 'ADD_ICECREAM';

export const buyIceCream = () => {
  return {
    type: BUY_ICECREAM,
    info: 'First Icecream action',
  };
};

export const addIceCream = () => {
  return {
    type: ADD_ICECREAM,
    info: 'IceCream added into the store',
  };
};
