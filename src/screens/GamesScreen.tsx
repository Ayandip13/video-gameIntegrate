import {
    View,
    Text,
    Pressable,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { loadGames, saveGames } from '../utils/storage';

type Game = {
    id: string;
    title: string;
    url: string;
    localUri?: string;
    downloading?: boolean;
};

const GAMES: Game[] = [
    {
        id: '1',
        title: 'Tic Tac Toe',
        url: 'https://raw.githubusercontent.com/mdn/webassembly-examples/main/js-api-examples/hello.html',
    },
    {
        id: '2',
        title: 'Simple Click Game',
        url: 'https://raw.githubusercontent.com/mdn/dom-examples/main/canvas/canvas-draw.html',
    },
];

type NavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'Games'
>;

export default function GamesScreen() {
    const [games, setGames] = useState<Game[]>(GAMES);
    const navigation = useNavigation<NavigationProp>();

    useEffect(() => {
        (async () => {
            const saved = await loadGames();
            if (saved) setGames(saved);
        })();
    }, []);

    const downloadGame = async (game: Game) => {
        try {
            setGames((prev) =>
                prev.map((g) =>
                    g.id === game.id ? { ...g, downloading: true } : g
                )
            );

            const fileUri =
                FileSystem.documentDirectory + `${game.id}.html`;

            const result = await FileSystem.downloadAsync(
                game.url,
                fileUri
            );

            setGames((prev) => {
                const updatedGames = prev.map((g) =>
                    g.id === game.id
                        ? { ...g, localUri: result.uri, downloading: false }
                        : g
                );

                saveGames(updatedGames);
                return updatedGames;
            });
        } catch (error) {
            setGames((prev) =>
                prev.map((g) =>
                    g.id === game.id ? { ...g, downloading: false } : g
                )
            );
        }
    };

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Text style={{ fontSize: 20, marginBottom: 12 }}>Games</Text>

            <FlatList
                data={games}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View
                        style={{
                            padding: 16,
                            borderWidth: 1,
                            borderRadius: 8,
                            marginBottom: 12,
                        }}
                    >
                        <Text style={{ fontSize: 16 }}>{item.title}</Text>

                        {item.localUri ? (
                            <Pressable
                                onPress={() =>
                                    navigation.navigate('GamePlayer', {
                                        uri: item.localUri!,
                                        title: item.title,
                                    })
                                }
                            >
                                <Text style={{ color: 'green', marginTop: 8 }}>
                                    Play Game
                                </Text>
                            </Pressable>
                        ) : item.downloading ? (
                            <ActivityIndicator style={{ marginTop: 8 }} />
                        ) : (
                            <Pressable onPress={() => downloadGame(item)}>
                                <Text style={{ color: 'blue', marginTop: 8 }}>
                                    Download
                                </Text>
                            </Pressable>
                        )}
                    </View>
                )}
            />
        </View>
    );
}
