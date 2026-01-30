import { View, Text, Pressable, StyleSheet, StatusBar } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
    return (
        <View style={styles.container}>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="#ffffff"
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
        backgroundColor: '#f5f5f5',
    },
    header: {
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 30,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    title: {
        color: '#333',
        fontSize: 32,
        fontWeight: '700',
        marginBottom: 8,
    },
    subtitle: {
        color: '#666',
        fontSize: 16,
    },
    content: {
        padding: 20,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardIcon: {
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: '#f0f0f0',
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
        color: '#333',
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 6,
    },
    cardDescription: {
        color: '#666',
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
