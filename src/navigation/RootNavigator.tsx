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
            <Stack.Navigator
                screenOptions={({ navigation, route }) => ({
                    headerShown: route.name !== 'Home',
                    headerStyle: {
                        backgroundColor: '#111',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: '600',
                        fontSize: 18,
                    },
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={{ marginLeft: 8 }}
                        >
                            <Entypo name="chevron-left" size={28} color="white" />
                        </TouchableOpacity>
                    ),
                    headerTitle: '',
                    headerBackVisible: false,
                })}
            >
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                />
                <Stack.Screen
                    name="VideoTopics"
                    component={VideoTopicsScreen}
                />
                <Stack.Screen
                    name="VideoPlayer"
                    component={VideoPlayerScreen}
                />
                <Stack.Screen
                    name="Games"
                    component={GamesScreen}
                />
                <Stack.Screen
                    name="GamePlayer"
                    component={GamePlayerScreen}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
