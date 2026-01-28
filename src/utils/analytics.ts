type Event = {
    name: string;
    timestamp: number;
    meta?: Record<string, any>;
};

const events: Event[] = [];

export function logEvent(name: string, meta?: Record<string, any>) {
    const event = {
        name,
        timestamp: Date.now(),
        meta,
    };

    events.push(event);
    console.log('ANALYTICS:', event);
}

export function getEvents() {
    return events;
}