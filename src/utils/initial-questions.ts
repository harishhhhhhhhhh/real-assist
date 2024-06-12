import { Question } from "@/models/Question";

export const INITIAL_QUESTIONS: Question[]  = [
  {
    role: 'user',
    content: "USA",
    questions: [{
      role: 'user',
      content: "Employee Onboarding",
    }, {
      role: 'user',
      content: "Employee Exit",
    }, {
      role: 'user',
      content: "Income Tax",
    }, {
      role: 'user',
      content: "ADP Payroll Setup",
    }, {
      role: 'user',
      content: "Medical Insurance",
    }]
  },
  {
    role: 'user',
    content: "India",
    questions: [{
      role: 'user',
      content: "Employee Onboarding",
    }, {
      role: 'user',
      content: "Employee Exit",
    }, {
      role: 'user',
      content: "Income Tax",
    }, {
      role: 'user',
      content: "ADP Payroll Setup",
    }, {
      role: 'user',
      content: "Medical Insurance",
    }]
  },
  {
    role: 'user',
    content: "Philippines",
    questions: [{
      role: 'user',
      content: "Employee Onboarding",
    }, {
      role: 'user',
      content: "Employee Exit",
    }, {
      role: 'user',
      content: "Income Tax",
    }, {
      role: 'user',
      content: "ADP Payroll Setup",
    }, {
      role: 'user',
      content: "Medical Insurance",
    }]
  },
];
