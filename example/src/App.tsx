import { StyleSheet, View, Text, Dimensions } from 'react-native';
import * as React from 'react';
import {
  RequestCameraPermission,
  Assessment,
} from '@xtravision/xtravision-react-native';
import { CameraPermissionStatus } from '@xtravision/xtravision-react-native';
import { useEffect, useState } from 'react';

export default function App() {
  const [hasPermission, setHasPermission] = useState(false);

  // TODO: Patching work. Cleanup required
  // Starting point of standing broad jump
  // (width, height) = Coordinates (x,y)
  const { width, height } = Dimensions.get('window');

  const stand_x = width - (width - width / 10); //100
  const stand_y = height / (height / 300); //- 100

  useEffect(() => {
    (async () => {
      const status = await RequestCameraPermission();
      setHasPermission(status === CameraPermissionStatus.AUTHORIZED);
    })();
  }, []);

  const [inPose, setInPose] = useState(false);
  const [repsCounter, setRepsCounter] = useState(0);

  // required prop:
  const onServerResponse = (serverResponse: any) => {
    if (serverResponse.errors.length) {
      console.error('Server Error Response:', serverResponse.errors);
      return;
    }
    console.log("server data", serverResponse.data)

    setRepsCounter(serverResponse.data?.reps);
    setInPose(serverResponse.data?.in_pose);
  };

  const auth_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkOTU1NTVkNS0wNmFhLTExZWQtOGJkYy0xMmZhYjRmZmFiZWQiLCJhcHBJZCI6IjY5YTdmMmU2LTA2YWEtMTFlZC04YmRjLTEyZmFiNGZmYWJlZCIsIm9yZ0lkIjoiNmQ5MWZlN2YtMDZhOS0xMWVkLThiZGMtMTJmYWI0ZmZhYmVkIiwiaWF0IjoxNjYwMTA3MjI0LCJleHAiOjE2OTE2NjQ4MjR9._i4MJbwPznHzxoStcRAcK7N7k_xGdUjvKwmHXv1zixM';
  const assessment_name = 'STANDING_BROAD_JUMP'; //STANDING_BROAD_JUMP, SQUATS,
  const cameraPosition = 'back' as "front" | "back"; //  which camara you want to use
  // let queryParams: any = {};
  let assessment_config = {} as any;
  let user_config = {} as any;

  // change back to STANDING_BROAD_JUMP testing
  if (assessment_name == 'STANDING_BROAD_JUMP') {
    // queryParams.userHeight = 180;
    // queryParams.stand_x = stand_x * 2;
    // queryParams.stand_y = stand_y * 2;

    user_config.userHeight = 180; // in Centimeter
    // Coordinates of start point
    assessment_config.stand_x = stand_x * 2;
    assessment_config.stand_y = stand_y * 2;
    // TODO: hardcoded part. auto calculate by frame or remove it
    assessment_config.image_height = 720;
    assessment_config.image_width = 1280;
    assessment_config.reps_threshold = 3;
    assessment_config.grace_time_threshold  = 3;
  }

  const connectionData = {
    assessment_name,
    auth_token,
    assessment_config,
    user_config,
  };

  const requestData = {
    isPreJoin: false
  }

  const libData = {
    onServerResponse,
    cameraPosition,
  }

  return (
    <View style={styles({}).container}>
      {hasPermission ? (
        <>
          {/* <Text>App has Permission</Text> */}
          {/* <Assessment
            cameraPosition={cameraPosition}
            connection={{ auth_token, queryParams }}
            assessment={assessment_name}
            isEducationScreen={false}
            onServerResponse={(res) => onServerResponse(res)}
          /> */}

          <Assessment
            connectionData={connectionData}
            requestData={requestData}
            libData={libData}
          />
          {assessment_name == 'STANDING_BROAD_JUMP' && (
            <>
              <View style={styles({ stand_x, stand_y }).point} />
              <Text style={styles({ stand_x, stand_y }).startPoint}>
                Start Point
              </Text>
            </>

            // <View >
            //   <View style={styles({stand_x, stand_y}).point} />
            //   {/* <Text style={styles.verticalText}>Start Point</Text> */}
            // </View>
          )}

          <Text style={{ textAlign: 'center' }}>
            In-Pose: {inPose} ; Reps Counter: {repsCounter}
          </Text>
        </>
      ) : (
        <>
          <Text>App don't have Permission</Text>
        </>
      )}
    </View>
  );
}

const styles = (orientation: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      // alignItems: 'center',
      justifyContent: 'center',
      position: 'relative', //overlap on the camera
    },
    verticalText: {
      transform: [{ rotate: '270deg' }],
      color: 'red',
      fontWeight: 'bold',
    },
    point: {
      width: 20,
      height: 20,
      borderRadius: 20,
      backgroundColor: '#fc0505',
      top: orientation?.stand_y, // y axis
      left: orientation?.stand_x, // x axis // TODO: make is configurable
      position: 'absolute', //overlap on the camera
      // // left: 280,     // x axis // TODO: make is configurable
    },
    startPoint: {
      // width: 20,
      // height: 20,
      // borderRadius: 20,
      // backgroundColor: '#fc0505',
      top: orientation?.stand_y + 20, // y axis
      left: orientation?.stand_x - 15, // x axis // TODO: make is configurable
      position: 'absolute',
    },
  });
