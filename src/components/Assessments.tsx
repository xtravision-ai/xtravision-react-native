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
import { getNormalizedArray } from '../formatter';
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

export function Assessment(props: AssessmentProp) {

  const WS_URL = `${WS_BASE_URL}/assessment/fitness/${props.assessment}`;

  let queryParams: {[key:string]: any} = { authToken: props.connection.authToken };
  if (props.connection.queryParams) {
    queryParams = { ...queryParams, ...props.connection.queryParams };
  }

  // add some extra params
  if (props.assessment === 'STANDING_BROAD_JUMP'){
    // TODO: hardcoded part. auto calculate by frame or remove it
    const orientationData = {
      "image_height": 720, //orientation.image_height,
      "image_width": 1280 //orientation.image_width
    }

    queryParams = {...queryParams, ...orientationData }

    console.log("queryParams: ", queryParams);
 }

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


  // Step-2: after extracting landmarks store unto temp variable
  const poseFrameHandler = useCallback((pose: any, frame: any) => {
    if (_.isEmpty(pose)) {
      // console.log('Pose is empty!',)
      return;
    }

    // console.log("frame.height----------", frame.height)
    // console.log("frame.width-----------", frame.width)

    // // update image height and width
    // setOrientation(prev => ({
    //   ...prev,
    //   image_height: frame.height,
    //   image_width: frame.width,
    // }));


    // normalized frames into landmarks
    const landmarks = getNormalizedArray(pose, frame);
    // store landmarks with current millis in temp variable
    const now = Date.now();
    landmarksTempRef.current[now] = { landmarks };
  }, []);

  // Step-1: using frame processor, extract body landmarks from Pose
  const frameProcessor = useFrameProcessor((frame: Frame) => {
    'worklet';
    const pose: any = scanPoseLandmarks(frame);
    // IMP: DO NOT PUT ANY JS CODE HERE
    // store landmarks into temp object
    runOnJS(poseFrameHandler)(pose, frame);
  }, []);

  // step-3: send data to server
  useEffect(() => {
    // TODO: use timeout instead of interval and recall same method

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

      __DEV__ && console.log('message send', timestamp);
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
        frameProcessorFps={3}
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


const markerStyles = (orientation: any) =>
  StyleSheet.create({
    point: {
      width: 20,
      height: 20,
      backgroundColor: '#fc0505',
      borderRadius: 20,
      position: 'absolute', //overlap on the camera
      left: 280,     // x axis // TODO: make is configurable
      top: 650,   // y axis
    },
  });
