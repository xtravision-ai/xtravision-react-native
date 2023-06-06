import { useEffect, useState } from "react";
import DeviceInfo from 'react-native-device-info';

// local
export const API_SERVER_URL = "http://localhost:4000/api/v1/graphql";

// prod
// export const API_SERVER_URL = "https://saasapi.xtravision.ai/api/v1/graphql"

interface WebSocketOpenType {
    requestedAt: any;
    authToken: string;
}

const WebSocketOpenHandler = async ({ requestedAt, authToken }: WebSocketOpenType) => {
    const [connectionDetails, setConnectionDetails] = useState() as any;
    const [initialSendingDone, setInitialSendingDone] = useState(false);

    if (!authToken || !requestedAt) throw new Error("AUTH_TOKEN or timeStamp error!")

    useEffect(() => {
        //TODO: improvement: change implementation over to backend
        const fetchData = async () => {
            try {
                const response = await fetch('https://ipapi.co/json/')
                const data = await response.json();
                setConnectionDetails({
                    ipAddress: data?.ip,
                    location: `${data}`
                })
            } catch (err) {
                console.log("fetch ip details error:", err);
            }
        };
        fetchData();
    }, [])

    const sdkDetails = {
        // TODO: improvement: set this dynamically 
        name: "@xtravision/xtravision-react-native",
        version: "2.7.0",
    };

    const deviceDetails = {
        osDetails: {
            name: DeviceInfo.getSystemName() || "Unknown OS",
            version: DeviceInfo.getSystemVersion() || "Unknown OS Version",
            apiVersion: DeviceInfo.getApiLevel() || "Unknown OS ApiVersion",
        },
        // ignoring for now:
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
                connectionDetails: connectionDetails,
                deviceDetails: deviceDetails,
                sdkDetails: sdkDetails
            },
            requestedAt: requestedAt
        }
    }

    console.log("apiRequest: ", apiRequest)

    if (apiRequest && !initialSendingDone) {
        try {
            const response = await fetch(API_SERVER_URL, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify(apiRequest),
            })

            if (response.ok) {
                // setting this so that we dont send multiple times when wss dissconnects and reconnects
                setInitialSendingDone(true);
            } else {
                console.error("Server returned an error :", response.status, response.statusText)
            }
        } catch (err) {
            console.error("Error on server API request:", err);
        }
    }
}

export default WebSocketOpenHandler;