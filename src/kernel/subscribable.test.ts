import { Subscribable } from './subscribable';

describe('Subscribable', () => {
    it('should allow subscription and notification', () => {
        const subscribable = new Subscribable<string>();
        const listener = jest.fn();

        subscribable.subscribe(listener);
        subscribable.notify('hello');

        expect(listener).toHaveBeenCalledWith('hello');
    });

    it('should allow unsubscription', () => {
        const subscribable = new Subscribable<string>();
        const listener = jest.fn();
        const unsubscribe = subscribable.subscribe(listener);

        unsubscribe();
        subscribable.notify('hello');

        expect(listener).not.toHaveBeenCalled();
    });

    it('should handle multiple listeners', () => {
        const subscribable = new Subscribable<string>();
        const listenerA = jest.fn();
        const listenerB = jest.fn();

        subscribable.subscribe(listenerA);
        subscribable.subscribe(listenerB);
        subscribable.notify('hello');

        expect(listenerA).toHaveBeenCalledWith('hello');
        expect(listenerB).toHaveBeenCalledWith('hello');
    });
});
