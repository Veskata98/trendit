'use server';

import prisma from '@/lib/db';
import serverUser from '@/lib/serverUser';
import { revalidatePath } from 'next/cache';

export const upvotePost = async (postId: string, revalidate?: boolean) => {
    try {
        const user = await serverUser();

        if (!user) {
            return { success: false };
        }

        const alreadyVoted = await prisma.like.findFirst({
            where: {
                postId,
                username: user.username,
            },
        });

        if (alreadyVoted) {
            if (alreadyVoted.type === 'LIKE') {
                await prisma.like.delete({
                    where: {
                        id: alreadyVoted.id,
                    },
                });

                if (revalidate) {
                    revalidatePath(`/post/${postId}`);
                }

                return { success: true, data: null };
            } else {
                const updatedVote = await prisma.like.update({
                    where: {
                        id: alreadyVoted.id,
                    },
                    data: {
                        type: 'LIKE',
                    },
                });

                if (revalidate) {
                    revalidatePath(`/post/${postId}`);
                }

                return { success: true, data: updatedVote };
            }
        }

        const newUpvote = await prisma.like.create({
            data: {
                type: 'LIKE',
                postId,
                username: user.username,
            },
        });

        if (revalidate) {
            revalidatePath(`/post/${postId}`);
        }

        return { success: true, data: newUpvote };
    } catch (error) {
        console.error(error);
        return { success: false };
    }
};

export const downvotePost = async (postId: string, revalidate?: boolean) => {
    try {
        const user = await serverUser();

        if (!user) {
            return { success: false };
        }

        const alreadyVoted = await prisma.like.findFirst({
            where: {
                postId,
                username: user.username,
            },
        });

        if (alreadyVoted) {
            if (alreadyVoted.type === 'DISLIKE') {
                await prisma.like.delete({
                    where: {
                        id: alreadyVoted.id,
                    },
                });

                if (revalidate) {
                    revalidatePath(`/post/${postId}`);
                }

                return { success: true, data: null };
            } else {
                const updatedVote = await prisma.like.update({
                    where: {
                        id: alreadyVoted.id,
                    },
                    data: {
                        type: 'DISLIKE',
                    },
                });

                if (revalidate) {
                    revalidatePath(`/post/${postId}`);
                }

                return { success: true, data: updatedVote };
            }
        }

        const newDownvote = await prisma.like.create({
            data: {
                type: 'DISLIKE',
                postId,
                username: user.username,
            },
        });

        if (revalidate) {
            revalidatePath(`/post/${postId}`);
        }

        return { success: true, data: newDownvote };
    } catch (error) {
        console.error(error);
        return { success: false };
    }
};
