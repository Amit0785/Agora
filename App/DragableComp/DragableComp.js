import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {DragableView} from './SharedElements';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import TagDragScreen from './TagDragScreen';
const DragableComp = () => {
  const setCordinate = () => {
    console.log('==Hello==>');
  };
  return (
    <View style={styles.container}>
      <DragableView>
        <View style={styles.box} />
      </DragableView>
      <DragableView>
        <View style={[styles.box, {backgroundColor: 'red'}]} />
      </DragableView>
    </View>
  );
};

export default DragableComp;

// const DragableComp = () => {
//   return <TagDragScreen />;
// };

// export default gestureHandlerRootHOC(DragableComp);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: 100,
    height: 100,
    backgroundColor: '#00f',
    borderRadius: 10,
  },
});
