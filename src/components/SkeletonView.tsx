import React from 'react';
// import { View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import Svg, {  Line } from 'react-native-svg';

type KeyPoint = {
  x: number;
  y: number;
};

type Props = {
  isFrontCamera: boolean;
  leftSideColor: string;
  rightSideColor: string;
  width: number;
  height: number;

};


type SkeletonViewProps = {
  keyPoints: KeyPoint[];
  props: Props;
};

const SkeletonView: React.FC<SkeletonViewProps> = ({ keyPoints, props }) => {
  const width = props.width;  // Substitute these values with the actual width and height
  const height = props.height; // you want for your SVG container
  // if (props.isFrontCamera){
  //     for (let key in keyPoints) {
  //       //@ts-ignore
  //       // keyPoints[key].x =  width - keyPoints[key].x;
  //       //@ts-ignore
  //       // keyPoints[key].y =  height - keyPoints[key].y;
  //     }
  // }

  // // Function to draw lines between keyPoints
  // const drawLine = (fromKeyPoint: KeyPoint, toKeyPoint: KeyPoint) => {
  //   const x1 = fromKeyPoint.x;
  //   const y1 = fromKeyPoint.y;
  //   const x2 = toKeyPoint.x;
  //   const y2 = toKeyPoint.y;

  //   return <Line x1={x1.toString()} y1={y1.toString()} x2={x2.toString()} y2={y2.toString()} stroke="black" strokeWidth="2" />;
  // };

  // // Create array to store SVG elements
  // let svgElements: JSX.Element[] = [];

  // let keySuffix = 0
  // // Draw the skeleton points
  // for (let keyPoint of keyPoints) {
  //   const x = keyPoint.x;
  //   const y = keyPoint.y;

  //   svgElements.push(<Circle key={`point_${keySuffix++}`} cx={x.toString()} cy={y.toString()} r="4" stroke="red" strokeWidth="3" />);
  // }

  // // Connect keyPoints
  // // Example for connecting keyPoints:
  // svgElements.push(drawLine(keyPoints[0] as KeyPoint, keyPoints[1] as KeyPoint));

  // return (
  //   <View style={{ width, height }}>
  //     <Svg height="100%" width="100%">
  //       {svgElements}
  //     </Svg>
  //   </View>
  // );


  const AnimatedLine = Animated.createAnimatedComponent(Line);
  const animatedLinesArray = buildSkeletonLines(keyPoints, props);

  return (
    <>

      <Svg
          style= {{width, height}}
        >
          {animatedLinesArray.map((element: any, key: any) => {
            return (
              //@ts-ignore
              <AnimatedLine animatedProps={element} stroke={element?.initial?.value.strokeColor || 'red'} strokeWidth="4" key={key} />
            )
          })}
          {/* {animatedCircleArray.map((element: any, key: any) => {
            return (
              //@ts-ignore
              <AnimatedCircle animatedProps={element} stroke={element?.initial?.value.strokeColor || 'red'} fill={element?.initial?.value.props || 'red'} key={key} />
            )
          })} */}
        </Svg>
    </>
  )
};


function buildSkeletonLines(poseData: any, props: any){

  const leftPinkyFingerToLeftWristPosition = getSkeletonLine(poseData, 17, 15,props.leftSideColor, props);
  const leftIndexFingerToLeftWristPosition = getSkeletonLine(poseData, 19, 15, props.leftSideColor, props);

  const leftWristToElbowPosition = getSkeletonLine(poseData, 15, 13, props.leftSideColor, props);
  const leftElbowToShoulderPosition = getSkeletonLine(poseData, 13, 11, props.leftSideColor, props);
  const leftShoulderToHipPosition = getSkeletonLine(poseData, 11, 23, props.leftSideColor, props);
  const leftHipToKneePosition = getSkeletonLine(poseData, 23, 25, props.leftSideColor, props);
  const leftKneeToAnklePosition = getSkeletonLine(poseData, 25, 27, props.leftSideColor, props);
  const leftAnkleToLeftHeel = getSkeletonLine(poseData, 27, 29, props.leftSideColor, props);
  const leftToeToLeftHeel = getSkeletonLine(poseData, 31, 29, props.leftSideColor, props);
  const leftThumbToLeftWrist = getSkeletonLine(poseData, 21, 15, props.leftSideColor, props);
  const leftToeToLeftAnkle = getSkeletonLine(poseData, 31, 27, props.leftSideColor, props);
  const leftEyeInnerToNosePosition = getSkeletonLine(poseData, 1, 0, props.leftSideColor, props);
  const leftEyeInnerToLeftEyeOuterPosition = getSkeletonLine(poseData, 1, 3, props.leftSideColor, props);
  const leftEyeOuterToLeftEarPosition = getSkeletonLine(poseData, 3, 7, props.leftSideColor, props);


  const rightPinkyFingerToRightWristPosition = getSkeletonLine(poseData, 18, 16, props.rightSideColor, props);
  const rightIndexFingerToRightWristPosition = getSkeletonLine(poseData, 20, 16, props.rightSideColor, props);
  const rightWristToElbowPosition = getSkeletonLine(poseData, 16, 14, props.rightSideColor, props);
  const rightElbowToShoulderPosition = getSkeletonLine(poseData, 14, 12, props.rightSideColor, props);
  const rightShoulderToHipPosition = getSkeletonLine(poseData, 12, 24, props.rightSideColor, props);
  const rightHipToKneePosition = getSkeletonLine(poseData, 24, 26, props.rightSideColor, props);
  const rightKneeToAnklePosition = getSkeletonLine(poseData, 26, 28, props.rightSideColor, props);
  const rightAnkleToRightHeel = getSkeletonLine(poseData, 28, 30, props.rightSideColor, props);
  const rightToeToRightHeel = getSkeletonLine(poseData, 32, 30, props.rightSideColor, props);
  const rightThumbToRightWrist = getSkeletonLine(poseData, 22, 16, props.rightSideColor, props);
  const rightToeToRightAnkle = getSkeletonLine(poseData, 32, 28, props.rightSideColor, props);
  const rightEyeInnerToNosePosition = getSkeletonLine(poseData, 4, 0, props.rightSideColor, props);
  const rightEyeInnerToRightEyeOuterPosition = getSkeletonLine(poseData, 4, 6, props.rightSideColor, props);
  const rightEyeOuterToRightEarPosition = getSkeletonLine(poseData, 6, 8, props.leftSideColor, props);


  const shoulderToShoulderPosition = getSkeletonLine(poseData, 11, 12, 'white', props);
  const hipToHipPosition = getSkeletonLine(poseData, 23, 24, 'white', props);
  const mouthLeftToMouthRightPosition = getSkeletonLine(poseData, 9, 10, 'white', props);


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
}

function getSkeletonLine(poseLine: any, fromIndex: any, toIndex: any, strokeColor: any, props: any){
  try {

    if (props.isFrontCamera) {
      return useAnimatedStyle(
        () => ({
          x1: props.width - poseLine[fromIndex].x,
          y1: poseLine[fromIndex].y,
          x2: props.width - poseLine[toIndex].x,
          y2: poseLine[toIndex].y,
          strokeColor
        } as any),
        [poseLine],
      );
    }

    return useAnimatedStyle(
      () => ({
        x1: poseLine[fromIndex].x,
        y1: poseLine[fromIndex].y,
        x2: poseLine[toIndex].x,
        y2: poseLine[toIndex].y,
        strokeColor
      } as any),
      [poseLine],
    );

    
    }catch (e) { console.error(e) }
}

export default SkeletonView;
