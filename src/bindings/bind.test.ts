import { bind } from './bind';
import { CollectionProxy } from '../kernel/collection';
import { BackendBinding } from './types';

describe('bind', () => {
    it('should return a CollectionProxy', () => {
        const mockBinding = {
            read: jest.fn(),
            write: jest.fn(),
            subscribe: jest.fn(),
            buildQuery: jest.fn()
        } as unknown as BackendBinding;

        const collection = bind(mockBinding, 'todos');
        expect(collection).toBeInstanceOf(CollectionProxy);
    });
});
