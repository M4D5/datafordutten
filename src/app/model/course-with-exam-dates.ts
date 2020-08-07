import {Course} from "./course";

export interface CourseWithExamDates extends Course {
    explicitExamDates: { date: string, season: string }[];
    examPlacementExamDates: Map<string, string>;
    schedulePlacementExamDates: Map<string, string>;
}
