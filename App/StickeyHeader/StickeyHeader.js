import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {StatusBar, StyleSheet, View, useColorScheme, Text} from 'react-native';
import {AvatarHeaderScrollView} from 'react-native-sticky-parallax-header';

import {Brandon} from './Cards';
import {IconMenu, iconCloseWhite} from './icons';
import {QuizCard} from './components';
import {screenStyles} from './constants';

import {avatarHeaderTestIDs} from './testIDs';

const StickeyHeader = () => {
  const navigation = useNavigation();

  function goBack() {
    navigation.goBack();
  }

  const isDarkTheme = useColorScheme() === 'dark';
  return (
    <>
      <AvatarHeaderScrollView
        leftTopIcon={iconCloseWhite}
        leftTopIconOnPress={goBack}
        leftTopIconTestID={'CardHeaderLeftTopIconTestID'}
        rightTopIcon={IconMenu}
        rightTopIconTestID={'CardHeaderRightTopIconTestID'}
        contentContainerStyle={[isDarkTheme ? '#000' : '#fff']}
        containerStyle={screenStyles.stretchContainer}
        backgroundColor={'rgb(78,15,255)'}
        hasBorderRadius
        image={Brandon.image}
        subtitle={
          'Coffee buff. Web enthusiast. Unapologetic student. Gamer. Avid organizer.'
        }
        subtitleTestID={avatarHeaderTestIDs.subtitle}
        title={Brandon.author}
        titleStyle={{
          fontFamily: 'AvertaStd-Regular',
        }}
        titleTestID={'CardHeaderTitleTestID'}
        showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {Brandon.cards.map((data, i, arr) => (
            <QuizCard
              data={data}
              num={i}
              key={data.question}
              cardsAmount={arr.length}
            />
          ))}
        </View>
      </AvatarHeaderScrollView>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Brandon.color}
        translucent
      />
    </>
  );
};

export default StickeyHeader;

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 24,
  },
});
