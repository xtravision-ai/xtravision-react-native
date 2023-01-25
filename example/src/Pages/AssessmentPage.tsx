import * as React from 'react';
import { StyleSheet, View, Text, useWindowDimensions } from 'react-native';

import { RequestCameraPermission, Assessment } from '@xtravision/xtravision-react-native';
import { CameraPermissionStatus } from '@xtravision/xtravision-react-native';

// Disable all warning and error on screen
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs();

const PLATE_TAPPING_COORDINATION_RADIUS = 80;

// cache variable
let responseCache: any = { positiveReps: 0, negativeReps: 0, lastReps: 0 };


export default function AssessmentPage({ route }: any) {
  const authToken = "__AUTH_TOKEN__";
  const selectedAssessment = route.params.assessmentName //'SIDE_FLAMINGO'; //, SIDE_FLAMINGO, PUSH_UPS, PLATE_TAPPING_COORDINATION, PARTIAL_CURL_UP, V_SIT_AND_REACH, SIT_UPS
  const cameraPosition = route.params.cameraOption // 'front'; // back or front
  const showSkeleton = false; // true or false
  const userHeight = route.params.userHeight;
  let assessmentConfig = {} as any;
  let userConfig = {} as any;

  const assessmentName = selectedAssessment.split("-")[0];// assessmentDataList[0];

  const leftSideColor = '#5588cf';  // blue color
  const rightSideColor = '#55bacf'; // sky blue color


  // TODO: Patching work. Cleanup required
  // Starting point of standing broad jump
  // (width, height) = Coordinates (x,y)
  const { width, height } = useWindowDimensions();

  assessmentConfig.image_height = height;
  assessmentConfig.image_width = width;

  const stand_x = width - (width - width / 10) //100
  const stand_y = height / (height / 250) //- 100
  // const stand_y = height / (width / 500) //- 100
  // const stand_x = (width - width / 5)

  let leftPoint_x, leftPoint_y
  let centerPoint_x, centerPoint_y;
  let rightPoint_x, rightPoint_y;
  let radius;

  if (assessmentName === 'PLATE_TAPPING_COORDINATION') {
    leftPoint_y = centerPoint_y = rightPoint_y = height - (height * 37 / 100) // / 2.7;
    const half = width / 2;
    leftPoint_x = (half - half * 1 / 2);
    centerPoint_x = half    // center
    rightPoint_x = (half + half * 1 / 2)

    radius = PLATE_TAPPING_COORDINATION_RADIUS;
    ;
  };

  const [hasPermission, setHasPermission] = React.useState(false);
  React.useEffect(() => {
    (async () => {
      const status = await RequestCameraPermission();
      setHasPermission(status === CameraPermissionStatus.AUTHORIZED);
    })();
  }, []);

  React.useEffect(() => {
    // temp data for demo
    //initial define cache variable
    responseCache = { positiveReps: 0, negativeReps: 0, lastReps: 0 };
  }, [])

  const [displayText, setDisplayText] = React.useState('Waiting for server....');

  // required prop:
  const onServerResponse = (serverResponse: any) => {
    if (serverResponse.errors.length) {
      console.error(Date() + ' Server Error Response:', serverResponse.errors);
      setDisplayText(` ERROR :=> ${serverResponse.errors[0].message}.`)
      return;
    }

    console.log(Date() + ' Server Data:', serverResponse.data);

    const additional_response = serverResponse.data.additional_response
    switch (selectedAssessment) {
      case "SIDE_FLAMINGO":
        setDisplayText(`Current-Pose: ${additional_response?.in_pose};  In-Pose Time(sec): ${additional_response?.seconds};`)
        break;
      case "PLATE_TAPPING_COORDINATION":
        setDisplayText(` Total Cycles: ${additional_response?.reps?.total};`)
        break;
      case "STANDING_BROAD_JUMP":
        setDisplayText(`is-at-start-position: ${serverResponse?.data?.additional_response?.is_at_start_position}; jump distance(cm): ${serverResponse?.data?.additional_response?.distance_cm}`)
        break;
      case "V_SIT_AND_REACH-POSITIVE_NEGATIVE":
        // reps increase
        if (additional_response.reps.total != responseCache.lastReps) {
          if (additional_response.in_pose) {
            responseCache.positiveReps++;
          } else {
            responseCache.negativeReps++;
          }
          responseCache.lastReps = additional_response.reps.total;
        }

        setDisplayText(` Positive Reps: ${responseCache.positiveReps}; Negative reps: ${responseCache.negativeReps}`)
        break;
      default:
        setDisplayText(`Current-Pose: ${additional_response?.in_pose}; Reps: ${additional_response?.reps?.total};`)
    }

  };

  // // @ts-ignore:next-line
  if (assessmentName == 'STANDING_BROAD_JUMP') {
    userConfig.user_height = userHeight; // in Centimeter string
    // Coordinates of start point
    assessmentConfig.stand_x = stand_x;
    assessmentConfig.stand_y = stand_y;
  }

  if (assessmentName === 'PLATE_TAPPING_COORDINATION') {
    assessmentConfig.point_1 = { point_1x: leftPoint_x, point_1y: leftPoint_y };  // left
    assessmentConfig.point_2 = { point_2x: centerPoint_x, point_2y: centerPoint_y };  // center
    assessmentConfig.point_3 = { point_3x: rightPoint_x, point_3y: rightPoint_y };   // right
    assessmentConfig.point_radius = radius;
  }

  // formatted data as required
  const connectionData = {
    assessment_name: assessmentName,
    auth_token: authToken,
    assessment_config: assessmentConfig,
    user_config: userConfig,
    session_id: null
  };

  const requestData = {
    isPreJoin: false
  }

  const libData = {
    sideColor: { leftSideColor, rightSideColor },
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
          {
            // @ts-ignore:next-line
            assessmentName == "STANDING_BROAD_JUMP" &&
            (
              <>
                <View style={styles({ stand_x, stand_y }).point} />
                <Text style={styles({ stand_x, stand_y }).startPoint}>Start Point</Text>
              </>

            )
          }

          {
            // @ts-ignore:next-line
            assessmentName == "PLATE_TAPPING_COORDINATION" &&
            (
              <>
                {/* left */}
                <View style={styles({ height, leftPoint_x, leftPoint_y, radius }).leftPoint} >
                  <Text style={{ fontSize: 40, textAlign: 'center', color: "black" }}>L</Text>
                </View>

                {/* center */}
                <View style={styles({ height, centerPoint_x, centerPoint_y, radius }).middlePoint} >
                  <Text style={{ fontSize: 40, textAlign: 'center', color: "black" }}>C</Text>
                </View>

                {/* right */}
                <View style={styles({ height, rightPoint_x, rightPoint_y, radius }).rightPoint}>
                  <Text style={{ fontSize: 40, textAlign: 'center', color: "black" }}>R</Text>
                </View>
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
    width: 40,
    height: 40,
    borderRadius: orientation?.radius,
    backgroundColor: '#fc0505',
    top: orientation?.stand_y,   // y axis
    left: orientation?.stand_x,     // x axis // TODO: make is configurable
    position: 'absolute', //overlap on the camera
    // // left: 280,     // x axis // TODO: make is configurable
  },
  leftPoint: {
    justifyContent: 'center',
    width: PLATE_TAPPING_COORDINATION_RADIUS,
    height: PLATE_TAPPING_COORDINATION_RADIUS,
    borderRadius: PLATE_TAPPING_COORDINATION_RADIUS,
    backgroundColor: '#A52A2A',
    top: orientation?.leftPoint_y,   // y axis
    left: orientation?.leftPoint_x,     // x axis // TODO: make is configurable
    position: 'absolute', //overlap on the camera
  },
  middlePoint: {
    justifyContent: 'center',
    width: PLATE_TAPPING_COORDINATION_RADIUS,
    height: PLATE_TAPPING_COORDINATION_RADIUS,
    borderRadius: PLATE_TAPPING_COORDINATION_RADIUS,
    backgroundColor: '#A52A2A', //#A52A2A
    top: orientation?.centerPoint_y,   // y axis
    left: orientation.centerPoint_x,     // x axis // TODO: make is configurable
    position: 'absolute', //overlap on the camera
    // // left: 280,     // x axis // TODO: make is configurable
  },
  rightPoint: {
    justifyContent: 'center',
    width: PLATE_TAPPING_COORDINATION_RADIUS,
    height: PLATE_TAPPING_COORDINATION_RADIUS,
    borderRadius: PLATE_TAPPING_COORDINATION_RADIUS,
    backgroundColor: '#A52A2A',
    top: orientation?.rightPoint_y,   // y axis
    left: orientation?.rightPoint_x,     // x axis // TODO: make is configurable
    position: 'absolute', //overlap on the camera
    // // left: 280,     // x axis // TODO: make is configurable
  },
  startPoint: {
    // width: 20,
    // height: 20,
    // borderRadius: 20,........
    // backgroundColor: '#fc0505',
    top: orientation?.stand_y + 40,   // y axis
    left: orientation?.stand_x - 15,     // x axis // TODO: make is configurable
    position: 'absolute',
  }
});
