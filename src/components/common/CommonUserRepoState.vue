<template>
    <div
        class="repostate"
        :class="stateClass"
    >
        <component
            :is="icon"
            class="icon"
        />
        <div>{{ stateName }}</div>
    </div>
</template>

<script setup lang="ts">
import InviteSent from '~/assets/icons/invite_sent.svg?component';
import InviteNotSent from '~/assets/icons/invite_not_sent.svg?component';
import InviteAccepted from '~/assets/icons/invite_accepted.svg?component';
import RefreshIcon from '~/assets/icons/refresh.svg?component';
import { REPO_STATE } from '~/types';
import type { ShallowRef } from 'vue';

const props = defineProps({
    state: Number,
});

const icon: Ref<Component> = ref(RefreshIcon);
const stateName: Ref<string> = ref('');
const stateClass: ShallowRef<string> = ref('');

onMounted(() => {
    switch (props.state) {
        case REPO_STATE.invited: {
            icon.value = InviteSent;
            stateName.value = 'Invited';
            stateClass.value = 'invited';
            break;
        }
        case REPO_STATE.not_invited: {
            icon.value = InviteNotSent;
            stateName.value = 'Not Invited';
            stateClass.value = 'not_invited';
            break;
        }
        case REPO_STATE.collabo: {
            icon.value = InviteAccepted;
            stateName.value = 'Collaborator';
            stateClass.value = 'collabo';
            break;
        }
    }
});
</script>

<style scoped lang="scss">
.repostate {
    display: flex;
    flex-direction: row;
    gap: 4px;
    align-items: center;
    justify-content: center;

    padding: 3px;
    border-radius: 6px;
}

.invited {
    background: $warning600;
}

.not_invited {
    background: $error600;
}

.collabo {
    background: $success600;
}

.icon {
    width: 30px;
}
</style>
