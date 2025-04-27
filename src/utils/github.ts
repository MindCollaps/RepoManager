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

export async function octoRemoveCollabo(octokit: Octokit, username: string, repoName: string, repoOwner: string): Promise<boolean> {
    try {
        await octokit.rest.repos.removeCollaborator({
            username: username,
            repo: repoName,
            owner: repoOwner,
        });
        return true;
    }
    catch {
        return false;
    }
}

export async function octoAddCollabo(octokit: Octokit, username: string, repoName: string, repoOwner: string): Promise<boolean> {
    try {
        await octokit.rest.repos.addCollaborator({
            username: username,
            repo: repoName,
            owner: repoOwner,
        });
        return true;
    }
    catch {
        return false;
    }
}
