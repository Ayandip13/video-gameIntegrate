import { View, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'GamePlayer'>;

export default function GamePlayerScreen({ route }: Props) {
    const { uri, title } = route.params;

    return (
        <View style={{ flex: 1 }}>
            <Text
                style={{
                    padding: 12,
                    fontSize: 16,
                    textAlign: 'center',
                }}
            >
                {title}
            </Text>

            <WebView
                source={{ uri }}
                originWhitelist={['*']}
                allowFileAccess
                allowUniversalAccessFromFileURLs
            />
        </View>
    );
}
