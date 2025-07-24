import { Octokit } from 'octokit';
import { createAppAuth, createOAuthUserAuth } from '@octokit/auth-app';
import type { GitHubAppUserAuthenticationWithExpiration } from '@octokit/auth-app';
import { prisma } from '~/server/prisma';

type AppAuth = ReturnType<typeof createAppAuth>;

let githubApp: Octokit | undefined = undefined;
let githubAppAuth: AppAuth | undefined = undefined;

const appId = process.env.NUXT_GITHUB_APP_ID;
const privateKey = process.env.NUXT_GITHUB_APP_PRIVATE_KEY;
const clientId = process.env.NUXT_GITHUB_APP_CLIENT_ID;
const clientSecret = process.env.NUXT_GITHUB_APP_CLIENT_SECRET;


async function makeGithubApp() {
    if (githubApp && githubAppAuth) {
        return;
    }

    if (!appId || !privateKey || !clientId || !clientSecret) {
        console.error('Github App credentials are missing! Check .env.example for variables');
        return;
    }

    githubAppAuth = createAppAuth({
        appId: appId,
        privateKey: privateKey,
        clientId: clientId,
        clientSecret: clientSecret,
        clientType: 'github-app',
    });

    githubApp = new Octokit({
        authStrategy: createAppAuth,
        auth: {
            appId: appId,
            privateKey: privateKey,
            clientId: clientId,
            clientSecret: clientSecret,
        },
    });
}

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

export async function githubUserKeyExchange(code: string) {
    await makeGithubApp();
    if (!githubAppAuth) {
        throw Error('GitHub Auth Setup failed');
    }

    const userAuth = await githubAppAuth({
        type: 'oauth-user',
        code,
        factory: createOAuthUserAuth,
    });

    const auth = await userAuth() as GitHubAppUserAuthenticationWithExpiration;
    return auth;
}

export async function getInstallationData(installationId: number) {
    await makeGithubApp();
    if (!githubApp) {
        throw Error('GitHub Auth Setup failed');
    }

    const installation = await githubApp.rest.apps.getInstallation({
        installation_id: installationId,
    });

    return installation;
}

export async function getInstallationById(installationId: number) {
    return new Octokit({
        authStrategy: createAppAuth,
        auth: {
            appId,
            privateKey,
            installationId,
        },
    });
}

export async function addUserInstallationToUser(gitId: number, installationId: number): Promise<boolean> {
    const dbUser = await prisma.user.findUnique({
        where: {
            git_id: gitId,
        },
    });

    if (dbUser) {
        await prisma.user.update({
            where: {
                git_id: gitId,
            },
            data: {
                hasInstallation: true,
                installationId: installationId,
            },
        });
        return true;
    }
    return false;
}

export async function removeUserInstallationFromUser(gitId: number): Promise<boolean> {
    const dbUser = await prisma.user.findUnique({
        where: {
            git_id: gitId,
        },
    });

    if (dbUser) {
        await prisma.user.update({
            where: {
                git_id: gitId,
            },
            data: {
                hasInstallation: true,
                installationId: undefined,
            },
        });
        return true;
    }
    return false;
}

export async function getInstallations() {
    await makeGithubApp();
    if (!githubApp) {
        throw Error('GitHub Auth Setup failed');
    }

    return (await githubApp.rest.apps.listInstallations()).data;
}

export async function checkUpdateUserInstallation(gitId: number) {
    const installations = await getInstallations();

    const userInstallation = installations.find(x => x.target_type === 'User' && x.target_id === gitId);

    if (userInstallation) {
        addUserInstallationToUser(gitId, userInstallation.id);
    }
    else {
        removeUserInstallationFromUser(gitId);
    }
}
