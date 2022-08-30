const BUY_CAKE = 'BUY_CAKE';
const ADD_CAKE = 'ADD_CAKE';

const BUY_ICECREAM = 'BUY_ICECREAM';
const ADD_ICECREAM = 'ADD_ICECREAM';

const buyCake = () => {
  return {
    type: BUY_CAKE,
    info: 'First redux action',
  };
};

const addCake = () => {
  return {
    type: ADD_CAKE,
    info: 'Cake added into the store',
  };
};

const buyIceCream = () => {
  return {
    type: BUY_ICECREAM,
    info: 'First Icecream action',
  };
};

const addIceCream = () => {
  return {
    type: ADD_ICECREAM,
    info: 'IceCream added into the store',
  };
};
