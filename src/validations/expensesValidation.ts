import * as yup from "yup";

export const createExpenseSchema = yup.object({
    amount: yup.number(),
    description: yup.string(),
    name_of_expenses: yup.string(),
    date: yup.date()
})
