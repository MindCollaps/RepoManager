import { prisma } from '~/server/prisma';
import { REPO_STATE } from '~/types';
import type { NotificationStyle } from '~/types';
import { defineCronJob } from './cron';
import { checkUpdateUserInstallation, makeInstallationOctokit, octoRemoveCollabo, fetchRepoCollaborators, fetchRepoInvites } from '~/utils/github';

initTasks();

function initTasks() {
    defineCronJob('*/30 * * * *', checkGroupExpiryState);
    defineCronJob('*/10 * * * *', checkTokenExpiryState);
    defineCronJob('*/3 * * * *', checkGitStatus);
    defineCronJob('*/30 * * * *', checkInstallationStatus);
}

async function checkInstallationStatus() {
    (await prisma.user.findMany()).forEach(usr => usr.git_id ? checkUpdateUserInstallation(usr.git_id) : () => {});
}

async function checkGitStatus() {
    const groups = await prisma.gitGroup.findMany({
        include: {
            users: {
                include: {
                    user: true,
                },
            },
            owners: {
                include: {
                    owner: true,
                },
            },
        },
    });

    for (const group of groups) {
        if (!group.owners[0].owner.installationId) {
            // TODO: Take action
            continue;
        }

        const favorem = await makeInstallationOctokit(group.owners[0].owner.installationId);

        if (!favorem) {
            // TODO: Take action
            continue;
        }

        const collaborators = await fetchRepoCollaborators(favorem, group.repoOwner, group.repoName);
        const invitations = await fetchRepoInvites(favorem, group.repoOwner, group.repoName);

        const updatePromises = [];

        for (const user of group.users) {
            const userId = user.user.id;
            const gitId = user.user.git_id;

            const userCollabo = collaborators.find(x => x.id === gitId);
            const userInvited = invitations.find(x => x.invitee?.id === gitId);

            let newRepoState;

            if (userCollabo) {
                newRepoState = REPO_STATE.collabo;
            }
            else if (userInvited) {
                newRepoState = REPO_STATE.invited;
            }
            else {
                newRepoState = REPO_STATE.not_invited;
            }

            updatePromises.push(prisma.gitUserGroup.update({
                where: {
                    userId_groupId: {
                        userId: userId,
                        groupId: group.id,
                    },
                },
                data: {
                    repoState: newRepoState,
                },
            }));
        }

        try {
            await prisma.$transaction(updatePromises);
        }
        catch (e) {
            console.error(`Failed to update repoState for group ${ group.id }:`, e);
        }
    }
}

async function checkGroupExpiryState() {
    const now = new Date();
    const expiredGroups = await prisma.gitGroup.findMany({
        where: {
            expires: true,
            expiryDate: {
                lt: now,
            },
        },
        include: {
            owners: {
                include: {
                    owner: true,
                },
            },
            users: {
                include: {
                    user: true,
                },
            },
        },
    });

    for (const grp of expiredGroups) {
        const installationId = grp.owners[0].owner.installationId;

        if (!installationId) {
            continue;
        }

        const octokit = await makeInstallationOctokit(installationId);

        if (!octokit) {
            continue;
        }

        let error = false;
        if (grp.deleteUsers) {
            const removalPromises = grp.users.map(usr => octoRemoveCollabo(octokit, usr.user.username, grp.repoName, grp.repoOwner)
                .catch(error => ({ user: usr.user.username, error })));

            const results = await Promise.allSettled(removalPromises);

            const failures = results
                .filter(result => result.status === 'rejected' || (result.value instanceof Error))
                .map(failed => failed.status);

            if (failures.length > 0) {
                const errorMessage = `${ failures.length } removals failed in group ${ grp.name } - Group was therefore not deleted!`;

                // Only sends it the main owner
                sendOwnerNotification(grp.owners[0].ownerId, 'Group Remove Error', errorMessage, 'error', `/dashboard/group-${ grp.id }`);
                error = true;
            }
        }

        const successMessage = `Group ${ grp.name } expired! ${ grp.users.length } users were removed from the Repository ${ grp.repoOwner }/${ grp.repoName }!`;

        if (grp.deleteSelf && !error) {
            sendOwnerNotification(grp.owners[0].ownerId, 'Group Expired', successMessage, 'warning');
            prisma.gitGroup.delete({
                where: {
                    id: grp.id,
                },
            });
        }
        else if (!grp.deleteSelf) {
            sendOwnerNotification(grp.owners[0].ownerId, 'Group Expired', successMessage + ' The group was not deleted due to settings', 'warning', `/dashboard/group-${ grp.id }`);
        }
    }
}

async function checkTokenExpiryState() {
    const now = new Date();

    const expiredGroups = await prisma.groupInviteToken.findMany({
        where: {
            expiryDate: {
                lt: now,
            },
        },
        include: {
            usedBy: {
                include: {
                    user: true,
                },
            },
        },
    });

    for (const tk of expiredGroups) {
        sendOwnerNotification(tk.ownerId, 'Token Expired', `Token ${ tk.name } was deleted due to expiry date! The token was used by ${ tk.usedBy.length }`, 'warning');
    }

    await prisma.groupInviteToken.deleteMany({
        where: {
            expiryDate: {
                lt: now,
            },
        },
    });
}

function sendOwnerNotification(id: number, title: string, message: string, style: NotificationStyle, link?: string) {
    prisma.notification.create({
        data: {
            ownerId: id,
            title: title,
            content: message,
            style: style,
            link: link,
        },
    });
}

console.log('Data-Worker Running');
