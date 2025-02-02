import { Hono } from 'hono'
import { Prisma, PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { blogRouter } from './blogRouter'
import { userRouter } from './userRouter'
// This is how you give the environment variable to your hono application
// 
const app = new Hono<{
  Bindings: {
    DATABASE_URL: string
    JWT_SECRET : string
  }, 
  Variables: {
    userId: string
  }
}>()

app.route ('api/v1/user', userRouter);
app.route ('api/v1/blogs', blogRouter);

app.get('/', (c) => {
  console.log('Serving / route');

  // Why this inside the route? 
  // >>>>> bcz sometimes in the serverless environment, the functions (route handlers) are brought up independently and 
  // you night not have the outside context and hence the client if it is defined globally 
  // >>>>> It might work and sometime not work... also you dont want many global variables in your application
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate())

  return c.json({
    msg: "Hello Hono Not Worldb!"
  })

})

app.all('*', (c) => {
  console.log(`Unhandled request to: ${c.req.url}`); // This should log all other requests
  return c.text('This is a fallback route'); // This is just for debugging
});

export default app
