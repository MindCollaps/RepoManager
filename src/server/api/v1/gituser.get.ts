import requireGithub from '~/server/middleware/github';
import type { Octokit } from 'octokit';
import { z } from 'zod';

const QuerySchema = z.object({
    username: z.string(),
});

export default defineEventHandler(async event => {
    const session = await requireUserSession(event);

    if (!session.secure?.userId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'ID is missing!',
        });
    }

    const query = await getValidatedQuery(event, query => QuerySchema.safeParse(query));

    if (!query.success) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Request invalid!',
        });
    }

    await requireGithub(event);
    const octo: Octokit = event.context.octo;

    const response = await octo.request('GET /users/{username}', {
        username: query.data.username,
    });

    return response.data;
});
