import {Component} from '@angular/core';
import {TableDataProvider} from "../data-table/table-data-provider";
import {TableData} from "../data-table/table-data";
import {BehaviorSubject, NEVER, Observable, of, Subject} from "rxjs";
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
import {DataRequestHolder} from "../data-table/data-request-holder";
import {ActivatedRoute, Router} from "@angular/router";
import {faSort, faSortAmountUpAlt} from "@fortawesome/free-solid-svg-icons";

@Component({
    selector: 'app-courses',
    templateUrl: './courses.component.html',
    styles: []
})
export class CoursesComponent implements TableDataProvider {
    courseDisplayNames = {
        undefined: 'Course Number',
        percentPassed: 'Passed',
        averageGrade: 'Grade',
        averageGradePercentile: 'Grade %',
        qualityScorePercentile: 'Rating %',
        workloadScorePercentile: 'Workscore %',
        lazyScorePercentile: 'Lazyscore %'
    };

    faSort = faSortAmountUpAlt;

    responsiveBreakpoint = 1200;

    dataRequestHolder: DataRequestHolder;
    data: Course[];

    tableDef = new TableDefinition([
        new ColumnDefinition<CourseWithExamDates>('Course', obj => obj.courseName, {
            cellTemplateComponent: CourseLinkCellTemplateComponent,
            maxWidthPercent: 40
        }),
        new ColumnDefinition<CourseWithExamDates>('Passed', obj => obj.percentPassed, {
            formatter: Utils.formatPercent,
            cellTemplateComponent: BackgroundColorCellTemplateComponent,
            cellTemplateData: {
                getBackgroundColor: val => ColorUtils.colorRangeToString(val, ColorUtils.percentPassedColorRange, '#eee')
            }
        }),
        new ColumnDefinition<CourseWithExamDates>('Grade', obj => obj.averageGrade, {
            formatter: g => g ? g : 'No Data',
            cellTemplateComponent: BackgroundColorCellTemplateComponent,
            cellTemplateData: {
                getBackgroundColor: val => ColorUtils.colorRangeToString(val, ColorUtils.averageGradeColorRange, '#eee')
            }
        }),
        new ColumnDefinition<CourseWithExamDates>('Grade %', obj => obj.averageGradePercentile, {
            formatter: Utils.formatPercent,
            cellTemplateComponent: BackgroundColorCellTemplateComponent,
            cellTemplateData: {getBackgroundColor: val => ColorUtils.colorRangeToString(val, ColorUtils.defaultColorRange, '#eee')}
        }),
        new ColumnDefinition<CourseWithExamDates>('Rating %', obj => obj.qualityScorePercentile, {
            formatter: Utils.formatPercent,
            cellTemplateComponent: BackgroundColorCellTemplateComponent,
            cellTemplateData: {getBackgroundColor: val => ColorUtils.colorRangeToString(val, ColorUtils.defaultColorRange, '#eee')}
        }),
        new ColumnDefinition<CourseWithExamDates>('Workscore %', obj => obj.workloadScorePercentile, {
            formatter: Utils.formatPercent,
            cellTemplateComponent: BackgroundColorCellTemplateComponent,
            cellTemplateData: {getBackgroundColor: val => ColorUtils.colorRangeToString(val, ColorUtils.defaultColorRange, '#eee')}
        }),
        new ColumnDefinition<CourseWithExamDates>('Lazyscore %', obj => obj.lazyScorePercentile, {
            formatter: Utils.formatPercent,
            cellTemplateComponent: BackgroundColorCellTemplateComponent,
            cellTemplateData: {getBackgroundColor: val => ColorUtils.colorRangeToString(val, ColorUtils.defaultColorRange, '#eee')}
        }),
    ]);

    private readonly _onWindowResized: BehaviorSubject<{ width: number, height: number }>;

    get onWindowResized(): Observable<WindowDimensions> {
        return this._onWindowResized.asObservable();
    }

    constructor(private httpClient: HttpClient, router: Router, activatedRoute: ActivatedRoute) {
        this._onWindowResized = new BehaviorSubject<WindowDimensions>({
            width: window.innerWidth,
            height: window.innerHeight
        });

        window.addEventListener('resize', event => {
            const window: Window = event.target as Window;
            this._onWindowResized.next({width: window.innerWidth, height: window.innerHeight})
        });

        this.dataRequestHolder = new DataRequestHolder(router, activatedRoute);
    }

    getData(dataRequest: DataRequestHolder): Observable<TableData> {
        if (!dataRequest) {
            return NEVER;
        }

        if (!this.data) {
            return this.httpClient.get<Course[]>('assets/course-data.json')
                .pipe(map(d => CourseUtils.convertCoursesToList(d)))
                .pipe(tap(d => this.data = d))
                .pipe(map(d => CourseUtils.prepareCourses(dataRequest, d)))
        }

        return of(CourseUtils.prepareCourses(dataRequest, this.data));
    }
}

export interface WindowDimensions {
    width: number;
    height: number;
}
