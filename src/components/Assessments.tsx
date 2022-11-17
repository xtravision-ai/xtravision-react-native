import 'react-native-reanimated';
import { StyleSheet, Text } from 'react-native';
import React, { useCallback, useEffect } from 'react';
import {
  Camera,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';
import type { Frame } from 'react-native-vision-camera';
import { scanPoseLandmarks } from '../helper';
import { runOnJS } from 'react-native-reanimated';
import { getDefaultObject} from '../formatter';
import _ from 'lodash';

// TODO: create custom webhook for WS connection
import useWebSocket from 'react-native-use-websocket';

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
}

//const WS_BASE_URL = 'ws://localhost:8000/wss/v1';
const WS_BASE_URL = 'wss://saasai.xtravision.ai/wss/v1';
//const WS_BASE_URL = 'wss://saasstagingai.xtravision.ai/wss/v1';

export function Assessment(props: AssessmentProp) {

  const WS_URL = `${WS_BASE_URL}/assessment/fitness/${props.assessment}`;

  let queryParams: {[key:string]: any} = { authToken: props.connection.authToken };
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

  const updateData = useCallback((now: any, landmarks: any) => {
    landmarksTempRef.current[now] = { landmarks };
   },[])

  // Step-1: using frame processor, extract body landmarks from Pose
  const frameProcessor = useFrameProcessor((frame: Frame) => {
    'worklet';
    const pose = scanPoseLandmarks(frame);

    if (Object.keys(pose).length == 0) {
      console.warn(Date()+" Body is not visible!")
      return;
    }

    __DEV__ && console.log(Date()+" Body is visible.")

    // Step-2: after extracting landmarks store unto temp variable
    const now = Date.now();
    // normalize pose: process to convert pose object to required formate
    const poseCopy: any = getDefaultObject();

    Object.keys(poseCopy).forEach(v => {
      // do nothing, on specific any specific part is not visible
      if (!pose[v] || pose[v].visibility < 0.3){
         return;
      }
      poseCopy[v] = {
        x: pose[v].x / frame.width,
        y: pose[v].y /frame.width,
        z: pose[v].z / frame.width,
        visibility: pose[v].visibility,
      };
    });

    runOnJS(updateData)(now, Object.values(poseCopy))

  },[]);

  

  const onError = function(error: any){
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
      <Text style={{ color: 'red', fontWeight: 'bold' }}>
        Unable to detect camera.
      </Text>
    );
  }

  return (
    <>
      <Camera
        style={styles.camera}
        device={device}
        isActive={true}
        // isActive={isAppForeground}
        frameProcessor={true?frameProcessor: undefined}
        fps = {10}
        frameProcessorFps = {10}
        onError = {onError}
      />
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
  verticalText : {
    transform:  [{ rotate: '270deg' }],
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
