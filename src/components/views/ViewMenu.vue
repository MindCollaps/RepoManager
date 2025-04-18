<template>
    <div class="header__menu">
        <div
            v-for="button in headerMenu"
            :key="button.text"
            class="header__menu_btn-wrapper"
            :class="{ 'header__menu_btn-wrapper--has-children': button.children }"
        >
            <common-button
                class="header__menu_btn-container"
                :disabled="button.disabled"
                :to="button.path"
                :type="button.active ? 'secondary-875' : 'secondary'"
                :width="button.width"
                @click="button.action?.()"
            >
                <template
                    v-if="button.icon"
                    #icon
                >
                    <component :is="button.icon"/>
                </template>
                <template
                    #default
                >
                    <div class="header__menu_btn">
                        <div class="header__menu_btn_text">
                            {{ button.text }}
                        </div>
                        <div
                            v-if="button.children"
                            class="header__menu_btn_children"
                        >
                            <drop-down-icon class="header__menu_btn_children_icon"/>
                        </div>
                    </div>
                </template>
            </common-button>
            <div
                v-if="button.children"
                class="header__menu_btn_children_menu"
            >
                <common-button
                    v-for="childrenButton in button.children"
                    :key="childrenButton.text"
                    :disabled="childrenButton.disabled"
                    :to="childrenButton.path"
                    :type="childrenButton.active ? 'primary' : 'secondary'"
                    @click="childrenButton.action?.()"
                >
                    <template
                        v-if="childrenButton.icon"
                        #icon
                    >
                        <component :is="childrenButton.icon"/>
                    </template>

                    {{ childrenButton.text }}
                </common-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useHeaderMenu } from '~/composables/navigation';
import DropDownIcon from 'assets/icons/dropdown.svg?component';

const headerMenu = computed(() => {
    const menu = useHeaderMenu();
    return menu.value.filter(x => {
        return !(x.hide ?? false);
    });
});
</script>

<style scoped lang="scss">
.header__menu {
    display: flex;
    gap: 16px;
    align-items: center;
    justify-content: center;

    &_btn {
        display: flex;
        gap: 8px;
        align-items: center;
        justify-content: space-between;

        width: 100%;

        text-align: left;

        &-container {
            position: relative;
        }

        &-wrapper {
            position: relative;

            &--has-children {
                &:hover {
                    .header__menu_btn-container {
                        border-bottom-right-radius: 0 !important;
                        border-bottom-left-radius: 0 !important;
                        background: $darkgray800 !important;
                    }

                    .header__menu_btn_children_menu {
                        visibility: visible;
                        opacity: 1;
                    }

                    .header__menu_btn_children_icon {
                        transform: rotate(180deg);
                    }
                }
            }
        }

        &_children {
            display: flex;

            &_icon {
                transform: rotate(0);
                width: 25px;
                transition: 0.3s;
            }

            &_menu {
                position: absolute;
                z-index: 10;
                top: calc(100% - 1px);
                left: 0;

                display: flex;
                flex-direction: column;
                gap: 8px;

                width: 100%;
                padding: 8px;
                border-bottom-right-radius: 8px;
                border-bottom-left-radius: 8px;

                visibility: hidden;
                opacity: 0;
                background: $darkgray900;

                transition: 0.3s;
            }
        }
    }
}
</style>
