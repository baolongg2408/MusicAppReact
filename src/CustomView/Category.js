import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';

const Category = ({ cate }) => {
  return (
    <View style={styles.container}>
      <ImageBackground source={require('../../assets/logo.png')} style={styles.imageBackground} blurRadius={30}>
        <Text style={styles.title}>{cate.name}</Text>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 50,
    marginBottom: 20,
    marginLeft:7
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'italic',
    fontFamily: 'serif',
    color: 'red',
  },
});

export default Category;
