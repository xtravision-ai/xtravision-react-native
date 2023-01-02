import 'react-native-reanimated';
import { StyleSheet, Text, useWindowDimensions } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Camera,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';
import type { Frame } from 'react-native-vision-camera';
// import { scanPoseLandmarks, generateSkeletonLines, generateSkeletonCircle } from '../helper';
import { scanPoseLandmarks} from '../helper';
// import Animated from 'react-native-reanimated';
import { runOnJS, useSharedValue } from 'react-native-reanimated';
import { getDefaultObject } from '../formatter';
import _ from 'lodash';
// import Svg, { Circle, Line } from 'react-native-svg';

// TODO: create custom hook for WS connection
import useWebSocket from 'react-native-use-websocket';

// const AnimatedLine = Animated.createAnimatedComponent(Line) as any;
// const AnimatedCircle = Animated.createAnimatedComponent(Circle) as any;

const defaultPose = getDefaultObject();

export interface AssessmentProp {
  connectionData: {
    assessment_name: string;
    auth_token: string;
    assessment_config?: object;
    user_config?: object;
    session_id?:string | null
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

// const WS_BASE_URL = 'wss://saasai.xtravision.ai/wss/v2';
// const WS_BASE_URL = 'wss://saasstagingai.xtravision.ai/wss/v2';
const WS_BASE_URL = 'ws://localhost:8000/wss/v2';

export function Assessment(props: AssessmentProp) {
  // const { width, height } = Dimensions.get('window');
  const dimensions = useWindowDimensions();

  const width = dimensions.width
  const height = dimensions.height;

  // TODO: clean up below code and move into custom hook

  let iQueryParams: { [key: string]: any } = {}; 
  iQueryParams['requested_at'] = Date.now();
  iQueryParams["session_id"]= props.connectionData.session_id ? props.connectionData.session_id : null;
  iQueryParams["auth_token"] = props.connectionData.auth_token;

  if (!_.isEmpty(props.connectionData.user_config)) {
    iQueryParams['user_config'] = encodeURIComponent(`${JSON.stringify(props.connectionData.user_config)}`);
  }

  if (!_.isEmpty(props.connectionData.assessment_config)) {
    iQueryParams['assessment_config'] = encodeURIComponent(`${JSON.stringify(props.connectionData.assessment_config)}`);
  }

  const WS_URL = `${WS_BASE_URL}/assessment/fitness/${props.connectionData.assessment_name}`
  
  //Imp: Since component is rendering multiple times and query params have current time, So we need to set query params only one time when load component
  const [queryParams] = useState(iQueryParams)
  
  const landmarksTempRef = React.useRef<any>({});
  const frameTempRef = React.useRef<any>({frame_height: height, frame_width: width});

  const devices = useCameraDevices();
  const device = devices[props.libData.cameraPosition];

  const poseSkeleton: any = useSharedValue(defaultPose);

  // const animatedLinesArray = generateSkeletonLines(poseSkeleton, props.libData.cameraPosition, orientation.width);
  // const animatedCircleArray = generateSkeletonCircle(poseSkeleton, props.libData.cameraPosition, orientation.width);

  const updateData = useCallback((now: any, landmarks: any, frame: any) => {
    landmarksTempRef.current[now] = { landmarks };
    frameTempRef.current = { frame_height: frame.height, frame_width: frame.width };
  }, [])

  const calculatePoseSkeleton = (poseCopyObj: any, pose: any, frame: any, dimensions: any) => {
    'worklet';
    
    // default consideration: Phone in Portrait mode
    const width = dimensions.width
    const height = dimensions.height

    let xFactor:any , yFactor:any;
    
    if (height > width ) {
      xFactor = height / frame.width
      yFactor = width / frame.height
    } else { // Phone in landscape mode
      // TODo: @Jestin: why we need to adjust this thing. Is it any phone specific ? 
      xFactor =  1 - 0.34;
      yFactor = 1 - 0.55;
    }

    try {
      Object.keys(pose).forEach(v => {
        poseCopyObj[v] = {
          x: pose[v].x * xFactor,
          y: pose[v].y * yFactor,
        };
      });

    } catch (e) { console.error(Date() + " ", e)}
    poseSkeleton.value = poseCopyObj;
  }

  // Step-1: using frame processor, extract body landmarks from Pose
  const frameProcessor = useFrameProcessor((frame: Frame) => {
    'worklet';
    const pose = scanPoseLandmarks(frame);

    if (Object.keys(pose).length == 0) {
      __DEV__ && console.warn(Date() + " Body is not visible!")
      return;
    }

    // __DEV__ && console.log(Date()+" Body is visible.")

    // Step-2: after extracting landmarks store unto temp variable
    const now = Date.now();
    // normalize pose: process to convert pose object to required formate
    const poseCopy: any = getDefaultObject();
    const poseCopyObj: any = getDefaultObject();

    Object.keys(poseCopy).forEach(v => {
      // do nothing, on specific any specific part is not visible
      if (!pose[v]) {
        return;
      }
      poseCopy[v] = {
        x: props.libData.cameraPosition === 'back' ? pose[v].x / frame.width : (frame.width - pose[v].x) / frame.width,
        y: pose[v].y / frame.width,
        z: pose[v].z / frame.width,
        visibility: pose[v].visibility,
      };
    });

    calculatePoseSkeleton(poseCopyObj, pose, frame, dimensions);
    runOnJS(updateData)(now, Object.values(poseCopy), frame)

  }, [dimensions]);

  const onError = function (error: any) {
    // https://github.com/mrousavy/react-native-vision-camera/blob/a65b8720bd7f2efffc5fb9061cc1e5ca5904bd27/src/CameraError.ts#L164
    console.error(Date() + "  " + error.message)
  }
  
  // https://github.com/Sumit1993/react-native-use-websocket#readme
  let default_options = {
    queryParams: queryParams, //{...props.connection.queryParams, queryParams}
    onOpen: () => console.log(Date() + ' WS Connection opened'),
    onError: (e: any) => console.error(Date() + ' ',  e), // todo : proper error handling
    //Will attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: (_closeEvent: any) => true,
    //To attempt to reconnect on error events,
    retryOnError: true,
  }
 
  const {
    sendJsonMessage,
    lastJsonMessage,
    // readyState,
    // getWebSocket
  } = useWebSocket(WS_URL, default_options );

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

      // testing
      // __DEV__ && console.log(Date() + ' Message send to Server on timestamp: ', timestamp);
      // WS SEND Kps -> 1s
      sendJsonMessage({
        timestamp,
        user_keypoints: keyPoints,
        isprejoin: !!props.requestData.isPreJoin,
        frame_width: frameTempRef.current.frame_width,
        frame_height: frameTempRef.current.frame_height
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
        style={getStylesData(dimensions).camera}
        device={device}
        isActive={true}
        // isActive={isAppForeground}
        frameProcessor={true ? frameProcessor : undefined}
        fps={10}
        frameProcessorFps={10}
        onError={onError}
      />

      {/* @ts-ignore */}
      <Text> width: {dimensions.width} height: {dimensions.height}</Text>

      {/* {props.libData.showSkeleton && (
        //@ts-ignore
        <Svg
          height={orientation.height}
          width={orientation.width}
          style={styles(orientation).linesContainer}
        >
          {animatedLinesArray.map((element: any, key: any) => {
            return (
              <AnimatedLine animatedProps={element} stroke="red" strokeWidth="2" key={key} />
            )
          })}
          {animatedCircleArray.map((element: any, key: any) => {
            return (
              <AnimatedCircle animatedProps={element} stroke="red" fill="red" key={key} />
            )
          })}
        </Svg>
      )} */}
    </>
  );
}

const getStylesData = (orientation: any) => StyleSheet.create({
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
    right: 0,
    height: orientation.height,
    width: orientation.width,
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
