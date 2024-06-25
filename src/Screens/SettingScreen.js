import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SettingScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Lỏ vcut</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    color:'red'
  },
});

export default SettingScreen;
