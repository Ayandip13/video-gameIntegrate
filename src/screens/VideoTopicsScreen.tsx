import { View, Text, FlatList, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'VideoTopics'>;

const TOPICS = [
    { id: '1', title: 'Alphabet Sounds', duration: 3 },
    { id: '2', title: 'Basic Words', duration: 4 },
    { id: '3', title: 'Sentence Building', duration: 5 },
];

export default function VideoTopicsScreen({ navigation }: Props) {
    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Text style={{ fontSize: 20, marginBottom: 12 }}>Video Topics</Text>

            <FlatList
                data={TOPICS}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() =>
                            navigation.navigate('VideoPlayer', {
                                topic: item,
                            } as any)
                        }
                        style={{
                            padding: 16,
                            borderWidth: 1,
                            borderRadius: 8,
                            marginBottom: 12,
                        }}
                    >
                        <Text style={{ fontSize: 16 }}>{item.title}</Text>
                        <Text>{item.duration} min</Text>
                    </Pressable>
                )}
            />
        </View>
    );
}
