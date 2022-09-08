export function multiply(a: number, b: number): Promise<number> {
  return Promise.resolve(a * b);
}



export function scanPoseLandmarkes(frame: Frame) {
  'worklet';
  return __scanPoseLandmarkes(frame);
}