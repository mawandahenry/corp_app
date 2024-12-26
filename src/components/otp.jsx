import React from 'react';
import {OtpInput} from 'react-native-otp-entry';
import PropTypes from 'prop-types';
import {StyleSheet, Text, View} from 'react-native';
import ShouldRender from './ShouldRender';
import normalize from 'react-native-normalize';

const OtpInputForm = React.forwardRef(
  ({handleChange, error, numberOfInputs, verify}, ref) => {
    return (
      <View style={styles.container}>
        <OtpInput
          ref={ref}
          handleChange={code => handleChange(code)}
          focusColor={'#0054a7'}
          numberOfDigits={numberOfInputs}
          type="numeric"
          theme={{
            containerStyle: styles.textInputContainer,
            pinCodeContainerStyle: styles.pinCodeContainer,
            pinCodeTextStyle: styles.pinCodeText,
            focusStickStyle: styles.focusStick,
            focusedPinCodeContainerStyle: styles.activePinCodeContainer,
            placeholderTextStyle: styles.placeholderText,
            filledPinCodeContainerStyle: styles.filledPinCodeContainer,
            disabledPinCodeContainerStyle: styles.disabledPinCodeContainer,
          }}
          onTextChange={text => handleChange(text)}
          onFilled={text => verify(text)}
        />
      </View>
    );
  },
);

OtpInputForm.displayName = 'OtpInput';

OtpInputForm.propTypes = {
  handleChange: PropTypes.func,
  error: PropTypes.string,
  numberOfInputs: PropTypes.number,
  inputStyles: PropTypes.shape({}),
};

OtpInput.defaultProps = {
  numberOfInputs: 4,
  inputStyles: {},
};

const styles = StyleSheet.create({
  container: {
    height: normalize(90),
    alignItems: 'flex-start',
    top: normalize(0),
    width: '100%',
    //backgroundColor: 'red',
  },
  textInputContainer: {
    //marginBottom: normalize(50),
  },
  roundedTextInput: {
    borderRadius: normalize(9),
    borderWidth: 1,
    width: normalize(50),
    height: normalize(50),
    padding: normalize(3),
    backgroundColor: 'transparent',
    fontSize: normalize(18),
    fontWeight: 'bold',
    marginRight: normalize(8),
    borderColor: '#7C7C7C',
    textAlign: 'center',
    fontFamily: 'Gilroy-Bold',
    color: '#7C7C7C',
  },
  error: {
    marginLeft: normalize(15),
    marginTop: 5,
  },
  errorMsg: {
    color: 'red',
    fontFamily: 'Poppins-Regular',
  },
  pinCodeContainer: {
    width: normalize(60),
  },
});

export default OtpInputForm;
