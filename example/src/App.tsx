/* eslint-disable react-native/no-inline-styles */
import React, { useCallback } from 'react';
import { runOnJS } from 'react-native-reanimated';
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

const AUTH_TOKEN = '_AUTH_TOKEN_';
const ASSESSMENT = 'PUSH_UPS';

// add your height here for Standing Broad Jump
const height = null; 

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

  const userProfile = {
    height,
  };

  const poseTempRef = React.useRef<any>({});

  const processPoseFrame = (data: any, frame: any) => {
    return [
      createNormalisedDictionary(data.nose, frame),
      createNormalisedDictionary(data.leftEyeInner, frame),
      createNormalisedDictionary(data.leftEye, frame),
      createNormalisedDictionary(data.leftEyeOuter, frame),
      createNormalisedDictionary(data.rightEyeInner, frame),
      createNormalisedDictionary(data.rightEye, frame),
      createNormalisedDictionary(data.rightEyeOuter, frame),
      createNormalisedDictionary(data.leftEar, frame),
      createNormalisedDictionary(data.rightEar, frame),
      createNormalisedDictionary(data.mouthLeft, frame),
      createNormalisedDictionary(data.mouthRight, frame),
      createNormalisedDictionary(data.leftShoulder, frame),
      createNormalisedDictionary(data.rightShoulder, frame),
      createNormalisedDictionary(data.leftElbow, frame),
      createNormalisedDictionary(data.rightElbow, frame),
      createNormalisedDictionary(data.leftWrist, frame),
      createNormalisedDictionary(data.rightWrist, frame),
      // createNormalisedDictionary(data.leftPinky, frame),
      createNormalisedDictionary(data.leftPinkyFinger, frame),
      // createNormalisedDictionary(data.rightPinky, frame),
      createNormalisedDictionary(data.rightPinkyFinger, frame),
      // createNormalisedDictionary(data.leftIndex, frame),
      createNormalisedDictionary(data.leftIndexFinger, frame),
      // createNormalisedDictionary(data.rightIndex, frame),
      createNormalisedDictionary(data.rightIndexFinger, frame),
      createNormalisedDictionary(data.leftThumb, frame),
      createNormalisedDictionary(data.rightThumb, frame),
      createNormalisedDictionary(data.leftHip, frame),
      createNormalisedDictionary(data.rightHip, frame),
      createNormalisedDictionary(data.leftKnee, frame),
      createNormalisedDictionary(data.rightKnee, frame),
      createNormalisedDictionary(data.leftAnkle, frame),
      createNormalisedDictionary(data.rightAnkle, frame),
      createNormalisedDictionary(data.leftHeel, frame),
      createNormalisedDictionary(data.rightHeel, frame),
      // createNormalisedDictionary(data.leftFootIndex, frame),
      createNormalisedDictionary(data.leftToe, frame),
      // createNormalisedDictionary(data.rightFootIndex, frame),
      createNormalisedDictionary(data.rightToe, frame),
    ];
  };

  React.useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);

  const { sendJsonMessage, lastJsonMessage } = useWebSocket(
    `${WS_URL}/assessment/fitness/${ASSESSMENT}?authToken=${AUTH_TOKEN}&userProfile=${userProfile} `,
    {
      shouldReconnect: (e) => true, // will attempt to reconnect on all close events
    }
  );

  const createNormalisedDictionary = (keypoint: any, frame: any) => {
    if (keypoint === undefined || keypoint.visibility < 0.3) {
      return { x: 0, y: 0, z: 0, visibility: 0.0 };
    }
    return {
      x: keypoint.x / frame.width,
      y: keypoint.y / frame.height,
      z: keypoint.z / frame.width,
      visibility: keypoint.visibility,
    };
  };

  const poseFrameHandler = useCallback((pose: any, frame: any) => {
    const landmarks = processPoseFrame(pose, frame);

    const curTime = Date.now();
    poseTempRef.current[curTime] = { landmarks };
  }, []);

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    const pose: any = scanPose(frame, poseParams);

    runOnJS(poseFrameHandler)(pose, frame);
  }, []);

  console.log('here...');

  React.useEffect(() => {
    let interval: any;
    const cleanUp = () => interval && clearInterval(interval);
    interval = setInterval(() => {
      if (poseTempRef.current !== undefined) {
        const keyPoints = Object.assign(poseTempRef.current, {});
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

  console.log('timestamp: ', Date.now());
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
