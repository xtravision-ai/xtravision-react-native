import React from "react";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput } from "react-native";
import { Button } from 'react-native';
import { AssessmentList } from "../Components/AssessmentList";
import { CameraOption } from "../Components/CameraOption";
// import { SkeletonOption } from "../Components/SkeletonOption";

export default function HomeScreen({ navigation }: any) {
    const [assessmentName, setAssessmentName] = useState("");
    const [cameraOption, setCameraOption] = useState("front");
    // testing
    const [userHeight, onChangeUserHeight] = React.useState('160');
    // const [showSkeleton, setShowSkeleton] = useState("false");
    const [showSkeleton] = useState("false");

    const styles = StyleSheet.create({
        component: { margin: 30, padding: 25, },
        labelText: { fontSize: 25, fontWeight: "bold", marginTop: 10 },
        labelHeightText: { fontSize: 15, fontWeight: "bold", marginTop: 10 },
        input: {
            height: 50,
            margin: 12,
            borderWidth: 1,
            padding: 10,
            borderRadius: 10
        },
    });

    const updateAssessmentName = (value: any) => setAssessmentName(value)
    const onPressCameraOption = (value: any) => setCameraOption(value)
    // const onPressSkeletonOption = (value: any) => setShowSkeleton(value)

    return (
        <>
            <ScrollView style={styles.component}>

                <Text style={styles.labelText}>Choose Assessment</Text>
                <AssessmentList setSelectedOption={updateAssessmentName} />

                {assessmentName === 'STANDING_BROAD_JUMP' && (
                    <>
                        <Text style={styles.labelHeightText}>Enter your height (in cm) here</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={onChangeUserHeight}
                            value={userHeight}
                            placeholder="Enter your height (in cm) here"
                            keyboardType="numeric"
                        />
                    </>

                )}

                {/* <Text style={styles.labelText}>Display Skeleton </Text>
                <SkeletonOption setSelectedOption={onPressSkeletonOption} /> */}

                <Text style={styles.labelText}>Choose  Camera </Text>
                <CameraOption setSelectedOption={onPressCameraOption} />

                <Text></Text>
                <Button
                    title={"Let's Start " + assessmentName}
                    disabled={userHeight.length <= 1}
                    onPress={() =>
                        navigation.navigate('AssessmentPage', { assessmentName, cameraOption, userHeight, showSkeleton })
                    }
                />
                <Text style={{ marginBottom: 20 }}></Text>
            </ScrollView>
        </>

    );
};
