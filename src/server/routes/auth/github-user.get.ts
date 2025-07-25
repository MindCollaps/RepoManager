import { prisma } from '~/server/prisma';
import { REPO_STATE, TokenCookieName } from '~/types';
import { generateRandomState } from '~/utils/github';
import { addCollaborator } from '~/utils/github-favorem';

export default defineOAuthGitHubEventHandler({
    config: {
        emailRequired: true,
        clientId: process.env.NUXT_GITHUB_APP_CLIENT_ID,
        clientSecret: process.env.NUXT_GITHUB_APP_CLIENT_SECRET,
        authorizationParams: {
            state: generateRandomState(),
        },
        scope: [],
        redirectURL: process.env.PUBLIC_FQDN + '/auth/github-user',
    },
    async onSuccess(event, { user, tokens }) {
        if (!user.email) {
            return sendRedirect(event, '/login/error?msg=' + encodeURIComponent('GitHub gave us no E-Mail Address'));
        }

        const tokenCookie = getCookie(event, TokenCookieName);

        if (!tokenCookie) {
            return sendRedirect(event, '/login/error?msg=' + encodeURIComponent('Request Invalid!'));
        }

        const token = await prisma.groupInviteToken.findUnique({
            where: {
                token: tokenCookie,
            },
            include: {
                groups: true,
                usedBy: {
                    include: {
                        user: true,
                    },
                },
            },
        });

        if (!token) {
            return sendRedirect(event, '/login/error?msg=' + encodeURIComponent('Token Invalid or expired!'));
        }

        if (token.usedBy.length >= token.maxUse) {
            return sendRedirect(event, '/login/error?msg=' + encodeURIComponent('This token cannot be used anymore - max usage'));
        }

        let dbUser = await prisma.gitUser.findUnique({
            where: {
                email: user.email.toLowerCase(),
            },
        });

        if (dbUser) {
            const dbUserr = dbUser;
            const connectOrCreateArray = token.groups.map(group => ({
                where: {
                    userId_groupId: {
                        userId: dbUserr.id,
                        groupId: group.groupId,
                    },
                },
                create: {
                    groupId: group.groupId,
                    repoState: REPO_STATE.invited,
                },
            }));

            dbUser = await prisma.gitUser.update({
                where: {
                    id: dbUser.id,
                },
                data: {
                    git_access_token: tokens.access_token,
                    avatar_url: user.avatar_url,
                    groups: {
                        connectOrCreate: connectOrCreateArray,
                    },
                },
            });

            if (token.usedBy.findIndex(x => x.userId === dbUser?.id) !== -1) {
                return sendRedirect(event, '/login/error?msg=' + encodeURIComponent('You used this token already!'));
            }
        }
        else {
            dbUser = await prisma.gitUser.create({
                data: {
                    email: user.email.toLowerCase(),
                    username: user.login,
                    name: user.name ?? 'No Name Provided',
                    git_access_token: tokens.access_token,
                    avatar_url: user.avatar_url,
                    git_id: user.id,
                    groups: {
                        createMany: {
                            data: token.groups.map(x => ({ groupId: x.groupId, repoState: REPO_STATE.invited })),
                        },
                    },
                    owners: {
                        createMany: {
                            data: {
                                ownerId: token.ownerId,
                            },
                        },
                    },
                },
            });
        }

        await prisma.groupInviteToken.update({
            where: {
                id: token.id,
            },
            data: {
                usedBy: {
                    create: {
                        userId: dbUser.id,
                    },
                },
            },
        });

        await setUserSession(event, {
            user: {
                logon: new Date(Date.now()),
                userId: dbUser.id,
                isUser: false,
            },
            secure: {
                githubId: user.id,
                userId: dbUser.id,
            },
        });

        deleteCookie(event, TokenCookieName);

        addCollaborator(token, dbUser);

        return sendRedirect(event, '/login/success');
    },
    onError(event, error) {
        console.error('GitHub OAuth error:', error);
        return sendRedirect(event, '/login/error');
    },
});
