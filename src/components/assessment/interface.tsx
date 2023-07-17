export interface AssessmentConnectionData{
  assessment_name: string;
  auth_token: string;
  assessment_config?: object;
  user_config?: object;
  session_id?: string | null
};


export interface AssessmentProp {
    connectionData:  AssessmentConnectionData;
    requestData: {
      isPreJoin?: boolean;
    };
    libData: {
      sideColor?: {
        leftSideColor: string,
        rightSideColor: string
      };
      onServerResponse(serverResponse: any): void;
      cameraPosition: 'front' | 'back';
      showSkeleton: boolean;
    }
  }