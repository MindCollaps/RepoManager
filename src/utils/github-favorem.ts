import type { GitUser, GroupInviteToken } from '@zenstackhq/runtime/models';
import { prisma } from '~/server/prisma';
import { octoAddCollabo, makeInstallationOctokit } from '~/utils/github';

export async function addCollaborator(token: GroupInviteToken, user: GitUser) {
    const tokenGroups = await prisma.groupInviteTokenGroups.findMany({
        where: {
            tokenId: token.id,
        },
        include: {
            group: true,
        },
    });

    const favorem = await prisma.user.findUnique({
        where: {
            id: token.ownerId,
        },
    });

    if (!favorem?.installationId) {
        // TODO: add to a queue or something
        return;
    }

    const favoremOcto = await makeInstallationOctokit(favorem?.installationId);

    if (!favoremOcto) {
        // TODO: add to a queue or something
        return;
    }

    for (const tokenGroup of tokenGroups) {
        octoAddCollabo(favoremOcto, user.username, tokenGroup.group.repoName, tokenGroup.group.repoOwner);
    }
}
