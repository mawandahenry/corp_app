import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
  Alert,
  PermissionsAndroid,
  Linking,
  StatusBar,
} from 'react-native';
import BarcodeScannerModal from '../components/scanner';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Buffer} from 'buffer';
import LinearGradient from 'react-native-linear-gradient';
import {io} from 'socket.io-client';
import normalize from 'react-native-normalize';
import {Commands} from '@pushpendersingh/react-native-scanner';
import {CommonActions} from '@react-navigation/native';
import Suspense from '../components/Suspense';
import Fallback from '../components/homeLoader/fallback';
import {removeAsyncData, getAsyncData} from '../utils/constants';
import {ALERT_TYPE, Dialog, Toast} from 'react-native-alert-notification';

const {width, height} = Dimensions.get('window');
const SOCKET_SERVER_URL = 'https://api.molusys.com';

const HomeScreen = ({navigation}) => {
  const [showScanner, setShowScanner] = useState(false);
  const [socket, setSocket] = useState(null);
  const [payload, setSessionPayload] = useState({});
  const [token, setToken] = useState('');
  const [activeDomain, storeDomain] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [scanningShopId, setActiveShopId] = useState(null);
  const [updating, isUpdating] = useState(false);
  const [updatingItem, isUpdatingItem] = useState(false);
  const [loading, setLoading] = useState('PENDING');
  const [itemScanner, setItemScanner] = useState(false);
  const [added, setAdded] = useState(false);

  const scannerRef = useRef(null);
  const scannerRef2 = useRef(null);
  const [scannedData, setScannedData] = useState(null);

  useEffect(() => {
    // Change the loading state to COMPLETED after 3 seconds
    const timer = setTimeout(() => {
      setLoading('COMPLETED');
    }, 3000);

    // Cleanup the timer when the component unmounts
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    checkCameraPermission();
  }, []);

  const closeItemScanner = () => {
    Commands.stopScanning(scannerRef2?.current);
    setScannedData(null);
    setAdded(false);
    setItemScanner(false);
  };

  const openItemDialog = () => {
    setItemScanner(true);
  };

  const handleBarcodeScanned = event => {
    isUpdating(true);
    const {data, bounds, type} = event?.nativeEvent;

    const parsedObject = JSON.parse(data);

    sessionInitializer(parsedObject);
  };

  const handleBarcodeScannedItem = event => {
    isUpdatingItem(true);
    const {data, bounds, type} = event?.nativeEvent;
    setScannedData({data, bounds, type});

    const parsedObject = JSON.parse(data);
    //console.log(data, '=====> scanned');
    sessionItemScan(parsedObject);
  };

  const logOut = async () => {
    Dialog.hide();
    await removeAsyncData('user');
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{name: 'Login'}],
      }),
    );
  };

  const getDomain = email => {
    // Check if the input contains '@'
    if (email.includes('@')) {
      // Split the string at '@' and return the part after it
      return email.split('@')[1];
    } else {
      return null; // Return null if '@' is not found
    }
  };

  // Pause the camera after barcode / QR code is scanned

  const startScanning = () => {
    //console.log(scannerRef.current);
    if (scannerRef?.current) {
      Commands.startCamera(scannerRef?.current);
    }
  };

  const startItemScanning = () => {
    if (scannerRef2?.current) {
      Commands.startCamera(scannerRef2?.current);
    }
  };

  const checkCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs access to your camera to scan codes.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
      } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
        Alert.alert(
          'Permission denied',
          'Camera access is required to use this feature.',
        );
      } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        Alert.alert(
          'Permission permanently denied',
          'Camera access has been permanently denied. Please enable it in the app settings.',
          [
            {text: 'Cancel', style: 'cancel'},
            {
              text: 'Open Settings',
              onPress: () => Linking.openSettings(),
            },
          ],
        );
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const options = [
    {id: '1', name: 'Session Scanner', icon: 'qr-code-scanner'},
    {id: '2', name: 'Item Scanner', icon: 'qr-code-scanner'},
    // { id: '3', name: 'Settings', icon: 'settings' },
    // { id: '4', name: 'Info', icon: 'info' },
    // { id: '5', name: 'Help', icon: 'help' },
    // { id: '6', name: 'Notifications', icon: 'notifications' },
    // { id: '7', name: 'Account', icon: 'account-circle' },
    //{id: '8', name: 'Logout', icon: 'exit-to-app'},
  ];

  React.useEffect(() => {
    (async () => {
      const authUser = await getAsyncData('user');
      if (authUser) {
        const parts = authUser?.token
          .split('.')
          .map(part =>
            Buffer.from(
              part.replace(/-/g, '+').replace(/_/g, '/'),
              'base64',
            ).toString('utf-8'),
          );
        const payload = JSON.parse(parts[1]); // Decode JWT payload
        setToken(authUser?.token);
        setSessionPayload(payload);
        storeDomain(authUser?.user);
      }
    })();
  }, []);

  const onClose = () => {
    Commands.stopScanning(scannerRef?.current);
    setScannedData(null);
    setShowScanner(false);
  };

  const makeModalVisible = type => {
    if (type === 'scanner') {
      startScanning();
      setShowScanner(true);
    }
  };

  const checkSocketStatus = data => {
    if (socket) {
      if (socket.connected) {
        socket.emit('send-message', {
          sessionId: {...data},
          operation: 'ACCEPT',
          administrator: {username: payload?.user?.username},
        });
      } else {
        reinitializeSocket(data);
      }
    } else {
      console.log('Socket is not initialized');
    }
  };

  const reinitializeSocket = data => {
    if (socket) {
      socket.disconnect(); // Disconnect the existing socket
    }

    const newSocket = io(SOCKET_SERVER_URL, {
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      console.log('Socket reconnected successfully');
    });

    setSocket(newSocket);
    newSocket.emit('send-message', {
      sessionId: {...data},
      operation: 'ACCEPT',
      administrator: {username: payload?.user?.username},
    });

    newSocket.on('send-message', message => {
      console.log('reintialized sockets =====>', message);
      if (message?.operation === 'ACCEPT') {
        isUpdating(false);
        onClose();
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Session started',
          textBody: 'Start adding items',
          button: 'open scanner',
          onPressButton: () => openItemsScanner(),
        });
      }

      if (message?.operation === 'SCAN') {
        setAdded(true);
        isUpdatingItem(false);
        closeItemScanner();
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Success',
          textBody: 'Item successfully added',
        });
      } else {
        console.log(message);
      }
      // setShowScanner(false); // Close the current scanner
      // setShowSessionScanner(true); // Open the next step
    });

    newSocket.on('connect_error', error => {
      Alert.alert('Connection Error', 'Could not connect to the server.');
      newSocket.disconnect(); // Disconnect on error
    });
  };

  const sessionInitializer = data => {
    console.log(data);
    setSessionId(data.temp_order_id);
    setActiveShopId(data.shopId);

    if (!socket) {
      console.log('initialized 1st time');
      // Initialize the socket
      const newSocket = io(SOCKET_SERVER_URL, {
        transports: ['websocket'],
      });

      setSocket(newSocket);

      // Set up socket event listeners
      newSocket.on('connect', () => {
        newSocket.emit('send-message', {
          sessionId: {...data},
          operation: 'ACCEPT',
          administrator: {username: payload?.user?.username},
        });
      });

      newSocket.on('send-message', message => {
        //console.log('=====> first', message);

        if (message?.operation === 'ACCEPT') {
          isUpdating(false);
          onClose();
          Dialog.show({
            type: ALERT_TYPE.SUCCESS,
            title: 'Session started',
            textBody: 'Start adding items',
            button: 'open scanner',
            onPressButton: () => openItemsScanner(),
          });
        }
        if (message?.operation === 'SCAN') {
          setAdded(true);
          isUpdatingItem(false);
          closeItemScanner();
          Toast.show({
            type: ALERT_TYPE.SUCCESS,
            title: 'Success',
            textBody: 'Item successfully added',
          });
        } else {
          console.log(message);
          //console.log(scanningShopId, '|=====>', message?.sessionId?.shopId);
        }
      });

      newSocket.on('connect_error', error => {
        Alert.alert('Connection Error', 'Could not connect to the server.');
        newSocket.disconnect();
      });
    } else {
      checkSocketStatus(data);
      socket.emit('send-message', {
        sessionId: {...data},
        operation: 'ACCEPT',
        administrator: {username: payload?.user?.username},
      });
    }
  };

  const openItemsScanner = () => {
    Dialog.hide();
    startItemScanning();
    openItemDialog();
  };

  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  const confirm = async () => {
    Dialog.show({
      type: ALERT_TYPE.DANGER,
      title: 'LogOut',
      textBody: 'Are you sure you want to log out ?',
      button: 'Confirm',
      onPressButton: () => logOut(),
    });
  };

  const sessionItemScan = async scan => {
    let datas = {
      shopId: scanningShopId,
      productId: scan?.productId,
      productCategoryId: scan?.productCategory,
    };

    try {
      const apiUrl =
        'https://mobileapi.molusys.com/mobile-adaptor/v1.0.0/proxy';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          method: 'POST',
          'Content-Type': 'application/json',
          Authorization: token,
          domain: getDomain(activeDomain),
          request: 'system/v1/inventory/shopstock/by/productIdentification',
          service: 'inventory',
        },
        body: JSON.stringify({
          where: datas,
        }),
      });

      // Handle non-OK responses (400/500)
      if (!response.ok) {
        isUpdatingItem(false);
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Error',
          textBody: 'Error while updating item',
        });
        closeItemScanner();
        let errorBody;
        try {
          errorBody = await response.json(); // Try to parse the error body as JSON
          console.error('Response error JSON body:', errorBody); // Log the error JSON
        } catch (jsonError) {
          console.error('Error parsing JSON from response:', jsonError);
          errorBody = {
            message: 'Failed to parse error response as JSON',
            rawBody: await response.text(),
          };
          console.error('Raw error response:', errorBody.rawBody); // Log raw response if JSON parsing fails
        }
        throw new Error(
          `HTTP Error: ${response.status} - ${response.statusText}`,
        );
      }

      const data = await response.json();

      if (data.status) {
        socket.emit('send-message', {
          sessionId: {temp_order_id: sessionId, shopId: scanningShopId},
          operation: 'SCAN',
          scannedData: data.data[0],
        });
      } else {
        console.log('Invalid product identifier');
      }
    } catch (error) {
      console.error('Error during product scan:', error);
    }
  };

  const filteredOptions = options.filter(option => {
    if (option.name === 'Item Scanner') {
      return scanningShopId !== null; // Include 'Item Scanner' only if shopId is not null
    }
    return true; // Include all other options
  });

  return (
    <LinearGradient
      colors={['#FFFFFF', '#3fa2f2', '#3e65e6']} // Blue to White gradient
      style={styles.container}>
      <StatusBar
        barStyle={'dark-content'}
        translucent
        backgroundColor={'transparent'}
      />
      <View style={styles.gradient}>
        <View style={styles.header}>
          <Image
            source={require('../assets/images/man.png')}
            style={styles.avatar}
          />
          <View style={styles.textContainer}>
            <Text style={styles.name}>
              {payload?.user?.username || 'No username'}
            </Text>
            <Text style={styles.role}>
              {payload?.organizations?.[0]?.organizaton?.title || 'No role'}
            </Text>
          </View>
        </View>

        <View style={styles.center} />
      </View>
      <View style={styles.optionsContainer}>
        <Suspense fallback={<Fallback />} loading={loading}>
          <FlatList
            data={filteredOptions}
            numColumns={4} // 4 items per row
            keyExtractor={item => item.id}
            contentContainerStyle={styles.flat}
            style={styles.flat2}
            renderItem={({item}) => (
              <View style={styles.iconBoxContainer}>
                <TouchableOpacity
                  style={styles.iconBox}
                  onPress={() => {
                    if (item.name === 'Session Scanner') {
                      makeModalVisible('scanner');
                    } else {
                      openItemsScanner();
                    }
                  }}>
                  <Icon name={item.icon} size={normalize(60)} color={'#333'} />
                </TouchableOpacity>
                <Text style={styles.iconLabel}>{item?.name}</Text>
              </View>
            )}
          />
        </Suspense>
      </View>

      <TouchableOpacity style={styles.footer} onPress={confirm}>
        {/* <TouchableOpacity style={styles.touchable}> */}
        <Icon
          name={'exit-to-app'}
          size={normalize(35)}
          color={'red'}
          style={styles.icon}
        />
        {/* </TouchableOpacity> */}

        <Text style={styles.logOut}>Log Out</Text>
      </TouchableOpacity>

      <BarcodeScannerModal
        open={showScanner}
        ref={scannerRef}
        onClose={onClose}
        handleBarcodeScanned={handleBarcodeScanned}
        isUpdating={updating}
      />

      <BarcodeScannerModal
        open={itemScanner}
        ref={scannerRef2}
        onClose={closeItemScanner}
        handleBarcodeScanned={handleBarcodeScannedItem}
        isUpdating={updatingItem}
        added={added}
      />
    </LinearGradient>
  );
};

