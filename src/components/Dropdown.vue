<script setup lang="ts">
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'

defineProps(['label', 'items']);
</script>

<template>
    <div class="c-dropdown">
        <label v-if="label">
            <span>{{ label }}</span>
            <Menu>
                <MenuButton>More</MenuButton>
                <MenuItems>
                    <MenuItem v-slot="{ active }">
                    <a>
                        Hey ;)
                    </a>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                    <a>
                        Hey yourself ;;)
                    </a>
                    </MenuItem>
                </MenuItems>
            </Menu>
        </label>
        <Menu v-else>
            <MenuButton>More</MenuButton>
            <MenuItems>
                <MenuItem v-slot="{ active }">
                <a>
                    Hey ;)
                </a>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                <a>
                    Hey yourself ;;)
                </a>
                </MenuItem>
            </MenuItems>
        </Menu>
    </div>
</template>

<style scoped lang="scss">
label {
    display: flex;
    flex-direction: column;
    font-weight: 600;
}

input {
    padding: 7px 9px;
    min-width: 0;
    max-width: 100%;
}
</style>