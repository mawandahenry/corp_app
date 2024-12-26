import React, {forwardRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';
import {ReactNativeScannerView} from '@pushpendersingh/react-native-scanner';
import normalize from 'react-native-normalize';

const {width, height} = Dimensions.get('window');

const BarcodeScannerModal = forwardRef((props, ref) => {
  const {
    onClose,
    handleBarcodeScanned,
    stopScanning,
    resumeScanning,
    disableFlashlight,
    enableFlashlight,
    releaseCamera,
    startScanning,
    isActive,
    activate,
    deactivate,
    open,
    scan,
  } = props;

  return (
    <Modal
      isVisible={open} // Ensure this prop is used to show/hide modal
      onBackButtonPress={onClose} // Close modal on back press
      onBackdropPress={onClose} // Close modal on backdrop press
      hasBackdrop={true}
      backdropColor="white"
      backdropOpacity={0.7}>
      <View style={styles.modalContainer}>
        <View style={styles.close}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.scannerWrapper}>
          <View style={styles.scanner}>
            <ReactNativeScannerView
              ref={ref}
              style={styles.scannerBox}
              onQrScanned={even => handleBarcodeScanned(even)}
              pauseAfterCapture={true} // Pause the scanner after barcode / QR code is scanned
              isActive={open} // Start / stop the scanner using this prop
              showBox={true} // Show the box around the barcode / QR code
            />
          </View>
        </View>
        <View style={styles.controls}>
          <Text style={styles.title}>Scanned Data</Text>
          <Text>{scan?.data}</Text>
        </View>
      </View>
    </Modal>
  );
});

// Styles
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    //backgroundColor: 'red',
    width: '100%',
  },
  close: {
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor: 'white',
  },
  scannerBox: {
    flex: 1,
    width: '100%',
    borderWidth: normalize(4),
  },
  scanner: {flex: 1},
  scannerWrapper: {flex: 0.5, backgroundColor: 'red'},
  closeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 20,
  },
  closeButtonText: {
    color: 'red',
    fontFamily: 'Poppins-Bold',
  },
  controls: {
    flex: 0.4,
    backgroundColor: 'white',
  },

  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: normalize(18),
    paddingTop: normalize(15),
  },
});

export default BarcodeScannerModal;
