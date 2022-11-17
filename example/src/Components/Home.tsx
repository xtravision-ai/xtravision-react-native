import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { StyleSheet, Text } from "react-native";
import { Button, View } from 'react-native';
import RadioForm from 'react-native-simple-radio-button';

import { AssessmentList } from "./AssessmentList";


export default function HomeScreen({ navigation }) {

    const [assessmentName, setAssessmentName] = useState("");
    const [cameraOption, setCameraOption] = useState("front");


    var radio_props = [
        {label: 'Front', value: "front" },
        {label: 'Back', value: "back" }
      ];

      
    const styles = StyleSheet.create({
        component: {margin: 30, padding: 25},
        labelText: { fontSize: 25, fontWeight: "bold" },
        radioButtonWrap: {
            margin: 10,
            alignItems: "center"
          },
        radioButtonLabel: {
            // fontSize: 15, 
            // fontWeight: "bold", 
            marginRight: 10 
        },

    });

    useEffect(()=>{
        console.log("Assessment", {assessmentName, cameraOption})
    })

    const updateAssessmentName = (value: any) => setAssessmentName(value) //console.log(value) // setAssessment(value)
    

    return (
        <>
            <View style={styles.component}>
                <Text style={ styles.labelText} >
                    Choose Assessment
                </Text>
                <AssessmentList 
                    setSelectedOption = {updateAssessmentName}
                />

                <Text style={ styles.labelText} >
                    Choose  Camera
                </Text>

                <View  style={styles.radioButtonWrap}>

                    <RadioForm
                        radio_props={radio_props}
                        initial={0}
                        onPress={(value : any) => setCameraOption(value)}
                        formHorizontal={true}
                        animation={true}
                        labelStyle={styles.radioButtonLabel}
                        buttonSize= {15}
                    />
                </View>

                <Button
                    title={"Let's Start " + assessmentName}
                    onPress={() =>
                        navigation.navigate('AssessmentPage', { assessmentName, cameraOption})
                    }
                />
            </View>
        </>
     
    );
  };
