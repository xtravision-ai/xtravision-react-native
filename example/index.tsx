import { AppRegistry } from 'react-native';

 if (__DEV__) {
    require('basil-ws-flipper').wsDebugPlugin;
  }

import App from './src/App';

AppRegistry.registerComponent('main', () => App);
