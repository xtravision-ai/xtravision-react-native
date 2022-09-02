/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import { runOnJS } from 'react-native-reanimated';

import { StyleSheet, Text } from 'react-native';
import {
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';

import { Camera } from 'react-native-vision-camera';
import { scanPose } from 'react-native-xtravision';
// import { scanPose,  } from 'react-native-xtravision';

const AUTH_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZjMwN2JkZi0yNjVmLTQxM2ItODU2ZC1mMDcyODVhMzc3NjkiLCJhcHBJZCI6Ijk1ZWFjZDQ1LTgyZjUtMTFlYy1hOWY1LWE0YmI2ZDZlZGM0ZSIsIm9yZ0lkIjoiZGQ4MzA1OWMtODJmMy0xMWVjLWE5ZjUtYTRiYjZkNmVkYzRlIiwiaWF0IjoxNjU4Mjk1MjA5LCJleHAiOjE2NTgzMDI0MDl9.P8cvuHOmQfqykXk3Zmks4wMeSVqvb-w5qv8AnBnc-h4';
const ASSESSMENT = 'ENDURANCE_FLAMINGO_FRONT';

export default function App() {
  const [hasPermission, setHasPermission] = React.useState(false);
  // const [faces, setFaces] = React.useState<any /* Face[] */>();

  const devices = useCameraDevices();
  const device = devices.front;

  const poseParams = {
    authToken: AUTH_TOKEN,
    ASSESSMENT: ASSESSMENT,
  };

  // React.useEffect(() => {
  //   console.log(faces);
  // }, [faces]);

  React.useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    // const scannedFaces = scanPose(frame);
    const pose = scanPose(frame, poseParams);
    console.log('pose > ', pose);
    // runOnJS(setFaces)(scannedFaces);
  }, []);
  console.log('here...');

  return device != null && hasPermission ? (
    <Camera
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={true}
      frameProcessor={frameProcessor}
      frameProcessorFps={5}
    />
  ) : (
    <Text>No devices</Text>
  );
}

// {
//   /* <Camera
//       style={StyleSheet.absoluteFill}
//       device={device}
//       isActive={true}
//       frameProcessor={frameProcessor}
//       frameProcessorFps={5}
//     /> */
// }
