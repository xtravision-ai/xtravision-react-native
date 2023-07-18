# xtravision-react-native
"xtravision-react-native" SDK allows you to quickly and easily use the [xtravision.ai](https://xtravision.ai/) APIs via React Native.


## Installation
Use the following command to install SDK and its dependencies.
```sh
yarn add react-native-reanimated@^2.10.0 react-native-vision-camera@^2.15.4 @xtravision/xtravision-react-native@3.0.0
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
> Note: You have to restart metro-bundler for changes in the babel.config.js file to take effect. Best practice to start metro server with `--reset-cache`


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
  const authToken = '__AUTH-TOKEN__'; //IMP: user specific auth token
  const assessmentName = '__ASSESSMENT_NAME__';
  const cameraPosition = 'back'; // front or back


  const connectionData = {
    assessment_name: assessmentName,
    auth_token: authToken,
    assessment_config: {},  // check document for more details
    user_config:{}, // check document for more details
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



> Tested with Node:v16.14.0 and react-native: v0.71.0
> Make sure you have added `kotlinVersion = "1.7.0"` (under buildToolsVersion) to `android/build.gradle`
> Currently it's supporting only android devices only 

## License
MIT

---