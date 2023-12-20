import React from 'react';
import { SelectList } from 'react-native-dropdown-select-list'
import { textFormatter } from '../Utility';

export const AssessmentList = [
  { value: textFormatter("BACK_EXTENSION"), key: "BACK_EXTENSION" },
  { value: textFormatter("BACK_FLEXION"), key: "BACK_FLEXION" },
  { value: "L/R Side Bend", key: "BACK_LATERAL_FLEXION" },
  { value: textFormatter("SHOULDER_ABDUCTION"), key: "SHOULDER_ABDUCTION" },
  { value: textFormatter("SIT TO STAND"), key: "SQUATS_T4" },
  { value: textFormatter("ONE LEG STAND"), key: "SINGLE_LEG_STANCE" },

  // { value: "Cardio", key: "CARDIO" },
  // { value: "Cardio-T2 (More Lenient)", key: "CARDIO_T2" },
  // { value: "Glute Bridge", key: "GLUTE_BRIDGE" },
  // { value: "Plank", key: "PLANK" },
  // { value: "Push Ups", key: "PUSH_UPS" },
  // { value: "Squats", key: "SQUATS" },
  // { value: "Range Of Motion", key: "RANGE_OF_MOTION" },
  
]

export const SelectAssessmentList = (props: any) => {

  const data = AssessmentList;

  const defaultOption =  data[0] //{ key: "PARTIAL_CURL_UP", value: "PARTIAL_CURL_UP" };

  return (
    <SelectList
      data={data}
      defaultOption={defaultOption}
      setSelected={(value: any) => props.setSelectedOption(value)}
      search={false}
    />
  )

};
