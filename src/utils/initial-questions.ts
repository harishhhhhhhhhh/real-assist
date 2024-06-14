import { Question } from "@/models/Question";

export const INITIAL_QUESTIONS: Question[] = [
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
      questions: [{
        role: 'user',
        content: "When will I receive my full and final (F&F) amount?",
      }, {
        role: 'user',
        content: "How is Earned Leave (EL) encashment calculated?",
      }, {
        role: 'user',
        content: "What is the process to submit the firm-issued assets?",
      }, {
        role: 'user',
        content: "Will I be eligible for medical insurance after submitting my resignation?",
      }, {
        role: 'user',
        content: "Can I submit tax proofs after the LWD and what is the available window for submission?",
      }, {
        role: 'user',
        content: "How to claim the internet reimbursement when in a notice period?",
      }, {
        role: 'user',
        content: "List down employee exit checklist",
      }]
    }, {
      role: 'user',
      content: "Income Tax",
      questions: [{
        role: 'user',
        content: "What are tax slabs and tax rates in New Tax Regime?",
      }, {
        role: 'user',
        content: "What are disallowed exemptions in New Tax Regime?",
      }, {
        role: 'user',
        content: "What are allowable exemptions in New Tax Regime?",
      }, {
        role: 'user',
        content: "What are tax slabs and tax rates in Old Tax Regime?",
      }, {
        role: 'user',
        content: "What are allowable exemptions in Old Tax Regime?",
      }]
    }, {
      role: 'user',
      content: "ADP Payroll",
      questions: [{
        role: 'user',
        content: "What are ADP Flexi bucket components?",
      }, {
        role: 'user',
        content: "What are Investment declaration steps?",
      }, {
        role: 'user',
        content: "What are Flexi declaration steps?",
      }, {
        role: 'user',
        content: "When is the declaration Window for investment & Flexi?",
      }]
    }, {
      role: 'user',
      content: "Medical Insurance",
      questions: [{
        role: 'user',
        content: "Top-up Premium details?",
      }, {
        role: 'user',
        content: "Contact info?",
      }]
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
