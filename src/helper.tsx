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

export const usePositionLine = (poseLine: any, valueName1: any, valueName2: any, cameraOption: string, width: number, paint: any) => {
  try {
    if (cameraOption === 'front') {
      const res = useAnimatedStyle(
        () => ({
          x1: width - poseLine.value[valueName1].x,
          y1: poseLine.value[valueName1].y,
          x2: width - poseLine.value[valueName2].x,
          y2: poseLine.value[valueName2].y,
          paint: paint,
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
        paint: paint
      } as any),
      [poseLine],
    );
    return res;
  } catch (e) { console.log(e) }
};

export const usePositionCircle = (poseCircle: any, valueName1: any, cameraOption: string, width: number, paint: any) => {
  try {
    if (cameraOption === 'front') {
      const res = useAnimatedStyle(
        () => ({
          cx: width - poseCircle.value[valueName1].x,
          cy: poseCircle.value[valueName1].y,
          r: 7,
          paint: paint,
        } as any),
        [poseCircle],
      );
      return res;
    }
    const res = useAnimatedStyle(
      () => ({
        cx: poseCircle.value[valueName1].x,
        cy: poseCircle.value[valueName1].y,
        r: 7,
        paint: paint,
      } as any),
      [poseCircle],
    );
    return res;
  } catch (e) { console.log(e) }
};

export const generateSkeletonLines = (poseLine: any, cameraPosition: any, width: any, paint: any) => {
  const leftPinkyFingerToleftWristPosition = usePositionLine(poseLine, 'leftPinkyFinger', 'leftWrist', cameraPosition, width, paint.left_Side_color);
  const leftIndexFingerToleftWristPosition = usePositionLine(poseLine, 'leftIndexFinger', 'leftWrist', cameraPosition, width, paint.left_Side_color);
  const leftWristToElbowPosition = usePositionLine(poseLine, 'leftWrist', 'leftElbow', cameraPosition, width, paint.left_Side_color);
  const leftElbowToShoulderPosition = usePositionLine(poseLine, 'leftElbow', 'leftShoulder', cameraPosition, width, paint.left_Side_color);
  const leftShoulderToHipPosition = usePositionLine(poseLine, 'leftShoulder', 'leftHip', cameraPosition, width, paint.left_Side_color);
  const leftHipToKneePosition = usePositionLine(poseLine, 'leftHip', 'leftKnee', cameraPosition, width, paint.left_Side_color);
  const leftKneeToAnklePosition = usePositionLine(poseLine, 'leftKnee', 'leftAnkle', cameraPosition, width, paint.left_Side_color);
  const leftAnkleToLeftHeel = usePositionLine(poseLine, 'leftAnkle', 'leftHeel', cameraPosition, width, paint.left_Side_color);
  const leftToeToLeftHeel = usePositionLine(poseLine, 'leftToe', 'leftHeel', cameraPosition, width, paint.left_Side_color);
  const leftThumbToLeftWrist = usePositionLine(poseLine, 'leftThumb', 'leftWrist', cameraPosition, width, paint.left_Side_color);
  const leftToeToLeftAnkle = usePositionLine(poseLine, 'leftToe', 'leftAnkle', cameraPosition, width, paint.left_Side_color);
  const leftEyeInnerToNosePosition = usePositionLine(poseLine, 'leftEyeInner', 'nose', cameraPosition, width, paint.left_Side_color);
  const leftEyeInnerToLeftEyeOuterPosition = usePositionLine(poseLine, 'leftEyeInner', 'leftEyeOuter', cameraPosition, width, paint.left_Side_color);
  const leftEyeOuterToLeftEarPosition = usePositionLine(poseLine, 'leftEyeOuter', 'leftEar', cameraPosition, width, paint.left_Side_color);


  const rightPinkyFingerToRightWristPosition = usePositionLine(poseLine, 'rightPinkyFinger', 'rightWrist', cameraPosition, width, paint.right_Side_color);
  const rightIndexFingerToRightWristPosition = usePositionLine(poseLine, 'rightIndexFinger', 'rightWrist', cameraPosition, width, paint.right_Side_color);
  const rightWristToElbowPosition = usePositionLine(poseLine, 'rightWrist', 'rightElbow', cameraPosition, width, paint.right_Side_color);
  const rightElbowToShoulderPosition = usePositionLine(poseLine, 'rightElbow', 'rightShoulder', cameraPosition, width, paint.right_Side_color);
  const rightShoulderToHipPosition = usePositionLine(poseLine, 'rightShoulder', 'rightHip', cameraPosition, width, paint.right_Side_color);
  const rightHipToKneePosition = usePositionLine(poseLine, 'rightHip', 'rightKnee', cameraPosition, width, paint.right_Side_color);
  const rightKneeToAnklePosition = usePositionLine(poseLine, 'rightKnee', 'rightAnkle', cameraPosition, width, paint.right_Side_color);
  const rightAnkleToRightHeel = usePositionLine(poseLine, 'rightAnkle', 'rightHeel', cameraPosition, width, paint.right_Side_color);
  const rightToeToRightHeel = usePositionLine(poseLine, 'rightToe', 'rightHeel', cameraPosition, width, paint.right_Side_color);
  const rightThumbToRightWrist = usePositionLine(poseLine, 'rightThumb', 'rightWrist', cameraPosition, width, paint.right_Side_color);
  const rightToeToRightAnkle = usePositionLine(poseLine, 'rightToe', 'rightAnkle', cameraPosition, width, paint.right_Side_color);
  const rightEyeInnerToNosePosition = usePositionLine(poseLine, 'rightEyeInner', 'nose', cameraPosition, width, paint.right_Side_color);
  const rightEyeInnerToRightEyeOuterPosition = usePositionLine(poseLine, 'rightEyeInner', 'rightEyeOuter', cameraPosition, width, paint.right_Side_color);
  const rightEyeOuterToRightEarPosition = usePositionLine(poseLine, 'rightEyeOuter', 'rightEar', cameraPosition, width, paint.left_Side_color);


  const shoulderToShoulderPosition = usePositionLine(poseLine, 'leftShoulder', 'rightShoulder', cameraPosition, width, 'white');
  const hipToHipPosition = usePositionLine(poseLine, 'leftHip', 'rightHip', cameraPosition, width, 'white');
  const mouthLeftToMouthRightPosition = usePositionLine(poseLine, 'mouthLeft', 'mouthRight', cameraPosition, width, 'white');


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
    hipToHipPosition,
    mouthLeftToMouthRightPosition,
    leftEyeInnerToNosePosition,
    rightEyeInnerToNosePosition,
    rightEyeInnerToRightEyeOuterPosition,
    leftEyeInnerToLeftEyeOuterPosition,
    rightEyeOuterToRightEarPosition,
    leftEyeOuterToLeftEarPosition
  ];
};

