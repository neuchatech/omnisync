export type Listener<T = any> = (value: T) => void;
export type Unsubscribe = () => void;

export class Subscribable<T = any> {
    private listeners: Set<Listener<T>> = new Set();

    subscribe(listener: Listener<T>): Unsubscribe {
        this.listeners.add(listener);
        return () => {
            this.listeners.delete(listener);
        };
    }

    notify(value: T): void {
        this.listeners.forEach((listener) => listener(value));
    }

    get listenerCount(): number {
        return this.listeners.size;
    }
}
