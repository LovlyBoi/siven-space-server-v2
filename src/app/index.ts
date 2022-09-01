import Koa from 'koa'
import CORS from '@koa/cors'
import bodyParser from 'koa-bodyparser'
import { blogsRouter } from '../router/blogs.router'

const app = new Koa()

app.use(CORS())
app.use(bodyParser())

app.use(blogsRouter.routes())
app.use(blogsRouter.allowedMethods())

export default app
