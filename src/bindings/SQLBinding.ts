import { BackendBinding, MutationRequest, QueryOptions, QueryRequest, UnsubscribeFn } from './types';

export interface SQLConfig {
    connectionString: string;
}

export class SQLBinding implements BackendBinding {
    constructor(private config: SQLConfig) { }

    async read(query: QueryRequest): Promise<any> {
        return Promise.resolve([]);
    }

    async write(mutation: MutationRequest): Promise<void> {
        return Promise.resolve();
    }

    subscribe(query: QueryRequest, onUpdate: (data: any) => void): UnsubscribeFn {
        return () => { };
    }

    buildQuery(collection: string, options: QueryOptions): QueryRequest {
        let sql = `SELECT * FROM ${collection}`;
        const params: any[] = [];

        if (options.include) {
            for (const relation of options.include) {
                // Simplified JOIN logic for demo
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
}
