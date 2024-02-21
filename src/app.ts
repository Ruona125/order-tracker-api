import express, {Express} from "express"
import helmet from "helmet"
import cors from "cors"

import registerUserRouter from "./routes/register/register.router"
import signinRouter from "./routes/login-and-logout/login.router";
import customerRouter from "./routes/customer/cutomer.router";
import orderRouter from "./routes/order/order.router";
import incomeRouter from "./routes/income/income.router";
import expensesRouter from "./routes/expenses/expenses.router";
import milestoneRouter from "./routes/milestone/milestone.router";
import reportRouter from "./routes/report/report.router";
import taskRouter from "./routes/task/task.router"
import changePasswordRouter from "./routes/users/users.routers"

const app:Express = express();

app.use(express.json())
app.use(cors())
app.use(helmet())

app.use(registerUserRouter)
app.use(signinRouter)
app.use(customerRouter)
app.use(orderRouter)
app.use(incomeRouter)
app.use(expensesRouter)
app.use(milestoneRouter)
app.use(reportRouter)
app.use(taskRouter)
app.use(changePasswordRouter)

export default app