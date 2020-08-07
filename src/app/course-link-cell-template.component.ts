import {Component, TemplateRef, ViewChild} from '@angular/core';
import {CellTemplate} from "./data-table/cell-template";
import {CourseUtils} from "./utils/course-utils";
import {Course} from "./model/course";

@Component({
    template: `
        <ng-template #templateRef>
            <td [style.width.%]="col.maxWidthPercent">
                <div class="lead">
                    <a [href]="getCourseLink()" *ngIf="this.value.courseName">
                        {{getFormattedValue()}}
                    </a>
                    <a [href]="getCourseLink()" class="text-muted" *ngIf="!this.value.courseName">Course Name Not Available</a>
                </div>
                <div>
                    {{value.courseNumber}}
                </div>
            </td>
        </ng-template>
    `
})
export class CourseLinkCellTemplateComponent extends CellTemplate<Course> {
    @ViewChild('templateRef', {static: true})
    templateRef: TemplateRef<Course>;

    getCourseLink() {
        return CourseUtils.getCourseLink(this.value.courseNumber);
    }

    getTemplateRef(): TemplateRef<any> {
        return this.templateRef;
    }
}

