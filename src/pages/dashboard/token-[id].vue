<template>
    <basic-editors-dashboard
        :default-values="gitToken"
        :delete-fn="deleteToken.mutateAsync"
        :fields="tokenFields"
        :loading
        :save-fn="updateToken.mutateAsync"
        :where="{ id: tokenId }"
    />
</template>

<script setup lang="ts">
import { useFindManyGitGroup, useDeleteGroupInviteToken, useUpdateGroupInviteToken, useFindUniqueGroupInviteToken } from '~~/lib/hooks';
import type { FieldSchema } from '~/components/basic/BasicEditorsDashboard.vue';
import BasicEditorsDashboard from '~/components/basic/BasicEditorsDashboard.vue';
import { useRoute } from 'vue-router';
import type { GitGroup, GroupInviteToken } from '@zenstackhq/runtime/models';
import type { UpdateFactory } from '~/components/basic/BasicAddersHelper.vue';

definePageMeta({
    middleware: ['authenticated'],
    layout: 'false',
});

const deleteToken = useDeleteGroupInviteToken();
const updateToken = useUpdateGroupInviteToken();

const route = useRoute();

const tokenId = parseInt(route.params.id as string);

const loading = ref(true);

const { data: gitGroups } = useFindManyGitGroup({}, { enabled: true });

const { data: gitToken, refetch: fetchTokens } = useFindUniqueGroupInviteToken({
    where: {
        id: tokenId,
    },
    include: {
        groups: true,
    },
}, { enabled: true });

await fetchTokens();

const selectedGroups: ComputedRef<Array<number>> = computed(() => {
    if (gitToken.value) {
        return gitToken.value.groups.map(x => x.groupId);
    }
    return [];
});

const tokenChoiceFactory: Ref<UpdateFactory<GitGroup>> = computed(() => ({
    data: gitGroups.value,
    display: [
        'name',
    ],
    selected: selectedGroups.value,
    updateFn: updateToken.mutateAsync,
    updateDataAddConstruct: {
        groups: {
            create: {
                groupId: -1,
            },
        },
    },
    updateDataAddKey: 'groups.create.groupId',
    updateDataRemoveConstruct: {
        groups: {
            deleteMany: {
                groupId: -1,
            },
        },
    },
    where: {
        id: tokenId,
    },
    updateDataRemoveKey: 'groups.deleteMany.groupId',
}));

const tokenFields: Ref<FieldSchema<GroupInviteToken>[]> = computed(() => ([
    {
        key: 'name',
        label: 'Name',
        type: 'text',
    },
    {
        key: 'token',
        label: 'Token',
        type: 'text',
        readonly: true,
    },
    {
        key: 'expiryDate',
        label: 'Expiry Date',
        type: 'date',
    },
    {
        label: 'Groups',
        type: 'choice',
        choiceFactory: tokenChoiceFactory.value,
    },
]));

onMounted(() => {
    loading.value = false;
});
</script>
