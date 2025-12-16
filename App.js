import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

import PokedexScreen from './src/screens/PokedexScreen';
import CollectionScreen from './src/screens/CollectionScreen';
import DetailsScreen from './src/screens/DetailsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === 'Pokédex') {
                iconName = focused ? 'list' : 'list-outline';
              } else if (route.name === 'Mi Colección') {
                iconName = focused ? 'albums' : 'albums-outline';
              }
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#e74c3c',
            tabBarInactiveTintColor: 'gray',
            headerStyle: {
              backgroundColor: '#e74c3c',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          })}
        >
          <Tab.Screen name="Pokédex" component={PokedexScreen} />
          <Tab.Screen name="Mi Colección" component={CollectionScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
