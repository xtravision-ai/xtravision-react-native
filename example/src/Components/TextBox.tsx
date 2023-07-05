import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface TextBoxProps {
  smallValue: any;
  bigValue: any;
  style?: ViewStyle;
}

const TextBox: React.FC<TextBoxProps> = ({ smallValue, bigValue, style }) => (
  <View style={[styles.box, style]}>
    <View style={styles.centerContainer}>
    <Text style={styles.bigText}>{bigValue}</Text>
    </View>
    <View style={styles.bottomContainer}>
    <Text style={styles.smallText}>{smallValue}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  box: {
    height: 80, 
    // width: 100, 
    // backgroundColor: 'skyblue',
    backgroundColor: 'rgba(158, 158, 158, 0.5)',  // gray color with 50% opacity
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,

    borderRadius: 1.5,  // adds rounded corners
    // shadowColor: "#000", // sets shadow color
    // shadowOffset: {
    //   width: 0,
    //   height: 1, // equivalent to offset.dy in Flutter
    // },
    // shadowOpacity: 0.15, // try different values to achieve desired effect
    // shadowRadius: 7, // try to manipulate this to get spread effect

    elevation: 1, // this is needed for Android

  },
  smallText: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold'
  },
  bigText: {
    fontSize: 24,
    color: 'black',
    fontWeight: 'bold'

  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

export default TextBox;
