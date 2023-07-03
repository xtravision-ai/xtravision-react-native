import { Alert } from 'react-native';

export const showError = (title: string, message: string) => {
  Alert.alert(
    title,
    message,
    [
      {
        text: "OK",
        onPress: () => console.log("OK Pressed")
      }
    ]
  );
}
