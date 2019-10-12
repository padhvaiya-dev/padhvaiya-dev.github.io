export class User {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    token: string
}

export interface loggedInUser{
    firstName: string;
    lastName: string;
    email: string;
    questionCount: number;
    answerCount: number;
}