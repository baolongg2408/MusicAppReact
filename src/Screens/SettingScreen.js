import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const SettingScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4aff40', '#ff0088']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.text}>Setting</Text>
        <TouchableOpacity onPress={() => navigation.navigate('FavoriteListScreen')}>
          <Text style={styles.linkText}>Favorite Songs</Text>
        </TouchableOpacity>
      </LinearGradient>
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
    color: '#000',
    marginBottom: 20,
  },
  linkText: {
    fontSize: 18,
    color: '#fff',
    textDecorationLine: 'underline',
  },
});

export default SettingScreen;
