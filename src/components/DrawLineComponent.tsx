import 'react-native-reanimated';
import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

const usePositionLine = (pose: any, valueName1: any, valueName2: any) => {
    return useAnimatedStyle(
        () => ({
            x1: pose.value[valueName1].x,
            y1: pose.value[valueName1].y,
            x2: pose.value[valueName2].x,
            y2: pose.value[valueName2].y,
        } as any),
        [pose],
    );
};


const DrawLineComponent = (poseLine: any) => {

    const leftIndexFingerToleftWristPosition = usePositionLine(poseLine, 'leftIndexFinger', 'leftWrist');
    const leftPinkyFingerToleftWristPosition = usePositionLine(poseLine, 'leftPinkyFinger', 'leftWrist');
    const leftWristToElbowPosition = usePositionLine(poseLine, 'leftWrist', 'leftElbow');
    const leftElbowToShoulderPosition = usePositionLine(poseLine, 'leftElbow', 'leftShoulder');
    const leftShoulderToHipPosition = usePositionLine(poseLine, 'leftShoulder', 'leftHip');
    const leftHipToKneePosition = usePositionLine(poseLine, 'leftHip', 'leftKnee');
    const leftKneeToAnklePosition = usePositionLine(poseLine, 'leftKnee', 'leftAnkle');
    const leftAnkleToLeftHeel = usePositionLine(poseLine, 'leftAnkle', 'leftHeel');
    const leftToeToLeftHeel = usePositionLine(poseLine, 'leftToe', 'leftHeel');
    const leftThumbToLeftWrist = usePositionLine(poseLine, 'leftThumb', 'leftWrist');
    const leftToeToLeftAnkle = usePositionLine(poseLine, 'leftToe', 'leftAnkle');
    const rightPinkyFingerToRightWristPosition = usePositionLine(poseLine, 'rightPinkyFinger', 'rightWrist');
    const rightIndexFingerToRightWristPosition = usePositionLine(poseLine, 'rightIndexFinger', 'rightWrist');
    const rightWristToElbowPosition = usePositionLine(poseLine, 'rightWrist', 'rightElbow');
    const rightElbowToShoulderPosition = usePositionLine(poseLine, 'rightElbow', 'rightShoulder');
    const rightShoulderToHipPosition = usePositionLine(poseLine, 'rightShoulder', 'rightHip');
    const rightHipToKneePosition = usePositionLine(poseLine, 'rightHip', 'rightKnee');
    const rightKneeToAnklePosition = usePositionLine(poseLine, 'rightKnee', 'rightAnkle');
    const rightAnkleToRightHeel = usePositionLine(poseLine, 'rightAnkle', 'rightHeel');
    const rightToeToRightHeel = usePositionLine(poseLine, 'rightToe', 'rightHeel');
    const rightThumbToRightWrist = usePositionLine(poseLine, 'rightThumb', 'rightWrist');
    const rightToeToRightAnkle = usePositionLine(poseLine, 'rightToe', 'rightAnkle');

    const shoulderToShoulderPosition = usePositionLine(poseLine, 'leftShoulder', 'rightShoulder');
    const hipToHipPosition = usePositionLine(poseLine, 'leftHip', 'rightHip');

    let lineCordinateData = [
        { name: "leftIndexFingerToleftWristPosition", value: leftIndexFingerToleftWristPosition },
        { name: "leftPinkyFingerToleftWristPosition", value: leftPinkyFingerToleftWristPosition },
        { name: "leftWristToElbowPosition", value: leftWristToElbowPosition },
        { name: "leftElbowToShoulderPosition", value: leftElbowToShoulderPosition },
        { name: "leftShoulderToHipPosition", value: leftShoulderToHipPosition },
        { name: "leftHipToKneePosition", value: leftHipToKneePosition },
        { name: "leftKneeToAnklePosition", value: leftKneeToAnklePosition },
        { name: "leftAnkleToLeftHeel", value: leftAnkleToLeftHeel },
        { name: "leftToeToLeftHeel", value: leftToeToLeftHeel },
        { name: "leftThumbToLeftWrist", value: leftThumbToLeftWrist },
        { name: "leftToeToLeftAnkle", value: leftToeToLeftAnkle },
        { name: "rightPinkyFingerToRightWristPosition", value: rightPinkyFingerToRightWristPosition },
        { name: "rightIndexFingerToRightWristPosition", value: rightIndexFingerToRightWristPosition },
        { name: "rightWristToElbowPosition", value: rightWristToElbowPosition },
        { name: "rightElbowToShoulderPosition", value: rightElbowToShoulderPosition },
        { name: "rightShoulderToHipPosition", value: rightShoulderToHipPosition },
        { name: "rightHipToKneePosition", value: rightHipToKneePosition },
        { name: "rightKneeToAnklePosition", value: rightKneeToAnklePosition },
        { name: "rightAnkleToRightHeel", value: rightAnkleToRightHeel },
        { name: "rightToeToRightHeel", value: rightToeToRightHeel },
        { name: "rightThumbToRightWrist", value: rightThumbToRightWrist },
        { name: "rightToeToRightAnkle", value: rightToeToRightAnkle },
        { name: "shoulderToShoulderPosition", value: shoulderToShoulderPosition },
        { name: "hipToHipPosition", value: hipToHipPosition },
    ]


    return {
        lineCordinateData,
        poseLine
    }
};

export default DrawLineComponent;