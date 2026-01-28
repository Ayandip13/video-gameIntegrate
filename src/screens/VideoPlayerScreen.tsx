import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useRef, useState, useEffect } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { logEvent } from '../utils/analytics';

type Props = NativeStackScreenProps<RootStackParamList, 'VideoPlayer'>;

type Activity = {
    id: number; // minute number
    completed: boolean;
};

const VIDEO_URL =
    'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4';

export default function VideoPlayerScreen({ route }: Props) {
    const { topic } = route.params;

    const videoRef = useRef<Video>(null);

    const [currentTime, setCurrentTime] = useState(0);
    const [showActivity, setShowActivity] = useState(false);
    const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);

    const [activities, setActivities] = useState<Activity[]>(
        Array.from({ length: topic.duration }, (_, i) => ({
            id: i + 1,
            completed: false,
        }))
    );

    useEffect(() => {
        logEvent('video_started', { topic: topic.title });
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{topic.title}</Text>

            <Video
                ref={videoRef}
                source={{ uri: VIDEO_URL }}
                style={styles.video}
                resizeMode={ResizeMode.CONTAIN}
                useNativeControls
                shouldPlay
                onPlaybackStatusUpdate={(status) => {
                    if (!status.isLoaded) return;
                    if (showActivity) return; // 🔥 VERY IMPORTANT GUARD

                    const seconds = Math.floor(status.positionMillis / 1000);
                    setCurrentTime(seconds);

                    const currentMinute = Math.floor(seconds / 60);

                    const pendingActivity = activities.find(
                        (a) => a.id === currentMinute && !a.completed
                    );

                    if (pendingActivity) {
                        videoRef.current?.pauseAsync();
                        setCurrentActivity(pendingActivity);
                        setShowActivity(true);
                    }
                }}
            />

            {/* ACTIVITY MODAL */}
            <Modal visible={showActivity} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={{ fontSize: 16, marginBottom: 12 }}>
                            Activity for minute {currentActivity?.id}
                        </Text>

                        <Pressable
                            style={styles.completeButton}
                            onPress={async () => {
                                if (!currentActivity) return;

                                const completedMinute = currentActivity.id;

                                setActivities((prev) =>
                                    prev.map((a) =>
                                        a.id === completedMinute
                                            ? { ...a, completed: true }
                                            : a
                                    )
                                );

                                setShowActivity(false);
                                setCurrentActivity(null);

                                logEvent('activity_completed', {
                                    minute: completedMinute,
                                    topic: topic.title,
                                });

                                await videoRef.current?.playAsync();
                            }}
                        >
                            <Text style={{ color: '#fff' }}>Complete Activity</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            <Text style={styles.timer}>Watched: {currentTime}s</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#000',
    },
    title: {
        color: '#fff',
        fontSize: 18,
        marginBottom: 12,
        textAlign: 'center',
    },
    video: {
        width: '100%',
        height: 220,
        backgroundColor: '#000',
    },
    timer: {
        color: '#fff',
        marginTop: 12,
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBox: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 8,
        alignItems: 'center',
    },
    completeButton: {
        backgroundColor: '#000',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 6,
    },
});
