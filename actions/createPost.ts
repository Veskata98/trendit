'use server';

import prisma from '@/lib/db';
import serverUser from '@/lib/serverUser';
import { redirect } from 'next/navigation';
import z, { ZodError } from 'zod';

const postSchema = z.object({
    title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
    postImage: z.instanceof(File).optional(),
    description: z.string().optional(),
});

export const createPost = async (formData: FormData, trendName: string) => {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const postImage = formData.get('postImage') as File;

    console.log(title);
    console.log(description);
    console.log(postImage);

    try {
        const user = await serverUser({ redirectToLogin: true });

        const trend = await prisma.trend.findFirst({
            where: {
                name: trendName,
                AND: [
                    {
                        OR: [
                            { creator_name: user!.username },
                            {
                                members: {
                                    some: {
                                        profile_username: user!.username,
                                    },
                                },
                            },
                        ],
                    },
                ],
            },
        });

        if (!trend) {
            throw 'Join the trend before creating post';
        }

        const parseError = postSchema.safeParse({ title, description, postImage }).error;

        if (parseError) {
            throw parseError;
        }

        await prisma.post.create({
            data: {
                title,
                trend_name: trendName,
                description,
                creator_name: user!.username,
            },
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return error.flatten().fieldErrors;
        }

        if (typeof error === 'string') {
            return { authError: [error] };
        }

        console.log(error);
    }

    redirect(`/t/${trendName}`);
};
