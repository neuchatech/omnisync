import { SQLBinding } from './SQLBinding';

describe('SQLBinding', () => {
    const binding = new SQLBinding({ connectionString: 'sqlite://:memory:' });

    it('should build a simple SELECT', () => {
        const result = binding.buildQuery('todos', {});
        expect(result.sql).toBe('SELECT * FROM todos');
        expect(result.params).toEqual([]);
    });

    it('should build a SELECT with WHERE clause', () => {
        const result = binding.buildQuery('todos', {
            where: { completed: false, user_id: 1 }
        });
        expect(result.sql).toContain('WHERE completed = ? AND user_id = ?');
        expect(result.params).toEqual([false, 1]);
    });

    it('should build a SELECT with ORDER BY', () => {
        const result = binding.buildQuery('todos', {
            orderBy: { created_at: 'desc' }
        });
        expect(result.sql).toContain('ORDER BY created_at DESC');
    });

    it('should build a SELECT with LIMIT and OFFSET', () => {
        const result = binding.buildQuery('todos', {
            limit: 10,
            offset: 5
        });
        expect(result.sql).toContain('LIMIT ? OFFSET ?');
        expect(result.params).toEqual([10, 5]);
    });

    it('should build a SELECT with Primary Key', () => {
        const result = binding.buildQuery('todos', {
            pk: '123'
        });
        expect(result.sql).toContain('WHERE id = ?');
        expect(result.params).toEqual(['123']);
    });
});
