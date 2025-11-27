export interface Tag {
    id: string;
    name: string;
    color: string;
}

export interface Task {
    id: string;
    title: string;
    status: 'todo' | 'doing' | 'done';
    order: number;
    tags: Tag[];
}
