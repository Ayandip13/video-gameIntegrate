import { View, Text, Button, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Home</Text>
            <TouchableOpacity
                style={{
                    margin: 10,
                    padding: 10,
                    backgroundColor: 'blue',
                    borderRadius: 5
                }}
                onPress={() => navigation.navigate('VideoTopics')}>
                <Text style={{ color: 'white' }}>Video Topics</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={{
                    margin: 10,
                    padding: 10,
                    backgroundColor: 'blue',
                    borderRadius: 5
                }}
                onPress={() => navigation.navigate('Games')}>
                <Text style={{ color: 'white' }}>Games</Text>
            </TouchableOpacity>
        </View>
    );
}
