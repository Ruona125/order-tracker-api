import * as yup from "yup"

export const taskValidationSchema = yup.object({
    task: yup.string(),
    deadline: yup.string(),
})