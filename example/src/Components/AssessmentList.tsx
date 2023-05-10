import React from 'react';
import { SelectList } from 'react-native-dropdown-select-list'


export const AssessmentList = (props: any) => {

  const data = [
    { key: "HALF_SQUAT", value: "HALF_SQUAT" },
    { value: "Partial Curl-Up", key: "PARTIAL_CURL_UP" },
    { value: "Push Ups", key: "PUSH_UPS" },
    { value: "Plate Tapping", key: "PLATE_TAPPING_COORDINATION" },
    { value: "Side Flamingo", key: "SIDE_FLAMINGO" },
    { value: "Sit Ups", key: "SIT_UPS" },
    { value: "Standing Broad Jump", key: "STANDING_BROAD_JUMP" },
    { value: "V Sit & Reach", key: "V_SIT_AND_REACH" },
    { value: "V Sit & Reach(+/-)", key: "V_SIT_AND_REACH-POSITIVE_NEGATIVE" },

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
