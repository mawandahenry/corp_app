import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

// Get the screen width and height
const { width, height } = Dimensions.get('window');

const OTPScreen = ({ navigation }) => {
  const [otp, setOtp] = useState(['', '', '', '']);

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const handleVerify = () => {
    const enteredOtp = otp.join('');
    if (enteredOtp === '1234') {
      navigation.replace('Home');
    } else {
      alert('Invalid OTP');
    }
  };

  const handleResendCode = () => {
    alert('Code has been resent!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter one time password</Text>

      {/* OTP Input */}
      <View style={styles.otpContainer}>
        {otp.map((_, index) => (
          <TextInput
            key={index}
            style={styles.otpInput}
            keyboardType="numeric"
            maxLength={1}
            value={otp[index]}
            onChangeText={(value) => handleOtpChange(index, value)}
          />
        ))}
      </View>

      {/* Buttons on the same line */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleResendCode}>
          <Text style={styles.cancelButtonText}>Resend code</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.verifyButton]} onPress={handleVerify}>
          <Text style={styles.buttonText}>Verify session</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(254, 254, 254)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
  },
  title: {
    fontSize: width * 0.03,
    color: '#333333',
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: height * 0.05,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.05,
    width: '80%',
  },
  otpInput: {
    width: width * 0.12,
    height: height * 0.09,
    backgroundColor: 'rgb(246, 245, 247)',
    borderRadius: 5,
    borderColor: 'rgb(221, 222, 230)',
    borderWidth: 1,
    textAlign: 'center',
    fontSize: width * 0.045,
    fontFamily: 'Inter-Regular',
    color: '#333333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Space between the buttons
    width: '80%', // Match the width of the OTP input container
    marginTop: height * 0.02,
  },
  button: {
    flex: 1, // Buttons take equal space
    height: height * 0.07,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifyButton: {
    backgroundColor: 'rgb(62, 101, 230)',
  },
  cancelButton: {
    backgroundColor: 'white',
    borderColor: 'rgb(224, 226, 233)',
    marginRight: width * 0.02, // Space between the buttons
  },
  cancelButtonText: {
    fontSize: width * 0.032,
    fontFamily: 'Inter-Bold',
    color: 'black',
  },
  buttonText: {
    fontSize: width * 0.032,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
});

export default OTPScreen;
