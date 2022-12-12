import React, {useState} from 'react';
import {
  Image,
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  ActivityIndicator,
} from 'react-native';
import {createThumbnail} from 'react-native-create-thumbnail';

const placeholderImage = require('./Assets/Icon/placeholder-image.png');
// const placeholderImage =
// ('https://cdn.pixabay.com/photo/2017/02/12/21/29/false-2061132__340.png');

export default function App() {
  const data1 = [
    {
      id: 1,
      title: 'Product 1',
      count: 4,
      image: 'https://source.unsplash.com/1024x768/?nature',
      url: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
    },
    {
      id: 2,
      title: 'Product 2',
      count: 4,
      image: 'https://source.unsplash.com/1024x768/?water',
      url: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4?_=1',
    },
    {
      id: 3,
      title: 'Product 4',
      count: 4,
      image: 'https://source.unsplash.com/1024x768/?tree',
      url: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
    },
    {
      id: 4,
      title: 'Product 3',
      count: 4,
      image: 'https://source.unsplash.com/1024x768/?air',
      url: 'https://www.youtube.com/watch?v=BLl32FvcdVM&t=1314s',
    },
    {
      id: 5,
      title: 'Product 3',
      count: 4,
      image: 'https://source.unsplash.com/1024x768/?fire',
      url: 'https://www.youtube.com/watch?v=BLl32FvcdVM&t=1314s',
    },
    {
      id: 6,
      title: 'Product 3',
      count: 4,
      image: 'https://source.unsplash.com/1024x768/?earth',
      url: 'https://www.youtube.com/watch?v=BLl32FvcdVM&t=1314s',
    },
    {
      id: 7,
      title: 'Product 3',
      count: 4,
      image: 'https://source.unsplash.com/1024x768/?girl',
      url: 'https://www.youtube.com/watch?v=BLl32FvcdVM&t=1314s',
    },
  ];

  //   const [path, setPath] = useState(
  //     'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
  //   );
  const [path, setPath] = useState(
    'https://demos.mydevfactory.com/socialnetwork/public/promotional/a89c3a22fe58d97491c9acea44495cc0.mp4',
  );
  const [thumbnail, setThumbnail] = useState('');
  const [timeStamp, setTimeStamp] = useState('1000');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>☆CreateThumbnail example☆</Text>
      <TextInput
        value={path}
        onChangeText={setPath}
        style={styles.pathInput}
        placeholder="Paste video url"
        placeholderTextColor="lightgrey"
      />
      <TextInput
        keyboardType="numeric"
        value={timeStamp}
        onChangeText={setTimeStamp}
        style={styles.timeInput}
        placeholder="Timestamp"
      />
      <Button
        title="Generate Thumbnail"
        disabled={isLoading}
        onPress={generateThumbnail}
      />
      <Text style={styles.welcome}>☆THUMBNAIL☆</Text>
      <View style={styles.image}>
        {isLoading ? (
          <ActivityIndicator size="large" />
        ) : (
          <Image
            style={styles.image}
            source={thumbnail ? {uri: thumbnail} : placeholderImage}
          />
        )}
      </View>
    </View>
  );

  async function generateThumbnail() {
    if (!path) {
      return;
    }

    setIsLoading(true);
    console.log('parseInt(timeStamp, 10)', parseInt(timeStamp, 10));

    try {
      const response = await createThumbnail({
        url: path,
        timeStamp: parseInt(timeStamp, 10),
      });
      console.log('response==>', response);
      setThumbnail(response.path);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 20,
    color: 'black',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 20,
  },
  image: {
    height: 150,
    width: 250,
    backgroundColor: 'lightgrey',
    justifyContent: 'center',
  },
  pathInput: {
    backgroundColor: '#eaeaea',
    width: '80%',
    paddingHorizontal: 10,
    color: 'black',
    borderColor: 'lightgrey',
    borderWidth: 1,
  },
  timeInput: {
    backgroundColor: '#eaeaea',
    width: '40%',
    paddingHorizontal: 10,
    margin: 20,
    color: 'black',
    borderColor: 'lightgrey',
    borderWidth: 1,
  },
});
