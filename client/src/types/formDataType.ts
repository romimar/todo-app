interface FormDataType {
    title: string;
    description: string;
    date: Date;
}

interface Item {
    id: number,
    title: string | undefined,
    description: string | undefined,
    date: Date | undefined,
    isDone: boolean,
}

export type { FormDataType, Item };