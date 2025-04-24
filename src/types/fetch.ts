import type { Prisma } from '@zenstackhq/runtime/models';

export const TokenFetchInclude = {
    groups: {
        include: {
            group: {
                select: {
                    name: true,
                    repoName: true,
                    repoOwner: true,
                },
            },
        },
    },
    owner: {
        select: {
            name: true,
            username: true,
            avatar_url: true,
        },
    },
} satisfies Prisma.GroupInviteTokenInclude;

export type FetchingToken = Prisma.GroupInviteTokenGetPayload<{
    include: typeof TokenFetchInclude;
}>;
