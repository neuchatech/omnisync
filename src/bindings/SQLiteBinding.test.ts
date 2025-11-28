import { SQLiteBinding } from './SQLiteBinding';

describe('SQLiteBinding', () => {
    let binding: SQLiteBinding;

    beforeEach(() => {
        // Use in-memory DB for testing
        binding = new SQLiteBinding({ filename: ':memory:' });

        // Setup schema
        binding['db'].exec(`
            CREATE TABLE todos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                text TEXT NOT NULL,
                completed INTEGER DEFAULT 0
            );
        `);

        // Insert initial data
        binding['db'].exec(`
            INSERT INTO todos (text, completed) VALUES ('Buy Milk', 0);
            INSERT INTO todos (text, completed) VALUES ('Walk Dog', 1);
        `);
    });

    afterEach(() => {
        binding.close();
    });

    it('should read data with buildQuery', async () => {
        const query = binding.buildQuery('todos', {
            where: { completed: 0 }
        });

        const results = await binding.read(query);
        expect(results).toHaveLength(1);
        expect(results[0].text).toBe('Buy Milk');
    });

    it('should support orderBy', async () => {
        const query = binding.buildQuery('todos', {
            orderBy: { text: 'desc' }
        });

        const results = await binding.read(query);
        expect(results).toHaveLength(2);
        expect(results[0].text).toBe('Walk Dog');
    });

    it('should support limit', async () => {
        const query = binding.buildQuery('todos', {
            limit: 1
        });

        const results = await binding.read(query);
        expect(results).toHaveLength(1);
    });

    it('should create data using structured mutation', async () => {
        await binding.write({
            type: 'create',
            collection: 'todos',
            data: { text: 'New Item', completed: 0 }
        });

        const query = binding.buildQuery('todos', { where: { text: 'New Item' } });
        const results = await binding.read(query);
        expect(results).toHaveLength(1);
        expect(results[0].text).toBe('New Item');
    });

    it('should update data', async () => {
        // First get an ID
        const all = await binding.read(binding.buildQuery('todos', { limit: 1 }));
        const id = all[0].id;

        await binding.write({
            type: 'update',
            collection: 'todos',
            id,
            data: { text: 'Updated Text' }
        });

        const query = binding.buildQuery('todos', { pk: id });
        const results = await binding.read(query);
        expect(results[0].text).toBe('Updated Text');
    });

    it('should delete data', async () => {
        const all = await binding.read(binding.buildQuery('todos', { limit: 1 }));
        const id = all[0].id;

        await binding.write({
            type: 'delete',
            collection: 'todos',
            id
        });

        const query = binding.buildQuery('todos', { pk: id });
        const results = await binding.read(query);
        expect(results).toHaveLength(0);
    });
});
