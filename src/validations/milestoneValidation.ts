import * as yup from "yup"

export const createMilestoneSchema = yup.object({
    description: yup.string(),
    countdown_timer: yup.string(),
})