import { z } from 'zod';
import { prisma } from '~/server/prisma';
import { TokenFetchInclude } from '~/types/fetch';

const QuerySchema = z.object({
    tk: z.string().min(6).max(12),
});

export default defineEventHandler(async event => {
    const query = await getValidatedQuery(event, query => QuerySchema.safeParse(query));

    if (!query.success) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Request invalid!',
        });
    }


    const token = await prisma.groupInviteToken.findUnique({
        where: {
            token: query.data.tk,
        },
        include: TokenFetchInclude,
    });

    return token;
});
