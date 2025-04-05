import { Octokit } from 'octokit';

export async function makeOctokit(token: any) {
    const octokit = new Octokit({ auth: token });
    const {
        data: { login },
    } = await octokit.rest.users.getAuthenticated();

    if (!login) {
        return null;
    }

    return octokit;
}

export async function octoListRepos(octokit: Octokit, username: string) {
    return (await octokit.rest.search.repos({
        q: 'user:' + username,
        per_page: 100, // TODO: Make this feteched until we have all
    })).data;
}
