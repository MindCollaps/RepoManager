export default defineEventHandler(async event => {
    const clientId = process.env.NUXT_GITHUB_APP_CLIENT_ID;
    const publicFqdn = process.env.PUBLIC_FQDN + '/auth/github';

    if (!clientId || !publicFqdn) {
        return sendRedirect(event, '/login/error?msg=' + encodeURIComponent('GitHub Auth Failed'));
    }

    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: publicFqdn,
        state: generateRandomState(),
    });

    const githubAuthUrl = `https://github.com/login/oauth/authorize?${ params.toString() }`;

    return sendRedirect(event, githubAuthUrl);
});

function generateRandomState(length = 32) {
    return Array.from(crypto.getRandomValues(new Uint8Array(length)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}
