import React from 'react';
import { SelectList } from 'react-native-dropdown-select-list'


export const AssessmentList = (props: any) => {

  const data = [
    //{ key: "HALF_SQUAT", value: "HALF_SQUAT" },
    { key: "PARTIAL_CURL_UP", value: "PARTIAL_CURL_UP" },
    { key: "PUSH_UPS", value: "PUSH_UPS" },
    { key: "PLATE_TAPPING_COORDINATION", value: "PLATE_TAPPING_COORDINATION" },
    { key: "SIDE_FLAMINGO", value: "SIDE_FLAMINGO" },
    { key: "SIT_UPS", value: "SIT_UPS" },
    { key: "STANDING_BROAD_JUMP", value: "STANDING_BROAD_JUMP" },
    { key: "V_SIT_AND_REACH", value: "V_SIT_AND_REACH" },
  ]
  
  const defaultOption = { key: "PARTIAL_CURL_UP", value: "PARTIAL_CURL_UP" };
  
  return (
    <SelectList
      data={data}
      defaultOption={defaultOption}
      setSelected={(value: any) => props.setSelectedOption(value)}
      search={false}
    />
  )

};
