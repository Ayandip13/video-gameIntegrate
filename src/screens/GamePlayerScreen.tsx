import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useEffect, useState } from 'react';
import * as FileSystem from 'expo-file-system/legacy';

type Props = NativeStackScreenProps<RootStackParamList, 'GamePlayer'>;

export default function GamePlayerScreen({ route }: Props) {
    const { uri, title } = route.params;
    const [htmlContent, setHtmlContent] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadGameContent();
    }, [uri]);

    const loadGameContent = async () => {
        try {
            console.log('🎮 Loading game from URI:', uri);
            const content = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.UTF8,
            });
            console.log('✅ Game content loaded, length:', content?.length);
            console.log('📄 First 100 chars:', content?.substring(0, 100));
            setHtmlContent(content);
        } catch (error) {
            console.error('❌ Failed to load game content:', error);
            setHtmlContent('<html><body><h1>Error loading game</h1></body></html>');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>Playing Offline</Text>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4CAF50" />
                    <Text style={styles.loadingText}>Loading game...</Text>
                </View>
            ) : (
                <WebView
                    source={{
                        html: htmlContent || '<html><body><h1>No content</h1></body></html>',
                        baseUrl: 'about:blank'
                    }}
                    originWhitelist={['*']}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    style={styles.webview}
                    onError={(syntheticEvent) => {
                        const { nativeEvent } = syntheticEvent;
                        console.error('WebView error:', nativeEvent);
                    }}
                    onLoad={() => console.log('✅ WebView loaded successfully')}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0a',
    },
    header: {
        paddingTop: 12,
        paddingHorizontal: 20,
        paddingBottom: 16,
        backgroundColor: '#111',
        borderBottomWidth: 1,
        borderBottomColor: '#2a2a2a',
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 13,
        color: '#4CAF50',
    },
    webview: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0a0a0a',
    },
    loadingText: {
        color: '#4CAF50',
        marginTop: 12,
        fontSize: 14,
    },
});
