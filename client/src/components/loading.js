import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

export default class Loading extends React.Component{
    render(){
        return(
            <View style={{flex:1, justifyContent:'center',alignItems:'center'}} >
                <Image 
                    source={require('../assests/logo.png')}
                    style={{width:200,height:200}}
                />
            </View>
        );
    }
}