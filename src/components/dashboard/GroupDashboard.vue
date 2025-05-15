<template>
    <basic-dashboard
        :default-values="defaultGroup"
        editable
        :fetched-data="gitGroups"
        @create="createGroup()"
        @edit="editGroup"
    >
        <template #popup>
            <common-input-text v-model="newGroup.groupName">Group Name</common-input-text>
            <div
                class="git-repo-check"
                :style="getGitStyle"
            >
                <common-input-text
                    v-model="newGroup.repoName"
                    @input="newGroup.confirmed = false"
                    @keyup.enter="checkGit()"
                >Repository
                    Name</common-input-text>
                <common-button
                    v-if="!newGroup.confirmed"
                    primary-color="success400"
                    @click="checkGit()"
                >Check</common-button>
            </div>
            <common-checkbox v-model="newGroup.ownRepo">Own Repo</common-checkbox>
            <common-input-text
                v-if="!newGroup.ownRepo"
                v-model="newGroup.repoOwner"
            >Repository
                Owner</common-input-text>
            <common-checkbox v-model="newGroup.deleteUsers">Delete Users</common-checkbox>
            <common-checkbox v-model="newGroup.deleteSelf">Delete Self</common-checkbox>
            <common-checkbox v-model="newGroup.expires">Expires</common-checkbox>
            <common-date-picker
                v-if="newGroup.expires"
                v-model="newGroup.expiryDate"
            />
        </template>
        <template #item="{ item }">
            <div class="group-dashboard-item">
                {{ item.name }} <common-button
                    :href="`https://github.com/${ item.repoOwner }/${ item.repoName }`"
                    type="transparent"
                >{{ item.repoOwner }} / {{ item.repoName }}</common-button>
            </div>
        </template>
    </basic-dashboard>
</template>

<script setup lang="ts">
import CommonButton from '~/components/common/CommonButton.vue';
import CommonInputText from '~/components/common/CommonInputText.vue';
import CommonCheckbox from '../common/CommonCheckbox.vue';
import CommonDatePicker from '../common/CommonDatePicker.vue';
import { useCreateGitGroup, useFindManyGitGroup } from '~~/lib/hooks';
import BasicDashboard from '../basic/BasicDashboard.vue';
import { useStore } from '~/store';

const createGitGroup = useCreateGitGroup();
const { data: gitGroups, refetch } = useFindManyGitGroup({});

const { session } = useUserSession();

const store = useStore();

const defaultGroup = {
    expires: false,
    expiryDate: new Date(),
    deleteUsers: true,
    deleteSelf: true,
    repoOwner: store.user?.username ?? '',
    ownRepo: session.value?.user ? true : false,
    repoName: '',
    userId: session.value?.user?.userId,
    groupName: '',
    confirmed: false,
    confirmStatus: false,
};

const newGroup = ref({ ...defaultGroup });

const getGitStyle = computed(() => {
    if (!newGroup.value.confirmed) {
        return {};
    }

    if (newGroup.value.confirmStatus) {
        return { 'border-color': colorsList.success600, 'border-style': 'solid' };
    }
    else {
        return { 'border-color': colorsList.error600, 'border-style': 'solid' };
    }
});

async function createGroup() {
    if (!newGroup.value.confirmed) {
        await checkGit();
    }

    if (!newGroup.value.confirmed || !newGroup.value.confirmStatus) {
        alert('Repo invalid!');
        return;
    }

    const userId = session.value?.user?.userId;

    if (!userId) {
        alert('Not logged in!');
    }
    else {
        try {
            if (newGroup.value.ownRepo) {
                newGroup.value.repoOwner = store.user?.username ?? '';
            }

            await createGitGroup.mutateAsync({
                data: {
                    expires: newGroup.value.expires,
                    expiryDate: newGroup.value.expiryDate,
                    deleteUsers: newGroup.value.deleteUsers,
                    deleteSelf: newGroup.value.deleteSelf,
                    repoOwner: newGroup.value.repoOwner,
                    repoName: newGroup.value.repoName,
                    name: newGroup.value.groupName,
                    owners: {
                        create: [{
                            owner: {
                                connect: {
                                    id: userId,
                                },
                            },
                        }],
                    },
                },
            });
        }
        catch (error) {
            alert('An error occured');
            console.log(error);
            return;
        }

        refetch();
    }
}

async function checkGit() {
    const owner = newGroup.value.repoOwner === '' ? '' : `&owner=${ encodeURIComponent(newGroup.value.repoOwner) }`;
    $fetch(`/api/v1/gh/repo?name=${ encodeURIComponent(newGroup.value.repoName) + owner }`)
        .then(data => {
            newGroup.value.confirmed = true;
            newGroup.value.confirmStatus = true;
        })
        .catch(async error => {
            const errorData = error.data || error.response?._data;

            console.log(JSON.stringify(errorData));

            alert(errorData?.statusMessage || 'Unknown error occurred');

            newGroup.value.confirmed = true;
            newGroup.value.confirmStatus = false;
        });
}

function editGroup(id: number) {
    navigateTo(`/dashboard/group-${ id }`);
}
</script>

<style scoped lang="scss">
.git-repo-check {
    display: flex;
    flex-direction: column;
    gap: 8px;

    padding: 16px;
    border-radius: 16px;

    background: $darkgray850;
}

.group-dashboard-item {
    display: grid;
    grid-template-columns: 240px auto;
    gap: 16px;
    align-items: center;
}
</style>
