

import { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';


import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen({ onRegister }) {
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      Alert.alert('Грешка', 'Попълни всички полета.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      Alert.alert('Грешка', 'Въведи валиден имейл адрес.');
      return;
    }

    try {
      setLoading(true);

      await signIn(cleanEmail, password);
    } catch (error) {
      Alert.alert(
        'Неуспешен вход',
        error.message || 'Възникна грешка.'
      );
    } finally {
      setLoading(false);
    }
  };


return (
  <KeyboardAwareScrollView
    style={styles.container}
    contentContainerStyle={styles.content}
    keyboardShouldPersistTaps="handled"
    keyboardDismissMode="on-drag"
    bottomOffset={130}
  >


        <Text style={styles.title}>LinguaRoom BG</Text>

        <Text style={styles.subtitle}>
          Практикувай чужди езици с други хора!
        </Text>

        <Text style={styles.heading}>Вход</Text>

     
<TextInput
  style={styles.input}
  placeholder="Имейл"
  keyboardType="email-address"
  autoCapitalize="none"
  autoComplete="email"
  returnKeyType="next"
  value={email}
  onChangeText={setEmail}
/>


     
<TextInput
  style={styles.input}
  placeholder="Парола"
  secureTextEntry
  autoComplete="password"
  returnKeyType="done"
  value={password}
  onChangeText={setPassword}
/>


        <TouchableOpacity
          style={[
            styles.button,
            loading && styles.disabledButton,
          ]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Вход</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onRegister}
          disabled={loading}
          style={styles.registerButton}
        >
          <Text style={styles.registerText}>
            Нямаш профил? Регистрирай се
          </Text>
        </TouchableOpacity>
    
    </KeyboardAwareScrollView>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },
 

content: {
  flexGrow: 1,
  justifyContent: 'flex-start',
  paddingHorizontal: 24,
  paddingTop: 30,
  paddingBottom: 50,
},


  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2563eb',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 20,
  },

input: {
  backgroundColor: '#fff',
  borderWidth: 1,
  borderColor: '#cbd5e1',
  borderRadius: 10,
  paddingVertical: 10,
  paddingHorizontal: 14,
  fontSize: 16,
  marginBottom: 10,
},

 
button: {
  backgroundColor: '#2563eb',
  paddingVertical: 12,
  paddingHorizontal: 16,
  borderRadius: 10,
  alignItems: 'center',
  marginTop: 5,
},

  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  registerButton: {
    marginTop: 25,
    alignItems: 'center',
    padding: 8,
  },
  registerText: {
    color: '#2563eb',
    fontSize: 15,
  },
});
