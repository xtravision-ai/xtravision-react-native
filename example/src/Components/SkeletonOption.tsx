import React from "react";
import { useState } from "react";
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';

export const SkeletonOption = (props: any) => {
    const [skeletonOption, setSkeletonOption] = useState("true");

    var Skeleton_radio_props = [
        { label: 'Enable', value: "true" },
        { label: 'Disable', value: "false" }
    ];

    const onPressSkeletonOption = (value: any) => {
        setSkeletonOption(value)
        props.setSelectedOption(value)
    }

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
                    Skeleton_radio_props.map((obj, i) => (
                        <RadioButton labelHorizontal={true} key={i} >
                            {/*  You can set RadioButtonLabel before RadioButtonInput */}
                            <RadioButtonInput
                                obj={obj}
                                index={i}
                                isSelected={(skeletonOption == obj.value)}
                                onPress={onPressSkeletonOption}
                                // buttonInnerColor={'#e74c3c'}
                                // buttonOuterColor={skeletonOption == obj.value ? '#2196f3' : '#000'}
                                // buttonSize={25}
                                // buttonOuterSize={35}
                                buttonStyle={{ borderWidth: 1 }}
                                buttonWrapStyle={{ marginLeft: 10 }}
                            />
                            <RadioButtonLabel
                                obj={obj}
                                index={i}
                                labelHorizontal={true}
                                onPress={onPressSkeletonOption}
                                labelStyle={{ fontSize: 20 }}
                                labelWrapStyle={{}}
                            />
                        </RadioButton>
                    ))
                }
            </RadioForm>
        </>

    );
};