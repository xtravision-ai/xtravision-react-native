/**
 * use this file to formate "google ml" pose landmarks to xtra-backend server format
 */
import * as _ from "lodash"
import type { Frame } from "react-native-vision-camera";



/* @ts-ignore:next-line  */
export function createNormalizedArray(keyPoint: any, frame: Frame, factors: any) {
  'worklet';

  if (!keyPoint || keyPoint.visibility < 0.3) {
    return { x: 0, y: 0, z: 0, visibility: 0.0 };
  }
  // if (_.isEmpty(keyPoint) || keyPoint.visibility < 0.3) {
  //   return { x: 0, y: 0, z: 0, visibility: 0.0 };
  // }
  // return {
  //   x: keyPoint.x * factors.xFactor,
  //   y: keyPoint.y * factors.xFactor,
  //   z: keyPoint.z * factors.xFactor,
  //   visibility: keyPoint.visibility,
  // };

  return {
    x: keyPoint.x / frame.width,
    y: keyPoint.y / frame.height,
    z: keyPoint.z / frame.width,
    visibility: keyPoint.visibility,
  };
}

export function getNormalizedArray(poseKeyPoints: any, frame: any, dimensions: any) {
  const xFactor = dimensions.width / frame.width;
  const yFactor = dimensions.height / frame.height;
  const factors = { xFactor, yFactor }

  // Array of 33 key points 
  return [
    createNormalizedArray(poseKeyPoints.nose, frame, factors),
    createNormalizedArray(poseKeyPoints.leftEyeInner, frame, factors),
    createNormalizedArray(poseKeyPoints.leftEye, frame, factors),
    createNormalizedArray(poseKeyPoints.leftEyeOuter, frame, factors),
    createNormalizedArray(poseKeyPoints.rightEyeInner, frame, factors),
    createNormalizedArray(poseKeyPoints.rightEye, frame, factors),
    createNormalizedArray(poseKeyPoints.rightEyeOuter, frame, factors),
    createNormalizedArray(poseKeyPoints.leftEar, frame, factors),
    createNormalizedArray(poseKeyPoints.rightEar, frame, factors),
    createNormalizedArray(poseKeyPoints.mouthLeft, frame, factors),
    createNormalizedArray(poseKeyPoints.mouthRight, frame, factors),
    createNormalizedArray(poseKeyPoints.leftShoulder, frame, factors),
    createNormalizedArray(poseKeyPoints.rightShoulder, frame, factors),
    createNormalizedArray(poseKeyPoints.leftElbow, frame, factors),
    createNormalizedArray(poseKeyPoints.rightElbow, frame, factors),
    createNormalizedArray(poseKeyPoints.leftWrist, frame, factors),
    createNormalizedArray(poseKeyPoints.rightWrist, frame, factors),
    createNormalizedArray(poseKeyPoints.leftPinkyFinger, frame, factors),
    createNormalizedArray(poseKeyPoints.rightPinkyFinger, frame, factors),
    createNormalizedArray(poseKeyPoints.leftIndexFinger, frame, factors),
    createNormalizedArray(poseKeyPoints.rightIndexFinger, frame, factors),
    createNormalizedArray(poseKeyPoints.leftThumb, frame, factors),
    createNormalizedArray(poseKeyPoints.rightThumb, frame, factors),
    createNormalizedArray(poseKeyPoints.leftHip, frame, factors),
    createNormalizedArray(poseKeyPoints.rightHip, frame, factors),
    createNormalizedArray(poseKeyPoints.leftKnee, frame, factors),
    createNormalizedArray(poseKeyPoints.rightKnee, frame, factors),
    createNormalizedArray(poseKeyPoints.leftAnkle, frame, factors),
    createNormalizedArray(poseKeyPoints.rightAnkle, frame, factors),
    createNormalizedArray(poseKeyPoints.leftHeel, frame, factors),
    createNormalizedArray(poseKeyPoints.rightHeel, frame, factors),
    createNormalizedArray(poseKeyPoints.leftToe, frame, factors),
    createNormalizedArray(poseKeyPoints.rightToe, frame, factors),
  ]

}

