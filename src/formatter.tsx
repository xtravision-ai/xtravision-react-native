/**
 * use this file to formate "google ml" pose landmarks to xtra-backend server format
 */
import * as _ from "lodash"
import type { Frame } from "react-native-vision-camera";


export function getNormalizedArray(poseKeyPoints: any, frame: Frame, dimensions: any){

    // 
    const xFactor = dimensions.width / frame.width;
    const yFactor = dimensions.height / frame.height;
    const factors = {xFactor,yFactor}

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

/* @ts-ignore:next-line  */
function createNormalizedArray(keyPoint: any, frame: Frame, factors: any = null){

    if (_.isEmpty(keyPoint) || keyPoint.visibility < 0.3) {
      return { x: 0, y: 0, z: 0, visibility: 0.0 };
    }
    // return {
    //   x: keyPoint.x * factors.xFactor,
    //   y: keyPoint.y * factors.xFactor,
    //   z: keyPoint.z * factors.xFactor,
    //   visibility: keyPoint.visibility,
    // };

    return {
      x: keyPoint.x / frame.width,
      y: keyPoint.y / frame.height,
      z: keyPoint.z/ frame.width,
      visibility: keyPoint.visibility,
    };
}