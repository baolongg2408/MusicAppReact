import React from "react";
import { StyleSheet, View, Image } from "react-native";
import FastImage from 'react-native-fast-image';

const SplatScreen = ()=>{
    return(
        <View style={styles.container}>
        <Image
        source={require('../../assets/logo.png')}
        style={styles.logo}
        />
        <FastImage source={require('../../assets/loading2.gif')} style={styles.loading}/>
    </View>
    )
}
const styles = StyleSheet.create({
container:{
    flex: 1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#000'
},
logo:{
    width:300,
    height:300,
},
loading:{
    width:30,
    height:30,
    marginTop:20,
}
})
export default SplatScreen;