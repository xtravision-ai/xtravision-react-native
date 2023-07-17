import 'react-native-reanimated';
import { getStylesData } from './style'
import { Text, View, useWindowDimensions } from 'react-native';
import React, { useCallback, useEffect } from 'react';
import { Camera, useCameraDevices, useFrameProcessor} from 'react-native-vision-camera';
import type { Frame } from 'react-native-vision-camera';
import  { runOnJS,  useSharedValue } from 'react-native-reanimated';
import { getDefaultObject } from '../../formatter';
import _ from 'lodash';
import type { AssessmentProp } from './interface';
import useXtraAssessment from './../../hooks/useXtraAssessment';
//@ts-ignore
import { generateSkeletonCircle, generateSkeletonLines, scanPoseLandmarks, buildSkeletonLines } from './../../helper';
// import { Line,  Svg } from 'react-native-svg';
import SkeletonView from '../SkeletonView';
// import { CameraPosition } from 'src/constants';

export function Assessment(props: AssessmentProp) {

  const defaultPose = getDefaultObject();
  // const AnimatedCircle = Animated.createAnimatedComponent(Circle);
  // const AnimatedLine = Animated.createAnimatedComponent(Line);
 
  // const paint = {
  //   left_Side_color: props?.libData?.sideColor?.leftSideColor || '#5588cf',
  //   right_Side_color: props?.libData?.sideColor?.rightSideColor || '#55bacf'
  // }

  //connection will be initiated before setup camera and others
  const [sendJsonData] = useXtraAssessment(props.connectionData, props.libData.onServerResponse)

  // define all required data
  const devices = useCameraDevices();
  const device = devices[props.libData.cameraPosition];

  //use for drawing skeleton
  // const poseSkeleton: any = React.useRef<any>(useSharedValue(defaultPose));
  const poseSkeleton = useSharedValue(Object.values(defaultPose));

  //WS Request Data: frame height/width, need to send to server
  const dimensions = useWindowDimensions();

  // const animatedLinesArray = buildSkeletonLines(poseSkeleton.value, props.libData.cameraPosition, dimensions.width, paint);
  // const animatedCircleArray = generateSkeletonCircle(poseSkeleton.value, props.libData.cameraPosition, dimensions.width, paint);
  
  const frameTempRef = React.useRef<any>({ frame_height: dimensions.height, frame_width: dimensions.width });

  //WS Request Data: landmarks
  const landmarksTempRef = React.useRef<any>({});

  //WS Request Data: 
  const updateWSEventData = useCallback((now: any, landmarks: any, frame: any) => {
    landmarksTempRef.current[now] = { landmarks };
    // default value
    frameTempRef.current = { frame_height: frame.height, frame_width: frame.width };

    // For Android: RN Vision Camera always provides same frame-data for both portrait and landscape mode. (Getting default data with landscape mode/aspect ratio 16:9)
    // For IOS, it works fine. 
    if ((dimensions.height > dimensions.width && frame.height < frame.width) || (dimensions.height < dimensions.width && frame.height > frame.width)) {
      frameTempRef.current = { frame_height: frame.width, frame_width: frame.height };
    }
  }, [dimensions])

  const calculatePoseSkeleton = (poseCopyObj: any, pose: any, frame: any, dimensions: any) => {
    'worklet';

    // default consideration: Phone in Portrait mode
    const width = dimensions.width
    const height = dimensions.height

    let xFactor: any, yFactor: any;

    if (height > width) {
      xFactor = (height / frame.width) - 0.045
      yFactor = (width / frame.height) + 0.04
    } else { // Phone in landscape mode
      xFactor = (width / frame.width);
      yFactor = (height / frame.height) - 0.09;
    }

    try {
      Object.keys(pose).forEach(v => {
        poseCopyObj[v] = {
          x: pose[v].x * xFactor,
          y: pose[v].y * yFactor,
        };
      });

    } catch (e) { console.error(Date() + " ", e) }

    // remove unnecessary labels to improve performance between UI-threads and JS Threads
    poseSkeleton.value = Object.values(poseCopyObj);
  }

  // Step-1: using frame processor, extract body landmarks from Pose
  const frameProcessor = useFrameProcessor((frame: Frame) => {
    'worklet';

    const pose = scanPoseLandmarks(frame);

    if (Object.keys(pose).length == 0) {
      __DEV__ && console.warn(Date() + " Body is not visible!")
      return;
    }

    // Step-2: after extracting landmarks store unto temp variable
    const now = Date.now();
    // normalize pose: process to convert pose object to required formate
    const poseCopy: any = getDefaultObject();
    const poseCopyObj: any = getDefaultObject();

    Object.keys(poseCopy).forEach(v => {
      // do nothing, on specific any specific part is not visible
      if (!pose[v]) {
        return;
      }

      // Handling Android issue in which the orientation of Frame is out of sync with device orientation
      if ((dimensions.height > dimensions.width && frame.height < frame.width) || (dimensions.height < dimensions.width && frame.height > frame.width)) {

        poseCopy[v] = {
          //TODO: why else case is different from Android
          x: pose[v].x / frame.height,
          y: pose[v].y / frame.width,
          z: pose[v].z / frame.height,
          visibility: pose[v].visibility,
        };

      } else {

        poseCopy[v] = {
          //TODO: why else case is different from Android
          x: pose[v].x / frame.width,
          y: pose[v].y / frame.height,
          z: pose[v].z / frame.width,
          visibility: pose[v].visibility,
        };
      }
    });

    //draw skeleton
    calculatePoseSkeleton(poseCopyObj, pose, frame, dimensions);
    // Collect data for send data to server
    runOnJS(updateWSEventData)(now, Object.values(poseCopy), frame)

  }, [dimensions]);

  const onError = function (error: any) {
    // https://github.com/mrousavy/react-native-vision-camera/blob/a65b8720bd7f2efffc5fb9061cc1e5ca5904bd27/src/CameraError.ts#L164
    console.error(Date() + "  " + error.message)
  }

  // step-3: send data to server
  useEffect(() => {

    let intervalInstance: any;
    // clear interval instance, if already set
    const cleanUp = () => intervalInstance && clearInterval(intervalInstance);

    intervalInstance = setInterval(() => {
      // if no keyPoints exist
      if (_.isEmpty(landmarksTempRef.current)) {
        return;
      }
      // get last keypoints
      const keyPoints = Object.assign(landmarksTempRef.current, {});

      // reset current
      landmarksTempRef.current = {};
      const timestamp = Date.now();

      sendJsonData({
        timestamp,
        user_keypoints: keyPoints,
        isprejoin: !!props.requestData.isPreJoin,
        frame_width: frameTempRef.current.frame_width,
        frame_height: frameTempRef.current.frame_height
      });

    }, 1000);

    return () => {
      // clean up  interval after component unmount
      cleanUp();
    };
  }, []);

  // if no camera found (front or back)
  if (device == null) {
    return (
      //@ts-ignore
      <Text style={{ color: 'red', fontWeight: 'bold' }}>
        Unable to detect camera.
      </Text>
    );
  }

  return (
    <>
      {/* @ts-ignore */}
      <View style={getStylesData(dimensions).container}>
        {/* @ts-ignore */}
        <Camera
          style={getStylesData(dimensions).camera}
          device={device}
          isActive={true}
          // isActive={isAppForeground}
          frameProcessor={true ? frameProcessor : undefined}
          fps={10}
          frameProcessorFps={10}
          onError={onError}
        />

        {
          props.libData.showSkeleton == "true" && (
          /* @ts-ignore */
          <View style={getStylesData(dimensions).overlay}>

            <SkeletonView keyPoints={poseSkeleton.value} props={{
              isFrontCamera: props.libData.cameraPosition == "front" ? true : false,
              leftSideColor:props?.libData?.sideColor?.leftSideColor || '#5588cf',
              rightSideColor: props?.libData?.sideColor?.rightSideColor || '#55bacf',
              width: dimensions.width,
              height: dimensions.height
            }} />
            

            {/* //@ts-ignore */}
              {/* <Svg
                height={dimensions.height}
                width={dimensions.width}
              > */}
                {/* {animatedLinesArray.map((element: any, key: any) => {
                  return (
                    //@ts-ignore
                    <AnimatedLine animatedProps={element} stroke={element?.initial?.value.paint || 'red'} strokeWidth="3" key={key} />
                  )
                })} */}
                {/* {animatedCircleArray.map((element: any, key: any) => {
                  return (
                    //@ts-ignore
                    <AnimatedCircle animatedProps={element} stroke={element?.initial?.value.paint || 'red'} fill={element?.initial?.value.paint || 'red'} key={key} />
                  )
                })} */}
          {/* </Svg> */}
          
          </View>)
        }

      </View>

      
      {/* {props.libData.showSkeleton && false && (
        //@ts-ignore
        <Svg
          height={dimensions.height}
          width={dimensions.width}
          style={getStylesData(dimensions).linesContainer}
        >
          {animatedLinesArray.map((element: any, key: any) => {
            return (
              //@ts-ignore
              <AnimatedLine animatedProps={element} stroke={element?.initial?.value.paint || 'red'} strokeWidth="2" key={key} />
            )
          })}
          {animatedCircleArray.map((element: any, key: any) => {
            return (
              //@ts-ignore
              <AnimatedCircle animatedProps={element} stroke={element?.initial?.value.paint || 'red'} fill={element?.initial?.value.paint || 'red'} key={key} />
            )
          })}
        </Svg>
      )} */}
    </>
  );
}

