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
import { useFindUniqueGitGroup, useDeleteManyGitGroup, useUpdateGitGroup } from '~~/lib/hooks';
import type { FieldSchema } from '~/components/dashboard/BasicEditorsDashboard.vue';
import BasicEditorsDashboard from '~/components/dashboard/BasicEditorsDashboard.vue';
import { useRoute } from 'vue-router';
import type { GitGroup } from '@zenstackhq/runtime/models';

const deleteUser = useDeleteManyGitGroup();
const updateUser = useUpdateGitGroup();

const route = useRoute();

const userId = parseInt(route.params.id as string);

const loading = ref(true);

const userFields: FieldSchema<GitGroup>[] = [
    {
        key: 'name',
        label: 'Name',
        type: 'text',
    },
    {
        key: 'expires',
        label: 'Expires',
        type: 'checkbox',
    },
];

const { data: gitUser, refetch } = useFindUniqueGitGroup({
    where: {
        id: userId,
    },
}, { enabled: false });

const newGroup = ref<GitGroup>();

definePageMeta({
    middleware: ['authenticated'],
});

await refetch();
if (gitUser.value) {
    newGroup.value = { ...gitUser.value };
}
loading.value = false;
</script>
