import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AssessmentPage from './Pages/AssessmentPage';
import HomeScreen from './Pages/Home';
import { Appearance } from 'react-native';

const Stack = createNativeStackNavigator();
export default function MyStack() {

  //either light or dark
  const colorScheme = Appearance.getColorScheme();
  let backgroundColor:string = 'white'

  if (colorScheme === 'dark') {
    // Use dark color scheme
    backgroundColor = 'black'
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          //@ts-ignore
          contentStyle:{
            backgroundColor: {backgroundColor } 
          }
       }} 
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'XtraVision ReactNative Demo App' }}
        />
        
        <Stack.Screen
          name="AssessmentPage"
          component={AssessmentPage}
          //@ts-expect-error
          options={({ route}) => ({ headerShown:false,  title: 'Assessment: ' + route.params?.assessmentName })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};