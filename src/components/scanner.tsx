import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import Modal from 'react-native-modal';

const { width, height } = Dimensions.get('window');

const BarcodeScannerModal = ({ onClose, onBarcodeScan, title, data}) => {

  useEffect(() => {
    // Simulate a barcode scan after the component loads
    console.log('scanner data',data)
    const simulatedData = data;
    handleBarcodeScan(simulatedData);
  }, []);

  const handleBarcodeScan = (e) => {
    // console.log(e.data)
    // onBarcodeScan(e.data); // Pass scanned data back to parent
    onBarcodeScan(e); 
    onClose(); // Close modal
  };

  return (
    <Modal
      isVisible={true} // Ensure this prop is used to show/hide modal
      onBackButtonPress={onClose} // Close modal on back press
      onBackdropPress={onClose} // Close modal on backdrop press
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>

        <QRCodeScanner
          onRead={handleBarcodeScan}
          showMarker={true}
          reactivate={true}
          reactivateTimeout={3000}
          cameraStyle={styles.camera}
        />
        <Text style={styles.scanInstructions}>{title}</Text>
      </View>
    </Modal>
  );
};

// Styles
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)', // Semi-transparent black background
  },
  camera: {
    width: width * 0.9, // 90% of screen width
    height: height * 0.6, // 60% of screen height
    borderRadius: 10, // Rounded corners for camera view
  },
  scanInstructions: {
    position: 'absolute',
    bottom: height * 0.05, // 5% of screen height from bottom
    color: '#FFFFFF',
    fontSize: width * 0.03, // Responsive font size
    fontFamily: 'Inter-Bold', // Bold global font
    textAlign: 'center',
    paddingHorizontal: width * 0.05, // Padding for text
  },
  closeButton: {
    position: 'absolute',
    top: height * 0.05, // 5% of screen height from top
    right: width * 0.05, // 5% of screen width from right
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white
    paddingVertical: height * 0.01, // Vertical padding
    paddingHorizontal: width * 0.03, // Horizontal padding
    borderRadius: 20, // Rounded button
  },
  closeButtonText: {
    color: '#000000', // Black text color
    fontSize: width * 0.03, // Responsive font size
    fontFamily: 'Inter-Bold', // Bold global font
  },
});

export default BarcodeScannerModal;
