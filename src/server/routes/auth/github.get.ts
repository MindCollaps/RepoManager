import { prisma } from '~/server/prisma';

export default defineOAuthGitHubEventHandler({
    config: {
        emailRequired: true,
        scope: ['repo'],
    },
    async onSuccess(event, { user, tokens }) {
        let dbUser = await prisma.user.findUnique({
            where: {
                email: user.email,
            },
        });

        if (dbUser) {
            await prisma.user.update({
                where: {
                    email: user.email,
                },
                data: {
                    git_access_token: tokens.access_token,
                },
            });
        }
        else {
            dbUser = await prisma.user.create({
                data: {
                    email: user.email,
                    username: user.login,
                    name: user.name,
                    git_access_token: tokens.access_token,
                },
            });
        }

        await setUserSession(event, {
            user: {
                id: dbUser.id,
                username: user.login,
                email: user.email,
                loggedIn: new Date(Date.now()),
            },
        });
        return sendRedirect(event, '/login/success');
    },
    onError(event, error) {
        console.error('GitHub OAuth error:', error);
        return sendRedirect(event, '/login/error');
    },
});
