import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
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
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerSubtitle}>
                    Choose a topic to start learning
                </Text>
            </View>

            <FlatList
                data={TOPICS}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() =>
                            navigation.navigate('VideoPlayer', {
                                topic: item,
                            })
                        }
                        style={styles.topicCard}
                    >
                        <View style={styles.topicInfo}>
                            <Text style={styles.topicTitle}>{item.title}</Text>
                            <Text style={styles.topicDuration}>
                                {item.duration} minute{item.duration > 1 ? 's' : ''}
                            </Text>
                        </View>
                        <Text style={styles.playIcon}>▶</Text>
                    </Pressable>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    headerSubtitle: {
        color: '#666',
        fontSize: 18,
    },
    listContent: {
        padding: 16,
    },
    topicCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 18,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    topicInfo: {
        flex: 1,
    },
    topicTitle: {
        color: '#333',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 6,
    },
    topicDuration: {
        color: '#666',
        fontSize: 14,
    },
    playIcon: {
        color: '#4CAF50',
        fontSize: 24,
        marginLeft: 12,
    },
});
