import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPause, faPlay, faForward, faBackward, faRepeat, faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import Sound from 'react-native-sound';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const PlayScreen = ({ route }) => {
    const { song } = route.params || {};
    const animationValue = useRef(new Animated.Value(-width)).current;
    const rotationValue = useRef(new Animated.Value(0)).current;
    const [isPlaying, setIsPlaying] = useState(false);
    const [sound, setSound] = useState(null);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isRepeat, setIsRepeat] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    //Gọi set trạng thái yêu thích
   useEffect(()=>{
    if(song){
        checkIfFavorite(song.trackId).then((isFavorite)=>{
            setIsFavorite(isFavorite);
        });
    }
   },[song]);

    useEffect(() => {
        if (!song || !song.previewUrl) {
            return;
        }

        Sound.setCategory('Playback');

        const soundInstance = new Sound(song.previewUrl, null, (error) => {
            if (error) {
                console.log('Failed to load the sound', error);
                return;
            }
            setSound((prevSound) => {
                if (prevSound) {
                    prevSound.stop(() => prevSound.release());
                }
                setDuration(soundInstance.getDuration());
                return soundInstance;
            });
        });

        return () => {
            if (sound) {
                sound.release();
            }
        };
    }, [song]);

    useEffect(() => {
        checkFavoriteStatus();
        Animated.loop(
            Animated.timing(animationValue, {
                toValue: width,
                duration: 9000,
                useNativeDriver: true,
            })
        ).start();
    }, [animationValue]);

    useEffect(() => {
        let interval = null;
        if (isPlaying && sound && isRepeat) {
            interval = setInterval(() => {
                sound.getCurrentTime((seconds) => {
                    if (seconds >= duration - 1) { // Check if near the end
                        sound.setCurrentTime(0); // Reset to start
                    }
                });
            }, 1000);
        }
        
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isPlaying, sound, isRepeat]);

    
    useEffect(() => {
        let interval = null;
        if (isPlaying && sound) {
            Animated.loop(
                Animated.timing(rotationValue, {
                    toValue: 1,
                    duration: 5000,
                    useNativeDriver: true,
                })
            ).start();
            sound.play((success) => {
                if (success) {
                    if (isRepeat) {
                        sound.setCurrentTime(0);
                        sound.play();
                        console.log(isRepeat);
                    } else {
                        setIsPlaying(false);
                        setCurrentTime(0);
                    }
                }
            });
            interval = setInterval(() => {
                sound.getCurrentTime((seconds) => {
                    setCurrentTime(seconds);
                });
            }, 1000);
        } else {
            rotationValue.stopAnimation(() => {
                rotationValue.setValue(0);
            });
            if (sound) {
                sound.pause();
            }
            if (interval) {
                clearInterval(interval);
            }
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isPlaying, rotationValue, sound, isRepeat]);

    const togglePlayPause = () => {
        if (sound) {
            setIsPlaying(!isPlaying);
        }
    };

    const toggleRepeat = () => {
        setIsRepeat(!isRepeat);
    };

    const toggleFavorite = async () => {
        try {
            const favoriteSongs = await AsyncStorage.getItem('favoriteSongs');
            const favoriteSongsList = favoriteSongs ? JSON.parse(favoriteSongs) : [];
    
            // Kiểm tra xem bài hát hiện tại đã được thêm vào yêu thích chưa
            const existingIndex = favoriteSongsList.findIndex((s) => s.trackId === song.trackId);
    
            if (existingIndex !== -1) {
                // Nếu đã tồn tại trong danh sách, loại bỏ khỏi danh sách yêu thích
                favoriteSongsList.splice(existingIndex, 1);
                await AsyncStorage.setItem('favoriteSongs', JSON.stringify(favoriteSongsList));
                setIsFavorite(false);
            } else {
                // Nếu chưa tồn tại trong danh sách, thêm vào danh sách yêu thích
                favoriteSongsList.push({
                    trackId: song.trackId,
                    trackName: song.trackName,
                    artistName: song.artistName,
                    author: song.collectionName,
                    imageUri: song.artworkUrl100,
                });
                await AsyncStorage.setItem('favoriteSongs', JSON.stringify(favoriteSongsList));
                setIsFavorite(true);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };
    //Hàm kiểm tra bài hát đã được yêu thích hay chưa
    const checkIfFavorite = async (paramId) => {
        try {
            const favoriteSongs = await AsyncStorage.getItem('favoriteSongs');
            if (!favoriteSongs) {
                return false; // Nếu không có dữ liệu yêu thích
            }
    
            const favoriteSongsList = JSON.parse(favoriteSongs);
            const isFavorite = favoriteSongsList.some((song) => song.trackId === paramId);
            return isFavorite;
        } catch (error) {
            console.error('Error checking favorite status:', error);
            return false;
        }
    };
    

    const checkFavoriteStatus = async () => {
        try {
            const favoriteSongs = await AsyncStorage.getItem('favoriteSongs');
            const favoriteSongsList = favoriteSongs ? JSON.parse(favoriteSongs) : [];
            const isFavoriteSong = favoriteSongsList.some((s) => s.trackId === song.trackId);
            setIsFavorite(isFavoriteSong);
        } catch (error) {
            console.error('Error checking favorite status:', error);
        }
    };

    const animatedStyle = {
        transform: [{ translateX: animationValue }],
    };

    const rotation = rotationValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const cdAnimatedStyle = {
        transform: [{ rotate: rotation }],
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    if (!song) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>No song data available.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.boderTop}>
                <View style={styles.nameTop}>
                    <Animated.Text style={[styles.textName, animatedStyle]}>
                        {song.trackName || 'Unknown Track'}
                    </Animated.Text>
                </View>
                <Text style={styles.singer}>{song.artistName || 'Unknown Artist'}</Text>
            </View>
            <FastImage
                style={styles.bgplay}
                source={require('../../assets/gifBG2.gif')}
                priority={FastImage.priority.high}
                resizeMode={FastImage.resizeMode.cover}
                cacheControl={FastImage.cacheControl.immutable}
            >
                <View style={styles.cdContainer}>
                    <Animated.Image
                        source={{ uri: song.artworkUrl100 || 'https://via.placeholder.com/200' }}
                        style={[styles.cdImage, cdAnimatedStyle]}
                    />
                </View>

                <View style={styles.progressBarContainer}>
                    <View style={styles.progressBar}>
                        <View style={[styles.progress, { width: `${(currentTime / duration) * 100}%` }]} />
                    </View>
                    <View style={styles.timeContainer}>
                        <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
                        <Text style={styles.timeText}>{formatTime(duration)}</Text>
                    </View>
                </View>

                <View style={styles.controls}>
                    <TouchableOpacity onPress={() => console.log('Previous')}>
                        <FontAwesomeIcon icon={faBackward} size={24} style={styles.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={togglePlayPause}>
                        <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} size={24} style={styles.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => console.log('Next')}>
                        <FontAwesomeIcon icon={faForward} size={24} style={styles.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={toggleRepeat}>
                        <View style={styles.repeatIconContainer}>
                            <FontAwesomeIcon icon={faRepeat} size={24} style={[styles.icon, isRepeat && styles.repeatActive]} />
                            {isRepeat && <Text style={styles.repeatText}>1</Text>}
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={toggleFavorite}>
                        <FontAwesomeIcon icon={isFavorite ? faHeartSolid : faHeartRegular} size={24} style={[styles.icon, isFavorite && styles.favoriteIcon]} />
                    </TouchableOpacity>
                </View>
            </FastImage>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0006',
        justifyContent: 'center', // Center the content vertically
        alignItems: 'center', // Center the content horizontally
    },
    boderTop: {
        borderWidth: 1,
        paddingBottom: 5,
        backgroundColor: '#0019',
        width: '100%',
        alignItems: 'center', // Center text horizontally
    },
    nameTop: {
        width: '100%',
        height: 50,
        justifyContent: 'center', // Center text vertically
        alignItems: 'center', // Center text horizontally
    },
    textName: {
        fontSize: 20,
        color: '#fff',
        marginTop: 10,
    },
    singer: {
        color: '#fff',
    },
    cdContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
        marginTop: 100,
    },
    cdImage: {
        width: 200,
        height: 200,
        borderRadius: 100,
    },
    progressBarContainer: {
        position: 'absolute',
        bottom: 70,
        width: '100%',
        paddingHorizontal: 20,
    },
    progressBar: {
        height: 5,
        backgroundColor: '#555',
        borderRadius: 5,
        overflow: 'hidden',
    },
    progress: {
        height: '100%',
        backgroundColor: '#fff',
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    timeText: {
        color: '#fff',
    },
    controls: {
        position: 'absolute',
        bottom: 10,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'transparent',
        paddingVertical: 10,
    },
    icon: {
        color: '#fff',
    },
    repeatIconContainer: {
        position: 'relative',
    },
    repeatActive: {
        color: '#1DB954', // Green color to indicate active repeat
    },
    repeatText: {
        position: 'absolute',
        top: -10,
        right: -10,
        color: '#1DB954',
        fontWeight: 'bold',
    },
    favoriteIcon: {
        color: 'red', // Red color to indicate favorite
    },
    bgplay: {
        width: '100%',
        height: '90%',
    },
    errorText: {
        fontSize: 18,
        color: '#fff',
    },
});

export default PlayScreen;
