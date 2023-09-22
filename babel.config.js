module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      // { 
      //   globals: ['scanPoseLandmarks'],
      // },
      'react-native-reanimated/plugin',
    ],
    ['react-native-worklets-core/plugin'],
  ],
};
