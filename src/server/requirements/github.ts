import { prisma } from '~/server/prisma';
import type { Octokit } from 'octokit';
import { makeOctokit } from '~/utils/github';

const cachedOcto: Map<number, Octokit> = new Map();

export default defineEventHandler(async event => {
    try {
        const session = await requireUserSession(event);

        if (!session.user?.userId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'ID is missing!',
            });
        }

        const userId = session.user.userId;

        const dbUser = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (dbUser) {
            if (!cachedOcto.has(userId)) {
                const octo = await makeOctokit(dbUser.git_access_token);
                if (!octo) {
                    throw createError({
                        statusCode: 401,
                        statusMessage: 'Unauthorized access',
                        cause: 'Couldnt etablish connection to github api',
                    });
                }

                cachedOcto.set(userId, octo);
            }
            event.context.user = dbUser;
            event.context.octo = cachedOcto.get(userId);
        }
    }
    catch (error) {
        console.error(error);
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized access',
        });
    }
});
