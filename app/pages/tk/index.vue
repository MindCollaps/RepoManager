<template>
    <common-loader v-if="loading"/>
    <div
        v-else
        class="token"
    >
        <div
            v-if="tokenError"
            class="token-errormessage"
        >
            <template v-if="noTokenProvided">
                No Token Provided!
            </template>
            <template v-else>
                {{ tokenErrorMessage }}
            </template>
        </div>
        <template v-else>
            <template v-if="user?.isUser">
                <div class="token-back">
                    <common-button
                        primary-color="error500"
                        width="fit-content"
                        @click="navigateTo('/dashboard')"
                    >
                        Back
                    </common-button>
                </div>
                <qrcode
                    :size="500"
                    :value="url.href"
                />
                <div class="token-copy">
                    <common-input-text v-model="url.href"/>
                    <common-button @click="copy()">
                        <div class="token-copy--button-icon-wrap">
                            <transition>
                                <check-icon
                                    v-if="copyAnim"
                                    class="token-copy--button-icon"
                                />
                            </transition>
                            <div class="token-copy--button-text">Copy</div>
                        </div>
                    </common-button>
                </div>
            </template>
            <template v-else-if="token">
                <div class="token-top">
                    <common-git-profile-pic
                        v-if="token.owner.avatar_url"
                        :override-image="token.owner.avatar_url"
                    />
                    <div class="token-top-message">
                        <div class="token-top-message-name">{{ token.owner.name }}</div> invted you to join
                    </div>
                </div>
                <div class="token-repos">
                    <div
                        v-for="group in token.groups"
                        :key="group.groupId"
                        class="token-repos-item"
                    >
                        {{ group.group.repoOwner }}/{{ group.group.repoName }}
                    </div>
                </div>
                <common-button
                    v-if="!loggedIn || usedToken"
                    type="secondary"
                    width="256px"
                    @click="login()"
                >
                    <template #default>
                        {{ !loggedIn ? 'Login with GitHub' : 'Join Groups' }}
                    </template>
                    <template
                        v-if="!loggedIn"
                        #icon
                    >
                        <github-icon/>
                    </template>
                </common-button>
                <div
                    v-else
                    class="token-repos-error"
                >
                    <p>Good news!</p>
                    <p>You already used this token!</p>
                </div>
            </template>
        </template>
    </div>
</template>

<script setup lang="ts">
import CheckIcon from '~/assets/icons/check.svg?component';
import GithubIcon from '/assets/icons/github.svg?component';
import CommonLoader from '~/components/common/CommonLoader.vue';
import Qrcode from 'qrcode.vue';
import CommonInputText from '~/components/common/CommonInputText.vue';
import CommonButton from '~/components/common/CommonButton.vue';
import CommonGitProfilePic from '~/components/common/CommonGitProfilePic.vue';
import type { FetchingToken } from '~/types/fetch';
import { TokenCookieName } from '~/types';

definePageMeta({
    layout: 'empty',
});

const { loggedIn, user, openInPopup } = useUserSession();

const route = useRoute();
const url = useRequestURL();

const loading = ref(true);
const tokenError = ref(false);
const noTokenProvided = ref(false);
const tokenErrorMessage = ref('');
const token = shallowRef<FetchingToken | undefined>();
const copyAnim = ref(false);
const usedToken = computed(() => loggedIn ? token.value?.usedBy.findIndex(x => x.userId === user.value?.userId) === -1 : false);

function setError(message: string, noToken = false) {
    tokenError.value = true;
    tokenErrorMessage.value = message;
    noTokenProvided.value = noToken;
}

async function fetchTokenByString(tokenString: string) {
    try {
        const data = await $fetch<FetchingToken>(`/api/v1/tk?tk=${ encodeURIComponent(tokenString) }`);

        if (!data) {
            setError('Token could not be found or is expired!');
        }
        else {
            token.value = data;
        }
    }
    catch (error: any) {
        setError(error?.statusMessage ?? 'Token could not be found or is expired');
    }
}

async function loadQuery() {
    const tokenString = route.query.tk as string | undefined;
    if (!tokenString) {
        setError('Token could not be found', true);
        return;
    }
    await fetchTokenByString(tokenString);
}

function login() {
    const tokenCookie = useCookie(TokenCookieName);
    tokenCookie.value = token.value?.token;

    openInPopup('/auth/github-user');
}

function copy() {
    navigator.clipboard.writeText(url.href);

    copyAnim.value = true;

    setTimeout(() => {
        copyAnim.value = false;
    }, 2000);
}

onMounted(async () => {
    try {
        await loadQuery();
    }
    catch {
        setError('An error occurred');
    }
    finally {
        loading.value = false;
    }
});
</script>

<style scoped lang="scss">
.token {
    display: flex;
    flex-direction: column;
    gap: 64px;
    align-items: center;
    justify-content: center;

    min-height: 70vh;
    margin-top: 64px;

    &-repos {
        display: flex;
        flex-direction: column;
        gap: 8px;

        padding: 22px 32px;
        border-radius: 8px;

        background: $darkgray800;
        box-shadow: 5px 8px 5px $darkgray1000;

        &-error {
            display: flex;
            flex-direction: column;
            gap: 8px;
            align-items: center;
            justify-content: center;

            font-size: 18px;

            p {
                margin: 0;
            }
        }
    }

    &-errormessage {
        font-size: 22px;
    }

    &-back {
        display: flex;
        justify-content: end;
        width: 100%;
        padding: 0 64px 0 0;
    }

    &-copy {
        display: flex;
        flex-direction: row;
        gap: 16px;
        justify-content: center;

        width: 50vw;

        &--button {
            &-icon {
                position: absolute;
                top: 0;
                left: 60px;

                width: 30px;

                color: $success500;

                &-wrap {
                    position: relative;
                    width: 100%;
                    height: 100%;
                }
            }

            &-text {
                position: relative;
            }
        }
    }

    &-top {
        display: flex;
        flex-direction: row;
        gap: 16px;
        align-items: center;

        &-message {
            display: flex;
            flex-direction: row;
            gap: 6px;
            align-items: center;

            &-name {
                font-size: 22px;
            }
        }
    }
}

.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>
