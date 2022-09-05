/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { runOnJS, useSharedValue } from 'react-native-reanimated';
import useWebSocket from 'react-native-use-websocket';
import { WS_URL } from './utils/constants';
import _ from 'lodash';

import { StyleSheet, Text } from 'react-native';
import {
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';

import { Camera } from 'react-native-vision-camera';
import { scanPose } from 'react-native-xtravision';
// import { scanPose,  } from 'react-native-xtravision';

const AUTH_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZjMwN2JkZi0yNjVmLTQxM2ItODU2ZC1mMDcyODVhMzc3NjkiLCJhcHBJZCI6Ijk1ZWFjZDQ1LTgyZjUtMTFlYy1hOWY1LWE0YmI2ZDZlZGM0ZSIsIm9yZ0lkIjoiZGQ4MzA1OWMtODJmMy0xMWVjLWE5ZjUtYTRiYjZkNmVkYzRlIiwiaWF0IjoxNjYwMDQzNzAxLCJleHAiOjE2OTE2MDEzMDF9.czzQWj22X6FY9wjTkWCDPvvDUgBWT-UgpjLfCKGxbRE';
const ASSESSMENT = 'BANDED_ALTERNATING_DIAGNOLS';

export default function App() {
  const [hasPermission, setHasPermission] = React.useState(false);
  // const [faces, setFaces] = React.useState<any /* Face[] */>();

  const devices = useCameraDevices();
  const device = devices.front;
  const isEduScreen = false;

  const poseParams = {
    authToken: AUTH_TOKEN,
    ASSESSMENT: ASSESSMENT,
  };

  const poseTempRef = React.useRef<any>({});
  const temp = useSharedValue<any>({ pose: {} });

  // React.useEffect(() => {
  //   console.log(faces);
  // }, [faces]);

  React.useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);

  const { sendJsonMessage, lastJsonMessage } = useWebSocket(
    `${WS_URL}/assessment/fitness/${ASSESSMENT}?authToken=${AUTH_TOKEN}`,
    {
      shouldReconnect: (e) => true, // will attempt to reconnect on all close events
    }
  );

  const foo = useCallback((pose: any) => {
    console.log('pose: ', pose);
    poseTempRef.current[Date.now()] = { pose };
    // console.log('poseTempRef: ', poseTempRef.current);
  }, []);

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    // const scannedFaces = scanPose(frame);
    const pose: any = scanPose(frame, poseParams);
    // console.log('pose: ', pose);

    runOnJS(foo)(pose);
  }, []);

  console.log('here...');

  React.useEffect(() => {
    let interval: any;
    const cleanUp = () => interval && clearInterval(interval);
    interval = setInterval(() => {
      if (poseTempRef.current !== undefined) {
        const keyPoints = Object.assign(poseTempRef.current, {});
        // console.log('keyPoints: ', keyPoints);
        poseTempRef.current = {};
        if (!_.isEmpty(keyPoints)) {
          // WS SEND Kps -> 1s
          sendJsonMessage({
            timestamp: Date.now(),
            user_keypoints: keyPoints,
            isprejoin: isEduScreen,
          });
        }
      }
    }, 1000);

    return () => {
      cleanUp();
    };
  }, [sendJsonMessage]);
  console.log('lastJsonMessage: ', lastJsonMessage);

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
