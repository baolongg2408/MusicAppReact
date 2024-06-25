import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import axios from 'axios';
import CustomSong from '../CustomView/CustomSong';
import FastImage from 'react-native-fast-image';
import Category from '../CustomView/Category'; // Ensure the path is correct

const HomeScreen = ({ navigation }) => {
  const [topSongs, setTopSongs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [genres, setGenres] = useState([
    { genreName: 'Pop' },
    { genreName: 'Rock' },
    { genreName: 'Jazz' },
    { genreName: 'Hip Hop' },
    { genreName: 'Classical' },
    { genreName: 'Country' },
  ]);

  useEffect(() => {
    const fetchTopSongs = async () => {
      try {
        const response = await axios.get('https://itunes.apple.com/search', {
          params: {
            term: searchTerm || 'top', // Use searchTerm or default to 'top'
            media: 'music',
            entity: 'musicTrack',
            limit: 20,
          },
        });
        setTopSongs(response.data.results);
      } catch (error) {
        console.error('Error fetching top songs', error.response?.data || error.message);
      }
    };

    fetchTopSongs();
  }, [searchTerm]);

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

  const renderGenre = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('GenreSongs', { genres: item.genreName })}>
      <Category cate={{ name: item.genreName }} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FastImage
        source={require('../../assets/bgHome.gif')}
        style={styles.bgHome}
      >
        <TextInput
          style={styles.searchInput}
          placeholder="Search songs..."
          placeholderTextColor={'#0006'}
          value={searchTerm}
          onChangeText={setSearchTerm} // Update searchTerm when input changes
        />
        
        {searchTerm === '' && (
          <View style={styles.genreContainer}>
            <FlatList
              data={genres}
              renderItem={renderGenre}
              keyExtractor={(item, index) => index.toString()}
              numColumns={3} // Display 3 genres per row
              contentContainerStyle={styles.genreList}
            />
          </View>
        )}

        <FlatList
          data={topSongs}
          renderItem={renderSong}
          keyExtractor={item => item.trackId.toString()}
          style={styles.songList}
        />
      </FastImage>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gray',
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    paddingHorizontal: 10,
    margin: 10,
    backgroundColor: '#fff',
    color: '#000',
  },
  bgHome: {
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  genreContainer: {
    height: '25%', // Occupy 1/4 of the screen
  },
  genreList: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  songList: {
    flex: 1, // Occupy the remaining screen space
    marginTop: 10,
  },
});

export default HomeScreen;
