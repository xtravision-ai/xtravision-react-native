import type { Frame } from 'react-native-vision-camera';

// /**
//  * Scans Pose.
//  */

// type Point = { x: number; y: number };
// export interface Face {
//   leftEyeOpenProbability: number;
//   rollAngle: number;
//   pitchAngle: number;
//   yawAngle: number;
//   rightEyeOpenProbability: number;
//   smilingProbability: number;
//   bounds: {
//     y: number;
//     x: number;
//     height: number;
//     width: number;
//   };
//   contours: {
//     FACE: Point[];
//     NOSE_BOTTOM: Point[];
//     LOWER_LIP_TOP: Point[];
//     RIGHT_EYEBROW_BOTTOM: Point[];
//     LOWER_LIP_BOTTOM: Point[];
//     NOSE_BRIDGE: Point[];
//     RIGHT_CHEEK: Point[];
//     RIGHT_EYEBROW_TOP: Point[];
//     LEFT_EYEBROW_TOP: Point[];
//     UPPER_LIP_BOTTOM: Point[];
//     LEFT_EYEBROW_BOTTOM: Point[];
//     UPPER_LIP_TOP: Point[];
//     LEFT_EYE: Point[];
//     RIGHT_EYE: Point[];
//     LEFT_CHEEK: Point[];
//   };
// }

export function scanPose(frame: Frame, params: any): any {
  'worklet';
  // @ts-ignore
  // eslint-disable-next-line no-undef
  return __scanPose(frame, params);
}
