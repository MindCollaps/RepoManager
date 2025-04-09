import { prisma } from '~/server/prisma';
import type { Octokit } from 'octokit';
import { makeOctokit } from '~/utils/github';

const cachedOcto: Map<number, Octokit> = new Map();

export default defineEventHandler(async event => {
    if (!event.path.startsWith('/api/v1/gh')) {
        return;
    }

    try {
        const session = await requireUserSession(event);

        if (!session.secure?.userId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'ID is missing!',
            });
        }

        const userId = session.secure.userId;

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
        console.log(error);
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized access',
        });
    }
});
