import { prisma } from '~/server/prisma';
import { TokenCookieName } from '~/types';

export default defineOAuthGitHubEventHandler({
    config: {
        emailRequired: true,
        scope: [],
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
            },
        });

        if (!token) {
            return sendRedirect(event, '/login/error?msg=' + encodeURIComponent('Token Invalid!'));
        }

        let dbUser = await prisma.gitUser.findUnique({
            where: {
                email: user.email.toLowerCase(),
            },
        });

        if (dbUser) {
            await prisma.gitUser.update({
                where: {
                    email: user.email.toLowerCase(),
                },
                data: {
                    git_access_token: tokens.access_token,
                    avatar_url: user.avatar_url,
                },
            });
        }
        else {
            dbUser = await prisma.gitUser.create({
                data: {
                    email: user.email.toLowerCase(),
                    username: user.login,
                    name: user.name,
                    git_access_token: tokens.access_token,
                    avatar_url: user.avatar_url,
                    groups: {
                        createMany: {
                            data: token.groups.map(x => ({ groupId: x.groupId, repoState: -1 })),
                        },
                    },
                    expires: false,
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

        await setUserSession(event, {
            user: {
                username: user.login,
                logon: new Date(Date.now()),
                userId: dbUser.id,
                isUser: false,
            },
            avatar_url: user.avatar_url,
            secure: {
                email: user.email,
            },
        });

        deleteCookie(event, TokenCookieName);

        return sendRedirect(event, '/login/success');
    },
    onError(event, error) {
        console.error('GitHub OAuth error:', error);
        return sendRedirect(event, '/login/error');
    },
});
