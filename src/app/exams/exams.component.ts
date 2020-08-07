import {Component, OnInit} from '@angular/core';
import {TableDataProvider} from "../data-table/table-data-provider";
import {forkJoin, Observable, of} from "rxjs";
import {Sort} from "../model/sort";
import {ColumnDefinition, TableDefinition} from "../data-table/table-definition";
import {CourseWithExamDates} from "../model/course-with-exam-dates";
import {HttpClient} from "@angular/common/http";
import {Course} from "../model/course";
import {CourseUtils} from "../utils/course-utils";
import {ExamSchedule} from "../model/exam-schedule";
import {map, tap} from "rxjs/operators";
import {TableData} from "../data-table/table-data";
import {CourseLinkCellTemplateComponent} from "../course-link-cell-template.component";
import {ExamDatesCellTemplateComponent} from "./exam-dates-cell-template.component";
import {TableFilter} from "../data-table/table-filter";
import {TablePageRequest} from "../data-table/table-page-request";

@Component({
    selector: 'app-exams',
    templateUrl: './exams.component.html',
    styles: []
})
export class ExamsComponent implements TableDataProvider {
    data: CourseWithExamDates[];

    tableDef = new TableDefinition([
        new ColumnDefinition<CourseWithExamDates>('Course', obj => obj.courseName, {
            cellTemplateComponent: CourseLinkCellTemplateComponent,
            maxWidthPercent: 40
        }),
        new ColumnDefinition<CourseWithExamDates>('Exam Date(s)', obj => obj, {
            sortable: false,
            cellTemplateComponent: ExamDatesCellTemplateComponent,
            maxWidthPercent: 40
        }),
    ]);

    constructor(private httpClient: HttpClient) {
    }

    loadData(): Observable<CourseWithExamDates[]> {
        const observables = [
            this.httpClient.get('assets/course-data.json'),
            this.httpClient.get('assets/exam-schedule.json')
        ];

        return forkJoin(observables).pipe(map(result => {
            const courseData: Course[] = <Course[]>CourseUtils.convertCoursesToList(result[0]);
            const examSchedule: Map<string, ExamSchedule> = this.copyToMap(result[1]);
            return this.getCoursesWithExams(examSchedule, courseData);
        }));
    }

    copyToMap<B>(obj: any) {
        const map = new Map<string, B>();

        for(let entry of Object.entries(obj)) {
            map.set(entry[0], <B>entry[1]);
        }

        return map;
    }

    getCoursesWithExams(examSchedules: Map<string, ExamSchedule>, courseData: Course[]): CourseWithExamDates[] {
        const data = [];

        for (let course of courseData) {
            const courseWithExamDates: CourseWithExamDates = <CourseWithExamDates>course;

            const courseExceptions = [];

            for (let examScheduleEntry of examSchedules.entries()) {
                if(!examScheduleEntry[1].courseExceptions) {
                    continue;
                }

                const exceptions = examScheduleEntry[1].courseExceptions[course.courseNumber];

                if (exceptions) {
                    courseExceptions.push(...exceptions.map(d => {
                        return {date: d, season: examScheduleEntry[0].substr(0, 1)};
                    }));
                }
            }


            if (courseExceptions.length > 0) {
                courseWithExamDates.explicitExamDates = courseExceptions;
            } else {
                if (course.examPlacements) {
                    courseWithExamDates.examPlacementExamDates =
                        this.getExamDatesFromPlacements(examSchedules.values(), course.examPlacements);
                }

                if (course.schedulePlacements) {
                    courseWithExamDates.schedulePlacementExamDates =
                        this.getExamDatesFromPlacements(examSchedules.values(), course.schedulePlacements);
                }
            }

            data.push(courseWithExamDates);
        }

        return data;
    }

    getExamDatesFromPlacements(examSchedules: Iterable<ExamSchedule>, placements: string[]): Map<string, string> {
        const examDates = new Map<string, string>();
        const remainingPlacements = [...placements];

        for (let examSchedule of examSchedules) {
            for (let placement of placements) {
                if(!examSchedule.schedulePlacementMappings) {
                    continue;
                }

                const examDate = examSchedule.schedulePlacementMappings[placement];

                if (examDate) {
                    examDates.set(placement, examDate);
                    const index = remainingPlacements.indexOf(placement);
                    remainingPlacements.splice(index, 1)
                }
            }
        }

        for (let placement of remainingPlacements) {
            examDates.set(placement, 'Unknown');
        }

        return examDates;
    }

    getData(sort?: Sort, filter?: TableFilter, page?: TablePageRequest): Observable<TableData> {
        if (!this.data) {
            return this.loadData()
                .pipe(tap(d => this.data = d))
                .pipe(map(d => CourseUtils.prepareCourses(sort, filter, page, d)))
        }

        return of(CourseUtils.prepareCourses(sort, filter, page, this.data));
    }
}
