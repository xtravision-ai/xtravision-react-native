// import { useState, useEffect } from "react";
import _ from "lodash";
import { useEffect, useState } from "react";
import useWebSocket from "react-native-use-websocket";
import type { AssessmentConnectionData } from "./../components/assessment"


const WS_BASE_URL = 'wss://saasai.xtravision.ai/wss/v2';
// const WS_BASE_URL = 'wss://saasstagingai.xtravision.ai/wss/v2';
// const WS_BASE_URL = 'ws://localhost:8000/wss/v2';

// local
// export const API_SERVER_URL = "http://localhost:4000/api/v1/graphql";

// prod
export const API_SERVER_URL = "https://saasapi.xtravision.ai/api/v1/graphql"

function useXtraAssessment(connectionData: AssessmentConnectionData, onResponse: Function): [Function, any] {
  const [responseData] = useState(null);

  const [initialSendingDone, setInitialSendingDone] = useState(false);

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

  const sdkDetails = {
    // TODO: improvement: set this dynamically 
    name: "@xtravision/xtravision-react-native",
    version: "2.7.0",
  };

  const deviceDetails = {
    // ignoring for now:
    // osDetails: {
    //     name: DeviceInfo.getSystemName() || "Unknown OS",
    //     version: DeviceInfo.getSystemVersion() || "Unknown OS Version",
    //     apiVersion: DeviceInfo.getApiLevel() || "Unknown OS ApiVersion",
    // },
    // manufacturerDetails: {
    //   make: "Samsung",
    //   model: "Galaxy S10",
    //   variant: "SM-G973U"
    // }
  };

  const apiRequest = {
    query: `mutation userSessionSaveMetaData($metaData: JSON, $requestedAt: Float) { 
              userSessionSaveMetaData(metaData: $metaData, requestedAt: $requestedAt) { 
                id
              } 
            }`,
    variables: {
      metaData: {
        connectionDetails: {},
        deviceDetails: deviceDetails,
        sdkDetails: sdkDetails,
      },
      requestedAt: queryParams.requested_at
    }
  }

  const WebSocketOpenHandler = async () => {
    if (!initialSendingDone) {
      try {
        const response = await fetch(API_SERVER_URL, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${queryParams.auth_token}`,
          },
          body: JSON.stringify(apiRequest),
        })

        if (response.ok) {
          // setting this so that we dont send multiple times when wss dissconnects and reconnects
          setInitialSendingDone(true);
        } else {
          console.warn("Server returned an error :", response.status, response.statusText)
        }
      } catch (err) {
        console.error("Error on server API request:", err);
      }
    }
  };

  // https://github.com/Sumit1993/react-native-use-websocket#readme
  let default_options = {
    queryParams: queryParams, //queryParams, //{...props.connection.queryParams, queryParams}
    onOpen: () => {
      console.log(Date() + ' XtraServer-AI Connection opened');
      WebSocketOpenHandler();
    },
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

  const sendJsonData = (jsonData: any) => {
    sendJsonMessage(jsonData)
  }


  return [sendJsonData, responseData]
}

export default useXtraAssessment; 