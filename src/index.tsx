/* globals __scanPoseLandmarks */
import type { Frame } from 'react-native-vision-camera';

export function multiply(a: number, b: number): Promise<number> {
  return Promise.resolve(a * b);
}



export function scanPoseLandmarks(frame: Frame) {
  'worklet';
  // @ts-expect-error Frame Processors are not typed.
  return __scanPoseLandmarks(frame);
}