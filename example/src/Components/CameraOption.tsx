import React from "react";
import { useState } from "react";
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';

export const CameraOption = (props: any) => {
    const [cameraOption, setCameraOption] = useState("front");

    var radio_props = [
        { label: 'Front', value: "front" },
        { label: 'Back', value: "back" }
    ];

    const onPressCameraOption = (value: any) => {
        setCameraOption(value)
        props.setSelectedOption(value)}

    return (
        <>
            <RadioForm
                initial={0}
                formHorizontal={true}
                animation={true}
                
                // labelStyle={styles.radioButtonLabel}
                // buttonSize={15}
            >
            {/* To create radio buttons, loop through your array of options */}
            {
                radio_props.map((obj, i) => (
                <RadioButton labelHorizontal={true} key={i} >
                    {/*  You can set RadioButtonLabel before RadioButtonInput */}
                    <RadioButtonInput
                        obj={obj}
                        index={i}
                        isSelected={(cameraOption == obj.value)}
                        onPress={onPressCameraOption}
                        // buttonInnerColor={'#e74c3c'}
                        // buttonOuterColor={cameraOption == obj.value ? '#2196f3' : '#000'}
                        // buttonSize={25}
                        // buttonOuterSize={35}
                        buttonStyle={{borderWidth : 1}}
                        buttonWrapStyle={{marginLeft: 10}}
                    />
                    <RadioButtonLabel
                        obj={obj}
                        index={i}
                        labelHorizontal={true}
                        onPress={onPressCameraOption}
                        labelStyle={{fontSize: 20}}
                        labelWrapStyle={{}}
                    />
                </RadioButton>
                ))
            }  
            </RadioForm>            
        </>

    );
};
