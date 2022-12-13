import _ from 'lodash';
import { useAnimatedStyle } from 'react-native-reanimated';
import type { Frame } from 'react-native-vision-camera';
import { Camera } from 'react-native-vision-camera';

export function scanPoseLandmarks(frame: Frame) {
  'worklet';
  // IMP: DO NOT PUT ANY JS CODE HERE
  if (!_WORKLET) throw new Error('ScanPoseLandmarks method must be called from a frame processor!');

  // @ts-expect-error Frame Processors are not typed.
  return __scanPoseLandmarks(frame);
}

export async function RequestCameraPermission() {
  return await Camera.requestCameraPermission()
}

export const usePositionLine = (poseLine: any, valueName1: any, valueName2: any, cameraOption: string, width: number) => {
  try {
    if (cameraOption === 'front') {
      const res = useAnimatedStyle(
        () => ({
          x1: width - poseLine.value[valueName1].x,
          y1: poseLine.value[valueName1].y,
          x2: width - poseLine.value[valueName2].x,
          y2: poseLine.value[valueName2].y,
        } as any),
        [poseLine],
      );
      return res;
    }
    const res = useAnimatedStyle(
      () => ({
        x1: poseLine.value[valueName1].x,
        y1: poseLine.value[valueName1].y,
        x2: poseLine.value[valueName2].x,
        y2: poseLine.value[valueName2].y,
      } as any),
      [poseLine],
    );
    return res;
  } catch (e) { console.log(e) }
};

export const usePositionCircle = (poseCircle: any, valueName1: any, cameraOption: string, width: number) => {
  if (_.isUndefined(poseCircle[valueName1])) console.log(valueName1);
  // try {
  //   if (cameraOption === 'front') {
  //     const res = useAnimatedStyle(
  //       () => ({
  //         cx: width - poseCircle.value[valueName1].x,
  //         cy: poseCircle.value[valueName1].y,
  //         r: 20,
  //       } as any),
  //       [poseCircle],
  //     );
  //     return res;
  //   }
  //   const res = useAnimatedStyle(
  //     () => ({
  //       cx: poseCircle.value[valueName1].x,
  //       cy: poseCircle.value[valueName1].y,
  //       r: 20,
  //     } as any),
  //     [poseCircle],
  //   );

  //   return res;
  // } catch (e) { console.log(e) }
};

export const generateSkeletonLines = (poseLine: any, cameraPosition: any, width: any) => {
  const leftPinkyFingerToleftWristPosition = usePositionLine(poseLine, 'leftPinkyFinger', 'leftWrist', cameraPosition, width);
  const leftIndexFingerToleftWristPosition = usePositionLine(poseLine, 'leftIndexFinger', 'leftWrist', cameraPosition, width);
  const leftWristToElbowPosition = usePositionLine(poseLine, 'leftWrist', 'leftElbow', cameraPosition, width);
  const leftElbowToShoulderPosition = usePositionLine(poseLine, 'leftElbow', 'leftShoulder', cameraPosition, width);
  const leftShoulderToHipPosition = usePositionLine(poseLine, 'leftShoulder', 'leftHip', cameraPosition, width);
  const leftHipToKneePosition = usePositionLine(poseLine, 'leftHip', 'leftKnee', cameraPosition, width);
  const leftKneeToAnklePosition = usePositionLine(poseLine, 'leftKnee', 'leftAnkle', cameraPosition, width);
  const leftAnkleToLeftHeel = usePositionLine(poseLine, 'leftAnkle', 'leftHeel', cameraPosition, width);
  const leftToeToLeftHeel = usePositionLine(poseLine, 'leftToe', 'leftHeel', cameraPosition, width);
  const leftThumbToLeftWrist = usePositionLine(poseLine, 'leftThumb', 'leftWrist', cameraPosition, width);
  const leftToeToLeftAnkle = usePositionLine(poseLine, 'leftToe', 'leftAnkle', cameraPosition, width);
  const rightPinkyFingerToRightWristPosition = usePositionLine(poseLine, 'rightPinkyFinger', 'rightWrist', cameraPosition, width);
  const rightIndexFingerToRightWristPosition = usePositionLine(poseLine, 'rightIndexFinger', 'rightWrist', cameraPosition, width);
  const rightWristToElbowPosition = usePositionLine(poseLine, 'rightWrist', 'rightElbow', cameraPosition, width);
  const rightElbowToShoulderPosition = usePositionLine(poseLine, 'rightElbow', 'rightShoulder', cameraPosition, width);
  const rightShoulderToHipPosition = usePositionLine(poseLine, 'rightShoulder', 'rightHip', cameraPosition, width);
  const rightHipToKneePosition = usePositionLine(poseLine, 'rightHip', 'rightKnee', cameraPosition, width);
  const rightKneeToAnklePosition = usePositionLine(poseLine, 'rightKnee', 'rightAnkle', cameraPosition, width);
  const rightAnkleToRightHeel = usePositionLine(poseLine, 'rightAnkle', 'rightHeel', cameraPosition, width);
  const rightToeToRightHeel = usePositionLine(poseLine, 'rightToe', 'rightHeel', cameraPosition, width);
  const rightThumbToRightWrist = usePositionLine(poseLine, 'rightThumb', 'rightWrist', cameraPosition, width);
  const rightToeToRightAnkle = usePositionLine(poseLine, 'rightToe', 'rightAnkle', cameraPosition, width);

  const shoulderToShoulderPosition = usePositionLine(poseLine, 'leftShoulder', 'rightShoulder', cameraPosition, width);
  const hipToHipPosition = usePositionLine(poseLine, 'leftHip', 'rightHip', cameraPosition, width);

  return [
    leftPinkyFingerToleftWristPosition,
    leftIndexFingerToleftWristPosition,
    leftWristToElbowPosition,
    leftElbowToShoulderPosition,
    leftShoulderToHipPosition,
    leftHipToKneePosition,
    leftKneeToAnklePosition,
    leftAnkleToLeftHeel,
    leftToeToLeftHeel,
    leftThumbToLeftWrist,
    leftToeToLeftAnkle,
    rightPinkyFingerToRightWristPosition,
    rightIndexFingerToRightWristPosition,
    rightWristToElbowPosition,
    rightElbowToShoulderPosition,
    rightShoulderToHipPosition,
    rightHipToKneePosition,
    rightKneeToAnklePosition,
    rightAnkleToRightHeel,
    rightToeToRightHeel,
    rightThumbToRightWrist,
    rightToeToRightAnkle,
    shoulderToShoulderPosition,
    hipToHipPosition
  ];
};

