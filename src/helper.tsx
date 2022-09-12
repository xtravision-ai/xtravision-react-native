import type { Frame } from 'react-native-vision-camera';
import { Camera } from 'react-native-vision-camera';


export function scanPoseLandmarks(frame: Frame) {
    'worklet';
    // IMP: DO NOT PUT ANY JS CODE HERE
    if (!_WORKLET) throw new Error('ScanPoseLandmarks method must be called from a frame processor!');

    // @ts-expect-error Frame Processors are not typed.
    return __scanPoseLandmarks(frame);
}

export async function RequestCameraPermission(){
  return await Camera.requestCameraPermission()
} 