export const generateSkeletonCircle = (poseCircle: any, cameraPosition: any, width: any, paint: any) => {
  const leftEyeInner = usePositionCircle(poseCircle, 'leftEyeInner', cameraPosition, width, paint.left_Side_color);
  const leftEye = usePositionCircle(poseCircle, 'leftEye', cameraPosition, width, paint.left_Side_color);
  const leftEyeOuter = usePositionCircle(poseCircle, 'leftEyeOuter', cameraPosition, width, paint.left_Side_color);
  const leftEar = usePositionCircle(poseCircle, 'leftEar', cameraPosition, width, paint.left_Side_color);
  const mouthLeft = usePositionCircle(poseCircle, 'mouthLeft', cameraPosition, width, paint.left_Side_color);
  const leftShoulder = usePositionCircle(poseCircle, 'leftShoulder', cameraPosition, width, paint.left_Side_color);
  const leftElbow = usePositionCircle(poseCircle, 'leftElbow', cameraPosition, width, paint.left_Side_color);
  const leftWrist = usePositionCircle(poseCircle, 'leftWrist', cameraPosition, width, paint.left_Side_color);
  const leftHip = usePositionCircle(poseCircle, 'leftHip', cameraPosition, width, paint.left_Side_color);
  const leftKnee = usePositionCircle(poseCircle, 'leftKnee', cameraPosition, width, paint.left_Side_color);
  const leftAnkle = usePositionCircle(poseCircle, 'leftAnkle', cameraPosition, width, paint.left_Side_color);
  const leftPinkyFinger = usePositionCircle(poseCircle, 'leftPinkyFinger', cameraPosition, width, paint.left_Side_color);
  const leftIndexFinger = usePositionCircle(poseCircle, 'leftIndexFinger', cameraPosition, width, paint.left_Side_color);
  const leftThumb = usePositionCircle(poseCircle, 'leftThumb', cameraPosition, width, paint.left_Side_color);
  const leftHeel = usePositionCircle(poseCircle, 'leftHeel', cameraPosition, width, paint.left_Side_color);
  const leftToe = usePositionCircle(poseCircle, 'leftToe', cameraPosition, width, paint.left_Side_color);

  const rightShoulder = usePositionCircle(poseCircle, 'rightShoulder', cameraPosition, width, paint.right_Side_color);
  const rightElbow = usePositionCircle(poseCircle, 'rightElbow', cameraPosition, width, paint.right_Side_color);
  const rightWrist = usePositionCircle(poseCircle, 'rightWrist', cameraPosition, width, paint.right_Side_color);
  const rightHip = usePositionCircle(poseCircle, 'rightHip', cameraPosition, width, paint.right_Side_color);
  const rightKnee = usePositionCircle(poseCircle, 'rightKnee', cameraPosition, width, paint.right_Side_color);
  const rightAnkle = usePositionCircle(poseCircle, 'rightAnkle', cameraPosition, width, paint.right_Side_color);
  const rightPinkyFinger = usePositionCircle(poseCircle, 'rightPinkyFinger', cameraPosition, width, paint.right_Side_color);
  const rightIndexFinger = usePositionCircle(poseCircle, 'rightIndexFinger', cameraPosition, width, paint.right_Side_color);
  const rightThumb = usePositionCircle(poseCircle, 'rightThumb', cameraPosition, width, paint.right_Side_color);
  const rightHeel = usePositionCircle(poseCircle, 'rightHeel', cameraPosition, width, paint.right_Side_color);
  const rightToe = usePositionCircle(poseCircle, 'rightToe', cameraPosition, width, paint.right_Side_color);
  const rightEyeInner = usePositionCircle(poseCircle, 'rightEyeInner', cameraPosition, width, paint.right_Side_color);
  const rightEye = usePositionCircle(poseCircle, 'rightEye', cameraPosition, width, paint.right_Side_color);
  const rightEyeOuter = usePositionCircle(poseCircle, 'rightEyeOuter', cameraPosition, width, paint.right_Side_color);
  const rightEar = usePositionCircle(poseCircle, 'rightEar', cameraPosition, width, paint.right_Side_color);
  const mouthRight = usePositionCircle(poseCircle, 'mouthRight', cameraPosition, width, paint.right_Side_color);

  const nose = usePositionCircle(poseCircle, 'nose', cameraPosition, width, 'white');

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
    leftPinkyFinger,
    rightPinkyFinger,
    leftIndexFinger,
    rightIndexFinger,
    leftThumb,
    rightThumb,
    leftHeel,
    rightHeel,
    leftToe,
    rightToe,

    nose,
    leftEyeInner,
    leftEye,
    leftEyeOuter,
    rightEyeInner,
    rightEye,
    rightEyeOuter,
    leftEar,
    rightEar,
    mouthLeft,
    mouthRight,
  ]
};
