import React, { FC } from 'react';
import { Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const BackButton: FC = () => {
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack();
  }

  return (
    <Button title="Go Back" onPress={handleBack} />
  );
}

export default BackButton;
