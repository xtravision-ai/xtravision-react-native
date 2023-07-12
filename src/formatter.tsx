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
    //------------ Start from 0 index
    nose: { x: 0, y: 0, z: 0, visibility: 0.0 },
    leftEyeInner: { x: 0, y: 0, z: 0, visibility: 0.0 },
    leftEye: { x: 0, y: 0, z: 0, visibility: 0.0 },
    leftEyeOuter: { x: 0, y: 0, z: 0, visibility: 0.0 },
    rightEyeInner: { x: 0, y: 0, z: 0, visibility: 0.0 },
    //------------ Start from 5 index
    rightEye: { x: 0, y: 0, z: 0, visibility: 0.0 },
    rightEyeOuter: { x: 0, y: 0, z: 0, visibility: 0.0 },
    leftEar: { x: 0, y: 0, z: 0, visibility: 0.0 },
    rightEar: { x: 0, y: 0, z: 0, visibility: 0.0 },
    mouthLeft: { x: 0, y: 0, z: 0, visibility: 0.0 },
    //------------ Start from 10 index
    mouthRight: { x: 0, y: 0, z: 0, visibility: 0.0 },
    leftShoulder: { x: 0, y: 0, z: 0, visibility: 0.0 },
    rightShoulder: { x: 0, y: 0, z: 0, visibility: 0.0 },
    leftElbow: { x: 0, y: 0, z: 0, visibility: 0.0 },
    rightElbow: { x: 0, y: 0, z: 0, visibility: 0.0 },
    //------------ Start from 15 index
    leftWrist: { x: 0, y: 0, z: 0, visibility: 0.0 },
    rightWrist: { x: 0, y: 0, z: 0, visibility: 0.0 },
    leftPinkyFinger: { x: 0, y: 0, z: 0, visibility: 0.0 },
    rightPinkyFinger: { x: 0, y: 0, z: 0, visibility: 0.0 },
    leftIndexFinger: { x: 0, y: 0, z: 0, visibility: 0.0 },
    //------------ Start from 20 index
    rightIndexFinger: { x: 0, y: 0, z: 0, visibility: 0.0 },
    leftThumb: { x: 0, y: 0, z: 0, visibility: 0.0 },
    rightThumb: { x: 0, y: 0, z: 0, visibility: 0.0 },
    leftHip: { x: 0, y: 0, z: 0, visibility: 0.0 },
    rightHip: { x: 0, y: 0, z: 0, visibility: 0.0 },
    //------------ Start from 25 index
    leftKnee: { x: 0, y: 0, z: 0, visibility: 0.0 },
    rightKnee: { x: 0, y: 0, z: 0, visibility: 0.0 },
    leftAnkle: { x: 0, y: 0, z: 0, visibility: 0.0 },
    rightAnkle: { x: 0, y: 0, z: 0, visibility: 0.0 },
    leftHeel: { x: 0, y: 0, z: 0, visibility: 0.0 },
    //------------ Start from 30 index
    rightHeel: { x: 0, y: 0, z: 0, visibility: 0.0 },
    leftToe: { x: 0, y: 0, z: 0, visibility: 0.0 },
    rightToe: { x: 0, y: 0, z: 0, visibility: 0.0 }
  }
}
