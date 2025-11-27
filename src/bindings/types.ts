export interface QueryOptions {
    where?: Record<string, any>;
    orderBy?: Record<string, 'asc' | 'desc'>;
    limit?: number;
    offset?: number;
    pk?: string | number;
}

export interface QueryRequest {
    // Opaque object understood by the specific binding
    query?: string;
    variables?: Record<string, any>;
    sql?: string;
    params?: any[];
}

export interface MutationRequest {
    mutation?: string;
    variables?: Record<string, any>;
    sql?: string;
    params?: any[];
}

export type UnsubscribeFn = () => void;

export interface BackendBinding<T = any> {
    // 1. READ: Fetch a single item or list
    read(query: QueryRequest): Promise<T>;

    // 2. WRITE: Mutate data
    write(mutation: MutationRequest): Promise<void>;

    // 3. SUBSCRIBE: Listen for realtime updates
    subscribe(query: QueryRequest, onUpdate: (data: T) => void): UnsubscribeFn;

    // 4. QUERY BUILDER: Generate backend-specific query strings/objects
    buildQuery(collection: string, options: QueryOptions): QueryRequest;
}
