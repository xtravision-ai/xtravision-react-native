import React from "react";
import { useState } from "react";
import { StyleSheet, Text } from "react-native";
import { Button, View } from 'react-native';
import { AssessmentList } from "../Components/AssessmentList";
import { CameraOption } from "../Components/CameraOption";


export default function HomeScreen({ navigation }: any) {
    const [assessmentName, setAssessmentName] = useState("");
    const [cameraOption, setCameraOption] = useState("front");

    const styles = StyleSheet.create({
        component: { margin: 30, padding: 25, },
        labelText: { fontSize: 25, fontWeight: "bold", color: 'black', marginTop: 10 }
    });

    const updateAssessmentName = (value: any) => setAssessmentName(value)
    const onPressCameraOption = (value: any) => setCameraOption(value)

    return (
        <>
            <View style={styles.component}>

                <Text style={styles.labelText}>Choose Assessment</Text>
                <AssessmentList setSelectedOption={updateAssessmentName} />
                
                <Text style={styles.labelText}>Choose  Camera </Text>
                <CameraOption setSelectedOption={onPressCameraOption} />

                <Text></Text>
                <Button
                    title={"Let's Start " + assessmentName}
                    onPress={() =>
                        navigation.navigate('AssessmentPage', { assessmentName, cameraOption })
                    }
                />
            </View>
        </>

    );
};
