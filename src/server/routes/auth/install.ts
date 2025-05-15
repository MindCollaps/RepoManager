import { prisma } from '~/server/prisma';
import { z } from 'zod';
import { getInstallationData as getGitInstallation } from '~/utils/github';

const QuerySchema = z.object({
    installation_id: z.string(),
});

export default defineEventHandler(async event => {
    const query = await getValidatedQuery(event, query => QuerySchema.safeParse(query));

    if (!query.data) {
        return sendRedirect(event, '/login/error?install&msg=' + encodeURIComponent('GitHub Auth Failed'));
    }

    const installationId = parseInt(query.data.installation_id);

    if (!query.success) {
        console.log(JSON.stringify(query));
        return sendRedirect(event, '/login/error?install&msg=' + encodeURIComponent('GitHub Auth Failed'));
    }

    let installation = undefined;

    try {
        installation = await getGitInstallation(installationId);
    }
    catch (error) {
        console.error(`Key Exchange failed\n${ error }`);
        return sendRedirect(event, '/login/error?install&msg=' + encodeURIComponent('GitHub key exchange failed'));
    }

    const userData = installation.data.account;

    if (!userData) {
        console.error('User of installation is invalid!');
        return sendRedirect(event, '/login/install&error?msg=' + encodeURIComponent('We only can sign in users'));
    }

    const dbUser = await prisma.user.findUnique({
        where: {
            git_id: userData.id,
        },
    });

    if (dbUser) {
        await prisma.user.update({
            where: {
                git_id: userData.id,
            },
            data: {
                hasInstallation: true,
                installationId: installationId,
            },
        });
    }
    else {
        return sendRedirect(event, '/login');
    }

    return sendRedirect(event, '/profile');
});
