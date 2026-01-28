import { View, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'GamePlayer'>;

export default function GamePlayerScreen({ route }: Props) {
    const { uri, title } = route.params;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>Playing Offline</Text>
            </View>

            <WebView
                source={{ uri }}
                originWhitelist={['*']}
                allowFileAccess
                allowUniversalAccessFromFileURLs
                style={styles.webview}
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
});
