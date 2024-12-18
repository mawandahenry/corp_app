import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, FlatList } from 'react-native';
import BarcodeScannerModal from '../components/scanner';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Buffer } from 'buffer';
import SessionStorage from 'react-native-session-storage';
import { io } from 'socket.io-client';
import { Alert } from 'react-native';

const { width, height } = Dimensions.get('window');
const SOCKET_SERVER_URL = 'https://api.molusys.com';

const HomeScreen = () => {
  const [showScanner, setShowScanner] = useState(false);
  const [showSessionScanner, setShowSessionScanner] = useState(false);
  const [socket, setSocket] = useState(null);
  const [payload, setSessionPayload] = useState({});
  const [token, setToken] = useState('');
  const [activeDomain, storeDomain] = useState('');
  const [sessionId,setSessionId] = useState('');
  const [scanningShopId,setActiveShopId] = useState('');

  const sessionIntData = {shopId: '656f3ab70e60e13ab3dddaee', temp_order_id: 768296}
  const scanData = { "shopId": "1234567890", "productId": "QR_CODE","productCategoryId":"productId"}


  const options = [
    { id: '1', name: 'QR Scanner', icon: 'qr-code-scanner' },
    // { id: '2', name: 'Home', icon: 'home' },
    // { id: '3', name: 'Settings', icon: 'settings' },
    // { id: '4', name: 'Info', icon: 'info' },
    // { id: '5', name: 'Help', icon: 'help' },
    // { id: '6', name: 'Notifications', icon: 'notifications' },
    // { id: '7', name: 'Account', icon: 'account-circle' },
    { id: '8', name: 'Logout', icon: 'exit-to-app' },
  ];

  useEffect(() => {
    const storedToken = SessionStorage.getItem('@token_data');
    const storedDomain = SessionStorage.getItem('@domain');
  
    if (storedToken !== null && storedToken !=undefined) {
      try {
        const parts = storedToken.split('.').map((part) =>
          Buffer.from(part.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8')
        );
        const payload = JSON.parse(parts[1]); // Decode JWT payload
        setToken(storedToken)
        storeDomain(storedDomain)
        setSessionPayload(payload);
      } catch (error) {
        console.log("Error parsing token", error);
      }
    } else {
      console.log('No token found in session storage.');
    }
  },[]);
  
 

  const onClose = () => {
    setShowScanner(false);
  };

  const makeModalVisible = (type: string) => {
    if (type === 'scanner') {
      console.log('Button pressed! Scan');
      setShowScanner(true);
    }
  };

  const sessionInitializer = (data) => {
    console.log('Scanned data:', data.sessionId);
    setSessionId(data.temp_order_id)
    setActiveShopId(data.shopId)
    // Initialize the socket connection here (only once)
    if (!socket) {
      const newSocket = io(SOCKET_SERVER_URL, {
        transports: ['websocket'],
      });
  
      setSocket(newSocket);
  
      newSocket.on('connect', () => {
        console.log('Socket connected');
        newSocket.emit('send-message', {sessionId:{...data},operation:"ACCEPT",administrator:{username:payload?.user?.username}});
  
        newSocket.on('send-message', (message) => {
          console.log(message);
          Alert.alert('Success', 'Session registered successfully!');
          setShowScanner(false); // Close the current scanner
          setShowSessionScanner(true); // Open the next step
        });
      });
  
      newSocket.on('connect_error', (error) => {
        Alert.alert('Connection Error', 'Could not connect to the server.');
        newSocket.disconnect(); // Disconnect on error
      });
    }
  };
  

  const sessionItemScan = async (scannedData) => {
    let datas = {
      "shopId": "66114041988f446d9a6e2ff4",
      "productId": "65700ad94b3e415355e911c5",
      "productCategoryId": "656f3bdc0e60e13ab3ddddf8"
    };
  
    try {
      const apiUrl = 'https://mobileapi.molusys.com/mobile-adaptor/v1.0.0/proxy';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          "method": "POST",
          "Content-Type": "application/json",
          "Authorization": token,  
          "domain": activeDomain,
          "request": "system/v1/inventory/shopstock/by/productIdentification",
          "service": "inventory"
        },
        body: JSON.stringify({
          where: {
            shopId: datas.shopId,
            productId: datas.productId,
            productCategoryId: datas.productCategoryId
          }
        }),
      });
  
      // Handle non-OK responses (400/500)
      if (!response.ok) {
        let errorBody;
        try {
          errorBody = await response.json(); // Try to parse the error body as JSON
          console.error('Response error JSON body:', errorBody); // Log the error JSON
        } catch (jsonError) {
          console.error('Error parsing JSON from response:', jsonError);
          errorBody = { message: 'Failed to parse error response as JSON', rawBody: await response.text() };
          console.error('Raw error response:', errorBody.rawBody); // Log raw response if JSON parsing fails
        }
        throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
      }
  
      const data = await response.json();
  
      if (data.status) {
        socket.emit('send-message', {sessionId:{temp_order_id: sessionId, shopId: scanningShopId},operation:"SCAN",scannedData:data.data[0]});
      } else {
        console.log('Invalid product identifier');
      }
    } catch (error) {
      console.error('Error during product scan:', error);
    }
  };
  

  const closeSessionScanner = () => {
    setShowSessionScanner(false)
  }
  

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Image source={require('../assets/images/man.png')} style={styles.avatar} />
        <View style={styles.textContainer}>
        <Text style={styles.name}>{payload?.user?.username || 'No username'}</Text>
        <Text style={styles.role}>{payload?.organizations?.[0]?.organizaton?.title || 'No role'}</Text>
        </View>
      </View>

      {/* Options */}
      <View style={styles.optionsContainer}>
        <Text style={styles.sectionTitle}>Features</Text>
        
        {/* Render icons using FlatList */}
        <FlatList
          data={options}
          numColumns={4} // 4 items per row
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.iconBoxContainer}>
              <TouchableOpacity
                style={styles.iconBox}
                onPress={() => item.name === 'QR Scanner' && makeModalVisible('scanner')}
              >
                <Icon name={item.icon} size={30} color="#333" />
              </TouchableOpacity>
              <Text style={styles.iconLabel}>{item.name}</Text>
            </View>
          )}
          contentContainerStyle={styles.iconList}
        />
      </View>

      {/* Show Barcode Scanner Modal when `showScanner` is true */}
      {showScanner && <BarcodeScannerModal onBarcodeScan={sessionInitializer} onClose={onClose} title="Scan to start session" data={sessionIntData}/>}
      {showSessionScanner && <BarcodeScannerModal onBarcodeScan={sessionItemScan} onClose={closeSessionScanner} title="Scan session items" data={scanData}/>}
    </View>
  );
};

