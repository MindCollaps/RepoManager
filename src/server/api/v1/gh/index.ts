import type { Octokit } from 'octokit';
import requireGithub from '~/server/requirements/github';
import { octoListRepos } from '~/utils/github';

export default defineEventHandler(async event => {
    await requireGithub(event);

    const octo: Octokit = event.context.octo;

    return octoListRepos(octo, 'MindCollaps');
});
