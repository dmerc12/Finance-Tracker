import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { broadcastLogout, subscribeToAuthEvents } from './authChannel';

/**
 * Minimal BroadcastChannel stand-in.
 * Captures posted messages and lets the test drive an inbound event by
 * invoking the captured onmessage handler.
 */
class FakeBroadcastChannel {
    static instances: FakeBroadcastChannel[] = [];
    onmessage: ((e: MessageEvent) => void) | null = null;
    posted: unknown[] = [];
    closed = false;
    name: string;

    constructor(name: string) {
        this.name = name;
        FakeBroadcastChannel.instances.push(this);
    }

    postMessage(msg: unknown) {
        this.posted.push(msg);
    }

    close() {
        this.closed = true;
    }
}

describe('FakeBroadcastChannel', () => {
    beforeEach(() => {
        FakeBroadcastChannel.instances = [];
    });

    it('stores posted messages and tracks close', () => {
        const channel = new FakeBroadcastChannel('test');
        channel.postMessage({ type: 'ping' });
        channel.close();
        expect(channel.posted).toEqual([{ type: 'ping' }]);
        expect(channel.closed).toBe(true);
    });
});

describe('authChannel', () => {
    const originalBroadcastChannel = globalThis.BroadcastChannel;

    beforeEach(() => {
        FakeBroadcastChannel.instances = [];
        // @ts-expect-error test stub - test stub replacing the real BroadcastChannel
        globalThis.BroadcastChannel = FakeBroadcastChannel;
    });

    afterEach(() => {
        globalThis.BroadcastChannel = originalBroadcastChannel;
        vi.restoreAllMocks();
    });

    describe('broadcastLogout', () => {
        it('posts a logout message and closes the channel', () => {
            broadcastLogout();
            expect(FakeBroadcastChannel.instances).toHaveLength(1);
            const channel = FakeBroadcastChannel.instances[0];
            expect(channel.name).toBe('finance-tracker-auth');
            expect(channel.posted).toEqual([{ type: 'logout' }]);
            expect(channel.closed).toBe(true);
        });
    });

    describe('subscribeToAuthEvents', () => {
        it('invokes the handler when a logout event arrives', () => {
            const handler = vi.fn();
            subscribeToAuthEvents(handler);
            const channel = FakeBroadcastChannel.instances[0];
            channel.onmessage?.({ data: { type: 'logout' } } as MessageEvent);
            expect(handler).toHaveBeenCalledWith({ type: 'logout' });
        });

        it('returns an unsubscribe function that closes the channel', () => {
            const unsubscribe = subscribeToAuthEvents(() => {});
            const channel = FakeBroadcastChannel.instances[0];
            unsubscribe();
            expect(channel.closed).toBe(true);
        });
    });

    describe('when BroadcastChannel is unavailable', () => {
        beforeEach(() => {
            // @ts-expect-error simulate unsupported environment
            delete globalThis.BroadcastChannel;
        });

        it('broadcastLogout is a no-op', () => {
            expect(() => broadcastLogout()).not.toThrow();
        });

        it('subscribeToAuthEvents returns a no-op unsubscribe', () => {
            const unsubscribe = subscribeToAuthEvents(() => {});
            expect(() => unsubscribe()).not.toThrow();
        });
    });
});
