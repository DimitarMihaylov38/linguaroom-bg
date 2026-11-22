
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import {
  AuthProvider,
  useAuth,
} from './src/contexts/AuthContext';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import CreateRoomScreen from './src/screens/CreateRoomScreen';
import MainTabs from './src/navigation/MainTabs';

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.subtitle}>Зареждане...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {session ? (
        <Stack.Navigator>
          <Stack.Screen
            name="Main"
            component={MainTabs}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="CreateRoom"
            component={CreateRoomScreen}
            options={{
              title: 'Създай стая',
              headerBackTitle: 'Назад',
            }}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            options={{ headerShown: false }}
          >
            {({ navigation }) => (
              <LoginScreen
                onRegister={() =>
                  navigation.navigate('Register')
                }
              />
            )}
          </Stack.Screen>

          <Stack.Screen
            name="Register"
            options={{ title: 'Регистрация' }}
          >
            {({ navigation }) => (
              <RegisterScreen
                onLogin={() =>
                  navigation.navigate('Login')
                }
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <KeyboardProvider>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fb',
  },
  subtitle: {
    marginTop: 15,
    fontSize: 16,
    color: '#475569',
  },
});

