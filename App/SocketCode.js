const createConnection = async () => {
  let usertoken = await AsyncStorage.getItem('user_token');
  let UToken = JSON.parse(usertoken);
  console.warn('TOKENNNNNNNNNNNNN', UToken);

  if (UToken != null && UToken != '' && UToken != 'null') {
    const socket1 = io(SOCKET_URL, {
      query: {token: UToken, forceNew: true},
    });
    console.warn('socket1', socket1);

    if (socket1 != null) {
      console.warn('OKKKKK');
      socket1.on('connected', data => {
        console.warn('connected>>>>>>>>>>>>>>>>>>>>', data);

        if (socket1.connected) {
          setSocket(socket1);
          console.warn('hihi', socket1.connected);
          socket1.on('pause_reason', data => {
            console.warn('pause job reason =====>>>', data);
            if (data.confirm_status === 1) {
              setDisableResume(false);
              setPause(false);
              setConfirmStatus(data.confirm_status);
              getUpdateJobDetails();
            } else {
              setDisableResume(true);
              setPause(true);
            }
          });
        } else {
          console.warn('ggg');
        }
      });
    }
  }
};

const disconnect_socket = async () => {
  let usertoken = await AsyncStorage.getItem('user_token');
  let UToken = JSON.parse(usertoken);
  console.warn('TOKENNNNNNNNNNNNN', UToken);
  console.warn('socket', socket);

  if (UToken != null && UToken != '' && UToken != 'null') {
    const socket1 = io(SOCKET_URL, {
      query: {token: UToken, forceNew: true},
    });
    if (socket1 != null) {
      console.warn('OKKKKK');
      socket1.on('connected', data => {
        console.warn('connected>>>>>>>>>>>>>>>>>>>>', data);

        if (socket1.connected) {
          socket1.disconnect();
          console.warn('hihi', socket1.connected);
        }
      });
    }
    props.navigation.goBack();
  }
};
