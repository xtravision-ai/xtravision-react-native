import 'react-native-reanimated';
import { StyleSheet, Text, Dimensions } from 'react-native';
import React, { useCallback, useEffect } from 'react';
import {
  Camera,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';
import type { Frame } from 'react-native-vision-camera';
import { scanPoseLandmarks, generateSkeletonLines, generateSkeletonCircle } from '../helper';
import Animated, { runOnJS, useSharedValue } from 'react-native-reanimated';
import { getDefaultObject } from '../formatter';
import _ from 'lodash';
import Svg, { Circle, Line } from 'react-native-svg';

// TODO: create custom hook for WS connection
import useWebSocket from 'react-native-use-websocket';

const AnimatedLine = Animated.createAnimatedComponent(Line) as any;
const AnimatedCircle = Animated.createAnimatedComponent(Circle) as any;


const { width, height } = Dimensions.get('window');

const defaultPose = getDefaultObject();

export interface AssessmentProp {
  connectionData: {
    assessment_name: string;
    auth_token: string;
    assessment_config?: object;
    user_config?: object;
  };
  requestData: {
    isPreJoin?: boolean;
  };
  libData: {
    onServerResponse(serverResponse: any): void;
    cameraPosition: 'front' | 'back';
    showSkeleton: boolean;
  }
}

const WS_BASE_URL = 'wss://saasai.xtravision.ai/wss/v2';
// const WS_BASE_URL = 'wss://saasstagingai.xtravision.ai/wss/v2';
// const WS_BASE_URL = 'ws://localhost:8000/wss/v2';

export function Assessment(props: AssessmentProp) {
  const WS_URL = `${WS_BASE_URL}/assessment/fitness/${props.connectionData.assessment_name}`;

  let queryParams: { [key: string]: any } = { auth_token: props.connectionData.auth_token };
  // if (props.connection.queryParams) {
  //   queryParams = { ...queryParams, ...props.connection.queryParams };
  // }

  if (!_.isEmpty(props.connectionData.user_config)) {
    queryParams['user_config'] = encodeURIComponent(`${JSON.stringify(props.connectionData.user_config)}`);
  }

  if (!_.isEmpty(props.connectionData.assessment_config)) {
    queryParams['assessment_config'] = encodeURIComponent(`${JSON.stringify(props.connectionData.assessment_config)}`);
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
    onOpen: () => console.log(Date() + ' WS Connection opened'),
    onError: (e: any) => console.error(e), // todo : proper error handling
    //Will attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: (_closeEvent: any) => true,
    //To attempt to reconnect on error events,
    retryOnError: true,
  });

  const landmarksTempRef = React.useRef<any>({});

  const devices = useCameraDevices();
  const device = devices[props.libData.cameraPosition];

  // svg
  const poseLine: any = useSharedValue(defaultPose);
  const poseCircle: any = useSharedValue(defaultPose);


  const animatedLinesArray = generateSkeletonLines(poseLine, props.libData.cameraPosition, width);
  const animatedCircleArray = generateSkeletonCircle(poseCircle, props.libData.cameraPosition, width);

  const updateData = useCallback((now: any, landmarks: any) => {

    // Step-2: after extracting landmarks store unto temp variable
    // const poseFrameHandler = useCallback((pose1: any, frame: any) => {
    //   if (_.isEmpty(pose1)) {
    //     // console.log('Pose is empty!',)
    //     return;
    //   }
    // // normalized frames into landmarks and store landmarks with current millis in temp variable
    // const now = Date.now();
    // const landmarks = getNormalizedArray(pose1, frame, dimensions);

    landmarksTempRef.current[now] = { landmarks };
  }, [])

  const calculateLinePose = (poseCopyLine: any, pose: any, frame: any) => {
    'worklet';
    const xFactor = (height / frame.width) - 0.05;
    const yFactor = (width / frame.height);

    // [TypeError: Cannot read property 'x' of undefined]
    try {
      Object.keys(pose).forEach(v => {
        poseCopyLine[v] = {
          x: pose[v].x * xFactor,
          y: pose[v].y * yFactor,
        };
      });

    } catch (e) { }
    poseLine.value = poseCopyLine;
    console.log("poseLine", poseLine)
  }

  const calculateCirclePose = (poseCopyCircle: any, pose: any, frame: any) => {
    'worklet';
    const xFactor = (height / frame.width) - 0.05;
    const yFactor = (width / frame.height);

    // [TypeError: Cannot read property 'x' of undefined]
    try {
      Object.keys(pose).forEach(v => {
        poseCopyCircle[v] = {
          cx: pose[v].x * xFactor,
          cy: pose[v].y * yFactor,
        };
      });
    } catch (e) { }
    poseCircle.value = poseCopyCircle;
    // console.log("poseCircle", poseCircle)

  }


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
    const poseCopyLine: any = getDefaultObject();
    const poseCopyCircle: any = getDefaultObject();

    Object.keys(poseCopy).forEach(v => {
      // do nothing, on specific any specific part is not visible
      if (!pose[v]) {
        return;
      }
      poseCopy[v] = {
        x: pose[v].x / frame.width,
        y: pose[v].y / frame.width,
        z: pose[v].z / frame.width,
        visibility: pose[v].visibility,
      };
    });

    calculateLinePose(poseCopyLine, pose, frame);
    calculateCirclePose(poseCopyCircle, pose, frame);

    runOnJS(updateData)(now, Object.values(poseCopy))

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
        isprejoin: !!props.requestData.isPreJoin,
      });
    }, 1000);

    return () => {
      // clean up  interval after component unmount
      cleanUp();
    };
  }, []);

  // step-4
  !_.isEmpty(lastJsonMessage) && props.libData.onServerResponse(lastJsonMessage);

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

      {props.libData.showSkeleton && (
        //@ts-ignore
        <Svg
          height={height}
          width={width}
          style={styles.linesContainer}
        >
          {animatedLinesArray.map((element: any) => {
            return (
              <AnimatedLine animatedProps={element} stroke="red" strokeWidth="2" />
            )
          })}
          {/* {animatedCircleArray.map((element: any) => {
            return (
              <AnimatedCircle animatedProps={element} stroke="red" fill="red" />
            )
          })} */}
        </Svg>
      )}
    </>
  );
}

//   <Circle
//     cx={element.initial.value.x}
//     cy={element.initial.value.y}
//     r="8"
//     stroke="red"
//     strokeWidth="2.5"
//     fill="red"
//   />
// )

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
