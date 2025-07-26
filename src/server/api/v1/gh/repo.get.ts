import { z } from 'zod';
import { prisma } from '~/server/prisma';
import { getInstallationById } from '~/utils/github';

const QuerySchema = z.object({
    name: z.string(),
    owner: z.string().optional(),
});

export default defineEventHandler(async event => {
    const session = await requireUserSession(event);

    const user = await prisma.user.findUnique({
        where: {
            git_id: session.secure?.githubId,
        },
    });

    if (!user || !user.username) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Request invalid!',
        });
    }

    const query = await getValidatedQuery(event, query => QuerySchema.safeParse(query));

    if (!query.success) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Request invalid!',
        });
    }

    let owner = query.data.owner;

    if (!user.installationId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Installation invalid!',
        });
    }

    if (!owner) {
        owner = user.username;
    }

    const octo = await getInstallationById(user.installationId);

    const repo = await octo.rest.repos.get({
        owner: owner,
        repo: query.data.name,
    }).catch(error => {
        console.error(error);
        throw createError({
            statusCode: 404,
            statusMessage: 'Repo not found',
        });
    });

    const { data } = await octo.rest.repos.getCollaboratorPermissionLevel({
        owner: owner,
        repo: query.data.name,
        username: user.username,
    }).catch(error => {
        console.error(`Error in Requesting CollaboratorPermissionLevel\n${ JSON.stringify(error) }`);
        throw createError({
            statusCode: 401,
            statusMessage: 'Insufficent permissions on repository',
        });
    });

    if (data.permission === 'admin' || data.permission === 'maintain') {
        return repo;
    }
    else {
        throw createError({
            statusCode: 401,
            statusMessage: 'Insufficent permissions on repository',
        });
    }
});
