import AsyncStorage from '@react-native-async-storage/async-storage';
export const storeAsyncData = async (key, value) => {
  try {
    const jsonValue =
      value instanceof Object || Array.isArray(value)
        ? JSON.stringify(value)
        : value;
    await AsyncStorage.setItem(key, jsonValue);
  } catch (err) {
    return err;
  }
};

/**
 * Reads a value from local storage
 * @param key
 * @returns
 */
export const getAsyncData = async key => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue !== null ? JSON.parse(jsonValue) : null;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const removeAsyncData = async key => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (err) {
    return err;
  }
};

//import AsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
/**
 * Stores data in local storage
 * @param key
 * @param value
 */

export const HTTP_STATUS = Object.freeze({
  IDLE: 'IDLE',
  PENDING: 'PENDING',
  FULFILLED: 'FULFILLED',
  REJECTED: 'REJECTED ',
});
