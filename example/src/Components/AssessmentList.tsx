import React from 'react';
import { SelectList } from 'react-native-dropdown-select-list'


export const AssessmentList = (props: any) => {

  const [selected, setSelected] = React.useState("");

  const data = [
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
      // setSelected={setSelected} //{(e) => props.setSelectedOption(e.value)}
      setSelected={(value) => props.setSelectedOption(value)}
      // onChange={(e) => props.setSelectedOption(e.target.value)}
      search={false}
    // setSelected={setSelected} 
    // notFoundText = {"Requested assessment is not available"}
    />
  )

};
