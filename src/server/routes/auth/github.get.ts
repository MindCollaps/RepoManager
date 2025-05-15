import { prisma } from '~/server/prisma';
import { z } from 'zod';
import { githubUserKeyExchange } from '~/utils/github';
import { Octokit } from 'octokit';

const QuerySchema = z.object({
    code: z.string(),
});

export default defineEventHandler(async event => {
    const query = await getValidatedQuery(event, query => QuerySchema.safeParse(query));

    // TODO: Check state
    if (!query.success) {
        return sendRedirect(event, '/login/error?msg=' + encodeURIComponent('GitHub Auth Failed'));
    }

    let exchange = undefined;

    try {
        exchange = await githubUserKeyExchange(query.data.code);
    }
    catch (error) {
        console.error(`Key Exchange failed\n${ JSON.stringify(error) }`);
        return sendRedirect(event, '/login/error?msg=' + encodeURIComponent('GitHub key exchange failed'));
    }

    const userOcto = new Octokit({
        auth: exchange.token,
    });

    let authData = undefined;

    try {
        authData = await userOcto.rest.users.getAuthenticated();
    }
    catch (error) {
        console.error(`GitHub Auth Failed\n${ JSON.stringify(error) }`);
        return sendRedirect(event, '/login/error?msg=' + encodeURIComponent('GitHub Auth Failed'));
    }

    const userData = authData.data;

    if (!userData.id || userData.id === 0) {
        return sendRedirect(event, '/login/error?msg=' + encodeURIComponent('GitHub read user failed'));
    }

    let dbUser = await prisma.user.findUnique({
        where: {
            git_id: userData.id,
        },
    });

    const in8h = new Date();
    const in6m = new Date();
    in8h.setHours(in8h.getHours() + 8);
    in6m.setMonth(in6m.getMonth() + 6);

    if (dbUser) {
        await prisma.user.update({
            where: {
                git_id: userData.id,
            },
            data: {
                username: userData.login,
                name: userData.name,
                avatar_url: userData.avatar_url,
                git_access_token: exchange.token,
                git_refresh_token: exchange.refreshToken,
                git_token_expires: in8h,
                git_refresh_expires: in6m,
            },
        });
    }
    else {
        dbUser = await prisma.user.create({
            data: {
                username: userData.login,
                name: userData.name,
                git_id: userData.id,
                avatar_url: userData.avatar_url,
                git_access_token: exchange.token,
                git_refresh_token: exchange.refreshToken,
                git_token_expires: in8h,
                git_refresh_expires: in6m,
            },
        });
    }

    await setUserSession(event, {
        user: {
            logon: new Date(Date.now()),
            userId: dbUser.id,
            isUser: true,
        },
        secure: {
            userId: dbUser.id,
            githubId: userData.id,
        },
    });

    return sendRedirect(event, '/login/success');
});
