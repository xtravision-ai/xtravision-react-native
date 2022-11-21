import 'react-native-reanimated';
import { StyleSheet, Text, Dimensions } from 'react-native';
import React, { useCallback, useEffect } from 'react';
import {
  Camera,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';
import type { Frame } from 'react-native-vision-camera';
import { scanPoseLandmarks } from '../helper';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { getDefaultObject } from '../formatter';
import _ from 'lodash';

// TODO: create custom webhook for WS connection
import useWebSocket from 'react-native-use-websocket';
import { Line, Svg } from 'react-native-svg';

const AnimatedLine = Animated.createAnimatedComponent(Line) as any;

const { width, height } = Dimensions.get('window');

export interface AssessmentProp {
  connection: {
    authToken: string;
    queryParams?: {
      [key: string]: string | number;
    };
  };
  cameraPosition: 'front' | 'back';
  assessment: string;
  isEducationScreen?: boolean;
  onServerResponse(serverResponse: any): void;
  showSkeleton: boolean;
}



//const WS_BASE_URL = 'ws://localhost:8000/wss/v1';
const WS_BASE_URL = 'wss://saasai.xtravision.ai/wss/v1';
//const WS_BASE_URL = 'wss://saasstagingai.xtravision.ai/wss/v1';

const defaultPose = {
  leftShoulder: { x: 0, y: 0 },
  rightShoulder: { x: 0, y: 0 },
  leftElbow: { x: 0, y: 0 },
  rightElbow: { x: 0, y: 0 },
  leftWrist: { x: 0, y: 0 },
  rightWrist: { x: 0, y: 0 },
  leftHip: { x: 0, y: 0 },
  rightHip: { x: 0, y: 0 },
  leftKnee: { x: 0, y: 0 },
  rightKnee: { x: 0, y: 0 },
  leftAnkle: { x: 0, y: 0 },
  rightAnkle: { x: 0, y: 0 },
};

const usePosition = (pose: any, valueName1: any, valueName2: any) => {
  return useAnimatedStyle(
    () => ({
      x1: pose.value[valueName1].x,
      y1: pose.value[valueName1].y,
      x2: pose.value[valueName2].x,
      y2: pose.value[valueName2].y,
    } as any),
    [pose],
  );;
};

export function Assessment(props: AssessmentProp) {

  const WS_URL = `${WS_BASE_URL}/assessment/fitness/${props.assessment}`;

  let queryParams: { [key: string]: any } = { authToken: props.connection.authToken };
  if (props.connection.queryParams) {
    queryParams = { ...queryParams, ...props.connection.queryParams };
  }

  //   // add some extra params
  //   if (props.assessment === 'STANDING_BROAD_JUMP'){
  //     // TODO: hardcoded part. auto calculate by frame or remove it
  //     const orientationData = {
  //       "image_height": 720, //orientation.image_height,
  //       "image_width": 1280 //orientation.image_width
  //     }

  //     queryParams = {...queryParams, ...orientationData }
  //  }

  // https://github.com/Sumit1993/react-native-use-websocket#readme
  const {
    sendJsonMessage,
    lastJsonMessage,
    // readyState,
    // getWebSocket
  } = useWebSocket(WS_URL, {
    queryParams: queryParams, //{...props.connection.queryParams, queryParams}
    onOpen: () => console.log('WS Connection opened'),
    onError: (e: any) => console.error(e), // todo : proper error handling
    //Will attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: (_closeEvent: any) => true,
    //To attempt to reconnect on error events,
    retryOnError: true,
  });

  const landmarksTempRef = React.useRef<any>({});

  const devices = useCameraDevices();
  const device = devices[props.cameraPosition];

  // const dimensions = useWindowDimensions();

  // https://medium.com/dogtronic/real-time-pose-detection-in-react-native-using-mlkit-e1819847c340

  const pose: any = useSharedValue(defaultPose);

  const leftWristToElbowPosition = usePosition(pose, 'leftWrist', 'leftElbow');
  const leftElbowToShoulderPosition = usePosition(pose, 'leftElbow', 'leftShoulder');
  const leftShoulderToHipPosition = usePosition(pose, 'leftShoulder', 'leftHip');
  const leftHipToKneePosition = usePosition(pose, 'leftHip', 'leftKnee');
  const leftKneeToAnklePosition = usePosition(pose, 'leftKnee', 'leftAnkle');

  const rightWristToElbowPosition = usePosition(pose, 'rightWrist', 'rightElbow');
  const rightElbowToShoulderPosition = usePosition(pose, 'rightElbow', 'rightShoulder');
  const rightShoulderToHipPosition = usePosition(pose, 'rightShoulder', 'rightHip');
  const rightHipToKneePosition = usePosition(pose, 'rightHip', 'rightKnee');
  const rightKneeToAnklePosition = usePosition(pose, 'rightKnee', 'rightAnkle');

  const shoulderToShoulderPosition = usePosition(pose, 'leftShoulder', 'rightShoulder');
  const hipToHipPosition = usePosition(pose, 'leftHip', 'rightHip');

  const updateData = useCallback((now: any, landmarks: any, pose1: any, frame: any) => {

    // Step-2: after extracting landmarks store unto temp variable
    // const poseFrameHandler = useCallback((pose1: any, frame: any) => {
    //   if (_.isEmpty(pose1)) {
    //     // console.log('Pose is empty!',)
    //     return;
    //   }

    const xFactor = width / frame.height;
    const yFactor = height / frame.width;

    const poseCopy: any = {
      leftShoulder: { x: 0, y: 0 },
      rightShoulder: { x: 0, y: 0 },
      leftElbow: { x: 0, y: 0 },
      rightElbow: { x: 0, y: 0 },
      leftWrist: { x: 0, y: 0 },
      rightWrist: { x: 0, y: 0 },
      leftHip: { x: 0, y: 0 },
      rightHip: { x: 0, y: 0 },
      leftKnee: { x: 0, y: 0 },
      rightKnee: { x: 0, y: 0 },
      leftAnkle: { x: 0, y: 0 },
      rightAnkle: { x: 0, y: 0 },
    };

    // [TypeError: Cannot read property 'x' of undefined]
    try {
      Object.keys(pose1).forEach(v => {
        poseCopy[v] = {
          x: pose1[v].x * xFactor,
          y: pose1[v].y * yFactor,
        };
      });
    } catch (e) { }

    // pose.value = landmarks;
    pose.value = poseCopy;
    console.log("pose.value: ", pose.value)

    // // normalized frames into landmarks and store landmarks with current millis in temp variable
    // const now = Date.now();
    // const landmarks = getNormalizedArray(pose1, frame, dimensions);

    landmarksTempRef.current[now] = { landmarks };
  }, [])

  // Step-1: using frame processor, extract body landmarks from Pose
  const frameProcessor = useFrameProcessor((frame: Frame) => {
    'worklet';
    const pose = scanPoseLandmarks(frame);

    if (Object.keys(pose).length == 0) {
      console.warn(Date() + " Body is not visible!")
      return;
    }

    // __DEV__ && console.log(Date()+" Body is visible.")

    // Step-2: after extracting landmarks store unto temp variable
    const now = Date.now();
    // normalize pose: process to convert pose object to required formate
    const poseCopy: any = getDefaultObject();

    Object.keys(poseCopy).forEach(v => {
      // do nothing, on specific any specific part is not visible
      if (!pose[v] || pose[v].visibility < 0.3) {
        return;
      }
      poseCopy[v] = {
        x: pose[v].x / frame.width,
        y: pose[v].y / frame.width,
        z: pose[v].z / frame.width,
        visibility: pose[v].visibility,
      };
    });

    runOnJS(updateData)(now, Object.values(poseCopy), pose, frame)

  }, []);



  const onError = function (error: any) {
    // https://github.com/mrousavy/react-native-vision-camera/blob/a65b8720bd7f2efffc5fb9061cc1e5ca5904bd27/src/CameraError.ts#L164
    console.error(Date() + "  " + error.message)

  }

  // step-3: send data to server
  useEffect(() => {

    let intervalInstance: any;
    // clear interval instance, if already set
    const cleanUp = () => intervalInstance && clearInterval(intervalInstance);

    intervalInstance = setInterval(() => {
      // if no keyPoints exist
      if (_.isEmpty(landmarksTempRef.current)) {
        return;
      }
      // get last keypoints
      const keyPoints = Object.assign(landmarksTempRef.current, {});

      // reset current
      landmarksTempRef.current = {};
      const timestamp = Date.now();

      __DEV__ && console.log(Date() + ' Message send to Server on timestamp: ', timestamp);
      // WS SEND Kps -> 1s
      sendJsonMessage({
        timestamp,
        user_keypoints: keyPoints,
        isprejoin: !!props.isEducationScreen,
      });
    }, 1000);

    return () => {
      // clean up  interval after component unmount
      cleanUp();
    };
  }, []);

  // step-4
  !_.isEmpty(lastJsonMessage) && props.onServerResponse(lastJsonMessage);

  // if no camera found (front or back)
  if (device == null) {
    return (
      //@ts-ignore
      <Text style={{ color: 'red', fontWeight: 'bold' }}>
        Unable to detect camera.
      </Text>
    );
  }

  return (
    <>
      {/* @ts-ignore */}
      <Camera
        style={styles.camera}
        device={device}
        isActive={true}
        // isActive={isAppForeground}
        frameProcessor={true ? frameProcessor : undefined}
        fps={10}
        frameProcessorFps={10}
        onError={onError}
      />
      {props.showSkeleton && (
        //@ts-ignore
        <Svg
          height={height}
          width={width}
          style={styles.linesContainer}
        >
          <AnimatedLine animatedProps={leftWristToElbowPosition} stroke="red" strokeWidth="2" />
          <AnimatedLine animatedProps={leftElbowToShoulderPosition} stroke="red" strokeWidth="2" />
          <AnimatedLine animatedProps={leftShoulderToHipPosition} stroke="red" strokeWidth="2" />
          <AnimatedLine animatedProps={leftHipToKneePosition} stroke="red" strokeWidth="2" />
          <AnimatedLine animatedProps={leftKneeToAnklePosition} stroke="red" strokeWidth="2" />
          <AnimatedLine animatedProps={rightWristToElbowPosition} stroke="red" strokeWidth="2" />
          <AnimatedLine animatedProps={rightElbowToShoulderPosition} stroke="red" strokeWidth="2" />
          <AnimatedLine animatedProps={rightShoulderToHipPosition} stroke="red" strokeWidth="2" />
          <AnimatedLine animatedProps={rightHipToKneePosition} stroke="red" strokeWidth="2" />
          <AnimatedLine animatedProps={rightKneeToAnklePosition} stroke="red" strokeWidth="2" />
          <AnimatedLine animatedProps={shoulderToShoulderPosition} stroke="red" strokeWidth="2" />
          <AnimatedLine animatedProps={hipToHipPosition} stroke="red" strokeWidth="2" />
        </Svg>
      )}

    </>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    width: '100%',
  },
  container: {
    // flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    //backgroundColor: "#e5e5e5",
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
    height: height,
    width: width,
  },
});


// const markerStyles = (orientation: any) =>
//   StyleSheet.create({
//     point: {
//       width: 20,
//       height: 20,
//       backgroundColor: '#fc0505',
//       borderRadius: 20,
//       position: 'absolute', //overlap on the camera
//       left: 280,     // x axis // TODO: make is configurable
//       top: 650,   // y axis
//     },
//   });
