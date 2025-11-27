import { GraphQLBinding } from './GraphQLBinding';

describe('GraphQLBinding', () => {
    const binding = new GraphQLBinding({ endpoint: 'http://localhost:4000' });

    it('should build a simple query', () => {
        const result = binding.buildQuery('todos', {});
        expect(result.query).toContain('query { todos { id } }');
    });

    it('should build a query with where clause', () => {
        const result = binding.buildQuery('todos', {
            where: { completed: false }
        });
        expect(result.query).toContain('where: {completed:false}');
    });

    it('should build a query with orderBy', () => {
        const result = binding.buildQuery('todos', {
            orderBy: { created_at: 'desc' }
        });
        expect(result.query).toContain('orderBy: {created_at:"desc"}');
    });

    it('should build a query with limit and offset', () => {
        const result = binding.buildQuery('todos', {
            limit: 10,
            offset: 5
        });
        expect(result.query).toContain('limit: 10');
        expect(result.query).toContain('offset: 5');
    });

    it('should build a query with primary key', () => {
        const result = binding.buildQuery('todos', {
            pk: '123'
        });
        expect(result.query).toContain('id: "123"');
    });

    it('should build a query with included relations', () => {
        const result = binding.buildQuery('todos', {
            include: ['user', 'comments']
        });
        expect(result.query).toContain('user { id }');
        expect(result.query).toContain('comments { id }');
    });
});
