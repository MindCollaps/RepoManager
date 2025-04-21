<template>
    <basic-dashboard
        :default-values="defaultToken"
        deletable
        editable
        :fetched-data="tokens"
        @create="createToken()"
        @delete="deleteToken"
        @edit="editToken"
    >
        <template #popup>
            <common-input-text v-model="newToken.name">Name</common-input-text>
            <common-input-text v-model="newToken.token">Token</common-input-text>
            <common-date-picker
                v-model="newToken.expiryDate"
            >Expiry Date</common-date-picker>
        </template>
        <template #item="{ item }">
            {{ item.name }}
        </template>
    </basic-dashboard>
</template>

<script setup lang="ts">
import CommonInputText from '~/components/common/CommonInputText.vue';
import CommonDatePicker from '../common/CommonDatePicker.vue';
import BasicDashboard from './BasicDashboard.vue';
import { useCreateGroupInviteToken, useFindManyGroupInviteToken, useDeleteGroupInviteToken } from '~~/lib/hooks';
import type { ZodIssue } from 'zod';

const router = useRouter();

const createInviteToken = useCreateGroupInviteToken();
const deleteInviteToken = useDeleteGroupInviteToken();
const { session } = useUserSession();
const { data: tokens, refetch } = useFindManyGroupInviteToken({
    where: {
        ownerId: session.value?.user?.userId,
    },
});

const defaultToken = {
    name: '',
    token: '',
    maxUse: 1,
    expiryDate: new Date(),
};

const newToken = ref({ ...defaultToken });

function editToken(id: number) {
    router.push(`/tk?id=${ id }&edit`);
}

async function createToken() {
    await createInviteToken.mutateAsync({
        data: {
            name: newToken.value.name,
            maxUse: newToken.value.maxUse,
            token: newToken.value.token,
            expiryDate: newToken.value.expiryDate,
            groups: {
                create: {
                    groupId: 1, // TODO: Change that duuuh~
                },
            },
            owner: {
                connect: {
                    id: session.value?.user?.userId,
                },
            },
        },
    }).then(() => {
        refetch();
    }).catch(error => {
        if (error && error.info.zodErrors && Array.isArray(error.info.zodErrors.issues)) {
            const messages = error.info.zodErrors.issues.map((issue: ZodIssue) => `${ issue.path.join('.') }: ${ issue.message }`).join('\n');
            alert(messages);
        }
        else if (error?.message) {
            alert(error.message);
        }
        else {
            alert('An unexpected error occurred.');
            console.log(error);
        }
    });
}

async function deleteToken(id: number) {
    if (confirm('Are you sure you want to delete this group?')) {
        await deleteInviteToken.mutateAsync({
            where: {
                id: id,
            },
        });
    }
}
</script>
