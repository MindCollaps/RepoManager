import { createEventHandler } from '@zenstackhq/server/nuxt';
import { RestApiHandler } from '@zenstackhq/server/api';
import { prisma } from '~/server/prisma';
import { enhance } from '@zenstackhq/runtime';

export default createEventHandler({
    getPrisma: async event => {
        const user = (await prisma.user.findFirst({ where: { id: (await getUserSession(event)).secure?.userId } }));
        if (!user) {
            return createError({
                statusCode: 400,
                statusMessage: 'Not logged in!',
            });
        }
        return enhance(prisma, { user });
    },
    handler: RestApiHandler({ endpoint: 'http://localhost:8080/api/data' }),
});