export function getDefaultObject() {
  'worklet';
  // IMP: DO NOT change any sequence
  return {
    nose: { x: 0, y: 0, z: 0, visibility: 0.0 }, // Index - 0  for nose
    leftEyeInner: { x: 0, y: 0, z: 0, visibility: 0.0 }, // Index - 1 for leftEyeInner
    leftEye: { x: 0, y: 0, z: 0, visibility: 0.0 }, // Index - 2 for leftEye
    leftEyeOuter: { x: 0, y: 0, z: 0, visibility: 0.0 }, // Index - 3 for leftEyeOuter
    rightEyeInner: { x: 0, y: 0, z: 0, visibility: 0.0 }, // Index - 4 for rightEyeInner
    rightEye: { x: 0, y: 0, z: 0, visibility: 0.0 }, // Index - 5 for rightEye
    rightEyeOuter: { x: 0, y: 0, z: 0, visibility: 0.0 }, // Index - 6 for rightEyeOuter
    leftEar: { x: 0, y: 0, z: 0, visibility: 0.0 }, // Index - 7 for leftEar
    rightEar: { x: 0, y: 0, z: 0, visibility: 0.0 }, // Index - 8 for rightEar
    mouthLeft: { x: 0, y: 0, z: 0, visibility: 0.0 }, // Index - 9 for mouthLeft
    mouthRight: { x: 0, y: 0, z: 0, visibility: 0.0 }, // Index - 10 for mouthRight
    leftShoulder: { x: 0, y: 0, z: 0, visibility: 0.0 }, // Index - 11 for leftShoulder
    rightShoulder: { x: 0, y: 0, z: 0, visibility: 0.0 }, // Index - 12 for rightShoulder
    leftElbow: { x: 0, y: 0, z: 0, visibility: 0.0 }, // Index - 13 for leftElbow
    rightElbow: { x: 0, y: 0, z: 0, visibility: 0.0 }, // Index - 14 for rightElbow
    leftWrist: { x: 0, y: 0, z: 0, visibility: 0.0 }, // Index - 15 for leftWrist
    rightWrist: { x: 0, y: 0, z: 0, visibility: 0.0 }, // Index - 16 for rightWrist
    leftPinkyFinger: { x: 0, y: 0, z: 0, visibility: 0.0 }, // Index - 17 for leftPinkyFinger
    rightPinkyFinger: { x: 0, y: 0, z: 0, visibility: 0.0 }, // Index - 18 for rightPinkyFinger
    leftIndexFinger: { x: 0, y: 0, z: 0, visibility: 0.0 }, // Index - 19 for leftIndexFinger
    rightIndexFinger: { x: 0, y: 0, z: 0, visibility: 0.0 }, // Index - 20 for rightIndexFinger
    leftThumb: { x: 0, y: 0, z: 0, visibility: 0.0 }, // Index - 21 for leftThumb
    rightThumb: { x: 0, y: 0, z: 0, visibility: 0.0 }, // Index - 22 for rightThumb
    leftHip: { x: 0, y: 0, z: 0, visibility: 0.0 }, // Index - 23 for leftHip
    rightHip: { x: 0, y: 0, z: 0, visibility: 0.0 }, // Index - 24 for rightHip
    leftKnee: { x: 0, y: 0, z: 0, visibility: 0.0 }, // Index - 25 for leftKnee
    rightKnee: { x: 0, y: 0, z: 0, visibility: 0.0 }, // Index - 26 for rightKnee
    leftAnkle: { x: 0, y: 0, z: 0, visibility: 0.0 }, // Index - 27 for leftAnkle
    rightAnkle: { x: 0, y: 0, z: 0, visibility: 0.0 }, // Index - 28 for rightAnkle
    leftHeel: { x: 0, y: 0, z: 0, visibility: 0.0 }, // Index - 29 for leftHeel
    rightHeel: { x: 0, y: 0, z: 0, visibility: 0.0 }, // Index - 30 for rightHeel
    leftToe: { x: 0, y: 0, z: 0, visibility: 0.0 }, // Index - 31 for leftToe
    rightToe: { x: 0, y: 0, z: 0, visibility: 0.0 } // Index - 32 for rightToe
  }
  
}
