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

export const buildSkeletonLines = (poseData: any, cameraPosition: any, width: any, paint: any) => {

  const leftPinkyFingerToLeftWristPosition = getSkeletonLine(poseData, 18, 15, cameraPosition, width, paint.left_Side_color);
  const leftIndexFingerToLeftWristPosition = getSkeletonLine(poseData, 19, 15, cameraPosition, width, paint.left_Side_color);

  const leftWristToElbowPosition = getSkeletonLine(poseData, 15, 13, cameraPosition, width, paint.left_Side_color);
  const leftElbowToShoulderPosition = getSkeletonLine(poseData, 13, 11, cameraPosition, width, paint.left_Side_color);
  const leftShoulderToHipPosition = getSkeletonLine(poseData, 11, 23, cameraPosition, width, paint.left_Side_color);
  const leftHipToKneePosition = getSkeletonLine(poseData, 23, 25, cameraPosition, width, paint.left_Side_color);
  const leftKneeToAnklePosition = getSkeletonLine(poseData, 25, 27, cameraPosition, width, paint.left_Side_color);
  const leftAnkleToLeftHeel = getSkeletonLine(poseData, 27, 29, cameraPosition, width, paint.left_Side_color);
  const leftToeToLeftHeel = getSkeletonLine(poseData, 31, 29, cameraPosition, width, paint.left_Side_color);
  const leftThumbToLeftWrist = getSkeletonLine(poseData, 21, 15, cameraPosition, width, paint.left_Side_color);
  const leftToeToLeftAnkle = getSkeletonLine(poseData, 31, 27, cameraPosition, width, paint.left_Side_color);
  const leftEyeInnerToNosePosition = getSkeletonLine(poseData, 1, 0, cameraPosition, width, paint.left_Side_color);
  const leftEyeInnerToLeftEyeOuterPosition = getSkeletonLine(poseData, 1, 3, cameraPosition, width, paint.left_Side_color);
  const leftEyeOuterToLeftEarPosition = getSkeletonLine(poseData, 3, 7, cameraPosition, width, paint.left_Side_color);


  const rightPinkyFingerToRightWristPosition = getSkeletonLine(poseData, 18, 16, cameraPosition, width, paint.right_Side_color);
  const rightIndexFingerToRightWristPosition = getSkeletonLine(poseData, 20, 16, cameraPosition, width, paint.right_Side_color);
  const rightWristToElbowPosition = getSkeletonLine(poseData, 16, 14, cameraPosition, width, paint.right_Side_color);
  const rightElbowToShoulderPosition = getSkeletonLine(poseData, 14, 12, cameraPosition, width, paint.right_Side_color);
  const rightShoulderToHipPosition = getSkeletonLine(poseData, 12, 24, cameraPosition, width, paint.right_Side_color);
  const rightHipToKneePosition = getSkeletonLine(poseData, 24, 26, cameraPosition, width, paint.right_Side_color);
  const rightKneeToAnklePosition = getSkeletonLine(poseData, 26, 28, cameraPosition, width, paint.right_Side_color);
  const rightAnkleToRightHeel = getSkeletonLine(poseData, 28, 30, cameraPosition, width, paint.right_Side_color);
  const rightToeToRightHeel = getSkeletonLine(poseData, 32, 30, cameraPosition, width, paint.right_Side_color);
  const rightThumbToRightWrist = getSkeletonLine(poseData, 22, 16, cameraPosition, width, paint.right_Side_color);
  const rightToeToRightAnkle = getSkeletonLine(poseData, 32, 28, cameraPosition, width, paint.right_Side_color);
  const rightEyeInnerToNosePosition = getSkeletonLine(poseData, 4, 0, cameraPosition, width, paint.right_Side_color);
  const rightEyeInnerToRightEyeOuterPosition = getSkeletonLine(poseData, 4, 6, cameraPosition, width, paint.right_Side_color);
  const rightEyeOuterToRightEarPosition = getSkeletonLine(poseData, 6, 8, cameraPosition, width, paint.left_Side_color);

  const shoulderToShoulderPosition = getSkeletonLine(poseData, 11, 12, cameraPosition, width, 'white');
  const hipToHipPosition = getSkeletonLine(poseData, 23, 24, cameraPosition, width, 'white');
  const mouthLeftToMouthRightPosition = getSkeletonLine(poseData, 9, 10, cameraPosition, width, 'white');

  return [
    leftPinkyFingerToLeftWristPosition,
    leftIndexFingerToLeftWristPosition,
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
export const getSkeletonLine = (poseLine: any, fromIndex: any, toIndex: any, cameraOption: string, width: number, paint: any) => {
  try {
    if (cameraOption === 'front') {
      const res = useAnimatedStyle(
        () => ({
          x1: width - poseLine[fromIndex].x,
          y1: poseLine[fromIndex].y,
          x2: width - poseLine[toIndex].x,
          y2: poseLine[toIndex].y,
          paint: paint,
        } as any),
        [poseLine],
      );
      return res;
    }
    const res = useAnimatedStyle(
      () => ({
        x1: poseLine[fromIndex].x,
        y1: poseLine[fromIndex].y,
        x2: poseLine[toIndex].x,
        y2: poseLine[toIndex].y,
        paint: paint
      } as any),
      [poseLine],
    );
    return res;
  } catch (e) { console.error(e) }
};


export const usePositionLine = (poseLine: any, labelName1: any, labelName2: any, cameraOption: string, width: number, paint: any) => {
  try {
    if (cameraOption === 'front') {
      const res = useAnimatedStyle(
        () => ({
          x1: width - poseLine[labelName1].x,
          y1: poseLine[labelName1].y,
          x2: width - poseLine[labelName2].x,
          y2: poseLine[labelName2].y,
          paint: paint,
        } as any),
        [poseLine],
      );
      return res;
    }
    const res = useAnimatedStyle(
      () => ({
        x1: poseLine[labelName1].x,
        y1: poseLine[labelName1].y,
        x2: poseLine[labelName2].x,
        y2: poseLine[labelName2].y,
        paint: paint
      } as any),
      [poseLine],
    );
    return res;
  } catch (e) { console.error(e) }
};

export const usePositionCircle = (poseCircle: any, labelName: any, cameraOption: string, width: number, paint: any) => {
  try {
    if (cameraOption === 'front') {
      const res = useAnimatedStyle(
        () => ({
          cx: width - poseCircle[labelName].x,
          cy: poseCircle[labelName].y,
          r: 7,
          paint: paint,
        } as any),
        [poseCircle],
      );
      return res;
    }
    const res = useAnimatedStyle(
      () => ({
        cx: poseCircle[labelName].x,
        cy: poseCircle[labelName].y,
        r: 7,
        paint: paint,
      } as any),
      [poseCircle],
    );
    return res;
  } catch (e) { 
    console.error(e) 
  }
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


  if (!poseCircle){
    return [];

  }

  // const leftEyeInner = usePositionCircle(poseCircle, 'leftEyeInner', cameraPosition, width, paint.left_Side_color);
  // const leftEye = usePositionCircle(poseCircle, 'leftEye', cameraPosition, width, paint.left_Side_color);
  // const leftEyeOuter = usePositionCircle(poseCircle, 'leftEyeOuter', cameraPosition, width, paint.left_Side_color);
  // const leftEar = usePositionCircle(poseCircle, 'leftEar', cameraPosition, width, paint.left_Side_color);
  // const mouthLeft = usePositionCircle(poseCircle, 'mouthLeft', cameraPosition, width, paint.left_Side_color);
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
  
  // const rightEyeInner = usePositionCircle(poseCircle, 'rightEyeInner', cameraPosition, width, paint.right_Side_color);
  // const rightEye = usePositionCircle(poseCircle, 'rightEye', cameraPosition, width, paint.right_Side_color);
  // const rightEyeOuter = usePositionCircle(poseCircle, 'rightEyeOuter', cameraPosition, width, paint.right_Side_color);
  // const rightEar = usePositionCircle(poseCircle, 'rightEar', cameraPosition, width, paint.right_Side_color);
  // const mouthRight = usePositionCircle(poseCircle, 'mouthRight', cameraPosition, width, paint.right_Side_color);
  // const nose = usePositionCircle(poseCircle, 'nose', cameraPosition, width, 'white');

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

    // nose,
    // leftEyeInner,
    // leftEye,
    // leftEyeOuter,
    // rightEyeInner,
    // rightEye,
    // rightEyeOuter,
    // leftEar,
    // rightEar,
    // mouthLeft,
    // mouthRight,
  ]
};
