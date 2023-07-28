import React, { useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';

interface ModalComponentProps {
  message: string;
  closeModal: () => void;
}

const ModalComponent: React.FC<ModalComponentProps> = ({ message, closeModal }) => {
  const isModalVisible = message !== '';


  useEffect(() => {
    if (isModalVisible) {
      const timeout = setTimeout(() => {
        closeModal();
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [isModalVisible, closeModal]);


  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={closeModal}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={closeModal}>
            <Text style={styles.messageText}>{message}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end', // Show the modal at the bottom
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background for overlay effect
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  messageText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },

});

export default ModalComponent;
