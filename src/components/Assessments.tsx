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
  }
}

// const WS_BASE_URL = 'ws://localhost:8000/wss/v2';
const WS_BASE_URL = 'wss://saasai.xtravision.ai/wss/v2';


export function Assessment(props: AssessmentProp) {

  let queryParams: { [key: string]: any } = {};

  queryParams['auth_token'] = props.connectionData.auth_token;

  if (props.connectionData.user_config) {
    queryParams['user_config'] = encodeURIComponent(`${JSON.stringify(props.connectionData.user_config)}`);
  }

  if (props.connectionData.assessment_config) {
    queryParams['assessment_config'] = encodeURIComponent(`${JSON.stringify(props.connectionData.assessment_config)}`);
  }

  const WS_URL = `${WS_BASE_URL}/assessment/fitness/${props.connectionData.assessment_name}`;

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
  const device = devices[props.libData.cameraPosition];


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
        frameProcessor={true ? frameProcessor : undefined}
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
});
