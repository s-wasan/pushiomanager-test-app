/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Text,
  StatusBar,
  Platform,
  TouchableOpacity,
  TextInput,
  ToastAndroid,
  Alert,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import PushIOManager from 'react-native-pushiomanager';

const App: () => React$Node = () => {
  const [canRegisterUser, setCanRegisterUser] = useState(false);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    PushIOManager.configure(
      'pushio_config.json',
      (configureError, configureResponse) => {
        if (configureResponse === 'success') {
          if (Platform.OS === 'android') {
            PushIOManager.registerApp(
              true,
              (registerError, registerResponse) => {
                if (registerResponse === 'success') {
                  setCanRegisterUser(true);
                } else {
                  setCanRegisterUser(false);
                }
              },
            );
          } else {
            PushIOManager.registerForAllRemoteNotificationTypes(
              (error, response) => {
                PushIOManager.registerApp(true, (error, response) => {});
              },
            );
          }
        } else {
          setCanRegisterUser(false);
        }
      },
    );
  }, []);

  const registerUser = () => {
    if (!canRegisterUser) {
      Alert.alert('Unable to register user.');
      return;
    }
    if (userId) {
      PushIOManager.registerUserId(userId);
      ToastAndroid.show('User ID registered', ToastAndroid.SHORT);
    } else {
      Alert.alert('Please informe the user ID first.');
    }
  };

  const unregisterUser = () => {
    PushIOManager.unregisterUserId();
    ToastAndroid.show('User ID unregistered', ToastAndroid.SHORT);
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <TextInput
            style={styles.input}
            placeholder="User ID for registration"
            value={userId}
            onChangeText={(text) => {
              setUserId(text);
            }}
          />

          <TouchableOpacity
            onPress={registerUser}
            style={{
              ...styles.button,
              ...styles.registerButton,
            }}>
            <Text style={{textAlign: 'center', color: 'white'}}>
              Register User
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={unregisterUser}
            style={{
              ...styles.button,
              ...styles.unregisterButton,
            }}>
            <Text style={{textAlign: 'center', color: 'white'}}>
              Unregister User
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  button: {
    height: 58,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 24,
    marginTop: 16,
  },
  registerButton: {backgroundColor: '#7cb342'},
  unregisterButton: {backgroundColor: '#e53935'},
  input: {
    borderColor: '#333',
    borderWidth: 0.3,
    padding: 8,
    margin: 24,
  },
});

export default App;