// Updated styles for consistent layout
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(246, 248, 251)',
  },
  header: {
    flexDirection: 'row', // Arrange elements in a row
    alignItems: 'center', // Align items vertically centered
    paddingVertical: height * 0.03,
    paddingHorizontal: width * 0.05,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  avatar: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: 5,
    marginRight: width * 0.04,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: width * 0.038,
    fontWeight: '600',
    color: '#333333',
  },
  role: {
    fontSize: width * 0.025,
    color: '#0054a7',
    fontWeight: "600",
  },
  optionsContainer: {
    padding: width * 0.04,
  },
  sectionTitle: {
    fontSize: width * 0.035,
    color: '#555555',
    marginBottom: height * 0.02,
    fontWeight: "600",
  },
  iconList: {
    justifyContent: 'space-evenly',
    marginBottom: height * 0.04, 
  },
  iconBoxContainer: {
    alignItems: 'center',
    width: '25%', // Ensure 4 icons per row (100% / 4 = 25%)
    marginBottom: height * 0.02,
  },
  iconBox: {
    width: width * 0.2, // 20% of screen width
    height: width * 0.2, // Equal height to width for square
    backgroundColor: 'rgba(255, 255, 255, 1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5, // Shadow for Android
  },
  iconLabel: {
    fontSize: width * 0.03, // Responsive font size
    color: '#333333',
    textAlign: 'center',
    marginTop: height * 0.01,
  },
});

export default HomeScreen;