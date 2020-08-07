import {ColumnDefinition} from "./table-definition";
import {Component, TemplateRef, ViewChild} from "@angular/core";

export abstract class CellTemplate<T> {
    col: ColumnDefinition<T>;
    value: T;

    abstract getTemplateRef(): TemplateRef<any>;

    getValue() {
        return this.col.valueAccessor(this.value);
    }

    getFormattedValue() {
        let value = this.col.valueAccessor(this.value);

        if(this.col.formatter) {
            value = this.col.formatter(value);
        }

        return value;
    }
}

@Component({template: '<ng-template #templateRef><td [style.width.%]="col.maxWidthPercent">{{getFormattedValue()}}</td></ng-template>'})
export class DefaultCellTemplate extends CellTemplate<any> {
    @ViewChild('templateRef', {static: true})
    templateRef: TemplateRef<any>;

    getTemplateRef(): TemplateRef<any> {
        return this.templateRef;
    }
}
