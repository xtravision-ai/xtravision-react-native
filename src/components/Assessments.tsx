import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Camera, useCameraDevices } from "react-native-vision-camera";
// import PropTypes from 'prop-types';

export interface AssessmentProp {
    cameraPosition: 'front' | 'back', 
}

export function Assessment(props: AssessmentProp) {

    console.log(props, StyleSheet.absoluteFill)

    const devices = useCameraDevices();
    const device = devices.front;
    

    if (device == null) {   
        return <Text style={{color: 'red',fontWeight: 'bold'}}>Click Me</Text>
    }

    return (
            <Camera
                style={styles.camera}
                device={device}
                isActive={true}
                // isActive={isAppForeground}
                // frameProcessor={frameProcessor}
                // frameProcessorFps={3}
            />
    )

}


const styles = StyleSheet.create({
    camera: {
      flex: 1,
      width: '100%',
    },
  });