import * as React from 'react';
import { StyleSheet, View, Text, } from 'react-native';
// import { Camera, Frame, useCameraDevices, useFrameProcessor } from 'react-native-vision-camera';

import { RequestCameraPermission, Assessment} from 'xtravision-react-native';
import { CameraPermissionStatus} from 'xtravision-react-native';


export default function App() {

  const [hasPermission, setHasPermission] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const status = await RequestCameraPermission();
      setHasPermission(status === CameraPermissionStatus.AUTHORIZED);
    })();
  }, []);

   // required prop:
   const cameraPosition = "front";


    // function examplePlugin(frame: Frame): string[] {
    //   'worklet';
    //   if (!_WORKLET) throw new Error('examplePlugin must be called from a frame processor!');
    
    //   // @ts-expect-error because this function is dynamically injected by VisionCamera
    //   return __example_plugin(frame, 'hello!', 'parameter2', true, 42, { test: 0, second: 'test' }, ['another test', 5]);
    // }


    // const frameProcessor = useFrameProcessor((frame) => {
    //     'worklet';
    //     // const pose: any = scanPoseLandmarks(frame);
    //     // console.log("Pose", pose)
    //     console.log('hurree')
    
    //     const a = examplePlugin(frame)
    //     console.log(a);

    //     // runOnJS(poseFrameHandler)(pose, frame);
    //   }, []);

    // // if no camera found (front or back)
    // if (device == null) {   
    //     return <Text style={{color: 'red',fontWeight: 'bold'}}>Unable to detect camera.</Text>
    // }

 

  return (
    <View  style={styles.container}> 
      { hasPermission ? 
        (
          <>
            <Text>App has Permission</Text>     
            <Assessment 
              cameraPosition={cameraPosition}
              />
          </>
        ) : (
          <>
            <Text>App don't have Permission</Text>
          </>
        )
      }
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
