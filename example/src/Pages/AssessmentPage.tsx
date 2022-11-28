import * as React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';

import { RequestCameraPermission, Assessment } from '@xtravision/xtravision-react-native';
import { CameraPermissionStatus } from '@xtravision/xtravision-react-native';

// Disable all warning and error on screen
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs();

export default function AssessmentPage({ route }: any) {

  // don't push auth token to public repo
  const auth_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwOGRmMjM3Yi03NzljLTRlYzItYWY2Ny1iNGE5OTdlOGJjOGQiLCJhcHBJZCI6Ijk1ZWFjZDQ1LTgyZjUtMTFlYy1hOWY1LWE0YmI2ZDZlZGM0ZSIsIm9yZ0lkIjoiZGQ4MzA1OWMtODJmMy0xMWVjLWE5ZjUtYTRiYjZkNmVkYzRlIiwiaWF0IjoxNjY5MzY3NDg1LCJleHAiOjE2NzE5NTk0ODV9.U0MHfGYZyColqrcB1VclbxTNTD2PpFzyr78f9p-hI9c";
  const assessment_name = route.params.assessmentName; //'SIDE_FLAMINGO'; //, SIDE_FLAMINGO, PUSH_UPS, PLATE_TAPPING_COORDINATION, PARTIAL_CURL_UP, V_SIT_AND_REACH, SIT_UPS
  const cameraPosition = route.params.cameraOption; // 'front'; // back or front
  const userHeight = route.params.userHeight;
  let assessment_config = {} as any;
  let user_config = {} as any;


  // TODO: Patching work. Cleanup required
  // Starting point of standing broad jump
  // (width, height) = Coordinates (x,y)
  const { width, height } = Dimensions.get('window');

  const stand_x = width - (width - width / 10) //100
  const stand_y = height / (height / 250) //- 100

  const [hasPermission, setHasPermission] = React.useState(false);
  React.useEffect(() => {
    (async () => {
      const status = await RequestCameraPermission();
      setHasPermission(status === CameraPermissionStatus.AUTHORIZED);
    })();
  }, []);

  const [displayText, setDisplayText] = React.useState('Waiting for server....');

  // required prop:
  const onServerResponse = function (serverResponse: any) {
    if (serverResponse.errors.length) {
      console.error(Date() + ' Server Error Response:', serverResponse.errors);
      setDisplayText(` ERROR :=> ${serverResponse.errors[0].message}.`)
      return;
    }

    console.log(Date() + ' Server Data:', serverResponse.data);

    const additional_response = serverResponse.data.additional_response
    /* @ts-ignore:next-line */
    switch (assessment_name) {

      /* @ts-ignore:next-line */
      case "SIDE_FLAMINGO":
        setDisplayText(`Current-Pose: ${serverResponse.data.in_pose}; \n Balance Loss: ${serverResponse.data.balance_loss} ; Remaining Time: ${serverResponse.data.remaining_time};`)
        break;
      /* @ts-ignore:next-line */
      case "PLATE_TAPPING_COORDINATION":
        setDisplayText(` Total Cycles: ${serverResponse.data.reps};`)
        break;
      case "STANDING_BROAD_JUMP":
        setDisplayText(`is-at-start-position: ${serverResponse?.data?.additional_response?.is_at_start_position}; jump distance(cm): ${serverResponse?.data?.additional_response?.distance_cm}`)
        break;
      default:
        setDisplayText(`Current-Pose: ${additional_response?.in_pose}; Reps: ${additional_response?.reps?.total};`)
    }

  };


  // // @ts-ignore:next-line
  if (assessment_name == 'STANDING_BROAD_JUMP') {
    user_config.user_height = userHeight; // in Centimeter string
    // Coordinates of start point
    assessment_config.stand_x = stand_x * 2;
    assessment_config.stand_y = stand_y * 2;
    // // TODO: hardcoded part. auto calculate by frame or remove it
    assessment_config.image_height = 720;
    assessment_config.image_width = 1280;
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
          <Assessment
            connectionData={connectionData}
            requestData={requestData}
            libData={libData}
          />
          {
            // @ts-ignore:next-line
            assessment_name == "STANDING_BROAD_JUMP" &&
            (
              <>
                <View style={styles({ stand_x, stand_y }).point} />
                <Text style={styles({ stand_x, stand_y }).startPoint}>Start Point</Text>
              </>

            )
          }
          <Text style={{ backgroundColor: 'white', textAlign: 'center', fontWeight: "bold", color: "black", fontSize: 20 }}>
            {displayText}
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

const styles = (orientation: any) => StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    justifyContent: 'center',
    position: 'relative', //overlap on the camera

  },
  verticalText: {
    transform: [{ rotate: '270deg' }],
    color: 'red',
    fontWeight: 'bold'
  },
  point: {
    width: 20,
    height: 20,
    borderRadius: 20,
    backgroundColor: '#fc0505',
    top: orientation?.stand_y,   // y axis
    left: orientation?.stand_x,     // x axis // TODO: make is configurable
    position: 'absolute', //overlap on the camera
    // // left: 280,     // x axis // TODO: make is configurable
  },
  startPoint: {
    // width: 20,
    // height: 20,
    // borderRadius: 20,
    // backgroundColor: '#fc0505',
    top: orientation?.stand_y + 20,   // y axis
    left: orientation?.stand_x - 15,     // x axis // TODO: make is configurable
    position: 'absolute',
  }
});
