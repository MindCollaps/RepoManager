import { prisma } from '~/server/prisma';
import requireGithub from '~/server/requirements/github';
import type { Octokit } from 'octokit';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

const PostBodySchema = z.object({
    username: z.string().min(2, 'Username must contain 2 letters'),
    name: z.string().min(2, 'Name must contain 2 letters').max(32, 'Name must not be longer than 32 letters'),
    email: z.string().email(),
    expires: z.boolean(),
    expiryDate: z.date().optional(),
});

export default defineEventHandler(async event => {
    const session = await requireUserSession(event);

    if (!session.user?.userId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'ID is missing!',
        });
    }

    const body = await readValidatedBody(event, body => PostBodySchema.safeParse(body));

    if (!body.success) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Request body invalid!',
            data: body.error.issues.map(x => x.message).join(', '),
        });
    }

    await requireGithub(event);
    const octo: Octokit = event.context.octo;

    const response = await octo.request('GET /users/{username}', {
        username: body.data.username,
    });

    if (!response.data) {
        throw createError({
            statusCode: 404,
            statusMessage: 'User not found',
        });
    }

    try {
        const dbUser = await prisma.gitUser.create({
            data: {
                email: body.data.email,
                avatar_url: response.data.avatar_url,
                name: body.data.name,
                username: body.data.username,
                expires: body.data.expires,
                repoState: 0,
                custom: true,
                owner: {
                    connect: [
                        { id: session.user.userId },
                    ],
                },
            },
        });

        return dbUser;
    }
    catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                throw createError({
                    statusCode: 403,
                    statusMessage: 'A user with this email exists!',
                });
            }
        }
        throw createError({
            statusCode: 500,
            statusMessage: 'Unknown Database Error occured!',
            cause: error,
        });
    }
});
