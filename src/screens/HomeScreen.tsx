import { View, Text, Pressable, StyleSheet, StatusBar } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
    return (
        <View style={styles.container}>
            <StatusBar
                barStyle="light-content"
                backgroundColor="#111"
            />
            <View style={styles.header}>
                <Text style={styles.title}>Learning Hub</Text>
                <Text style={styles.subtitle}>
                    Choose what you'd like to explore
                </Text>
            </View>

            <View style={styles.content}>
                <Pressable
                    style={styles.card}
                    onPress={() => navigation.navigate('VideoTopics')}
                >
                    <View style={styles.cardIcon}>
                        <Text style={styles.iconText}>📺</Text>
                    </View>
                    <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>Video Topics</Text>
                        <Text style={styles.cardDescription}>
                            Watch educational videos with interactive activities
                        </Text>
                    </View>
                    <Text style={styles.cardArrow}>→</Text>
                </Pressable>

                <Pressable
                    style={styles.card}
                    onPress={() => navigation.navigate('Games')}
                >
                    <View style={styles.cardIcon}>
                        <Text style={styles.iconText}>🎮</Text>
                    </View>
                    <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>Games</Text>
                        <Text style={styles.cardDescription}>
                            Download and play educational games offline
                        </Text>
                    </View>
                    <Text style={styles.cardArrow}>→</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0a',
    },
    header: {
        paddingTop: 20,
        paddingHorizontal: 20,
        paddingBottom: 30,
        backgroundColor: '#111',
    },
    title: {
        color: '#fff',
        fontSize: 32,
        fontWeight: '700',
        marginBottom: 8,
    },
    subtitle: {
        color: '#888',
        fontSize: 16,
    },
    content: {
        padding: 20,
    },
    card: {
        backgroundColor: '#1a1a1a',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#2a2a2a',
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardIcon: {
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: '#2a2a2a',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    iconText: {
        fontSize: 24,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 6,
    },
    cardDescription: {
        color: '#888',
        fontSize: 14,
        lineHeight: 20,
    },
    cardArrow: {
        color: '#4CAF50',
        fontSize: 24,
        fontWeight: '700',
        marginLeft: 12,
    },
});
