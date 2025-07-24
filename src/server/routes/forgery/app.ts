export default defineEventHandler(async event => {
    const redirect = process.env.GITHUB_APP_LINK;
    if (!redirect) {
    // TODO: Add some kind of error
        return sendRedirect(event, '/');
    }
    return sendRedirect(event, redirect);
});
