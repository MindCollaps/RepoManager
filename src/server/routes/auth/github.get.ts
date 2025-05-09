import { prisma } from '~/server/prisma';

export default defineOAuthGitHubEventHandler({
    config: {
        emailRequired: true,
        scope: ['repo'],
    },
    async onSuccess(event, { user, tokens }) {
        if (!user.email) {
            return sendRedirect(event, '/login/error?msg=' + encodeURIComponent('GitHub gave us no E-Mail Address'));
        }

        let dbUser = await prisma.user.findUnique({
            where: {
                email: user.email.toLowerCase(),
            },
        });

        if (dbUser) {
            await prisma.user.update({
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
            dbUser = await prisma.user.create({
                data: {
                    email: user.email.toLowerCase(),
                    username: user.login,
                    name: user.name,
                    git_access_token: tokens.access_token,
                    avatar_url: user.avatar_url,
                },
            });
        }

        await setUserSession(event, {
            user: {
                username: user.login,
                logon: new Date(Date.now()),
                userId: dbUser.id,
                isUser: true,
            },
            avatar_url: user.avatar_url,
            secure: {
                email: user.email,
            },
        });

        return sendRedirect(event, '/login/success');
    },
    onError(event, error) {
        console.error('GitHub OAuth error:', error);
        return sendRedirect(event, '/login/error');
    },
});
