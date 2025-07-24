import { checkUpdateUserInstallation } from '~/utils/github';

export default defineEventHandler(async event => {
    const session = await requireUserSession(event);
    if (session.secure?.githubId) {
        checkUpdateUserInstallation(session.secure?.githubId);
    }
    else {
        throw createError({
            statusCode: 400,
            statusMessage: 'ID is missing!',
        });
    }

    return { statusMessage: 'Refresh scheduled' };
});
