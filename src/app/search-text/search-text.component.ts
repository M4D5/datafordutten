import {Component, Input} from '@angular/core';
import {ComponentWithTableData} from "../data-table/component-with-table-data";

@Component({
    selector: 'app-search-text',
    templateUrl: './search-text.component.html',
    styles: []
})
export class SearchTextComponent {
    @Input()
    componentWithTableData: ComponentWithTableData;

    @Input()
    objectName: string = 'Entries';

    get shown(): number {
        return this.componentWithTableData?.getTableData().rowValues.length;
    }

    get matching(): number {
        return this.componentWithTableData?.getTableData().matchingRows;
    }

    get visible(): boolean {
        return !!this.componentWithTableData?.getTableData();
    }
}
