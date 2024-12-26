import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import OtpInput from '../components/otp';
import normalize from 'react-native-normalize';
import {Toast, ALERT_TYPE} from 'react-native-alert-notification';

// Get the screen width and height
const {width, height} = Dimensions.get('window');

const OTPScreen = ({navigation}) => {
  const [error, setError] = useState('');

  const handleVerify = otp => {
    // const enteredOtp = otp.join('');
    if (otp === '1234') {
      navigation.replace('Home');
    } else {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Login error',
        textBody: 'Invalid OTP',
      });
    }
  };

  const handleResendCode = () => {
    alert('Code has been resent!');
  };

  const handleChange = e => {
    console.log(e);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter one time password</Text>

      {/* OTP Input */}
      <View style={styles.otpContainer}>
        <OtpInput
          numberOfInputs={4}
          handleChange={handleChange}
          verify={handleVerify}
          error={error}
        />
      </View>

      {/* Buttons on the same line */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={handleResendCode}>
          <Text style={styles.cancelButtonText}>Resend code</Text>
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
    fontSize: normalize(18),
    //color: '#333333',
    fontFamily: 'Poppins-Medium',
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
  },
  button: {
    flex: 1, // Buttons take equal space
    height: height * 0.07,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifyButton: {
    //backgroundColor: 'rgb(62, 101, 230)',
  },
  cancelButton: {
    backgroundColor: 'white',
    borderColor: 'rgb(224, 226, 233)',
    marginRight: width * 0.02, // Space between the buttons
  },
  cancelButtonText: {
    fontSize: width * 0.032,
    fontFamily: 'Poppins-Regular',
    color: 'black',
  },
  buttonText: {
    fontSize: width * 0.032,
    fontFamily: 'Poppins-Regular',
    color: '#FFFFFF',
  },

  buttonText2: {
    fontSize: width * 0.032,
    fontFamily: 'Poppins-Regular',
    color: 'rgb(62, 101, 230)',
  },
});

export default OTPScreen;
