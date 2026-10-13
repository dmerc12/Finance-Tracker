/**
 * Cross-tab synchronization for auth lifecycle events.
 *
 * <p>Uses the {@link BroadcastChannel} API when available.
 * No-op when the browser does not support it (older Safari, some embedded webviews)
 * - the channel is best-effort, not a security boundary.
 *
 * <p>Only the logout event is broadcast today.
 * Login is intentionally not broadcast: sessions established in one tab do not need to
 * force-log-in other tabs; the next request from those tabs resolves identity via {@code /auth/me}.
 */
const CHANNEL_NAME = 'finance-tracker-auth';

export type AuthEvent = { type: 'logout' };

/**
 * Notifies other tabs that the current user has logged out.
 * Other tabs receiving this event should clear auth and user
 * state and let the route guard redirect to /login.
 */
export function broadcastLogout(): void {
    if (typeof BroadcastChannel === 'undefined') return;
    const channel = new BroadcastChannel(CHANNEL_NAME);
    try {
        channel.postMessage({ type: 'logout' } satisfies AuthEvent);
    } finally {
        channel.close();
    }
}

/**
 * Subscribes to auth events from other tabs.
 *
 * @param handler invoked for each received event
 * @returns unsubscribe function that closes the channel
 */
export function subscribeToAuthEvents(handler: (event: AuthEvent) => void): () => void {
    if (typeof BroadcastChannel === 'undefined') return () => {};
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channel.onmessage = (event: MessageEvent<AuthEvent>) => handler(event.data);
    return () => channel.close();
}
