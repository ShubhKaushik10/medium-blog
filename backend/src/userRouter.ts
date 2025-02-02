import { Hono } from "hono"
import { Prisma, PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'
import { signinInputSchema, signupInputSchema } from "@shubh_kaushik/medium-common";

export const userRouter = new Hono <{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    }
}>();


userRouter.post ('/signup', async (c) => {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    console.log ("Hi There! This is before even getting the payload");
    try {

        const reqBody = await c.req.json ();
        console.log ("Hi There! This is before validation");
        const {success} = await signupInputSchema.safeParse (reqBody);
    
        // TODO_Shubh: Add Zod validation
        if (!success) {
            return c.json ({
                msg: "Invalid inputs"
            });
        }
    
        console.log ("Hi There! This is after validation");
        // TODO_Shubh: Hash the password
    
        const newUser = await prisma.user.create ({
            data  : {
                firstName : reqBody.firstName,
                lastName : reqBody.lastName,
                email : reqBody.email,
                password : reqBody.password
            }
        })
    
        const token = await sign ({id: newUser.id}, c.env.JWT_SECRET)
    
        return c.json ({
            token, 
            msg : "Signed up successfully"
        });
            
    } catch {
        // Can fail if unable to connect to the DB, or tries to sign in with the existing ID
        return c.json ({
            msg: "Invalid inputs"
        });
    }
})
  
userRouter.post ('/signin', async (c) => {

    const prisma = new PrismaClient ({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends (withAccelerate ())

    const reqBody = await c.req.json ();
    try {
        // zod validation of the incoming body
        const { success } = await signinInputSchema.safeParse (reqBody);

        if (!success) {
            return c.json ({
                msg: "Invalid inputs"
            });
        }

        const user = await prisma.user.findUnique ({
            where: {
                email: reqBody.email,
                password: reqBody.password
            }
        }) 

        if (!user) {
            c.status (403);
            return c.json ({
                msg: "Incorrect username or password"
            });
        }  
        
        const token = await sign ({id: user.id}, c.env.JWT_SECRET);

        return c.json ({
            token,
            msg: "You have successfully signed in!"
        });
    } catch {
        // Can fail if unable to connect to the DB
        return c.json ({
        msg: "Invalid"
        });
    }
})