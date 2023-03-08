import { StyleSheet } from "react-native";

export const getStylesData = function (orientation: any) {
    return  StyleSheet.create({
        camera: {
          flex: 1,
          width: '100%',
        },
        container: {
          position: 'absolute', //overlap on the camera
          left: 280,     // x axis // TODO: make is configurable
          top: 650, // y axis
      
        },
        verticalText: {
          transform: [{ rotate: '270deg' }],
          color: 'red',
          fontWeight: 'bold'
        },
        point: {
          width: 20,
          height: 20,
          backgroundColor: '#fc0505',
          borderRadius: 20,
          // position: 'absolute', //overlap on the camera
          // left: 280,     // x axis // TODO: make is configurable
          top: 20,   // y axis
        },
        linesContainer: {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: orientation.height,
          width: orientation.width,
        },
      })
}