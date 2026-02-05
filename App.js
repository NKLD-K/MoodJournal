import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import AddMoodScreen from './src/screens/AddMoodScreen';


const Stack = createStackNavigator()


export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style='light'/>
      <Stack.Navigator
          screenOptions={{ 
            headerShown: false,
            cardStyleInterpolator: ({current, layouts}) =>{
              return {
                cardStyle: {
                  transform: [
                    {
                      translateX: current.progress.interpolate({
                        inputRange: [0,1],
                        outputRange: [layouts.screen.width, 0]
                      })
                    }
                  ]
                }
              }
            }
           }}
      >
        <Stack.Screen name='Home' component={HomeScreen} />
        <Stack.Screen name='AddMood' component={AddMoodScreen}/>
        <Stack.Screen name='History' component={HistoryScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}