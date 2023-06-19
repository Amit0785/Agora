import React, {useState} from 'react';
import {
  View,
  Image,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';

const ImageTagging = () => {
  const [tagLocation, setTagLocation] = useState({x: 0, y: 0}); // location of the tag
  const [taggedUsers, setTaggedUsers] = useState([]); // list of tagged users
  const [animation, setAnimation] = useState(new Animated.Value(0)); // animation value for tag container opacity

  const handleImagePress = event => {
    console.log('Hello');
    const {locationX, locationY} = event.nativeEvent;
    console.log('======locationX, locationY=====>', locationX, locationY);
    setTagLocation({x: locationX, y: locationY});
    setAnimation(new Animated.Value(0));
    Animated.timing(animation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const handleTagPress = user => {
    console.log(`User ${user} tapped!`);
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={handleImagePress}>
        <Image
          source={require('../../Assets/marketplace2.png')}
          style={styles.image}
        />
      </TouchableWithoutFeedback>
      <Animated.View
        style={[
          styles.tagContainer,
          {left: tagLocation.x, top: tagLocation.y, opacity: animation},
        ]}>
        {taggedUsers.map(user => (
          <TouchableWithoutFeedback
            key={user}
            onPress={() => handleTagPress(user)}>
            <Text style={styles.tag}>user</Text>
          </TouchableWithoutFeedback>
        ))}
      </Animated.View>

      <TouchableOpacity
        onPress={() => {
          console.log('Hello');
        }}
        style={{
          position: 'absolute',
          backgroundColor: '#000',
          height: 50,
          width: 40,
          alignItems: 'center',
          justifyContent: 'center',
          left: tagLocation.x,
          top: tagLocation.y,
        }}>
        <Text>Hello</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    resizeMode: 'contain',
  },
  tagContainer: {
    position: 'absolute',
    backgroundColor: 'peru',
    height: 50,
    width: 100,
  },
  tag: {
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: 'flex-start',
    color: '#000',
  },
});

export default ImageTagging;
