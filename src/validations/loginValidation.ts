import * as yup from "yup"

export const loginSchema = yup.object({
    email: yup.string().email(),
    password: yup.string().required()
})