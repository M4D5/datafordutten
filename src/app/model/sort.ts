export interface Sort {
    property: string;
    direction: SortDirection;
}

export enum SortDirection {
    Ascending,
    Descending
}
