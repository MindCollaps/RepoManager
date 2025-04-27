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
            <basic-create-adder
                v-model="selectedGroups"
                :data="gitGroups"
                label="Git Groups"
            >
                <template #default="{ item }">
                    {{ item.name }}
                </template>
            </basic-create-adder>
        </template>
        <template #item="{ item }">
            {{ item.name }} | Used {{ item.usedBy.length }}
        </template>
        <template #action="{ item }">
            <common-button
                primary-color="info500"
                @click="navigateTo('/tk?tk=' + encodeURIComponent(item.token))"
            >
                <template #icon>
                    <search-icon/>
                </template>
            </common-button>
        </template>
    </basic-dashboard>
</template>

<script setup lang="ts">
import SearchIcon from '~/assets/icons/search.svg?component';
import CommonInputText from '~/components/common/CommonInputText.vue';
import CommonDatePicker from '../common/CommonDatePicker.vue';
import BasicDashboard from '../basic/BasicDashboard.vue';
import BasicCreateAdder from '../basic/BasicCreateAdder.vue';
import { useCreateGroupInviteToken, useFindManyGroupInviteToken, useDeleteGroupInviteToken, useFindManyGitGroup } from '~~/lib/hooks';
import type { ZodIssue } from 'zod';

const { data: gitGroups } = useFindManyGitGroup({}, { enabled: true });
const createInviteToken = useCreateGroupInviteToken();
const deleteInviteToken = useDeleteGroupInviteToken();
const { session } = useUserSession();
const { data: tokens, refetch } = useFindManyGroupInviteToken({
    where: {
        ownerId: session.value?.user?.userId,
    },
    include: {
        usedBy: true,
    },
});

const defaultToken = {
    name: '',
    token: '',
    maxUse: 1,
    expiryDate: new Date(),
};

const newToken = ref({ ...defaultToken });

const selectedGroups: Ref<Array<number>> = ref([]);

function editToken(id: number) {
    navigateTo(`/dashboard/token-${ id }`);
}

async function createToken() {
    await createInviteToken.mutateAsync({
        data: {
            name: newToken.value.name,
            maxUse: newToken.value.maxUse,
            token: newToken.value.token,
            expiryDate: newToken.value.expiryDate,
            groups: {
                createMany: {
                    data: selectedGroups.value.map(id => ({ groupId: id })),
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
