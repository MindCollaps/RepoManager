<template>
    <basic-editors-dashboard
        :default-values="gitGroup"
        :delete-fn="deleteGroup.mutateAsync"
        :fields="userFields"
        :loading
        :save-fn="updateGroup.mutateAsync"
        :where="{ id: userId }"
    />
</template>

<script setup lang="ts">
import { useFindUniqueGitGroup, useDeleteManyGitGroup, useUpdateGitGroup, useFindManyGitUser } from '~~/lib/hooks';
import type { FieldSchema } from '~/components/dashboard/BasicEditorsDashboard.vue';
import BasicEditorsDashboard from '~/components/dashboard/BasicEditorsDashboard.vue';
import { useRoute } from 'vue-router';
import type { GitGroup, GitUser } from '@zenstackhq/runtime/models';
import type { UpdateFactory } from '~/components/dashboard/BasicAddersHelper.vue';

definePageMeta({
    middleware: ['authenticated'],
});

const route = useRoute();

const deleteGroup = useDeleteManyGitGroup();
const updateGroup = useUpdateGitGroup();
const userId = parseInt(route.params.id as string);

const { data: gitUsers, refetch: loadGitUsers } = useFindManyGitUser({}, { enabled: false });

const { data: gitGroup } = useFindUniqueGitGroup({
    where: {
        id: userId,
    },
    include: { users: true },
}, { enabled: true });

await loadGitUsers();

const loading = ref(true);

const selectedGroups: ComputedRef<Array<number>> = computed(() => {
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
    selected: selectedGroups.value,
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
                userId: 0,
            },
        },
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
        key: 'expires',
        label: 'Expires',
        type: 'checkbox',
        hides: 'expiryDate',
    },
    userChoice.value,
]));

const newGroup = ref<GitGroup>();

if (gitGroup.value) {
    newGroup.value = { ...gitGroup.value };
}

onMounted(() => {
    loading.value = false;
});
</script>
