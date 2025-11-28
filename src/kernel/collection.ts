import { BackendBinding, QueryOptions } from '../bindings/types';

export type CollectionResolver<T> = (options: QueryOptions) => T[] | Promise<T[]>;

export class CollectionProxy<T = any> {
    private proxy: any;

    constructor(
        private collectionName: string,
        private options: QueryOptions = {},
        private resolver?: CollectionResolver<T>,
        private binding?: BackendBinding<T[]>
    ) {
        this.proxy = new Proxy(this, {
            get: (target, prop, receiver) => {
                // 1. Builder Methods
                if (prop === 'where') return this.where.bind(this);
                if (prop === 'orderBy') return this.orderBy.bind(this);
                if (prop === 'limit') return this.limit.bind(this);
                if (prop === 'offset') return this.offset.bind(this);
                if (prop === 'include') return this.include.bind(this);
                if (prop === 'get') return this.get.bind(this);
                if (prop === 'getOptions') return this.getOptions.bind(this);

                // 2. Write Methods
                if (prop === 'add') return this.add.bind(this);
                if (prop === 'update') return this.update.bind(this);
                if (prop === 'delete') return this.delete.bind(this);

                // 3. Array Methods / Data Access
                if (this.resolver) {
                    const data = this.resolver(this.options);

                    // Handle Suspense (Promise)
                    if (data instanceof Promise) {
                        throw data;
                    }

                    // Delegate to the resolved data
                    const value = Reflect.get(data, prop, receiver);

                    if (typeof value === 'function') {
                        return value.bind(data);
                    }

                    return value;
                }

                return Reflect.get(target, prop, receiver);
            }
        });

        return this.proxy;
    }

    where(conditions: Record<string, any>): CollectionProxy<T> {
        return new CollectionProxy(this.collectionName, {
            ...this.options,
            where: { ...this.options.where, ...conditions }
        }, this.resolver, this.binding);
    }

    orderBy(order: Record<string, 'asc' | 'desc'>): CollectionProxy<T> {
        return new CollectionProxy(this.collectionName, {
            ...this.options,
            orderBy: { ...this.options.orderBy, ...order }
        }, this.resolver, this.binding);
    }

    limit(n: number): CollectionProxy<T> {
        return new CollectionProxy(this.collectionName, {
            ...this.options,
            limit: n
        }, this.resolver, this.binding);
    }

    offset(n: number): CollectionProxy<T> {
        return new CollectionProxy(this.collectionName, {
            ...this.options,
            offset: n
        }, this.resolver, this.binding);
    }

    include(relation: string): CollectionProxy<T> {
        return new CollectionProxy(this.collectionName, {
            ...this.options,
            include: [...(this.options.include || []), relation]
        }, this.resolver, this.binding);
    }

    get(pk: string | number): CollectionProxy<T> {
        return new CollectionProxy(this.collectionName, {
            ...this.options,
            pk
        }, this.resolver, this.binding);
    }

    getOptions(): QueryOptions {
        return this.options;
    }

    async add(data: T): Promise<void> {
        if (!this.binding) throw new Error('CollectionProxy: No binding configured for writes');
        await this.binding.write({
            type: 'create',
            collection: this.collectionName,
            data
        });
        // Invalidate cache or notify listeners here if needed
    }

    async update(id: string | number, data: Partial<T>): Promise<void> {
        if (!this.binding) throw new Error('CollectionProxy: No binding configured for writes');
        await this.binding.write({
            type: 'update',
            collection: this.collectionName,
            id,
            data
        });
    }

    async delete(id: string | number): Promise<void> {
        if (!this.binding) throw new Error('CollectionProxy: No binding configured for writes');
        await this.binding.write({
            type: 'delete',
            collection: this.collectionName,
            id
        });
    }
}

