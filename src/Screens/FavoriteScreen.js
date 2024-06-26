import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomSong from '../CustomView/CustomSong';

const FavoriteListScreen = ({ navigation }) => {
    const [favoriteSongs, setFavoriteSongs] = useState([]);

    useEffect(() => {
        const fetchFavoriteSongs = async () => {
            const favoriteSongs = await AsyncStorage.getItem('favoriteSongs');
            if (favoriteSongs) {
                setFavoriteSongs(JSON.parse(favoriteSongs));
            }
        };
        fetchFavoriteSongs();
    }, []);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.songContainer}
            onPress={() => navigation.navigate('Play', { song: item })}
        >
            <CustomSong song={{
                 id: item.trackId,
                 title: item.trackName,
                 artist: item.artistName,
                 author: item.author,
                 imageUri: item.imageUri,
            }}/>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={favoriteSongs}
                renderItem={renderItem}
                keyExtractor={(item) => item.trackId.toString()}
                ListEmptyComponent={<Text style={styles.emptyText}>No favorite songs</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    songContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    songTitle: {
        fontSize: 18,
    },
    songArtist: {
        fontSize: 14,
        color: '#888',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 18,
    },
});

export default FavoriteListScreen;
