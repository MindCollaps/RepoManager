import { prisma } from '~~/server/prisma';
import { UserFetchSelect } from '~/types/fetch';

export default defineEventHandler(async event => {
    const session = await requireUserSession(event).then(session => session).catch();

    if (!session.user?.userId) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Not authenticated',
        });
    }

    const dbUser = await prisma.user.findUnique({
        where: {
            git_id: session.secure?.githubId,
        },
        select: UserFetchSelect,
    });

    return dbUser;
});
