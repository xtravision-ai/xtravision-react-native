// import { useState, useEffect } from "react";
import _ from "lodash";
import { useEffect, useState } from "react";
import useWebSocket from "react-native-use-websocket";
import type {AssessmentConnectionData} from "./../components/assessment"


const WS_BASE_URL = 'wss://saasai.xtravision.ai/wss/v2';
// const WS_BASE_URL = 'wss://saasstagingai.xtravision.ai/wss/v2';
// const WS_BASE_URL = 'ws://localhost:8000/wss/v2';

function useXtraAssessment(connectionData: AssessmentConnectionData, onResponse: Function) : [Function, any]{
  const [responseData] = useState(null);


  const WS_URL = `${WS_BASE_URL}/assessment/fitness/${connectionData.assessment_name}`

  let iQueryParams: { [key: string]: any } = {};
  iQueryParams['requested_at'] = Date.now();
  iQueryParams["session_id"] = connectionData.session_id ? connectionData.session_id : null;
  iQueryParams["auth_token"] = connectionData.auth_token;

  if (!_.isEmpty(connectionData.user_config)) {
      iQueryParams['user_config'] = encodeURIComponent(`${JSON.stringify(connectionData.user_config)}`);
  }

  if (!_.isEmpty(connectionData.assessment_config)) {
      iQueryParams['assessment_config'] = encodeURIComponent(`${JSON.stringify(connectionData.assessment_config)}`);
  }

  //Imp: Since component is rendering multiple times and query params have current time, 
  //So we need to set query params only one time when load component
  const [queryParams] = useState(iQueryParams)

  // https://github.com/Sumit1993/react-native-use-websocket#readme
  let default_options = {
    queryParams: queryParams, //queryParams, //{...props.connection.queryParams, queryParams}
    onOpen: () => console.log(Date() + ' XtraServer-AI Connection opened'),
    //onClose: () =>  console.log(Date() + 'XtraServer-AI Connection closed'),
    onError: (e: any) => console.error(Date() + ' ', e), // todo : proper error handling
    //Will attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: (_closeEvent: any) => true,
    //To attempt to reconnect on error events,
    retryOnError: true,
  }

  // __DEV__ && console.log(Date() + " ", { WS_URL, default_options })

  const {
    sendJsonMessage,
    lastJsonMessage,
    // readyState,
    // getWebSocket
  } = useWebSocket(WS_URL, default_options);


  useEffect(() => {
    if (!_.isEmpty(lastJsonMessage)) {
      // setResponseData(lastJsonMessage)
      onResponse(lastJsonMessage);
    }
  }, [lastJsonMessage]);

  const sendJsonData = (jsonData: any ) => {
    sendJsonMessage(jsonData)
  }


  
  return [sendJsonData, responseData]
}

export default useXtraAssessment; 