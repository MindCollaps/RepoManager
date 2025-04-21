import { prisma } from '~/server/prisma';

export default defineEventHandler(async event => {
    const session = await requireUserSession(event);

    if (!session.user?.userId) {
        throw createError({
            statusCode: 401, // Changed from 400 to 401 Unauthorized
            statusMessage: 'Not authenticated',
        });
    }

    try {
        const gitUsers = await prisma.gitUser.findMany({
            where: {
                owners: {
                    some: {
                        ownerId: session.user.userId,
                    },
                },
            },
        });

        return gitUsers || [];
    }
    catch (error) {
        console.error('Error fetching GitUsers:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal server error',
        });
    }
});
