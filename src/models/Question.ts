export interface Question {
    role: string;
    content: string;
    questions?: Question[];
}