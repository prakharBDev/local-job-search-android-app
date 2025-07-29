import React, { useState, useMemo, useCallback } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

const Login = ({ onLogin }) => {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const styles = useMemo(() => getStyles(theme || {}), [theme]);

  const handleLogin = useCallback(() => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (onLogin) {
      onLogin(email, password);
    } else {
      Alert.alert('Login', `Email: ${email}\nPassword: ${password}`);
    }
  }, [email, password, onLogin]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
      backgroundColor: theme?.colors?.background?.primary || '#FFFFFF',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 30,
      color: theme?.colors?.text?.primary || '#1E293B',
    },
    input: {
      borderWidth: 1,
      borderColor: theme?.colors?.border?.primary || '#E2E8F0',
      padding: 15,
      marginBottom: 15,
      borderRadius: 8,
      fontSize: 16,
    },
    button: {
      backgroundColor: theme?.colors?.primary?.cyan || '#6174f9',
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
    },
    buttonText: {
      color: theme?.colors?.text?.white || '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

export default Login;
