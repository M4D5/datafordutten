import {compareCourses, Course} from "../model/course";
import {Sort, SortDirection} from "../model/sort";
import {RequestFilter} from "../data-table/request-filter";
import {PageRequest} from "../data-table/page-request";
import {DataRequestHolder} from "../data-table/data-request-holder";

export class CourseUtils {
    static convertCoursesToList(courses: any): Course[] {
        const keys = Object.keys(courses);
        const list = [];

        for (let key of keys) {
            const obj = courses[key];
            obj.courseNumber = key;
            list.push(obj);
        }

        return list;
    }

    static getCourseLink(courseNumber: string) {
        return `https://kurser.dtu.dk/course/${courseNumber}`;
    }

    static matchesSearchTerm(searchTerm: string, course: Course): boolean {
        return course.courseNumber.startsWith(searchTerm) ||
            course.courseName && course.courseName.toLocaleLowerCase().indexOf(searchTerm.toLocaleLowerCase()) !== -1;
    }

    static sortCourses(sort: Sort, data: Course[]) {
        if (!sort) {
            return data.sort((a, b) => compareCourses(a, b, SortDirection.Ascending, 'courseNumber'));
        } else {
            return data.sort((a, b) => compareCourses(a, b, sort.direction, sort.property));
        }
    }

    static prepareCourses(dataRequest: DataRequestHolder, data: Course[]) {
        const filteredCourses = this.filterCourses(dataRequest.filter, data);
        const sortedCourses = CourseUtils.sortCourses(dataRequest.sortOptions, filteredCourses);
        const pagedCourses = sortedCourses.slice(dataRequest.page * dataRequest.pageSize, (dataRequest.page + 1) * dataRequest.pageSize);

        return {
            totalRows: data.length,
            rowValues: pagedCourses,
            matchingRows: filteredCourses.length,
            matchingPages: Math.ceil(filteredCourses.length / dataRequest.pageSize)
        };
    }

    static filterCourses(filter: RequestFilter, data: Course[]) {
        let filteredData = data;

        if (filter && filter.globalSearchTerm) {
            filteredData = data.filter(d => CourseUtils.matchesSearchTerm(filter.globalSearchTerm, d));
        }

        return filteredData;
    }
}
