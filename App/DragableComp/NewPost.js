import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  TextInput,
  Image,
  ScrollView,
  ImageBackground,
  FlatList,
  Modal,
  Pressable,
  Alert,
  TouchableWithoutFeedback,
  Animated,
  ActivityIndicator,
  StatusBar,
  Platform,
} from 'react-native';
import React, {useState, useRef, useEffect, useContext} from 'react';

import {RFValue} from 'react-native-responsive-fontsize';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import ImagePicker from 'react-native-image-crop-picker';
import RBSheet from 'react-native-raw-bottom-sheet';
import {request, PERMISSIONS} from 'react-native-permissions';
import {DragableView} from './SharedElements';
import ChildTag from './ChildTag';

const {width, height} = Dimensions.get('window');

const NewPost = props => {
  const linkData = [
    {name: 'Amit', link: 'google'},
    {name: 'Amit1', link: 'google'},
    {name: 'Amit2', link: 'google'},
    {name: 'Amit3', link: 'google'},
    {name: 'Amit4', link: 'google'},
  ];

  const refRBSheet = useRef();
  const [caption, setCaption] = useState('');
  const [imageModal, setImageModal] = useState(false);
  const [postImage, setPostImage] = useState('');

  const [search, setSearch] = useState('');

  const [checked, setChecked] = useState([]);

  const [selectSendList, setSelectSendList] = useState([]);

  const [tagLocation, setTagLocation] = useState({x: 0, y: 0});

  const [isLoading, setLoading] = useState(false);
  const [addLinkText, setAddLinkText] = useState('');
  const [addLinkURL, setAddLinkURL] = useState('');
  const [otherModal, setOtherModal] = useState(false);
  const [imageData, setImageData] = useState('');
  const [errorMsg, setErrorMsg] = useState({
    isAddLinkText: true,
    isAddLinkURL: true,
  });

  const captionHandler = value => {
    setCaption(value);
  };
  const onCamera = () => {
    request(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA,
    )
      .then(result => {
        //setPermissionResult(result)
        console.log(result);
        if (result == 'granted') {
          onCamera1();
        } else if (result == 'denied') {
          Alert.alert(
            'Camera Permission Denied',
            'Please give permission to access Camera through Setting',
          );
        } else if (
          result == 'blocked' ||
          result == 'limited' ||
          result == 'unavailable'
        ) {
          Alert.alert(
            `Camera Permission ${result}`,
            'Please give permission to access Camera through Setting',
          );
        }
      })
      .catch(error => {
        console.log('Error===>', error);
        Alert.alert(error);
      });
  };
  const onCamera1 = () => {
    ImagePicker.openCamera({
      mediaType: 'photo',
      cropping: true,
      compressImageQuality: 1,
    })
      .then(image => {
        //  console.log('Image==>', image);
        setImageData(image);
        setPostImage(image.path);
        setImageModal(false);
        //setImage64(image.data);
      })
      .catch(error => {
        console.log('User cancelled image selection from the Camera');
        console.log('Image Cancel error===>', error);
      });
  };

  const onGallery = () => {
    request(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    )
      .then(result => {
        //setPermissionResult(result)
        console.log(result);
        if (result == 'granted') {
          onGallery1();
        } else if (result == 'denied') {
          Alert.alert(
            'Media Permission Denied',
            'Please give permission to access Media through Setting',
          );
        } else if (
          result == 'blocked' ||
          result == 'limited' ||
          result == 'unavailable'
        ) {
          Alert.alert(
            `Media Permission ${result}`,
            'Please give permission to access Media through Setting',
          );
        }
      })
      .catch(error => {
        console.log('Error===>', error);
        Alert.alert(error);
      });
  };

  const onGallery1 = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      cropping: true,
      compressImageQuality: 1,
    })
      .then(image => {
        //console.log('Image==>', image);
        setImageData(image);
        setPostImage(image.path);
        setImageModal(false);
        //setImage64(image.data);
      })
      .catch(error => {
        console.log('User cancelled image selection from the gallery');
        console.log('Image Cancel error===>', error);
      });
  };

  const addPostFunc = () => {
    console.log(selectSendList);
  };

  const addPostLink = event => {
    const {locationX, locationY} = event.nativeEvent;
    console.log('======locationX, locationY=====>', locationX, locationY);
    setTagLocation({x: locationX, y: locationY});
    //setSearch('');
    refRBSheet.current.open();
  };

  const addLink = (data, index) => {
    if (selectSendList.length < 5) {
      var alreadyPresent = false;
      selectSendList.map((item, index) => {
        if (item.name == data.name) {
          alreadyPresent = true;
        }
      });
      if (!alreadyPresent) {
        var addData = {
          //logo: image_url + data.image,
          name: data.name,
          link: data.link,
          positionX: tagLocation.x,
          positionY: tagLocation.y,
        };
        selectSendList.push(addData);
        //  selectSendList.push(data);
        let newArr = [...checked];
        newArr[index] = !newArr[index];
        setChecked([...newArr]);
      } else {
        Alert.alert('Already taged Link.');
      }
    } else {
      Alert.alert('Maximum of 5 links can be added');
    }
    refRBSheet.current.close();
    setSearch('');
  };

  const removeLink2 = (data, index) => {
    console.log('==selectSendList===>', selectSendList);
    var newList = selectSendList.filter(item => item.name != data.name);
    setSelectSendList([...newList]);
    console.log('===remove selectSendList==>', selectSendList);
  };

  const handleData = (x, y, item, index) => {
    // Do something with the received data
    console.log('Received data:', x, y, item);
    var temp = {
      ...item,
      positionX: item.positionX + x,
      positionY: item.positionY + y,
    };
    console.log('====temp===>', temp);
    var tempArr = selectSendList;
    tempArr[index] = temp;
    setSelectSendList(tempArr);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>
      <View
        style={{
          height: '100%',
          width: '100%',
          alignItems: 'center',
          paddingHorizontal: width * 0.04,
          backgroundColor: '#fff',
          paddingTop: height * 0.01,
        }}>
        <KeyboardAvoidingScrollView
          // keyboardShouldPersistTaps={'handled'}
          //keyboardShouldPersistTaps="always"
          keyboardShouldPersistTaps="always"
          scrollEventThrottle={16}
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{}}
          style={{
            backgroundColor: '#ffffff',
            flex: 1,
          }}>
          <View
            style={{
              marginBottom: height * 0.1,
              alignSelf: 'center',
              width: width * 0.9,
            }}>
            {postImage !== '' && (
              <View
                //onPress={addPostLink}
                style={{
                  width: '100%',
                  height: height * 0.5,
                  alignSelf: 'center',
                  alignItems: 'center',
                  // backgroundColor: 'red',
                  borderWidth: 2,
                  borderRadius: 15,
                  borderColor: '#2E4497',
                }}>
                <TouchableWithoutFeedback onPress={addPostLink}>
                  <Image
                    source={{uri: postImage}}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: 10,
                      resizeMode: 'cover',
                    }}
                  />
                </TouchableWithoutFeedback>
                {selectSendList.map((item, index) => {
                  return (
                    <ChildTag
                      key={index}
                      item={item}
                      index={index}
                      removeLink2={() => removeLink2(item, index)}
                      //   updatePosition={(x, y) => {
                      //     console.log(x, y);
                      //   }}
                      onDataReceived={(x, y) => handleData(x, y, item, index)}
                    />
                  );
                })}
              </View>
            )}

            <TouchableOpacity
              onPress={() => {
                //addMoreImage();
                setImageModal(true);
              }}
              style={{
                width: '100%',
                //height: 54.5,
                height: 60,
                //backgroundColor: 'red',
                alignSelf: 'center',
                alignItems: 'center',
                borderRadius: 15,
                marginVertical: height * 0.01,
                borderColor: '#2E4497',
                borderWidth: 2,
              }}>
              <View
                style={{
                  width: '100%',
                  height: '100%',
                  //flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  //paddingHorizontal: 15,
                }}>
                <Text
                  style={{
                    fontSize: RFValue(16),
                    color: '#2E4497',
                    //fontFamily: FONTS.NunitoBold,
                    fontWeight: '600',
                  }}>
                  Add Image
                </Text>
              </View>
            </TouchableOpacity>

            <View
              style={{
                width: '100%',
                //backgroundColor: 'red',
                marginTop: height * 0.03,
                borderBottomColor: '#E0E0E0',
                borderBottomWidth: 0.5,
              }}>
              <Text
                style={{
                  color: '#6D6D6D',
                  fontSize: RFValue(15),
                  //fontFamily: FONTS.NunitoSemiBold,
                  fontWeight: '600',
                }}>
                Fit Type
              </Text>
              <View style={styles.division}>
                <Text
                  style={{
                    color: '#000000',
                    //fontFamily: FONTS.NunitoRegular,
                    fontWeight: '400',
                    fontSize: 18,
                    alignSelf: 'center',
                    marginRight: 5,
                  }}>
                  #
                </Text>
                <TextInput
                  value={caption}
                  onChangeText={value => captionHandler(value)}
                  placeholder="Fit Type"
                  placeholderTextColor={'#ddd'}
                  autoCorrect={false}
                  style={styles.input}
                />
                <Text
                  style={{
                    color: '#000000',
                    //fontFamily: FONTS.NunitoRegular,
                    fontWeight: '400',
                    fontSize: 18,
                    alignSelf: 'center',
                  }}>
                  Fit
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => {
                addPostFunc();
              }}
              style={{
                width: '100%',
                height: 60,
                backgroundColor: 'red',
                alignSelf: 'center',
                alignItems: 'center',
                borderRadius: 15,
                marginTop: height * 0.06,
              }}>
              <View
                style={{
                  width: '100%',
                  height: '100%',
                  //flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  //paddingHorizontal: 15,
                }}>
                <Text
                  style={{
                    fontSize: RFValue(16),
                    color: '#ffffff',
                    //fontFamily: FONTS.NunitoBold,
                    fontWeight: '600',
                  }}>
                  Post Now
                </Text>
              </View>
            </TouchableOpacity>

            {/* ****************************************Modal**************************************************** */}

            <Modal
              visible={imageModal}
              transparent={true}
              animationType="fade"
              statusBarTranslucent={true}
              onRequestClose={() => {
                setImageModal(false);
              }}>
              <Pressable
                onPress={() => setImageModal(false)}
                style={{
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  flex: 1,
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    backgroundColor: '#fff',
                    width: width * 0.8,
                    height: height * 0.3,
                    alignItems: 'center',
                    //justifyContent: 'center',
                    marginTop: height * 0.3,
                    borderRadius: 15,
                  }}>
                  <View>
                    <Text
                      style={{
                        fontSize: RFValue(22),
                        color: '#404040',
                        //fontFamily: FONTS.PoppinsBold,
                      }}>
                      Choose Media
                    </Text>
                  </View>

                  <View
                    style={{
                      marginTop: height * 0.05,
                      flexDirection: 'row',
                      width: '85%',
                      justifyContent: 'space-between',
                      position: 'absolute',
                      bottom: '15%',
                    }}>
                    <View style={{width: width * 0.32, height: 40}}>
                      <TouchableOpacity
                        style={{
                          height: '100%',
                          width: '100%',
                          backgroundColor: 'blue',
                          borderRadius: 7,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onPress={() => onCamera()}>
                        <Text
                          style={{
                            fontSize: 13,
                            color: '#FFFFFF',
                            // fontFamily: FONTS.PoppinsMedium,
                          }}>
                          Launch Camera
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View style={{width: width * 0.32, height: 40}}>
                      <TouchableOpacity
                        style={{
                          height: '100%',
                          width: '100%',
                          backgroundColor: '#000',
                          borderRadius: 7,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onPress={() => onGallery()}>
                        <Text
                          style={{
                            fontSize: 13,
                            color: '#FFFFFF',
                            //fontFamily: FONTS.PoppinsMedium,
                          }}>
                          Open Gallery
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Pressable>
            </Modal>

            {/* ***************************************End of Modal******************************************** */}

            {/* ****************************************RB Sheet************************************************* */}
            <RBSheet
              height={400}
              animationType="slide"
              ref={refRBSheet}
              closeOnDragDown={false}
              closeOnPressMask={true}
              closeOnSwipeDown={false}
              customStyles={{
                container: {
                  borderTopEndRadius: 20,
                  borderTopStartRadius: 20,
                },
                wrapper: {
                  backgroundColor: 'transparent',
                  // backgroundColor: 'rgba(0,0,0,0.3)',
                  //backgroundColor: 'rgba(225,225,225,0.1)',
                },
                draggableIcon: {
                  backgroundColor: '#000',
                },
              }}>
              <View style={{flex: 1, backgroundColor: '#fff', paddingTop: 15}}>
                <View
                  style={{
                    height: '98%',
                    width: '100%',
                    //backgroundColor: 'red',
                  }}>
                  {isLoading ? (
                    <View
                      style={{
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        //backgroundColor: 'red',
                        marginTop: height * 0.1,
                      }}>
                      <ActivityIndicator size={60} color="#2E4497" />
                    </View>
                  ) : (
                    <>
                      <ScrollView
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        style={{width: '100%'}}
                        contentContainerStyle={{}}>
                        <View
                          style={{
                            marginBottom: height * 0.02,
                            width: '100%',
                            paddingHorizontal: 5,
                          }}>
                          {linkData.map((item, index) => {
                            return (
                              <TouchableOpacity
                                onPress={() => {
                                  addLink(item, index);
                                }}
                                key={index}
                                style={{
                                  width: '100%',
                                  alignSelf: 'center',
                                  height: 60,
                                  //backgroundColor: 'red',
                                  paddingHorizontal: 10,
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  borderColor: '#E0E0E0',
                                  borderBottomWidth: 0.5,
                                  paddingVertical: 3,
                                }}>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    height: '100%',
                                    alignItems: 'center',
                                  }}>
                                  <View style={{marginLeft: 10}}>
                                    <Text
                                      style={{
                                        color: '#404040',
                                        fontSize: RFValue(15),
                                        //fontFamily: FONTS.NunitoRegular,
                                        fontWeight: '700',
                                      }}>
                                      {item.name}
                                    </Text>
                                  </View>
                                </View>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      </ScrollView>
                    </>
                  )}
                </View>
              </View>
            </RBSheet>
            {/* ***********************************End of RB Sheet************************************************ */}
          </View>
        </KeyboardAvoidingScrollView>
      </View>
    </SafeAreaView>
  );
};

export default NewPost;
const styles = StyleSheet.create({
  division: {
    width: width * 0.83,
    backgroundColor: '#ffffff',
    //backgroundColor: 'red',
    height: 45,
    flexDirection: 'row',
  },
  input: {
    flex: 1,
    color: '#000000',
    //fontFamily: FONTS.NunitoRegular,
    fontWeight: '400',
    fontSize: 18,
  },

  scrollDivision: {
    width: '100%',
    backgroundColor: '#ffffff',
    height: 50,
    //borderRadius: 10,
    // flexDirection: 'row',
    // marginTop: height * 0.025,
    borderWidth: 0,
    alignSelf: 'flex-start',
    borderBottomColor: '#E0E0E0',
    borderBottomWidth: 0.5,
    //paddingLeft: 10,
  },
  division1: {
    width: '95%',
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    height: 45,
    borderRadius: 7,
    flexDirection: 'row',
    marginTop: height * 0.015,
    paddingLeft: 10,
    borderColor: '#C9C9C9',
    borderWidth: 0.5,
  },
  input1: {
    flex: 1,
    color: '#000000',
    //fontFamily: FONTS.NunitoRegular,
    fontWeight: '400',
    fontSize: 16,
  },
});
