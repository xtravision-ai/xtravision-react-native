import * as React from 'react';

import { StyleSheet, View, Text, } from 'react-native';
import { multiply, RequestCameraPermission, Assessment} from 'xtravision-react-native';

export default function App() {
  const [result, setResult] = React.useState<number | undefined>();

  const [hasPermission, setHasPermission] = React.useState(false);


  React.useEffect(() => {
    (async () => {
      const status = await RequestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);


  React.useEffect(() => {
    multiply(3, 7).then(setResult);
  }, []);

  return (
    <View  style={styles.container}> 
      { hasPermission ? 
        (
          <>
            <Text>App has Permission</Text>
            <Assessment cameraPosition={'front'}></Assessment> 
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
  }
});
