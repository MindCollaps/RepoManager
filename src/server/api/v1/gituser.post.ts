import { prisma } from '~/server/prisma';
import requireGithub from '~/server/middleware/github';
import type { Octokit } from 'octokit';
import { z } from 'zod';

const PostBodySchema = z.object({
    username: z.string(),
    name: z.string(),
    email: z.string(),
    expires: z.boolean(),
    expiryDate: z.date().optional(),
});

export default defineEventHandler(async event => {
    const session = await requireUserSession(event);

    if (!session.secure?.userId) {
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
            data: body.error.issues,
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
                    { id: session.secure.userId },
                ],
            },
        },
    });

    return dbUser;
});
