import { prisma } from '~/server/prisma';

export default defineEventHandler(async event => {
    const session = await requireUserSession(event);

    if (!session.user?.userId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'ID is missing!',
        });
    }

    const userId = session.user.userId;

    const gitUsers = await prisma.gitUser.findMany({
        where: {
            owner: {
                some: {
                    id: userId,
                },
            },
        },
    });

    if (gitUsers) {
        return gitUsers;
    }
    else {
        return [];
    }
});
