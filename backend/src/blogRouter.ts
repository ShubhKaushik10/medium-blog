import { Hono } from "hono";
import { Prisma, PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'
import { createBlogInputSchema, updateBlogInputSchema } from "@shubh_kaushik/medium-common";

export const blogRouter = new Hono <{
    Bindings : {
        DATABASE_URL: string;
        JWT_SECRET : string;
    },
    Variables: {
        userId: string
    }
}> ();

/**
 * This will the middleware for the blogRouter
 * This all the routes under this needs to be authenticated
 * Hence, this will verify the JWT and pass the extracted userID to the futher handlers
 */
blogRouter.use ('/*', async (c, next) => {
    
    const authHeader = c.req.header ('Authorization') || "";

    try {
        // expecting the authHeader in format of "Bearer <token>""
        const token = authHeader.split (" ")[1] || "";

        const verifyJwt = await verify (token, c.env.JWT_SECRET) as any;

        if (!verifyJwt) {
            return c.json ({
                msg: "You're not authorized",
            }, 411)
        }

        c.set ('userId', verifyJwt.id)
        await next ();
    } catch {
        return c.json ({
            msg: "You're not authorized"
        }, 411)
    }
})

blogRouter.post ('/', async (c) => {

    const prisma = new PrismaClient ({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends (withAccelerate ()); 

    const reqBody = await c.req.json ();
    const { success } = createBlogInputSchema.safeParse (reqBody);

    if (!success) {
        // TODO_SHUBH: Come back for error code
        return c.json ({
            msg: "Invalid Inputs"
        }, 411);
    }

    try {
        const newBlog = await prisma.allPost.create ({
            data : {
                title: reqBody.title,
                content: reqBody.content,
                authorId: c.get ('userId'),
                isPublished: reqBody.isPublished
            }
        })    

        return c.json ({
            msg: "Published Successfully",
            blog_id: newBlog.id
        });

    } catch {
        // TODO_SHUBH: Come back later for the error code 
        return c.json ({
            msg: "Something went wrong, please try again later"
        }, 400)
    }
});

// Update a blog with the given ID
blogRouter.put ('/', async (c) => {

    const prisma = new PrismaClient ({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends (withAccelerate ()); 

    const reqBody = await c.req.json ();
    const { success } = updateBlogInputSchema.safeParse (reqBody);

    if (!success) {
        // TODO_SHUBH: Come back for error code
        return c.json ({
            msg: "Invalid Inputs"
        }, 411);
    }

    try {
        const updatedBlog = await prisma.allPost.update ({
            where : {
                id: reqBody.id,
                authorId: c.get ('userId')
            },
            data : {
                title: reqBody.title,
                content: reqBody.content,
            }
        })    

        return c.json ({
            msg: "Blog updated successfully",
            blog_id: updatedBlog.id             // TODO_SHUBH: is it required here? comeback after frontend
        });

    } catch {
        // TODO_SHUBH: Come back later for the error code 
        return c.json ({
            msg: "Something went wrong, please try again later"
        }, 400)
    }
})

// get the blog with the asked id
blogRouter.get ('/:id', async (c) => {
    const prisma = new PrismaClient ({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends (withAccelerate ()); 
    const blogId = c.req.param ('id');
    try {
        const blog = await prisma.allPost.findUnique ({
            where:  {
                id: blogId
            }
        })    

        return c.json ({
            blog,
        });

    } catch {
        // TODO_SHUBH: Come back later for the error code 
        return c.json ({
            msg: "Something went wrong, please try again later"
        }, 400)
    }
});

blogRouter.get ('/bulk', async (c) => {
    const prisma = new PrismaClient ({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends (withAccelerate ());

    try {
        const allBlogs = await prisma.allPost.findMany ();

        // TODO_SHUBH: Add pagination and instead of returning all data return some specific datas 
        return c.json ({
            allBlogs,
        });    
    } catch {
        // TODO_SHUBH: Come back later for the error code 
        return c.json ({
            msg: "Something went wrong, please try again later"
        }, 400)
    }
});
