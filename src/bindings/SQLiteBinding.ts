import Database from 'better-sqlite3';
import { BackendBinding, MutationRequest, QueryOptions, QueryRequest, UnsubscribeFn } from './types';

export interface SQLiteConfig {
    filename: string;
    options?: Database.Options;
}

export class SQLiteBinding implements BackendBinding {
    private db: Database.Database;

    constructor(config: SQLiteConfig) {
        this.db = new Database(config.filename, config.options);
    }

    async read(query: QueryRequest): Promise<any[]> {
        if (!query.sql) {
            throw new Error('SQLiteBinding: query.sql is required');
        }
        const stmt = this.db.prepare(query.sql);
        return stmt.all(query.params || []);
    }

    async write(mutation: MutationRequest): Promise<void> {
        if (mutation.sql) {
            const stmt = this.db.prepare(mutation.sql);
            stmt.run(mutation.params);
            return;
        }

        if (mutation.type === 'create') {
            const keys = Object.keys(mutation.data);
            const values = Object.values(mutation.data);
            const placeholders = keys.map(() => '?').join(', ');
            const sql = `INSERT INTO ${mutation.collection} (${keys.join(', ')}) VALUES (${placeholders})`;
            const stmt = this.db.prepare(sql);
            stmt.run(values);
        } else if (mutation.type === 'update') {
            const keys = Object.keys(mutation.data);
            const values = Object.values(mutation.data);
            const setClause = keys.map(key => `${key} = ?`).join(', ');
            const sql = `UPDATE ${mutation.collection} SET ${setClause} WHERE id = ?`;
            const stmt = this.db.prepare(sql);
            stmt.run([...values, mutation.id]);
        } else if (mutation.type === 'delete') {
            const sql = `DELETE FROM ${mutation.collection} WHERE id = ?`;
            const stmt = this.db.prepare(sql);
            stmt.run(mutation.id);
        }
    }

    subscribe(query: QueryRequest, onUpdate: (data: any) => void): UnsubscribeFn {
        // SQLite doesn't natively support subscriptions easily without extensions or polling.
        // For this MVP, we'll implement a simple polling mechanism if requested, 
        // or just leave it as a no-op/manual trigger.
        // Let's do a simple polling for demonstration purposes (every 1s).

        const interval = setInterval(() => {
            const data = this.read(query);
            // In a real app, we'd check if data changed.
            // Since read is async (in interface) but sync in better-sqlite3, we need to handle promise.
            // However, better-sqlite3 is synchronous. The interface returns Promise.
            // We can just call the callback.

            // Note: This is very inefficient. Real implementation would use triggers or a change log.
            Promise.resolve(data).then(onUpdate);
        }, 1000);

        return () => clearInterval(interval);
    }

    buildQuery(collection: string, options: QueryOptions): QueryRequest {
        let sql = `SELECT * FROM ${collection}`;
        const params: any[] = [];

        if (options.include) {
            // Basic join support
            for (const relation of options.include) {
                // Assuming standard naming convention: table.relation_id = relation.id
                sql += ` LEFT JOIN ${relation} ON ${collection}.${relation}_id = ${relation}.id`;
            }
        }

        if (options.pk) {
            sql += ` WHERE id = ?`;
            params.push(options.pk);
        } else if (options.where) {
            const clauses: string[] = [];
            for (const [key, value] of Object.entries(options.where)) {
                clauses.push(`${key} = ?`);
                params.push(value);
            }
            if (clauses.length > 0) {
                sql += ` WHERE ${clauses.join(' AND ')}`;
            }
        }

        if (options.orderBy) {
            const orders: string[] = [];
            for (const [key, dir] of Object.entries(options.orderBy)) {
                orders.push(`${key} ${dir.toUpperCase()}`);
            }
            if (orders.length > 0) {
                sql += ` ORDER BY ${orders.join(', ')}`;
            }
        }

        if (options.limit) {
            sql += ` LIMIT ?`;
            params.push(options.limit);
        }

        if (options.offset) {
            sql += ` OFFSET ?`;
            params.push(options.offset);
        }

        return {
            sql,
            params
        };
    }

    // Helper to close DB
    close() {
        this.db.close();
    }
}
