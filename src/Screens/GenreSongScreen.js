import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import CustomSong from '../CustomView/CustomSong';

const GenreSongsScreen = ({ route}) => {
  const { genres } = route.params || { genres: '' };
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await axios.get('https://itunes.apple.com/search', {
          params: {
            term: genres,
            media: 'music',
            entity: 'musicTrack',
            limit: 20,
          },
        });
        setSongs(response.data.results);
      } catch (error) {
        console.error('Error fetching songs', error.response?.data || error.message);
      }
    };

    fetchSongs();
  }, [genres]);

  const renderSong = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('Play', { song: item })}>
      <CustomSong
        song={{
          id: item.trackId,
          title: item.trackName,
          artist: item.artistName,
          author: item.collectionName,
          imageUri: item.artworkUrl100,
        }}
        isPlaying={false}
        onTogglePlay={() => console.log(`Toggle play for ${item.trackName}`)}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Songs in {genres} Genre</Text>
      <FlatList
        data={songs}
        renderItem={renderSong}
        keyExtractor={item => item.trackId.toString()}
        style={styles.songList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gray',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 10,
    color: '#fff',
  },
  songList: {
    flex: 1,
  },
});

export default GenreSongsScreen;
