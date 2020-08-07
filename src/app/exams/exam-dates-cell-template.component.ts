import {Component, TemplateRef, ViewChild} from '@angular/core';
import {CellTemplate} from "../data-table/cell-template";
import {CourseWithExamDates} from "../model/course-with-exam-dates";
import {faSnowflake, faUmbrellaBeach} from "@fortawesome/free-solid-svg-icons";

@Component({
    template: `
        <ng-template #templateRef>
            <td [style.width.%]="col.maxWidthPercent">
                <div *ngIf="!hasExamDates()" class="text-muted">No Data Available</div>
                <div *ngIf="hasExamDates()">
                    <span *ngFor="let val of getExamDates2(value)">
                        <span class="exam-date-e" *ngIf="val.season === 'E'">
                            <fa-icon class="mr-2" [icon]="faSnowflake"></fa-icon>
                            {{val.date}}
                            <span *ngIf="val.placement"> ({{val.placement}})</span>
                        </span>
                        <span class="exam-date-f" *ngIf="val.season === 'F'">
                            <fa-icon class="mr-2" [icon]="faUmbrellaBeach"></fa-icon>
                            {{val.date}}
                            <span *ngIf="val.placement"> ({{val.placement}})</span>
                        </span>
                    </span>
                </div>
            </td>
        </ng-template>`,
    styleUrls: ['./exam-dates-cell-template.component.scss']
})
export class ExamDatesCellTemplateComponent extends CellTemplate<CourseWithExamDates> {
    faUmbrellaBeach = faUmbrellaBeach;
    faSnowflake = faSnowflake;

    @ViewChild('templateRef', {static: true})
    templateRef: TemplateRef<any>;

    getTemplateRef(): TemplateRef<any> {
        return this.templateRef;
    }

    hasExamDates() {
        const dates = this.getExamDates(this.value);
        return dates.length > 0;
    }

    getExamDates2(course: CourseWithExamDates) {
        const dates = [];

        if (course.explicitExamDates) {
            for (let date of course.explicitExamDates) {
                dates.push(date);
            }
        } else if (course.examPlacementExamDates) {
            for (let entry of course.examPlacementExamDates.entries()) {
                const date = entry[1];
                const placement = entry[0];

                dates.push({
                    date: date,
                    season: placement.substr(0, 1),
                    placement: placement
                });
            }
        } else if (course.schedulePlacementExamDates) {
            for (let entry of course.schedulePlacementExamDates.entries()) {
                const date = entry[1];
                const placement = entry[0];

                dates.push({
                    date: date,
                    season: placement.substr(0, 1),
                    placement: placement
                });
            }
        }

        return dates;
    }

    formatExamDates() {
        const dates = this.getExamDates(this.value);

        if (dates.length > 0) {
            return dates.join(', ');
        } else {
            return 'No Data';
        }
    }

    getExamDates(course: CourseWithExamDates) {
        const dates = [];

        if (course.explicitExamDates) {
            for (let date of course.explicitExamDates) {
                dates.push(date);
            }
        } else if (course.examPlacementExamDates) {
            for (let date of course.examPlacementExamDates.entries()) {
                dates.push(date[1] + ' (' + date[0] + ')');
            }
        } else if (course.schedulePlacementExamDates) {
            for (let date of course.schedulePlacementExamDates.entries()) {
                dates.push(date[1] + ' (' + date[0] + ')');
            }
        }

        return dates;
    }
}
