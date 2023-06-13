import React from 'react';
import { SelectList } from 'react-native-dropdown-select-list'


export const AssessmentList = (props: any) => {

  const data = [
    { value: "Squats", key: "SQUATS_T2" },
    { value: "Banded Diagonal", key: "BANDED_ALTERNATING_DIAGNOLS" },
    { value: "Sit Wall", key: "SIT_WALL" },
    { value: "Push Ups", key: "PUSH_UPS" },
    { value: "Glute Bridge", key: "GLUTE_BRIDGE" }
  ]

  // testing
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
