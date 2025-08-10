import type { ISubjectResponse } from './Subject';
import type { IUserResponse } from './Users';

export interface ISubjectInscriptionResponse {
    id: number;
    observation: string;
    userId: number;
    subjectId: number;
    student: IUserResponse;
    subject: ISubjectResponse;
}

export interface ISubjectInscriptionRequest {
    UserStudentId: number;
    Subjects: ISubjectsInscriptionsRequest[];
}

export interface ISubjectsInscriptionsRequest {
    Id: number;
    Observation: string;
}

export interface IModalRegisterSubjectsComponent {
    open: boolean;
    subjects: ISubjectResponse[];
    onHandleModal: () => void;
    registerSubjects: (subjects: ISubjectInscriptionRequest) => void;
}