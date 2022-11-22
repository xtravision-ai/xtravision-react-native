import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AssessmentPage from './Components/AssessmentPage';
import HomeScreen from './Components/Home';

const Stack = createNativeStackNavigator();
export default function MyStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'XtraVision ReactNative Demo App' }}
        />
        
        <Stack.Screen
          name="AssessmentPage"
          component={AssessmentPage}
          options={({ route }) => ({ title: 'Assessment: ' + route.params?.assessmentName })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};