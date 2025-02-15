import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import SessionStorage from 'react-native-session-storage';
import {Toast, ALERT_TYPE} from 'react-native-alert-notification';
import normalize from 'react-native-normalize';
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withSpring,
//   withRepeat,
// } from 'react-native-reanimated';

const {width, height} = Dimensions.get('window');

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('admin@williex.com');
  const [password, setPassword] = useState('1701W1990');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // const offset = useSharedValue(width / 2 - 240);

  // const animatedStyles = useAnimatedStyle(() => ({
  //   transform: [{translateX: offset.value}],
  // }));

  // React.useEffect(() => {
  //   offset.value = withRepeat(withSpring(-offset.value), -1, true);
  // }, [offset]);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const apiUrl =
        'https://mobileapi.molusys.com/mobile-adaptor/v1.0.0/authentication';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();

      if (data.status) {
        console.log(data);
        storeToken(data.token);
        //
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Login error',
          textBody: 'Invalid credentials',
        });
      }
    } catch (error) {
      console.log(error.Error);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Login error',
        textBody: 'error',
      });
    } finally {
      setLoading(false); // Ensure spinner stops after login attempt
    }
  };

  const storeToken = async token => {
    try {
      // Store the token in session storage
      await SessionStorage.setItem('@token_data', token);
      await SessionStorage.setItem('@domain', email.split('@')[1]);

      // Retrieve the stored token to confirm
      const storedToken = await SessionStorage.getItem('@token_data');
      if (storedToken !== null) {
        navigation.replace('OTP');
      } else {
        console.log('No token found in session storage.');
      }
    } catch (error) {
      console.error('Error storing token in session storage:', error);
    }
  };

  return (
    <View style={[styles.container]}>
      <Text style={styles.loginText}>ACCOUNT AUTHENTICATION</Text>

      {/* Input fields for email and password */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Login Button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <View style={styles.buttonContent}>
          {loading && (
            <ActivityIndicator
              size="small"
              color="#fff"
              style={styles.spinner}
            />
          )}
          <Text style={styles.buttonText}>AUTHENTICATE</Text>
        </View>
      </TouchableOpacity>

      {/* Error Message */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(254, 254, 254)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.05, // 5% of screen width
  },
  loginText: {
    fontSize: normalize(15), // Responsive font size
    color: '#333333',
    //fontWeight: 'bold',
    fontFamily: 'Poppins-ExtraBold',
    textAlign: 'right',
    marginBottom: height * 0.03, // 3% of screen height for spacing
  },
  input: {
    width: '90%',
    height: height * 0.07,
    backgroundColor: 'rgb(246, 245, 247)',
    borderRadius: 5,
    borderColor: 'rgb(221, 222, 230)',
    borderWidth: 1,
    paddingHorizontal: width * 0.04,
    fontSize: width * 0.03,
    color: '#333333',
    marginBottom: height * 0.02,
    fontFamily: 'Poppins-Regular',
  },
  button: {
    width: '90%',
    height: height * 0.06,
    backgroundColor: 'rgb(62, 101, 230)',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.01,
  },
  buttonContent: {
    flexDirection: 'row', // Align spinner and text horizontally
    alignItems: 'center', // Center vertically
  },
  spinner: {
    marginRight: 10, // Space between spinner and text
  },
  buttonText: {
    color: 'white',
    fontSize: width * 0.03,
    fontFamily: 'Poppins-Bold',
  },
  errorText: {
    color: '#FF4D4D',
    fontSize: width * 0.04,
    marginBottom: height * 0.02,
  },
});

export default LoginScreen;
