import AsyncStorage from '@react-native-async-storage/async-storage';

export type Game = {
    id: string;
    title: string;
    url: string;
    localUri?: string;
    downloading?: boolean;
};

const GAMES_KEY = 'DOWNLOADED_GAMES';

export async function saveGames(games: Game[]): Promise<void> {
    try {
        await AsyncStorage.setItem(GAMES_KEY, JSON.stringify(games));
    } catch (error) {
        console.error('Failed to save games:', error);
        throw error;
    }
}

export async function loadGames(): Promise<Game[] | null> {
    try {
        const data = await AsyncStorage.getItem(GAMES_KEY);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Failed to load games:', error);
        return null;
    }
}