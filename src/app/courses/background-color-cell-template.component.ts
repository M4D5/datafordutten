import {Component, TemplateRef, ViewChild} from '@angular/core';
import {CellTemplate} from "../data-table/cell-template";
import {Course} from "../model/course";

@Component({
    selector: 'app-background-color-cell-template',
    template: `
        <ng-template #templateRef>
            <td [style.width.%]="col.maxWidthPercent" [style.background-color]="getBackgroundColor()">
                {{getFormattedValue()}}
            </td>
        </ng-template>
    `
})
export class BackgroundColorCellTemplateComponent extends CellTemplate<Course> {
    @ViewChild('templateRef', {static: true})
    templateRef: TemplateRef<any>;

    getTemplateRef(): TemplateRef<any> {
        return this.templateRef;
    }

    getBackgroundColor() {
        if (!this.col.cellTemplateData.getBackgroundColor) {
            return undefined;
        }

        // noinspection TypeScriptValidateJSTypes
        return this.col.cellTemplateData.getBackgroundColor(this.getValue());
    }
}
