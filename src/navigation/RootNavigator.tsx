import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="VideoTopics" component={VideoTopicsScreen} />
                <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} />
                <Stack.Screen name="Games" component={GamesScreen} />
                <Stack.Screen name="GamePlayer" component={GamePlayerScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
