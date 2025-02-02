import z from "zod"

export const signupInputSchema = z.object ({
    email: z.string ().email (),
    password: z.string ().min (8),
    firstName: z.string (),
    lastName: z.string ().optional ()
});

export const signinInputSchema = z.object ({
    email: z.string ().email (),
    password: z.string ().min (8),
});

export const createBlogInputSchema = z.object ({
    title : z.string (),
    content: z.string (),
    published: z.string (),
    postedOn: z.string ().datetime (),
});

export const updateBlogInputSchema = z.object ({
    title : z.string (),
    content: z.string (),
    id: z.string ()
});

export type SignupInputSchema       = z.infer<typeof signupInputSchema>  
export type SigninInputSchema       = z.infer<typeof signinInputSchema>  
export type UpdateBlogInputSchema   = z.infer<typeof updateBlogInputSchema>
export type CreateBlogInputSchema   = z.infer <typeof createBlogInputSchema>