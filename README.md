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
  const cameraPosition = 'back'; // front or back

  return (
    <View style={styles.container}>
      {hasPermission ? (
        <>
          <Assessment
            cameraPosition={cameraPosition}
            connection={{authToken, queryParams: {}}}
            assessment={assessmentName}
            isEducationScreen={false}
            onServerResponse={onServerResponse}
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
4. SIDE_FLAMINGO
5. PLATE_TAPPING_COORDINATION, 
6. PARTIAL_CURL_UP

> Tested with Node:v16.10.0 and react-native: v0.68.2

## License
MIT

---