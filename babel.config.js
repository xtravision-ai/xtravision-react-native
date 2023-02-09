module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      { 
        globals: ['__scanPoseLandmarks'],
      },
      'react-native-reanimated/plugin',
    ],
  ],
};