// Updated styles for consistent layout
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(246, 248, 251)',
  },
  header: {
    alignItems: 'center', // Align items vertically centered
    justifyContent: 'center',
    flex: 0.9,
  },
  avatar: {
    width: normalize(80),
    height: normalize(80),
    borderRadius: normalize(40),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  touchable: {
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  gradient: {flex: 0.4},
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: normalize(20),
    fontFamily: 'Poppins-Bold',
  },
  flat: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    //backgroundColor: 'red',
  },
  flat2: {
    //flexGrow: 1,
    top: normalize(-50),
    //backgroundColor: 'red',
  },
  role: {
    fontSize: normalize(15),
    color: '#333333',
    fontFamily: 'Poppins-Regular',
  },
  center: {flex: 0.1},
  footer: {
    flexDirection: 'row',
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'red',
    //borderRadius: normalize(20),
  },
  optionsContainer: {
    padding: width * 0.04,
    flex: 0.5,
    borderTopLeftRadius: normalize(50),
    borderTopRightRadius: normalize(50),
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  sectionTitle: {
    fontSize: width * 0.035,
    color: '#555555',
    marginBottom: height * 0.02,
    fontFamily: 'Poppins-Bold',
  },

  logOut: {
    color: 'red',
    fontFamily: 'Poppins-Regular',
    fontSize: normalize(15),
  },
  iconBoxContainer: {
    width: width * 0.35, // 20% of screen width
    height: width * 0.35, // Equal height to width for square
    alignItems: 'center',
    justifyContent: 'center',
    margin: normalize(15),
    left: normalize(15),
  },
  iconBox: {
    width: width * 0.35, // 20% of screen width
    height: width * 0.35, // Equal height to width for square
    backgroundColor: 'rgba(255, 255, 255, 1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5, // Shadow for Android
    //top: normalize(-50),
  },
  iconLabel: {
    fontSize: width * 0.03, // Responsive font size
    color: '#333333',
    textAlign: 'center',
    marginTop: height * 0.01,
    fontFamily: 'Poppins-Regular',
    //backgroundColor: 'pink',
  },
});

export default HomeScreen;
