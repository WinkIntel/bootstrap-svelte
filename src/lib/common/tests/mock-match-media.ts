import { onTestFinished, vi } from 'vitest';

// Model the browser boundary, including obsolete-query events and subscription disposal.
export function mockMatchMedia(initial: number | Record<string, boolean> = {}) {
    let width = typeof initial === 'number' ? initial : undefined;
    const initialMatches = typeof initial === 'number' ? {} : initial;
    const matchesWidth = (query: string) => {
        if (width === undefined) return false;
        const minimum = query.match(/min-width:\s*([\d.]+)px/);
        const maximum = query.match(/max-width:\s*([\d.]+)px/);
        if (!minimum && !maximum) return false;
        return (!minimum || width >= Number(minimum[1])) && (!maximum || width <= Number(maximum[1]));
    };
    const original = window.matchMedia;
    onTestFinished(() => {
        window.matchMedia = original;
    });
    const queries = new Map<string, { list: MediaQueryList; listeners: Set<EventListenerOrEventListenerObject> }>();
    window.matchMedia = vi.fn((query: string) => {
        let entry = queries.get(query);
        if (!entry) {
            const listeners = new Set<EventListenerOrEventListenerObject>();
            const list = Object.assign(new EventTarget(), {
                media: query,
                matches: initialMatches[query] ?? matchesWidth(query),
                onchange: null,
                addListener: vi.fn(),
                removeListener: vi.fn()
            });
            const add = list.addEventListener.bind(list);
            const remove = list.removeEventListener.bind(list);
            list.addEventListener = (type, listener, options) => {
                if (type === 'change' && listener) listeners.add(listener);
                add(type, listener, options);
            };
            list.removeEventListener = (type, listener, options) => {
                if (type === 'change' && listener) listeners.delete(listener);
                remove(type, listener, options);
            };
            entry = { list, listeners };
            queries.set(query, entry);
        }
        return entry.list;
    });
    return {
        emit(query: string, matches: boolean) {
            const entry = queries.get(query);
            if (!entry) throw new Error(`Query was never created: ${query}`);
            Object.defineProperty(entry.list, 'matches', { value: matches, configurable: true });
            entry.list.dispatchEvent(new Event('change'));
        },
        setWidth(nextWidth: number) {
            width = nextWidth;
            for (const [query, entry] of queries) {
                Object.defineProperty(entry.list, 'matches', { value: matchesWidth(query), configurable: true });
                entry.list.dispatchEvent(new Event('change'));
            }
        },
        listenerCount(query: string) {
            const entry = queries.get(query);
            if (!entry) throw new Error(`Query was never created: ${query}`);
            return entry.listeners.size;
        },
        totalListeners() {
            return [...queries.values()].reduce((sum, entry) => sum + entry.listeners.size, 0);
        }
    };
}
