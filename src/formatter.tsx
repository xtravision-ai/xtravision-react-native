/**
 * use this file to formate "google ml" pose landmarks to xtra-backend server format
 */
import * as _ from "lodash"
import type { Frame } from "react-native-vision-camera";


export function getNormalizedArray(poseKeyPoints: any, frame: Frame){

    // Array of 33 key points 
    return [
        createNormalizedArray(poseKeyPoints.nose, frame),
        createNormalizedArray(poseKeyPoints.leftEyeInner, frame),
        createNormalizedArray(poseKeyPoints.leftEye, frame),
        createNormalizedArray(poseKeyPoints.leftEyeOuter, frame),
        createNormalizedArray(poseKeyPoints.rightEyeInner, frame),
        createNormalizedArray(poseKeyPoints.rightEye, frame),
        createNormalizedArray(poseKeyPoints.rightEyeOuter, frame),
        createNormalizedArray(poseKeyPoints.leftEar, frame),
        createNormalizedArray(poseKeyPoints.rightEar, frame),
        createNormalizedArray(poseKeyPoints.mouthLeft, frame),
        createNormalizedArray(poseKeyPoints.mouthRight, frame),
        createNormalizedArray(poseKeyPoints.leftShoulder, frame),
        createNormalizedArray(poseKeyPoints.rightShoulder, frame),
        createNormalizedArray(poseKeyPoints.leftElbow, frame),
        createNormalizedArray(poseKeyPoints.rightElbow, frame),
        createNormalizedArray(poseKeyPoints.leftWrist, frame),
        createNormalizedArray(poseKeyPoints.rightWrist, frame),
        createNormalizedArray(poseKeyPoints.leftPinkyFinger, frame),
        createNormalizedArray(poseKeyPoints.rightPinkyFinger, frame),
        createNormalizedArray(poseKeyPoints.leftIndexFinger, frame),
        createNormalizedArray(poseKeyPoints.rightIndexFinger, frame),
        createNormalizedArray(poseKeyPoints.leftThumb, frame),
        createNormalizedArray(poseKeyPoints.rightThumb, frame),
        createNormalizedArray(poseKeyPoints.leftHip, frame),
        createNormalizedArray(poseKeyPoints.rightHip, frame),
        createNormalizedArray(poseKeyPoints.leftKnee, frame),
        createNormalizedArray(poseKeyPoints.rightKnee, frame),
        createNormalizedArray(poseKeyPoints.leftAnkle, frame),
        createNormalizedArray(poseKeyPoints.rightAnkle, frame),
        createNormalizedArray(poseKeyPoints.leftHeel, frame),
        createNormalizedArray(poseKeyPoints.rightHeel, frame),
        createNormalizedArray(poseKeyPoints.leftToe, frame),
        createNormalizedArray(poseKeyPoints.rightToe, frame),
    ]

}

function createNormalizedArray(keyPoint: any, frame: any){

    if (_.isEmpty(keyPoint) || keyPoint.visibility < 0.3) {
      return { x: 0, y: 0, z: 0, visibility: 0.0 };
    }
    return {
      x: keyPoint.x / frame.width,
      y: keyPoint.y / frame.height,
      z: keyPoint.z / frame.width,
      visibility: keyPoint.visibility,
    };
}