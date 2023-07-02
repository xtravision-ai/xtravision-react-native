import React from 'react';
import { SelectList } from 'react-native-dropdown-select-list'


export const AssessmentList = (props: any) => {

  const data = [
    { key: "HALF_SQUAT", value: "Half Squat" },
    { key: "BANDED_ALTERNATING_DIAGNOLS", value: "Banded Diagonal" },
    { key: "SIT_WALL", value: "Sit Wall" },
    { key: "PUSH_UPS", value: "Push Ups" },
    { key: "SIT_AND_REACH_T2", value: "V Sit and Reach" },
    { key: "SIT_UPS_T2", value: "Sit Ups" }
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
