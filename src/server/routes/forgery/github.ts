import { generateRandomState } from '~/utils/github';

export default defineEventHandler(async event => {
    const clientId = process.env.NUXT_GITHUB_APP_CLIENT_ID;
    const redirectUri = process.env.PUBLIC_FQDN + '/auth/github';

    if (!clientId || !redirectUri) {
        return sendRedirect(event, '/login/error?msg=' + encodeURIComponent('GitHub Auth Failed'));
    }

    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        state: generateRandomState(),
    });

    const githubAuthUrl = `https://github.com/login/oauth/authorize?${ params.toString() }`;

    return sendRedirect(event, githubAuthUrl);
});

