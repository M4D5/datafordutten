import {SortDirection} from "./sort";

export interface Course {
    courseName: string;
    schedulePlacements: string[];
    examPlacements: string[];
    courseNumber: string;
    averageGrade: number;
    averageGradePercentile: number;
    percentPassed: number;
    qualityScore: number;
    qualityScorePercentile: number;
    workloadScore: number;
    workloadScorePercentile: number;
    lazyScore: number;
    lazyScorePercentile: number;
}

export function compareCourses(a: Course, b: Course, direction: SortDirection, property: string) {
    let c1, c2;

    if (direction === SortDirection.Ascending) {
        c1 = a;
        c2 = b;
    } else {
        c1 = b;
        c2 = a;
    }

    if (c1[property] === undefined || c1[property] === null) {
        if (direction === SortDirection.Ascending) {
            return 1;
        } else {
            return -1;
        }
    }

    if (c2[property] === undefined || c2[property] === null) {
        if (direction === SortDirection.Ascending) {
            return -1;
        } else {
            return 1;
        }
    }

    if (typeof (c1[property]) === 'number') {
        return c1[property] - c2[property];
    } else if (typeof (c1[property]) === 'string') {
        return c1[property].localeCompare(c2[property]);
    } else {
        return 0;
    }
}
