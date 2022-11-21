import * as React from 'react';
import { StyleSheet, View, Text, Dimensions, AppState } from 'react-native';

import { RequestCameraPermission, Assessment } from '@xtravision/xtravision-react-native';
import { CameraPermissionStatus } from '@xtravision/xtravision-react-native';

// Disable all warning and error on screen
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs();

export default function AssessmentPage({ navigation, route }) {

  const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMmY3N2VlOC0xOGE0LTRkNzQtYmQxMC1jYWFhMDUzNjExMTAiLCJhcHBJZCI6IjhkZWExNGJiLTRlYjMtMTFlZC04MjNiLTEyZmFiNGZmYWJlZCIsIm9yZ0lkIjoiODk5Y2I5NjAtNGViMy0xMWVkLTgyM2ItMTJmYWI0ZmZhYmVkIiwiaWF0IjoxNjY4Njc4OTM2LCJleHAiOjE2NzEyNzA5MzZ9.S2qv_cfo5wmJJWlq1LiKbjV6Mv9V6d8SmYc5pYd2nt4";
  const assessmentName = route.params.assessmentName //'SIDE_FLAMINGO'; //, SIDE_FLAMINGO, PUSH_UPS, PLATE_TAPPING_COORDINATION, PARTIAL_CURL_UP, V_SIT_AND_REACH, SIT_UPS
  const cameraPosition = route.params.cameraOption // 'front'; // back or front
  const showSkeleton = route.params.showSkeleton // 'true' or 'false'; 

  // // TODO: Patching work. Cleanup required
  // // Starting point of standing broad jump
  // // (width, height) = Coordinates (x,y)
  // const { width, height } = Dimensions.get('window');

  // const stand_x = width - (width - width / 10) //100
  // const stand_y = height/(height / 300) //- 100

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
      return;
    }

    console.log(Date() + ' Server Data:', serverResponse.data);

    /* @ts-ignore:next-line */
    switch (assessmentName) {

      /* @ts-ignore:next-line */
      case "SIDE_FLAMINGO":
        setDisplayText(`Current-Pose: ${serverResponse.data.in_pose}; \n Balance Loss: ${serverResponse.data.balance_loss} ; Remaining Time: ${serverResponse.data.remaining_time};`)
        break;
      /* @ts-ignore:next-line */
      case "PLATE_TAPPING_COORDINATION":
        setDisplayText(` Total Cycles: ${serverResponse.data.reps};`)
        break;
      default:
        setDisplayText(`Current-Pose: ${serverResponse.data.in_pose}; Reps: ${serverResponse.data.reps};`)
    }

  };


  // // @ts-ignore:next-line
  // if (assessmentName == 'STANDING_BROAD_JUMP'){
  //   queryParams.userHeight = 180 // in Centimeter
  //   // Coordinates of start point
  //   queryParams.stand_x = stand_x * 2;
  //   queryParams.stand_y = stand_y* 2 
  // }

  // testing
  const queryParams = {}

  return (
    <View style={styles({}).container}>
      {hasPermission ? (
        <>
          {/* <Text>App has Permission</Text> */}
          <Assessment
            cameraPosition={cameraPosition}
            connection={{ authToken, queryParams }}
            assessment={assessmentName}
            isEducationScreen={false}
            onServerResponse={(res) => onServerResponse(res)}
            showSkeleton={showSkeleton == 'true' ? true : false}
          />
          {/* {
            // @ts-ignore:next-line
            assessmentName == "STANDING_BROAD_JUMP" &&
            (
              <>
                <View style={styles({ stand_x, stand_y }).point} />
                <Text style={styles({ stand_x, stand_y }).startPoint}>Start Point</Text>
              </>

            )
          } */}
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
