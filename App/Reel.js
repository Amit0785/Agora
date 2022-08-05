import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  Image,
} from 'react-native';
import React, {useRef, useEffect, useState} from 'react';
import Video from 'react-native-video';
//import {RFValue} from 'react-native-responsive-fontsize';
import {SwiperFlatList} from 'react-native-swiper-flatlist';

//import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const {width, height} = Dimensions.get('window');
const Reel = props => {
  useEffect(() => {
    // console.log('VideoRef', videoRef);
    if (!videoRef.current) {
      videoRef.current.seek(0);
    }
  }, [currIndex]);

  const onBuffer = e => {
    console.log('Buffering....', e);
  };
  const onError = e => {
    console.log('Error....', e);
  };
  const data1 = [
    {
      id: 1,
      title: 'Product 1',
      count: 4,
      image: 'https://source.unsplash.com/1024x768/?nature',
      file: 'https://demos.mydevfactory.com/socialnetwork/public/promotional/4e2c12d9a2d89d7c329bdc531b0e6dd7.mp4',
    },
    {
      id: 2,
      title: 'Product 2',
      count: 4,
      image: 'https://source.unsplash.com/1024x768/?water',
      file: 'https://demos.mydevfactory.com/socialnetwork/public/promotional/4e2c12d9a2d89d7c329bdc531b0e6dd7.mp4',
    },
    {
      id: 3,
      title: 'Product 4',
      count: 4,
      image: 'https://source.unsplash.com/1024x768/?tree',
      file: 'https://demos.mydevfactory.com/socialnetwork/public/promotional/4e2c12d9a2d89d7c329bdc531b0e6dd7.mp4',
    },
  ];
  const videoRef = useRef(null);
  const [currIndex, setIndex] = useState(0);
  const onChangeIndex = ({index, prevIndex}) => {
    console.log('uuuuuuuuuu', index, prevIndex);
    setIndex(index);
  };

  const renderItem = ({item, index}) => {
    console.log('jjjjjjjjjjj', item);
    return (
      <View style={{flex: 1}}>
        <Video
          source={{
            uri: item.file,
          }}
          ref={videoRef}
          onBuffer={onBuffer}
          onError={onError}
          style={styles.backgroundVideo}
          resizeMode="cover"
          paused={currIndex !== index}
          //paused={false}
          repeat
          poster="https://source.unsplash.com/1024x768/?tree"
          posterResizeMode="cover"
        />
      </View>
    );
  };
  return (
    <View style={{flex: 1, backgroundColor: 'pink'}}>
      <SwiperFlatList
        vertical={true}
        data={data1}
        showsHorizontalScrollIndicator={false}
        onChangeIndex={onChangeIndex}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />

      <View
        style={{
          position: 'absolute',
          top: 0,
          flexDirection: 'row',
          //margin: 5,
          marginTop: height * 0.01,
          width: width * 0.9,
          justifyContent: 'space-between',
          //backgroundColor: 'blue',
        }}>
        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 100,
              alignItems: 'center',
            }}>
            <Image
              source={require('./Assets/Images/angelina.png')}
              style={{
                height: '100%',
                width: '100%',
                borderRadius: 100,
              }}
              resizeMode="cover"
            />
          </View>
          <View
            style={{
              marginLeft: width * 0.01,
              marginTop: height * 0.011,
              alignItems: 'flex-start',
            }}>
            <Text
              style={{
                fontSize: 16,
                color: '#FFFFFF',
                fontFamily: 'Roboto-Regular',
                fontWeight: '400',
                //fontWeight: 'bold',
                //letterSpacing: 0.4,
              }}>
              #Amit0785
            </Text>

            <Text
              style={{
                fontSize: 12,
                color: '#FFFFFF',
                fontFamily: 'Roboto-Light',
                fontWeight: '300',
                //letterSpacing: 0.4,
              }}>
              bio
            </Text>
          </View>
        </View>

        <View
          style={{
            //backgroundColor: 'green',
            //alignItems: 'flex-end',
            marginTop: height * 0.01,
            //justifyContent: 'center',
          }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Roboto-Medium',
              color: '#FFFFFF',
              fontWeight: '600',
            }}>
            data.totalfollow
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Reel;

const styles = StyleSheet.create({
  backgroundVideo: {
    height: height,
    width: width,
  },
});
