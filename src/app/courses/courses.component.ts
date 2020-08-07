import {Component} from '@angular/core';
import {TableDataProvider} from "../data-table/table-data-provider";
import {Sort} from "../model/sort";
import {TableData} from "../data-table/table-data";
import {Observable, of} from "rxjs";
import {TablePageRequest} from "../data-table/table-page-request";
import {TableFilter} from "../data-table/table-filter";
import {ColumnDefinition, TableDefinition} from "../data-table/table-definition";
import {CourseWithExamDates} from "../model/course-with-exam-dates";
import {CourseLinkCellTemplateComponent} from "../course-link-cell-template.component";
import {map, tap} from "rxjs/operators";
import {Course} from "../model/course";
import {HttpClient} from "@angular/common/http";
import {CourseUtils} from "../utils/course-utils";
import {Utils} from "../utils/utils";
import {BackgroundColorCellTemplateComponent} from "./background-color-cell-template.component";
import {ColorUtils} from "../utils/color-utils";

@Component({
    selector: 'app-courses',
    templateUrl: './courses.component.html',
    styles: []
})
export class CoursesComponent implements TableDataProvider {
    data: Course[];

    defaultColorRange = {minHue: 0, maxHue: 120, minValue: 0, maxValue: 100};

    tableDef = new TableDefinition([
        new ColumnDefinition<CourseWithExamDates>('Course', obj => obj.courseName, {
            cellTemplateComponent: CourseLinkCellTemplateComponent,
            maxWidthPercent: 40
        }),
        new ColumnDefinition<CourseWithExamDates>('Passed', obj => obj.percentPassed, {
            formatter: Utils.formatPercent,
            cellTemplateComponent: BackgroundColorCellTemplateComponent,
            cellTemplateData: {
                getBackgroundColor: val => ColorUtils.colorRangeToString(val, {
                    minHue: 0,
                    maxHue: 120,
                    minValue: 50,
                    maxValue: 100
                }, '#eee')
            }
        }),
        new ColumnDefinition<CourseWithExamDates>('Grade', obj => obj.averageGrade, {
            formatter: g => g ? g : 'No Data',
            cellTemplateComponent: BackgroundColorCellTemplateComponent,
            cellTemplateData: {
                getBackgroundColor: val => ColorUtils.colorRangeToString(val, {
                    minHue: 0,
                    maxHue: 120,
                    minValue: 2,
                    maxValue: 12
                }, '#eee')
            }
        }),
        new ColumnDefinition<CourseWithExamDates>('Grade %', obj => obj.averageGradePercentile, {
            formatter: Utils.formatPercent,
            cellTemplateComponent: BackgroundColorCellTemplateComponent,
            cellTemplateData: {getBackgroundColor: val => ColorUtils.colorRangeToString(val, this.defaultColorRange, '#eee')}
        }),
        new ColumnDefinition<CourseWithExamDates>('Rating %', obj => obj.qualityScorePercentile, {
            formatter: Utils.formatPercent,
            cellTemplateComponent: BackgroundColorCellTemplateComponent,
            cellTemplateData: {getBackgroundColor: val => ColorUtils.colorRangeToString(val, this.defaultColorRange, '#eee')}
        }),
        new ColumnDefinition<CourseWithExamDates>('Workscore %', obj => obj.workloadScorePercentile, {
            formatter: Utils.formatPercent,
            cellTemplateComponent: BackgroundColorCellTemplateComponent,
            cellTemplateData: {getBackgroundColor: val => ColorUtils.colorRangeToString(val, this.defaultColorRange, '#eee')}
        }),
        new ColumnDefinition<CourseWithExamDates>('Lazyscore %', obj => obj.lazyScorePercentile, {
            formatter: Utils.formatPercent,
            cellTemplateComponent: BackgroundColorCellTemplateComponent,
            cellTemplateData: {getBackgroundColor: val => ColorUtils.colorRangeToString(val, this.defaultColorRange, '#eee')}
        }),
    ]);

    constructor(private httpClient: HttpClient) {
    }

    getData(sort?: Sort, filter?: TableFilter, page?: TablePageRequest): Observable<TableData> {
        if (!this.data) {
            return this.httpClient.get<Course[]>('assets/course-data.json')
                .pipe(map(d => CourseUtils.convertCoursesToList(d)))
                .pipe(tap(d => this.data = d))
                .pipe(map(d => CourseUtils.prepareCourses(sort, filter, page, d)))
        }

        return of(CourseUtils.prepareCourses(sort, filter, page, this.data));
    }
}