export const generateSkeletonCircle = (poseCircle: any, cameraPosition: any, width: any) => {
  const leftShoulder = usePositionCircle(poseCircle, 'leftShoulder', cameraPosition, width);
  const rightShoulder = usePositionCircle(poseCircle, 'rightShoulder', cameraPosition, width);
  const leftElbow = usePositionCircle(poseCircle, 'leftElbow', cameraPosition, width);
  const rightElbow = usePositionCircle(poseCircle, 'rightElbow', cameraPosition, width);
  const leftWrist = usePositionCircle(poseCircle, 'leftWrist', cameraPosition, width);
  const rightWrist = usePositionCircle(poseCircle, 'rightWrist', cameraPosition, width);
  const leftHip = usePositionCircle(poseCircle, 'leftHip', cameraPosition, width);
  const rightHip = usePositionCircle(poseCircle, 'rightHip', cameraPosition, width);
  const leftKnee = usePositionCircle(poseCircle, 'leftKnee', cameraPosition, width);
  const rightKnee = usePositionCircle(poseCircle, 'rightKnee', cameraPosition, width);
  const leftAnkle = usePositionCircle(poseCircle, 'leftAnkle', cameraPosition, width);
  const rightAnkle = usePositionCircle(poseCircle, 'rightAnkle', cameraPosition, width);

  const leftPinky = usePositionCircle(poseCircle, 'leftPinky', cameraPosition, width);
  const rightPinky = usePositionCircle(poseCircle, 'rightPinky', cameraPosition, width);
  const leftIndex = usePositionCircle(poseCircle, 'leftIndex', cameraPosition, width);
  const rightIndex = usePositionCircle(poseCircle, 'rightIndex', cameraPosition, width);
  const leftThumb = usePositionCircle(poseCircle, 'leftThumb', cameraPosition, width);
  const rightThumb = usePositionCircle(poseCircle, 'rightThumb', cameraPosition, width);
  const leftHeel = usePositionCircle(poseCircle, 'leftHeel', cameraPosition, width);
  const rightHeel = usePositionCircle(poseCircle, 'rightHeel', cameraPosition, width);
  const leftFootIndex = usePositionCircle(poseCircle, 'leftFootIndex', cameraPosition, width);
  const rightFootIndex = usePositionCircle(poseCircle, 'rightFootIndex', cameraPosition, width);

  //todo: match undefined values to the getDefaultvalues 

  // leftPinky      
  // rightPinky     
  // leftIndex      
  // rightIndex     
  // leftFootIndex  
  // rightFootIndex 
  // leftPinky      
  // rightPinky     
  // leftIndex      
  // rightIndex     
  // leftFootIndex  
  // rightFootIndex 
  // leftPinky      
  // rightPinky     
  // leftIndex      
  // rightIndex     
  // leftFootIndex  
  // rightFootIndex 

  return [
    leftShoulder,
    rightShoulder,
    leftElbow,
    rightElbow,
    leftWrist,
    rightWrist,
    leftHip,
    rightHip,
    leftKnee,
    rightKnee,
    leftAnkle,
    rightAnkle,
    leftPinky,
    rightPinky,
    leftIndex,
    rightIndex,
    leftThumb,
    rightThumb,
    leftHeel,
    rightHeel,
    leftFootIndex,
    rightFootIndex,
  ]
};
