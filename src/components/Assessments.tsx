import 'react-native-reanimated'
import { StyleSheet, Text } from "react-native";
import React, { useCallback } from "react";
import { Camera, useCameraDevices, useFrameProcessor } from "react-native-vision-camera";
import type { Frame } from 'react-native-vision-camera';
import { scanPoseLandmarks } from "../helper";
import { runOnJS } from 'react-native-reanimated';
import { getNormalizedArray } from '../formatter';
import _ from 'lodash';


export interface AssessmentProp {
    cameraPosition: 'front' | 'back', 
}

export function Assessment(props: AssessmentProp) {

  const landmarksTempRef = React.useRef<any>({});

    
    const devices = useCameraDevices();
    const device = devices[props.cameraPosition];


  
    // 
    const poseFrameHandler = useCallback((pose: any, frame: any) => {

      if (_.isEmpty(pose)) {
          // console.log('Pose is empty!',)
          return ;
       }
      // normalized frames into landmarks
      const landmarks = getNormalizedArray(pose, frame);  
      // store landmarks with current millis in temp variable
      const now = Date.now();
      landmarksTempRef.current[now] = { landmarks };
    }, []);

    const frameProcessor = useFrameProcessor((frame: Frame) => {
        'worklet';
        const pose: any = scanPoseLandmarks(frame);
        // IMP: DO NOT PUT ANY JS CODE HERE
        // store landmarks into temp object
        runOnJS(poseFrameHandler)(pose, frame);
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