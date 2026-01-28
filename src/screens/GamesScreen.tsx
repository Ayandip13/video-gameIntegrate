import {
    View,
    Text,
    Pressable,
    FlatList,
    ActivityIndicator,
    StyleSheet,
    Alert,
} from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { loadGames, saveGames, Game } from '../utils/storage';

const GAMES: Game[] = [
    {
        id: '1',
        title: 'Offline Click Game',
        url: 'https://raw.githubusercontent.com/rajatsharma/mini-html-games/main/click-game.html',
    },
    {
        id: '2',
        title: 'Offline Counter Game',
        url: 'https://raw.githubusercontent.com/rajatsharma/mini-html-games/main/counter.html',
    },
];

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Games'>;

export default function GamesScreen() {
    const [games, setGames] = useState<Game[]>(GAMES);
    const navigation = useNavigation<NavigationProp>();

    useEffect(() => {
        loadSavedGames();
    }, []);

    const loadSavedGames = async () => {
        try {
            const saved = await loadGames();
            if (saved && saved.length > 0) {
                setGames(saved);
            }
        } catch (error) {
            console.error('Failed to load saved games:', error);
        }
    };

    const downloadGame = async (game: Game) => {
        try {
            const fileUri = FileSystem.documentDirectory + `${game.id}.html`;

            setGames((prev) =>
                prev.map((g) =>
                    g.id === game.id ? { ...g, downloading: true } : g
                )
            );

            const fileInfo = await FileSystem.getInfoAsync(fileUri);
            if (fileInfo.exists) {
                updateGameState(game.id, { localUri: fileUri, downloading: false });
                return;
            }

            const result = await FileSystem.downloadAsync(game.url, fileUri);

            setGames((prev) => {
                const updated = prev.map((g) =>
                    g.id === game.id
                        ? { ...g, localUri: result.uri, downloading: false }
                        : g
                );
                saveGames(updated);
                return updated;
            });
        } catch (error) {
            setGames((prev) =>
                prev.map((g) =>
                    g.id === game.id ? { ...g, downloading: false } : g
                )
            );
        }
    };

    const updateGameState = (gameId: string, updates: Partial<Game>) => {
        setGames((prev) => {
            const updated = prev.map((g) =>
                g.id === gameId ? { ...g, ...updates } : g
            );
            saveGames(updated);
            return updated;
        });
    };

    const renderGameCard = ({ item }: { item: Game }) => {
        const isDownloaded = !!item.localUri;
        const isDownloading = item.downloading;

        return (
            <View style={styles.gameCard}>
                <View style={styles.gameInfo}>
                    <Text style={styles.gameTitle}>{item.title}</Text>
                    <Text style={styles.gameStatus}>
                        {isDownloaded
                            ? '✓ Downloaded'
                            : isDownloading
                                ? 'Downloading...'
                                : 'Available for download'}
                    </Text>
                </View>

                {isDownloaded ? (
                    <Pressable
                        style={styles.playButton}
                        onPress={() =>
                            navigation.navigate('GamePlayer', {
                                uri: item.localUri!,
                                title: item.title,
                            })
                        }
                    >
                        <Text style={styles.playButtonText}>▶ Play</Text>
                    </Pressable>
                ) : isDownloading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" color="#4CAF50" />
                    </View>
                ) : (
                    <Pressable
                        style={styles.downloadButton}
                        onPress={() => downloadGame(item)}
                    >
                        <Text style={styles.downloadButtonText}>⬇ Download</Text>
                    </Pressable>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Games</Text>
                <Text style={styles.headerSubtitle}>
                    Download games to play offline
                </Text>
            </View>

            <FlatList
                data={games}
                keyExtractor={(item) => item.id}
                renderItem={renderGameCard}
                contentContainerStyle={styles.listContent}
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
    gameCard: {
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#2a2a2a',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    gameInfo: {
        flex: 1,
        marginRight: 12,
    },
    gameTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 6,
    },
    gameStatus: {
        color: '#888',
        fontSize: 13,
    },
    playButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        minWidth: 100,
        alignItems: 'center',
    },
    playButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '700',
    },
    downloadButton: {
        backgroundColor: '#2196F3',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        minWidth: 100,
        alignItems: 'center',
    },
    downloadButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '700',
    },
    loadingContainer: {
        minWidth: 100,
        alignItems: 'center',
        paddingVertical: 10,
    },
});
