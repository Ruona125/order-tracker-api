import * as yup from "yup";

export const createIncomeSchema = yup.object({
    amount: yup.number(),
    description: yup.string(),
    name_of_income: yup.string(),
    date: yup.date()
})