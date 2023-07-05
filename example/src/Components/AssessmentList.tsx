import React from 'react';
import { SelectList } from 'react-native-dropdown-select-list'


export const AssessmentList = (props: any) => {

  const data = [
    // { value: "Banded Diagonal", key: "BANDED_ALTERNATING_DIAGNOLS" },
    { value: "Glute Bridge", key: "GLUTE_BRIDGE" },
    { value: "Plank", key: "PLANK" },
    { value: "Push Ups", key: "PUSH_UPS" },
    { value: "Squats", key: "SQUATS" },
    { value: "Range Of Motion", key: "RANGE_OF_MOTION" },
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
