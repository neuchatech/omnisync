import { BackendBinding } from './types';
import { CollectionProxy } from '../kernel/collection';

export function bind<T = any>(binding: BackendBinding<T[]>, collection: string) {
    return new CollectionProxy<T>(collection, {}, async (options) => {
        const query = binding.buildQuery(collection, options);
        return binding.read(query);
    }, binding);
}
