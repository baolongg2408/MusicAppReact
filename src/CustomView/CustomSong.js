import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import LinearGradient from 'react-native-linear-gradient';

const CustomSong = ({ song }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <LinearGradient
      colors={['#4aff40', '#ff0088']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <Image source={{ uri: song.imageUri }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{song.title}</Text>
        <Text style={styles.artist}>{song.artist}</Text>
        <Text style={styles.author}>{song.author}</Text>
      </View>
      <TouchableOpacity onPress={togglePlayPause}>
        <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} size={24} style={styles.icon} />
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    margin: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  artist: {
    fontSize: 14,
    color: '#666',
  },
  author: {
    fontSize: 14,
    color: '#666',
  },
  icon: {
    marginLeft: 10,
    color: '#000',
  },
});

export default CustomSong;
