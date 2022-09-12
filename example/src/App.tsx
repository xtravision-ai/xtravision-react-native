import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { RequestCameraPermission, Assessment } from 'xtravision-react-native';
import { CameraPermissionStatus } from 'xtravision-react-native';

export default function App() {
  const [hasPermission, setHasPermission] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const status = await RequestCameraPermission();
      setHasPermission(status === CameraPermissionStatus.AUTHORIZED);
    })();
  }, []);

  const [inPose, setInPose] = React.useState(false);
  const [repsCounter, setRepsCounter] = React.useState(0);
  // required prop:
  function onServerResponse(serverResponse: any): void {
    if (serverResponse.errors.length){
      console.error('Server Error Response:', serverResponse.errors);
      return ;
    }
   
    console.log('Server Data:', serverResponse.data);

    setRepsCounter(serverResponse.data?.reps);
    setInPose(serverResponse.data?.in_pose);
  }

  const authToken = '__AUTH-TOKEN__';
  const assessmentName = '__ASSESSMENT-NAME__';
  const cameraPosition = 'back';

  return (
    <View style={styles.container}>
      {hasPermission ? (
        <>
          {/* <Text>App has Permission</Text> */}
          <Assessment
            cameraPosition={cameraPosition}
            connection={{ authToken, queryParams: {} }}
            assessment={assessmentName}
            isEducationScreen={false}
            onServerResponse={onServerResponse}
          />
          <Text>In-Pose: {inPose} ; Reps Counter: {repsCounter}</Text>
        </>
      ) : (
        <>
          <Text>App don't have Permission</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
});
