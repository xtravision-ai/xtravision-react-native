# xtravision-react-native
"xtravision-react-native" SDK allows you to quickly and easily use the [xtravision.ai](https://xtravision.ai/) APIs via React Native.


## Installation
Use the following command to install SDK and its dependencies.
```sh
yarn add react-native-reanimated@2.10.0 react-native-vision-camera@2.13.0 @xtravision/xtravision-react-native
```

Add the required plugin to your babel.config.js:
```js
module.exports = {
    plugins: [
        [
            'react-native-reanimated/plugin',
            {
                globals: ['__scanPoseLandmarks'],
            },
        ],
        // others
    ]
}
```
> Note: You have to restart metro-bundler for changes in the babel.config.js file to take effect.


## Usage

```js
// Import required things
import { RequestCameraPermission, Assessment} from '@xtravision/xtravision-react-native';
import {CameraPermissionStatus} from '@xtravision/xtravision-react-native';

export default function App() {
  const [hasPermission, setHasPermission] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const status = await RequestCameraPermission();
      setHasPermission(status === CameraPermissionStatus.AUTHORIZED);
    })();
  }, []);

  
  // Callback to handle server response
  function onServerResponse(serverResponse: any): void {
    if (serverResponse.errors.length) {
      console.error('Server Error Response:', serverResponse.errors);
      return;
    }

    console.log('Server Data:', serverResponse.data);
  }

  // required prop:
  const authToken = '__AUTH-TOKEN__';
  const assessmentName = '__ASSESSMENT_NAME__';
  const cameraPosition = 'back' as "front" | "back"; //  which camara you want to use
  let assessment_config = {} as any;
  let user_config = {} as any;

  // add the required parameters for the test you want

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
    <View style={styles.container}>
      {hasPermission ? (
        <>
          <Assessment
            connectionData={connectionData}
            requestData={requestData}
            libData={libData}
          />
        </>
      ) : (
        <>
          <Text>App don't have Camera Permission</Text>
        </>
      )}
    </View>
  );
}
```


### Assessment List
1. PUSH_UPS
2. SIT_UPS
3. V_SIT_AND_REACH

> Tested with Node:v16.10.0 and react-native: v0.68.2

## License
MIT

---