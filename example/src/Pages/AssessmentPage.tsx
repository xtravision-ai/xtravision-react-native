import { StyleSheet, View, Text, useWindowDimensions } from 'react-native';
import {  Assessment } from '@xtravision/xtravision-react-native';
import TextBox from '../Components/TextBox';
import { showError } from '../Components/Alert';
import BackButton from '../Components/BackButton';
import ModalComponent from '../Components/Modal';

import { useCameraPermission } from 'react-native-vision-camera';
import { useEffect, useState } from 'react';
import React from 'react';
import { AssessmentList } from '../Components/AssessmentList';
// Disable all warning and error on screen
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs();

// cache variable
// let responseCache: any = { positiveReps: 0, negativeReps: 0, lastReps: 0 };

export default function AssessmentPage({ route }: any) {
  
  // const authToken =  "__AUTH_TOKEN__";
  const selectedAssessment = route.params.assessmentName 
  const cameraPosition = route.params.cameraOption // 'front'; // back or front
  const showSkeleton = false; // true or false
  let assessmentConfig = {
    sets_threshold: -1 // set as -1 to disable sets
  } as any;
  let userConfig = {} as any;

  const assessmentName = selectedAssessment.split("-")[0];// assessmentDataList[0];

  const leftSideColor = '#5588cf';  // blue color
  const rightSideColor = '#55bacf'; // sky blue color


  // TODO: Patching work. Cleanup required
  // Starting point of standing broad jump
  // (width, height) = Coordinates (x,y)
  const { width, height } = useWindowDimensions();

  assessmentConfig.image_height = height;
  assessmentConfig.image_width = width;

  // display text while checking camera permission
  const [appText, setAppText] = useState('Waiting...')

  // Check Camera Permission
  const { hasPermission, requestPermission } = useCameraPermission()
  useEffect(() =>{
    if (hasPermission){
      console.log('Camera Access granted!')
      return 
    }
    setAppText("Checking Camera-Permission.....")
    requestPermission()
  },[])


  const [displayText, setDisplayText] = useState('Waiting for server....');
  const [displayResponse, setDisplayResponse] = useState({smallText: '-', bigText: '-'});
  const [displayRespMsg, setDisplayRespMsg] = useState('');

  const closeModal = () => {
    setDisplayRespMsg(''); // Set the message to an empty string to close the modal
  };

  // set isPreJoin = true only if you are using education screen screen
  const [requestData, setRequestData] = useState({ isPreJoin: false})

  // required prop:
  const onServerResponse = (serverResponse: any) => {

    // always check first is there any error
    if (serverResponse?.errors?.length) {
      console.error(Date() + ' Server Error Response:', serverResponse.errors);
      showError("Error From Server", `${serverResponse.errors[0].message}.`);
      return;
    }

    // Imp: use below code only purpose of Education screen.
    // Else don't use this
    if (requestData.isPreJoin || serverResponse?.data?.code) {
        console.log(Date() + ' Server Data For Education Screen:', serverResponse);
  
        // once body will be fully visible then start assessment.
        if (serverResponse.data.is_passed){
          return setRequestData({isPreJoin: false})
        }
        const msg = "Education Screen:  " + serverResponse.data.code
        return setDisplayRespMsg(msg);  
    }

    //dump server response in log
    console.log(Date() + ' Server Data:', serverResponse.data);

    //show assessment name
    let assessmentObj = AssessmentList.find(o => o.key === selectedAssessment);
    const assessmentName = assessmentObj? assessmentObj.value : ''

    setDisplayText(assessmentName);
    const additional_response = serverResponse.data.additional_response

    /**
     * IMP: below method is very specific and may vary assessment wise. 
     * Use wisely
     */
    const checkOutOfScreenFeedback = function(){
        const outOfScreenCode = serverResponse.data?.out_of_screen_feedback?.code;

        if (outOfScreenCode) {
          let msgString = outOfScreenCode;
          switch(outOfScreenCode) {
            case 'HAND_IS_OUT_OF_THE_SCREEN':
              msgString = 'Your hand is out of the screen'; break;
            case 'FEET_IS_OUT_OF_THE_SCREEN':
              msgString = 'Your feet is out of the screen'; break;
            default:
              msgString = outOfScreenCode
          }
          setDisplayRespMsg(msgString);
        }else{
          closeModal();
        } 

    }
    
    // Assessment Specific Handling
    if (selectedAssessment === 'RANGE_OF_MOTION') {
      const leftValue = serverResponse.data.angles.shoulder_left;
      const rightValue = serverResponse.data.angles.shoulder_right;
      setDisplayResponse({smallText: 'Shoulder Angle', bigText: `L: ${leftValue}\u00B0 R: ${rightValue}\u00B0`})
      return ;
    }

    // Assessment Specific Handling
    if (selectedAssessment.includes('CARDIO')) {
      checkOutOfScreenFeedback();
      const caloryValue = serverResponse.data.calories_burnt;
      const powerValue = serverResponse.data.power_list[0];
      setDisplayResponse({smallText: 'Calory Power', bigText: `${caloryValue}   ${powerValue}`})
      return ;
    }

    // Assessment Specific Handling
    if (selectedAssessment.includes('BACK_EXTENSION')) {
      const angle = additional_response?.back_extension;
      setDisplayResponse({smallText: 'Angle', bigText: `${angle}°`})
      return ;
    }
    // Assessment Specific Handling
    if (selectedAssessment.includes('BACK_FLEXION')) {
      const angle = additional_response?.back_flexion;
      setDisplayResponse({smallText: 'Angle', bigText: `${angle}°`})
      return ;
    }
     // Assessment Specific Handling
     if (selectedAssessment.includes('BACK_LATERAL_FLEXION')) {
      const leftAngle = additional_response?.lateral_left_flexion;
      const rightAngle = additional_response?.lateral_right_flexion;
      setDisplayResponse({smallText: 'Left   Right', bigText: `${leftAngle}°  ${rightAngle}°`})
      return ;
    }

    // Assessment Specific Handling
    if (selectedAssessment.includes('SHOULDER_ABDUCTION')) {
    const leftAngle = additional_response?.left_shoulder_abduction;
    const rightAngle = additional_response?.right_shoulder_abduction;
    setDisplayResponse({smallText: 'Left   Right', bigText: `${leftAngle}°  ${rightAngle}°`})
    return ;
  }
    

    // If POSE_BASED_REPS reps
    if (serverResponse.data.category == 'POSE_BASED_REPS') {
      setDisplayResponse({smallText: 'Reps', bigText: additional_response?.reps?.total ?? 0})
      return ;
    }

    // Time Based Assessment specific handling
    if (serverResponse.data.category == 'TIME_BASED') {
      setDisplayResponse({smallText: 'Seconds', bigText: additional_response?.seconds ?? 0})
      return ;
    }

    //Time Based Reps specific handling
    if (serverResponse.data.category == 'TIME_BASED_REPS') {
      const reps = additional_response?.reps?.total ?? 0;
      const seconds = additional_response?.seconds ?? 0;
      setDisplayResponse({smallText: 'Reps  Seconds', bigText: `${reps}          ${seconds}`})
      return ;
    }

  };

 /**
  * See document for details of below parameter: 
  *   - connectionData
  *   - requestData
  *   - libData
  */

  // formatted data as required
  const connectionData = {
    assessment_name: assessmentName,
    auth_token: authToken,
    assessment_config: {  "reps_threshold": 10, "grace_time_threshold": 5, "sets_threshold": -1 }, // default values
    user_config: userConfig,
    session_id: null
  };

  const libData = {
    sideColor: { leftSideColor, rightSideColor },
    onServerResponse,
    cameraPosition,
    showSkeleton,
    // serverEndpoint:  'local' //'production'//'local'
  }

  return (
    <View style={styles().container}>
      {hasPermission ? (
        <>
          <Assessment
            connectionData={connectionData}
            requestData={requestData}
            libData={libData}
          />

          {/* Show Assessment name on UI  */}
          <TextBox smallValue="Assessment" bigValue={displayText} style={styles().leftBox} />
          {/* Show Server response data on UI  */} 
          <TextBox smallValue={displayResponse.smallText} bigValue={displayResponse.bigText} style={styles().rightBox} />
          {/* Display Out of screen feedback */}
          <ModalComponent message={displayRespMsg} closeModal={closeModal} />
          
          {/* Show Back button on UI  */} 
          <View style={styles().backBtn}>
            <BackButton />
          </View>

        </>
      ) : (
        <>
          <Text>{appText}</Text>
        </>
      )
      }
    </View >
  );
}

const styles = () => StyleSheet.create({
  leftBox:{position: 'absolute', top: 50, left: 20},
  rightBox:{position: 'absolute', top: 50, right: 20},

  container: {
    flex: 1,
    // alignItems: 'center',
    justifyContent: 'center',
    position: 'relative', //overlap on the camera

  },
  
  // orangeFrame: {
  //   width: '100%',
  //   height: '100%',
  //   position: 'absolute',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   display: 'flex',
  // },
  // frameImage: {
  //   height: orientation.width > orientation.height ? orientation.width : orientation.height,
  //   width: orientation.width > orientation.height ? orientation.height : orientation.width,
  //   resizeMode: 'contain',
  //   transform: orientation.width > orientation.height ? [{ rotate: '90deg' }] : [{ rotate: '0deg' }],
  // },
  
  backBtn: {
    position: 'absolute',
    bottom: 50,
    right: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#488be2',
    // border: "solid",
    // borderColor: "white",
    // borderRadius: 20,
    // borderWidth: 1,
    zIndex: 999,
    // width: 100,
  }
});
