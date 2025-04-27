import type { Octokit } from 'octokit';
import requireGithub from '~/server/requirements/github';
import { z } from 'zod';

const QuerySchema = z.object({
    name: z.string(),
    owner: z.string().optional(),
});
export default defineEventHandler(async event => {
    const query = await getValidatedQuery(event, query => QuerySchema.safeParse(query));

    const session = await requireUserSession(event);

    if (!query.success) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Request invalid!',
        });
    }

    await requireGithub(event);
    const octo: Octokit = event.context.octo;

    let owner = query.data.owner;
    if (!owner || owner.length === 0) {
        owner = session.user.username;
    }

    const repo = await octo.rest.repos.get({
        owner: owner,
        repo: query.data.name,
    }).catch(error => {
        throw createError({
            statusCode: 404,
            statusMessage: 'Repo not found',
        });
    });

    const { data } = await octo.rest.repos.getCollaboratorPermissionLevel({
        owner: owner,
        repo: query.data.name,
        username: session.user.username,
    }).catch(error => {
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
