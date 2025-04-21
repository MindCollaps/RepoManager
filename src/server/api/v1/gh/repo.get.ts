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

    const owner = query.data.owner ?? session.user.username;

    try {
        const repo = await octo.rest.repos.get({
            owner: owner,
            repo: query.data.name,
        });

        if (repo.status === 200) {
            return repo.data;
        }
    }
    catch {
        throw createError({
            statusCode: 404,
            statusMessage: 'Repo not found',
        });
    }
});
