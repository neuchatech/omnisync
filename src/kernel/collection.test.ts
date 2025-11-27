import { CollectionProxy } from './collection';

describe('CollectionProxy', () => {
    it('should be immutable', () => {
        const root = new CollectionProxy('todos');
        const q1 = root.where({ completed: true });

        expect(root).not.toBe(q1);
        expect(root.getOptions()).toEqual({});
        expect(q1.getOptions().where).toEqual({ completed: true });
    });

    it('should chain where clauses', () => {
        const q = new CollectionProxy('todos')
            .where({ completed: false })
            .where({ user_id: 1 });

        expect(q.getOptions().where).toEqual({
            completed: false,
            user_id: 1
        });
    });

    it('should chain orderBy clauses', () => {
        const q = new CollectionProxy('todos')
            .orderBy({ created_at: 'desc' })
            .orderBy({ priority: 'asc' });

        expect(q.getOptions().orderBy).toEqual({
            created_at: 'desc',
            priority: 'asc'
        });
    });

    it('should set limit and offset', () => {
        const q = new CollectionProxy('todos')
            .limit(10)
            .offset(20);

        expect(q.getOptions().limit).toBe(10);
        expect(q.getOptions().offset).toBe(20);
    });

    it('should set primary key', () => {
        const q = new CollectionProxy('todos').get('123');
        expect(q.getOptions().pk).toBe('123');
    });

    it('should chain include clauses', () => {
        const q = new CollectionProxy('todos')
            .include('user')
            .include('comments');

        expect(q.getOptions().include).toEqual(['user', 'comments']);
    });

    it('should behave like an array when resolved', () => {
        const mockData = [{ id: 1 }, { id: 2 }];
        const resolver = jest.fn().mockReturnValue(mockData);

        const q = new CollectionProxy('todos', {}, resolver) as any;

        expect(q.length).toBe(2);
        expect(q[0]).toEqual({ id: 1 });
        expect(q.map((i: any) => i.id)).toEqual([1, 2]);
        expect(resolver).toHaveBeenCalled();
    });

    it('should support Suspense (throwing promise)', () => {
        const promise = new Promise(() => { });
        const resolver = jest.fn().mockReturnValue(promise);

        const q = new CollectionProxy('todos', {}, resolver) as any;

        try {
            q.length;
            throw new Error('Should have thrown');
        } catch (e) {
            expect(e).toBe(promise);
        }
    });
});
