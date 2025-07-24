import { createEventHandler } from '@zenstackhq/server/nuxt';
import { prisma } from '~/server/prisma';
import { enhance } from '@zenstackhq/runtime';

export default createEventHandler({
    getPrisma: async event => {
        const user = (await prisma.user.findFirst({ where: { id: (await getUserSession(event)).user?.userId } }));

        return enhance(prisma, { user: user ? user : undefined });
    },
});
