<template>
    <div v-if="loading">
        Loading
    </div>
    <div v-else>
        <template v-if="tokenError">
            <template v-if="noTokenProvided">
                No Token Provided!
            </template>
            <template v-else>
                {{ tokenErrorMessage }}
            </template>
        </template>
        <template v-else>
            {{ token?.name }} | {{ token?.token }}
        </template>
    </div>
</template>

<script setup lang="ts">
import type { GroupInviteToken } from '@zenstackhq/runtime/models';
import { useFindUniqueGroupInviteToken } from '~~/lib/hooks';

const route = useRoute();

const loading = ref(true);
const tokenError = ref(false);
const noTokenProvided = ref(false);
const tokenErrorMessage = ref('');
const token = shallowRef<GroupInviteToken | undefined>();

function setError(message: string, noToken = false) {
    tokenError.value = true;
    tokenErrorMessage.value = message;
    noTokenProvided.value = noToken;
}

async function fetchTokenByString(tokenString: string) {
    try {
        const data = await $fetch<GroupInviteToken>(`/api/v1/tk?tk=${ encodeURIComponent(tokenString) }`);
        token.value = data;
    }
    catch (error: any) {
        setError(error?.statusMessage || 'Token could not be found');
    }
}

async function fetchTokenById(tokenId: string) {
    const id = parseInt(tokenId, 10);
    if (isNaN(id)) {
        setError('Invalid token ID', true);
        return;
    }
    try {
        // Silly way of fetching MANUEL
        const { data, error, refetch } = useFindUniqueGroupInviteToken({ where: { id: id } }, { enabled: false });
        await refetch();
        if (error?.value) {
            setError(error.value.message ?? 'Token could not be found');
        }
        else if (data?.value) {
            token.value = data.value;
        }
        else {
            setError('Token could not be found');
        }
    }
    catch (error: any) {
        setError(error?.message ?? 'Token could not be found');
    }
}

async function editQuery() {
    const tokenString = route.query.tk as string | undefined;
    const tokenId = route.query.id as string | undefined;

    if (!tokenString && !tokenId) {
        setError('No token provided', true);
        return;
    }
    if (tokenString) {
        await fetchTokenByString(tokenString);
    }
    else if (tokenId) {
        await fetchTokenById(tokenId);
    }
}

async function loadQuery() {
    const tokenString = route.query.tk as string | undefined;
    if (!tokenString) {
        setError('Token could not be found', true);
        return;
    }
    await fetchTokenByString(tokenString);
}

onMounted(async () => {
    try {
        if ('edit' in route.query) {
            await editQuery();
        }
        else {
            await loadQuery();
        }
    }
    catch {
        setError('An error occurred');
    }
    finally {
        loading.value = false;
    }
});
</script>

