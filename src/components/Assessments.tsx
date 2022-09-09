import 'react-native-reanimated'
import { StyleSheet, Text } from "react-native";
import React from "react";
import { Camera, useCameraDevices, useFrameProcessor } from "react-native-vision-camera";
import type { Frame } from 'react-native-vision-camera';
import { scanPoseLandmarks } from "../helper";
// @ts-expect-error Frame Processors are not typed.
import { runOnJS } from 'react-native-reanimated';


export interface AssessmentProp {
    cameraPosition: 'front' | 'back', 
}

export function Assessment(props: AssessmentProp) {
    
    const devices = useCameraDevices();
    const device = devices[props.cameraPosition];

    const frameProcessor = useFrameProcessor((frame: Frame) => {
        'worklet';
        const pose: any = scanPoseLandmarks(frame);
        console.log("Pose", pose)
        
        // runOnJS(poseFrameHandler)(pose, frame);
      }, []);

    // if no camera found (front or back)
    if (device == null) {   
        return <Text style={{color: 'red',fontWeight: 'bold'}}>Unable to detect camera.</Text>
    }

    return (
            <Camera
                style={styles.camera}
                device={device}
                isActive={true}
                // isActive={isAppForeground}
                frameProcessor={frameProcessor}
                frameProcessorFps={3}
            />
    )

}


const styles = StyleSheet.create({
    camera: {
      flex: 1,
      width: '100%',
    },
  });