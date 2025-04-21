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
import { useFindUniqueGitUser, useDeleteManyGitUser, useUpdateGitUser } from '~~/lib/hooks';
import type { FieldSchema } from '~/components/dashboard/BasicEditorsDashboard.vue';
import BasicEditorsDashboard from '~/components/dashboard/BasicEditorsDashboard.vue';
import { useRoute } from 'vue-router';
import type { GitUser } from '@zenstackhq/runtime/models';

const deleteUser = useDeleteManyGitUser();
const updateUser = useUpdateGitUser();

const route = useRoute();

const userId = parseInt(route.params.id as string);

const loading = ref(true);

const userFields: FieldSchema<GitUser>[] = [
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
];

const { data: gitUser, refetch } = useFindUniqueGitUser({
    where: {
        id: userId,
    },
}, { enabled: false });

const newUser = ref<GitUser>();

definePageMeta({
    middleware: ['authenticated'],
});

await refetch();
if (gitUser.value) {
    newUser.value = { ...gitUser.value };
}
loading.value = false;
</script>
