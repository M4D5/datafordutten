import {Type} from "@angular/core";

export class TableDefinition<T> {
    columns: ColumnDefinition<T>[];

    constructor(columns: ColumnDefinition<T>[]) {
        this.columns = columns;
    }
}

export class ColumnDefinition<T> {
    title: string;
    valueAccessor: (obj: T) => any;
    propertyName: string;
    propertyNameFn: (obj: T) => any;
    cellTemplateComponent: Type<any>;
    cellTemplateData: any = {};
    sortable = true;
    maxWidthPercent: number;
    formatter: (obj: T) => string;

    constructor(title: string, valueAccessor: (obj: T) => any, options?: ColumnDefinitionOptions<T>) {
        this.title = title;
        this.valueAccessor = valueAccessor;

        if (this.propertyName && this.propertyNameFn) {
            throw 'Only one of the properties "propertyName" and "propertyNameFn" must be specified';
        }

        this.propertyName = options?.propertyName;
        this.propertyNameFn = options?.propertyNameFn;
        this.cellTemplateComponent = options?.cellTemplateComponent;

        if (options?.sortable === false) {
            this.sortable = false;
        }

        if (options?.maxWidthPercent < 1 || options?.maxWidthPercent > 100) {
            throw `Expecting percentage for maxWidthPercentage to be between 1 and 100`;
        }

        this.maxWidthPercent = options?.maxWidthPercent;
        this.formatter = options?.formatter;

        if(options?.cellTemplateData) {
            this.cellTemplateData = options.cellTemplateData;
        }
    }
}

export interface ColumnDefinitionOptions<T> {
    propertyName?: string;
    propertyNameFn?: (obj: T) => any;
    cellTemplateComponent?: Type<any>;
    sortable?: boolean;
    maxWidthPercent?: number;
    formatter?: (obj: any) => string;
    cellTemplateData?: any;
}
