import {
    View,
    Text,
    Pressable,
    FlatList,
    ActivityIndicator,
    StyleSheet,
    Alert,
    ToastAndroid,
} from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { loadGames, saveGames, Game } from '../utils/storage';
import { SIMPLE_GAME_HTML } from '../utils/offlineGames';

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
            console.log('📥 Starting download for:', game.title);
            console.log('💾 Saving to:', fileUri);

            setGames((prev) =>
                prev.map((g) =>
                    g.id === game.id ? { ...g, downloading: true } : g
                )
            );

            // write offline HTML game
            await FileSystem.writeAsStringAsync(
                fileUri,
                SIMPLE_GAME_HTML,
                { encoding: FileSystem.EncodingType.UTF8 }
            );

            console.log('✅ File written successfully');
            console.log('📄 Game HTML length:', SIMPLE_GAME_HTML.length);

            // update state + persist
            setGames((prev) => {
                const updated = prev.map((g) =>
                    g.id === game.id
                        ? { ...g, localUri: fileUri, downloading: false }
                        : g
                );
                saveGames(updated);
                console.log('💾 Game state saved, localUri:', fileUri);
                return updated;
            });
            ToastAndroid.show(`${game.title} is ready to play offline`, ToastAndroid.LONG);
        } catch (error) {
            console.error('Download failed:', error);
            setGames((prev) =>
                prev.map((g) =>
                    g.id === game.id ? { ...g, downloading: false } : g
                )
            );
            ToastAndroid.show('Failed to prepare offline game', ToastAndroid.LONG);
        }
    };

    const deleteGame = async (game: Game) => {
        Alert.alert(
            'Delete Game',
            `Remove ${game.title} from your device?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            if (game.localUri) {
                                await FileSystem.deleteAsync(game.localUri, { idempotent: true });
                                console.log('🗑️ Deleted file:', game.localUri);
                            }

                            setGames((prev) => {
                                const updated = prev.map((g) =>
                                    g.id === game.id ? { ...g, localUri: undefined } : g
                                );
                                saveGames(updated);
                                return updated;
                            });

                            ToastAndroid.show('Game removed. You can download it again.', ToastAndroid.LONG);
                        } catch (error) {
                            console.error('Delete failed:', error);
                            ToastAndroid.show('Failed to delete game', ToastAndroid.LONG);
                        }
                    },
                },
            ]
        );
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
                    <View style={styles.buttonGroup}>
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
                        <Pressable
                            style={styles.deleteButton}
                            onPress={() => deleteGame(item)}
                        >
                            <Text style={styles.deleteButtonText}>🗑️</Text>
                        </Pressable>
                    </View>
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
    gameCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
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
    gameInfo: {
        flex: 1,
        marginRight: 12,
    },
    gameTitle: {
        color: '#333',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 6,
    },
    gameStatus: {
        color: '#666',
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
    buttonGroup: {
        flexDirection: 'row',
        gap: 8,
    },
    deleteButton: {
        backgroundColor: '#f44336',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButtonText: {
        fontSize: 18,
    },
});
