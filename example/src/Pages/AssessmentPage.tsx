import * as React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';

import { RequestCameraPermission, Assessment } from '@xtravision/xtravision-react-native';
import { CameraPermissionStatus } from '@xtravision/xtravision-react-native';

// Disable all warning and error on screen
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs();

export default function AssessmentPage({ route }: any) {
  const auth_token = "_AUTH_TOKEN_";
  const assessment_name = route.params.assessmentName //'SIDE_FLAMINGO'; //, SIDE_FLAMINGO, PUSH_UPS, PLATE_TAPPING_COORDINATION, PARTIAL_CURL_UP, V_SIT_AND_REACH, SIT_UPS
  const cameraPosition = route.params.cameraOption // 'front'; // back or front
  const showSkeleton = route.params.showSkeleton; // true or false
  const userHeight = route.params.userHeight;
  let assessment_config = {} as any;
  let user_config = {} as any;


  // TODO: Patching work. Cleanup required
  // Starting point of standing broad jump
  // (width, height) = Coordinates (x,y)
  const { width, height } = Dimensions.get('window');

  const stand_x = width - (width - width / 10) //100
  const stand_y = height / (height / 250) //- 100
  // const stand_y = height / (width / 500) //- 100
  // const stand_x = (width - width / 5)

  let point_1x, point_1y
  let point_2x, point_2y;
  let point_3x, point_3y;
  let radius;

  // console.log("point_1", point_1, "point_2: ", point_2, "point_3: ", point_3);

  if (assessment_name === 'PLATE_TAPPING_COORDINATION') {
    point_1y = point_2y = point_3y = height - height / 4;
    point_1x = width / 3 - (width / 3) / 2;
    point_2x = width / 2;
    point_3x = width - width / 3 + (width / 3) / 2;
    radius = 80;
  };

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
        setDisplayText(`Current-Pose: ${additional_response?.in_pose};  In-Pose Time(sec): ${additional_response?.seconds};`)
        break;
      // /* @ts-ignore:next-line */
      case "PLATE_TAPPING_COORDINATION":
        setDisplayText(` Total Cycles: ${additional_response?.reps?.total};`)
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
    assessment_config.stand_x = stand_x;
    assessment_config.stand_y = stand_y;
    // // TODO: hardcoded part. auto calculate by frame or remove it
    assessment_config.image_height = 720;
    assessment_config.image_width = 1280;

  }

  if (assessment_name === 'PLATE_TAPPING_COORDINATION') {
    assessment_config.point_1 = { point_1x, point_1y };  // left
    assessment_config.point_2 = { point_2x, point_2y };  // center
    assessment_config.point_3 = { point_3x, point_3y };   // right
    assessment_config.point_radius = radius;
    assessment_config.image_height = height;
    assessment_config.image_width = width;
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
    showSkeleton
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
          {/* {
              // @ts-ignore:next-line
              assessment_name == "STANDING_BROAD_JUMP" &&
              (
                <>
                  <View style={styles({ stand_x, stand_y }).point} />
                  <Text style={styles({ stand_x, stand_y }).startPoint}>Start Point</Text>
                </>

              )
            } */}

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

          {
            // @ts-ignore:next-line
            assessment_name == "PLATE_TAPPING_COORDINATION" &&
            (
              <>
                {/* left */}
                <View style={styles({ height, point_1x, point_1y, radius }).leftPoint} />

                {/* center */}
                <View style={styles({ height, point_2x, point_2y, radius }).middlePoint} />

                {/* right */}
                <View style={styles({ height, point_3x, point_3y, radius }).rightPoint} />
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
    borderRadius: orientation?.radius,
    backgroundColor: '#fc0505',
    top: orientation?.stand_y,   // y axis
    left: orientation?.stand_x,     // x axis // TODO: make is configurable
    position: 'absolute', //overlap on the camera
    // // left: 280,     // x axis // TODO: make is configurable
  },
  leftPoint: {
    width: 80,
    height: 80,
    borderRadius: orientation?.radius,
    backgroundColor: '#fc0505',
    top: orientation?.point_1y,   // y axis
    left: orientation?.point_1x,     // x axis // TODO: make is configurable
    position: 'absolute', //overlap on the camera
    // // left: 280,     // x axis // TODO: make is configurable
  },
  middlePoint: {
    width: 80,
    height: 80,
    borderRadius: orientation?.radius,
    backgroundColor: '#fc0505',
    top: orientation?.point_2y,   // y axis
    left: orientation.point_2x,     // x axis // TODO: make is configurable
    position: 'absolute', //overlap on the camera
    // // left: 280,     // x axis // TODO: make is configurable
  },
  rightPoint: {
    width: 80,
    height: 80,
    borderRadius: orientation?.radius,
    backgroundColor: '#fc0505',
    top: orientation?.point_3y,   // y axis
    left: orientation?.point_3x,     // x axis // TODO: make is configurable
    position: 'absolute', //overlap on the camera
    // // left: 280,     // x axis // TODO: make is configurable
  },
  startPoint: {
    // width: 20,
    // height: 20,
    // borderRadius: 20,........
    // backgroundColor: '#fc0505',
    top: orientation?.stand_y + 20,   // y axis
    left: orientation?.stand_x - 15,     // x axis // TODO: make is configurable
    position: 'absolute',
  }
});
