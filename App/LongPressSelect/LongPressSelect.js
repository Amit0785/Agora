import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  // PanResponder,
  StyleSheet,
  Text,
  useColorScheme,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
  ImageBackground,
  Alert,
  SafeAreaView,
} from 'react-native';
//import {TouchableOpacity} from 'react-native-gesture-handler';
const {width, height} = Dimensions.get('window');

const LongPressSelect = () => {
  const postData1 = [
    {id: 1, image: require('../Assets/Images/profile1.png')},
    {id: 2, image: require('../Assets/Images/profile2.png')},
    {id: 3, image: require('../Assets/Images/profile3.png')},
    {id: 4, image: require('../Assets/Images/profile4.png')},
    {id: 5, image: require('../Assets/Images/profile5.png')},
    {id: 6, image: require('../Assets/Images/profile6.png')},
    {id: 7, image: require('../Assets/Images/profile7.png')},
    {id: 8, image: require('../Assets/Images/profile8.png')},
    {id: 9, image: require('../Assets/Images/profile9.png')},
    {id: 10, image: require('../Assets/Images/profile10.png')},
  ];

  useEffect(() => {
    setPostData(postData1);
    setSelectedData([]);
  }, []);

  const theme = useColorScheme();

  //console.log('==============>', theme);

  const [selectedData, setSelectedData] = useState([]);

  const [postData, setPostData] = useState([]);

  const selectFunc = (data, index) => {
    console.log('selectFunc data', data, index);
    if (selectedData.length > 0) {
      const tempArr = postData;
      if (postData[index].isSelected) {
        console.log('already added');
        tempArr[index].isSelected = false;
        setPostData(tempArr);
        //setSelectedData([...selectedData, data]);
        let temp = selectedData.filter(item => item.id != data.id);
        setSelectedData(temp);
      } else {
        tempArr[index].isSelected = true;
        setPostData(tempArr);
        setSelectedData([...selectedData, data]);
      }
    } else {
      console.log('Hello');
      Alert.alert(JSON.stringify(data.id));
    }
  };

  const longSelect = (data, index) => {
    //setSelectedData([]);
    console.log('doubleSelect data', data);
    const tempArr = postData;
    if (postData[index].isSelected) {
      console.log('already added');
    } else {
      tempArr[index].isSelected = true;
      setPostData(tempArr);
      setSelectedData([...selectedData, data]);
    }
  };

  const cancelFunc = () => {
    setSelectedData([]);
    postData.map(item => {
      item.isSelected = false;
    });
  };

  const deleteFunc = () => {
    const result = postData.filter(ad =>
      selectedData.every(fd => fd.id !== ad.id),
    );
    setSelectedData([]);
    setPostData(result);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          height: height * 0.07,
          width: '90%',
          // backgroundColor: 'red',
          flexDirection: 'row',
          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        {selectedData.length > 0 && (
          <>
            <Text
              onPress={() => {
                cancelFunc();
              }}
              style={styles.descriptionText}>
              Back
            </Text>
            <Text style={styles.descriptionText}>
              {selectedData.length} Selected
            </Text>
            <Text
              onPress={() => {
                cancelFunc();
              }}
              style={styles.descriptionText}>
              Cancel
            </Text>
            <Text onPress={() => deleteFunc()} style={styles.descriptionText}>
              Delete
            </Text>
          </>
        )}
      </View>
      <View
        style={{
          width: width * 0.9,
          height: height * 0.785,
          marginTop: height * 0.01,
          alignSelf: 'center',
        }}>
        <FlatList
          data={postData}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{}}
          horizontal={false}
          numColumns={3}
          renderItem={({item, index}) => (
            <TouchableOpacity
              onLongPress={() => {
                longSelect(item, index);
              }}
              onPress={() => {
                selectFunc(item, index);
              }}
              key={index}
              style={item.isSelected ? styles.cardSelect : styles.card}>
              <ImageBackground
                source={item.image}
                imageStyle={{borderRadius: 10}}
                resizeMode={'cover'}
                blurRadius={!item.isSelected ? 0 : 3}
                style={{
                  width: '100%',
                  height: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {item.isSelected && (
                  <View
                    style={{
                      width: '100%',
                      height: '100%',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <View
                      style={{
                        height: 40,
                        width: 40,
                        backgroundColor: '#000',
                        alignSelf: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 100,
                      }}>
                      <Image
                        source={require('../Assets/Icons/tick.png')}
                        style={{
                          height: '50%',
                          width: '50%',
                          alignSelf: 'center',
                          tintColor: '#07D00F',
                        }}
                      />
                    </View>
                  </View>
                )}
              </ImageBackground>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default LongPressSelect;

const styles = StyleSheet.create({
  descriptionText: {
    color: '#000',
    fontSize: 17,

    fontWeight: '700',
  },

  card: {
    //height: 110,
    height: height * 0.15,
    width: width * 0.265,
    // backgroundColor: 'red',
    borderRadius: 10,
    margin: 5,
  },
  cardSelect: {
    //height: 110,
    height: height * 0.15,
    width: width * 0.265,
    // backgroundColor: 'red',
    borderRadius: 10,
    margin: 5,
    borderColor: '#07D00F',
    borderWidth: 2,
  },
});
