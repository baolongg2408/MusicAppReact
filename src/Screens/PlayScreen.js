import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPause, faPlay, faForward, faBackward, faRepeat } from '@fortawesome/free-solid-svg-icons';
import Sound from 'react-native-sound';
import FastImage from 'react-native-fast-image'; // Import FastImage

const { width, height } = Dimensions.get('window');

const PlayScreen = ({ route }) => {
    const { song } = route.params;
    const animationValue = useRef(new Animated.Value(-width)).current;
    const rotationValue = useRef(new Animated.Value(0)).current;
    const [isPlaying, setIsPlaying] = useState(false);
    const [sound, setSound] = useState(null);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isRepeat, setIsRepeat] = useState(false); // State for repeat

    useEffect(() => {
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
    }, [song.previewUrl]);

    useEffect(() => {
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
        if (isPlaying) {
            Animated.loop(
                Animated.timing(rotationValue, {
                    toValue: 1,
                    duration: 5000,
                    useNativeDriver: true,
                })
            ).start();
            if (sound) {
                sound.play((success) => {
                    if (success) {
                        if (isRepeat) {
                            sound.setCurrentTime(0);
                            sound.play();
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
            }
        } else {
            rotationValue.stopAnimation(() => {
                rotationValue.setValue(0); // Reset rotation to initial value
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
        setIsPlaying(!isPlaying);
    };

    const toggleRepeat = () => {
        setIsRepeat(!isRepeat);
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

    return (
        <View style={styles.container}>
            <View style={styles.boderTop}>
                <View style={styles.nameTop}>
                    <Animated.Text style={[styles.textName, animatedStyle]}>
                        {song.trackName}
                    </Animated.Text>
                </View>
                <Text style={styles.singer}>{song.artistName}</Text>
            </View>
            <FastImage
                style={styles.bgplay}
                source={require('../../assets/gifBG2.gif') } 
                priority={ FastImage.priority.high}
                resizeMode={FastImage.resizeMode.cover}
                cacheControl={FastImage.cacheControl.immutable}
            >
                <View style={styles.cdContainer}>
                    <Animated.Image
                        source={{ uri: song.artworkUrl100 }}
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
                </View>
            </FastImage>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0006',
    },
    boderTop: {
        borderWidth: 1,
        paddingBottom: 5,
        backgroundColor: '#0009',
    },
    nameTop: {
        width: '100%',
        height: 50,
    },
    textName: {
        fontSize: 20,
        color: '#fff',
        marginTop: 10,
    },
    singer: {
        marginLeft: 20,
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
    bgplay:{
        width: '100%',
        height: '90%',
    }
});

export default PlayScreen;
