
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import RoomsScreen from '../screens/RoomsScreen';
import MyRoomsScreen from '../screens/MyRoomsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          height: 65,
          paddingTop: 5,
          paddingBottom: 10,
        },
      }}
    >
      <Tab.Screen
        name="Rooms"
        component={RoomsScreen}
        options={{
          tabBarLabel: 'Стаи',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 23, color }}>💬</Text>
          ),
        }}
      />

      <Tab.Screen
        name="MyRooms"
        component={MyRoomsScreen}
        options={{
          tabBarLabel: 'Моите стаи',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 23, color }}>📚</Text>
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Профил',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 23, color }}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
