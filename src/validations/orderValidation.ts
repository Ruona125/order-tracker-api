import * as yup from "yup";

export const createOrderSchema = yup.object({
    details: yup.string(),
    cost_of_order: yup.number(),
    // start_date: yup.date(),
    // end_date: yup.date(),
    status: yup.string(),
    order_number: yup.number(),
})

