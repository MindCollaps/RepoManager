<template>
    <basic-editors-dashboard
        :default-values="gitUser"
        :delete-fn="deleteUser.mutateAsync"
        :fields="userFields"
        :loading
        :save-fn="updateUser.mutateAsync"
        :where="{ id: userId }"
    />
</template>

<script setup lang="ts">
import { useFindUniqueGitUser, useDeleteManyGitUser, useUpdateGitUser, useFindManyGitGroup } from '~~/lib/hooks';
import type { FieldSchema } from '~/components/dashboard/BasicEditorsDashboard.vue';
import BasicEditorsDashboard from '~/components/dashboard/BasicEditorsDashboard.vue';
import { useRoute } from 'vue-router';
import type { GitGroup, GitUser } from '@zenstackhq/runtime/models';
import type { UpdateFactory } from '~/components/dashboard/BasicAddersHelper.vue';

const deleteUser = useDeleteManyGitUser();
const updateUser = useUpdateGitUser();

const route = useRoute();

const userId = parseInt(route.params.id as string);

const loading = ref(true);

const { data: gitGroups } = useFindManyGitGroup({}, { enabled: true });

const { data: gitUser, refetch: fetchGitUser } = useFindUniqueGitUser({
    where: {
        id: userId,
    },
    include: {
        groups: true,
    },
}, { enabled: true });

await fetchGitUser();

const selectedGroups: ComputedRef<Array<number>> = computed(() => {
    if (gitUser.value) {
        return gitUser.value.groups.map(x => x.groupId);
    }
    return [];
});

const userChoiceFactory: Ref<UpdateFactory<GitGroup>> = computed(() => ({
    data: gitGroups.value,
    display: [
        'name',
    ],
    selected: selectedGroups.value,
    updateFn: updateUser.mutateAsync,
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
        id: userId,
    },
    updateDataRemoveKey: 'groups.deleteMany.groupId',
}));

const userFields: Ref<FieldSchema<GitUser>[]> = computed(() => ([
    {
        key: 'name',
        label: 'Name',
        type: 'text',
    },
    {
        key: 'email',
        label: 'Email',
        type: 'text',
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
    {
        label: 'Groups',
        type: 'choice',
        choiceFactory: userChoiceFactory.value,
    },
]));

const newUser = ref<GitUser>();


if (gitUser.value) {
    newUser.value = { ...gitUser.value };
}

onMounted(() => {
    loading.value = false;
});
</script>
