/* globals __scanPoseLandmarks */
import type { Frame } from 'react-native-vision-camera';
import { Camera } from 'react-native-vision-camera';


export function scanPoseLandmarks(frame: Frame) {
    'worklet';

    // @ts-expect-error Frame Processors are not typed.
    return __scanPoseLandmarks(frame);
  }

export async function RequestCameraPermission(){
  return await Camera.requestCameraPermission()
} 
