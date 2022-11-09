import * as React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';

import { RequestCameraPermission, Assessment } from '@xtravision/xtravision-react-native';
import { CameraPermissionStatus } from '@xtravision/xtravision-react-native';

// Disable all warning and error on screen
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs();


export default function App() {

  const authToken = "__AUTH_TOKEN__";
  const assessmentName = 'PUSH_UPS'; //, SIDE_FLAMINGO, PUSH_UPS
  const cameraPosition = 'front'; // back or front
  let queryParams:any = {}

  const [hasPermission, setHasPermission] = React.useState(false);

  // TODO: Patching work. Cleanup required
  // Starting point of standing broad jump
  // (width, height) = Coordinates (x,y)
  const { width, height } = Dimensions.get('window');


  const stand_x = width - (width - width / 10) //100
  const stand_y = height/(height / 300) //- 100

  React.useEffect(() => {
    (async () => {
      const status = await RequestCameraPermission();
      setHasPermission(status === CameraPermissionStatus.AUTHORIZED);
    })();
  }, []);

  const [displayText, setDisplayText] = React.useState('Waiting for server....');

  // required prop:
  const onServerResponse = function (serverResponse: any) {
    if (serverResponse.errors.length){
      console.error('Server Error Response:', serverResponse.errors);
      return ;
    }
   
    console.log('Server Data:', serverResponse.data);

    /* @ts-ignore:next-line */
    if ("SIDE_FLAMINGO" == assessmentName) {
      setDisplayText( `In-Pose: ${serverResponse.data.in_pose}; Balance Loss: ${serverResponse.data.balance_loss} ; Remaining Time: ${serverResponse.data.remaining_time};`)
    }else {
      setDisplayText( `In-Pose: ${serverResponse.data.in_pose}; Reps: ${serverResponse.data.reps};`)

    }

  };


  // @ts-ignore:next-line
  if (assessmentName == 'STANDING_BROAD_JUMP'){
    queryParams.userHeight = 180 // in Centimeter
    // Coordinates of start point
    queryParams.stand_x = stand_x * 2;
    queryParams.stand_y = stand_y* 2 
  }

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
            onServerResponse={(res)=>onServerResponse(res)}
          />
        {
           // @ts-ignore:next-line
        assessmentName== "STANDING_BROAD_JUMP" && 
          (
            <>
              <View style={styles({stand_x, stand_y}).point} />
              <Text style={styles({stand_x, stand_y}).startPoint}>Start Point</Text>
            </>

          // <View >
          //   <View style={styles({stand_x, stand_y}).point} />
          //   {/* <Text style={styles.verticalText}>Start Point</Text> */}
          // </View>
          )
        }

          {/* <Text style={{textAlign: 'center'}}>In-Pose: {inPose} ; Reps Counter: {repsCounter}</Text> */}

          <Text style={{textAlign: 'center', fontWeight: "bold", color:"blue"}}>{displayText}</Text>

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
  verticalText : {
    transform:  [{ rotate: '270deg' }],
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
