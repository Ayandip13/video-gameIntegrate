import AsyncStorage from '@react-native-async-storage/async-storage';

const GAMES_KEY = 'DOWNLOADED_GAMES';

export async function saveGames(games: any[]) {
    await AsyncStorage.setItem(GAMES_KEY, JSON.stringify(games));
}

export async function loadGames() {
    const data = await AsyncStorage.getItem(GAMES_KEY);
    return data ? JSON.parse(data) : null;
}