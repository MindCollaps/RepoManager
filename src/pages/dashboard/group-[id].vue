<template>
    <basic-editors-dashboard
        :default-values="gitGroup"
        :delete-fn="deleteGroup.mutateAsync"
        :fields="userFields"
        :loading
        :save-fn="updateGroup.mutateAsync"
        :where="{ id: groupId }"
    />
</template>

<script setup lang="ts">
import { useFindUniqueGitGroup, useDeleteManyGitGroup, useUpdateGitGroup, useFindManyGitUser } from '~~/lib/hooks';
import type { FieldSchema } from '~/components/basic/BasicEditorsDashboard.vue';
import BasicEditorsDashboard from '~/components/basic/BasicEditorsDashboard.vue';
import { useRoute } from 'vue-router';
import type { GitGroup, GitUser } from '@zenstackhq/runtime/models';
import type { UpdateFactory } from '~/components/basic/BasicAddersHelper.vue';

definePageMeta({
    middleware: ['authenticated'],
    layout: 'empty',
});

const route = useRoute();

const deleteGroup = useDeleteManyGitGroup();
const updateGroup = useUpdateGitGroup();
const groupId = parseInt(route.params.id as string);

const loading = ref(true);

const { data: gitUsers, refetch: loadGitUsers } = useFindManyGitUser({}, { enabled: false });

const { data: gitGroup } = useFindUniqueGitGroup({
    where: {
        id: groupId,
    },
    include: { users: true },
}, { enabled: true });

await loadGitUsers();

const selectedUsers: ComputedRef<Array<number>> = computed(() => {
    if (gitGroup.value) {
        return gitGroup.value.users.map(x => x.userId);
    }
    return [];
});

const userChoiceFactory: Ref<UpdateFactory<GitUser>> = computed(() => ({
    data: gitUsers.value,
    display: [
        'name',
    ],
    selected: selectedUsers.value,
    updateFn: useUpdateGitGroup().mutateAsync,
    updateDataAddConstruct: {
        users: {
            create: {
                userId: -1,
            },
        },
    },
    updateDataAddKey: 'users.create.userId',
    updateDataRemoveConstruct: {
        users: {
            deleteMany: {
                userId: -1,
            },
        },
    },
    where: {
        id: groupId,
    },
    updateDataRemoveKey: 'users.deleteMany.userId',
}));

const userChoice: ComputedRef<FieldSchema<GitGroup, GitUser>> = computed(() => ({
    label: 'Users',
    type: 'choice',
    choiceFactory: userChoiceFactory.value,
}));

const userFields: ComputedRef<FieldSchema<GitGroup>[]> = computed(() => ([
    {
        key: 'name',
        label: 'Name',
        type: 'text',
    },
    {
        key: 'deleteUsers',
        label: 'Remove users from repo when expired',
        type: 'checkbox',
    },
    {
        key: 'deleteSelf',
        label: 'Delete group when expired',
        type: 'checkbox',
    },
    {
        key: 'expires',
        label: 'Expires',
        type: 'checkbox',
        hides: 'expiryDate',
    },
    {
        key: 'expiryDate',
        label: 'Expiry Date',
        type: 'date',
    },
    userChoice.value,
]));

onMounted(() => {
    loading.value = false;
});
</script>
