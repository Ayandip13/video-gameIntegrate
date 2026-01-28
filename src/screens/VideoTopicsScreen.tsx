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
                <Text style={styles.headerTitle}>Video Topics</Text>
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
        backgroundColor: '#0a0a0a',
    },
    header: {
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: '#111',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 6,
    },
    headerSubtitle: {
        color: '#888',
        fontSize: 14,
    },
    listContent: {
        padding: 16,
    },
    topicCard: {
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        padding: 18,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#2a2a2a',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    topicInfo: {
        flex: 1,
    },
    topicTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 6,
    },
    topicDuration: {
        color: '#888',
        fontSize: 14,
    },
    playIcon: {
        color: '#4CAF50',
        fontSize: 24,
        marginLeft: 12,
    },
});
