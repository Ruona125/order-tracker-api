import * as yup from "yup";

export const userSchema = yup.object({
    name: yup.string().required(),
    password: yup.string().required(),
    email: yup.string().email(),
    roles: yup.string(),
    security_question: yup.string().required(),
    security_answer: yup.string().required()
})  

