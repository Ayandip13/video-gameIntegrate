import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import VideoTopicsScreen from '../screens/VideoTopicsScreen';
import VideoPlayerScreen from '../screens/VideoPlayerScreen';
import GamesScreen from '../screens/GamesScreen';
import GamePlayerScreen from '../screens/GamePlayerScreen';

export type RootStackParamList = {
    Home: undefined;
    VideoTopics: undefined;
    VideoPlayer: {
        topic: {
            id: string;
            title: string;
            duration: number;
        };
    };
    Games: undefined;
    GamePlayer: {
        uri: string;
        title: string;
    };
};


const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="VideoTopics"
                    component={VideoTopicsScreen}
                    options={{
                        headerTitle: `Video Topics`,
                        headerBackTitle: 'Back',
                        headerTitleStyle: {
                            fontSize: 22,
                        },
                    }}
                />
                <Stack.Screen
                    name="VideoPlayer"
                    component={VideoPlayerScreen}
                    options={{
                        headerTitle: 'Video Player',
                        headerBackTitle: 'Back',
                        headerTitleStyle: {
                            fontSize: 22,
                        },
                    }}
                />
                <Stack.Screen
                    name="Games"
                    component={GamesScreen}
                    options={{
                        headerTitle: 'Games',
                        headerBackTitle: 'Back',
                        headerTitleStyle: {
                            fontSize: 22,
                        },
                    }}
                />
                <Stack.Screen
                    name="GamePlayer"
                    component={GamePlayerScreen}
                    options={{
                        headerTitle: 'Game Player',
                        headerBackTitle: 'Back',
                        headerTitleStyle: {
                            fontSize: 22,
                        },
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
