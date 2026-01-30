import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { useRef, useState, useEffect } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { logEvent } from '../utils/analytics';

type Props = NativeStackScreenProps<RootStackParamList, 'VideoPlayer'>;

type Activity = {
    id: number; // Activity number (1-based)
    completed: boolean;
    triggeredAt: number; // Second mark when activity should trigger (60, 120, 180, etc.)
};

const VIDEO_URL = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

export default function VideoPlayerScreen({ route }: Props) {
    const { topic } = route.params;
    const videoRef = useRef<Video>(null);

    const [currentTime, setCurrentTime] = useState(0);
    const [showActivity, setShowActivity] = useState(false);
    const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);

    // Track which activities have been shown to prevent re-triggering
    const [shownActivities, setShownActivities] = useState<Set<number>>(new Set());

    // Initialize activities: one per minute, triggers at 60s, 120s, 180s, etc.
    const [activities, setActivities] = useState<Activity[]>(
        Array.from({ length: topic.duration }, (_, i) => ({
            id: i + 1,
            completed: false,
            triggeredAt: (i + 1) * 60,
        }))
    );

    useEffect(() => {
        logEvent('video_started', { topic: topic.title });
    }, [topic.title]);

    const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
        if (!status.isLoaded) return;

        // Critical guard: Don't update anything if modal is showing
        if (showActivity) return;

        const seconds = Math.floor(status.positionMillis / 1000);
        setCurrentTime(seconds);

        // Find if there's an activity that should trigger at this exact second
        // and hasn't been shown yet
        const pendingActivity = activities.find(
            (activity) =>
                seconds >= activity.triggeredAt &&
                seconds < activity.triggeredAt + 2 && // Small window to catch it
                !activity.completed &&
                !shownActivities.has(activity.id)
        );

        if (pendingActivity) {
            // Pause the video
            videoRef.current?.pauseAsync();

            // Mark this activity as shown to prevent re-triggering
            setShownActivities((prev) => new Set([...prev, pendingActivity.id]));

            // Show the activity modal
            setCurrentActivity(pendingActivity);
            setShowActivity(true);

            logEvent('activity_shown', {
                activityId: pendingActivity.id,
                triggeredAt: seconds,
                topic: topic.title,
            });
        }
    };

    const handleCompleteActivity = async () => {
        if (!currentActivity) return;

        const completedActivityId = currentActivity.id;

        setActivities((prev) =>
            prev.map((a) =>
                a.id === completedActivityId
                    ? { ...a, completed: true }
                    : a
            )
        );

        logEvent('activity_completed', {
            activityId: completedActivityId,
            topic: topic.title,
        });

        setShowActivity(false);
        setCurrentActivity(null);

        await videoRef.current?.playAsync();
    };

    // Format time in MM:SS
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Calculate completed activities count
    const completedCount = Array.from(shownActivities).filter((id) => {
        const activity = activities.find((a) => a.id === id);
        return activity?.completed;
    }).length;

    return (
        <View style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
                <Text style={styles.title}>{topic.title}</Text>
                <Text style={styles.subtitle}>
                    {topic.duration} minute learning session
                </Text>
            </View>

            {/* Video Player */}
            <View style={styles.videoContainer}>
                <Video
                    ref={videoRef}
                    source={{ uri: VIDEO_URL }}
                    style={styles.video}
                    resizeMode={ResizeMode.CONTAIN}
                    useNativeControls
                    shouldPlay
                    onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
                />
            </View>

            {/* Stats Section */}
            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Time Watched</Text>
                    <Text style={styles.statValue}>{formatTime(currentTime)}</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Activities Done</Text>
                    <Text style={styles.statValue}>
                        {completedCount} / {topic.duration}
                    </Text>
                </View>
            </View>

            {/* Activity Modal */}
            <Modal visible={showActivity} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                📝 Activity Time!
                            </Text>
                            <Text style={styles.modalSubtitle}>
                                Activity {currentActivity?.id} of {topic.duration}
                            </Text>
                        </View>

                        <View style={styles.modalBody}>
                            <Text style={styles.modalDescription}>
                                Take a moment to reflect on what you've learned so far.
                                Complete this activity to continue watching.
                            </Text>
                        </View>

                        <Pressable
                            style={styles.completeButton}
                            onPress={handleCompleteActivity}
                        >
                            <Text style={styles.completeButtonText}>
                                ✓ Complete Activity
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0a',
    },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: '#111',
    },
    title: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        color: '#888',
        fontSize: 14,
        textAlign: 'center',
    },
    videoContainer: {
        backgroundColor: '#000',
        marginHorizontal: 16,
        marginTop: 20,
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    video: {
        width: '100%',
        height: 240,
    },
    statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingTop: 24,
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#1a1a1a',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2a2a2a',
    },
    statLabel: {
        color: '#888',
        fontSize: 12,
        marginBottom: 6,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    statValue: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalCard: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#1a1a1a',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#333',
        overflow: 'hidden',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
    },
    modalHeader: {
        backgroundColor: '#222',
        padding: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        alignItems: 'center',
    },
    modalTitle: {
        color: '#fff',
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 8,
    },
    modalSubtitle: {
        color: '#888',
        fontSize: 14,
    },
    modalBody: {
        padding: 24,
    },
    modalDescription: {
        color: '#ccc',
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'center',
    },
    completeButton: {
        backgroundColor: '#4CAF50',
        marginHorizontal: 24,
        marginBottom: 24,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    completeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
});
