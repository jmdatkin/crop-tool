<script setup lang="ts">
import Button from '@/components/Button.vue';
import InputText from '@/components/InputText.vue';
import { sidebarWidth } from '@/variables';
import { reactive, watch } from 'vue';
import { register, signIn } from '@/firebase';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

if (authStore.user !== null)
    router.push('/');

const form = reactive({
    email: '',
    password: '',
});

const validation = reactive({
    email: '',
    password: '',
});


const submitValidate = function() {
    let validationStatus = true;

    if (form.email === '') {
        validation.email = 'Field cannot be blank';
        validationStatus = false;
    }

    if (form.password === '') {
        validation.password = 'Field cannot be blank';
        validationStatus = false;
    }

    return validationStatus;   

}

const onSubmit = function() {
    if (!submitValidate()) return;
    signIn(form.email, form.password)
    .then(() =>  router.push('/'));
}
</script>
<template>
    <div class="register-view flex w-full h-full">
        <div class="sidebar border-r dark:border-zinc-700" :style="{ 'minWidth': sidebarWidth + 'px' }"></div>
        <div class="form-container flex flex-col flex-grow p-8">
            <h4 class="font-semibold text-[2rem] mb-4">Sign In</h4>
            <div class="register-form grid grid-cols-2">
                <form>
                <InputText label="E-mail" v-model="form.email" :error="validation.email"></InputText>
                <InputText password label="Password" v-model="form.password" :error="validation.password"></InputText>
                <Button @click.prevent="onSubmit" class="w-full" label="Submit"></Button>
                </form>
                <div class="">
                    Register to save presets
                </div>
            </div>
        </div>
        <div class="sidebar border-l dark:border-zinc-700" :style="{ 'minWidth': sidebarWidth + 'px' }"></div>
    </div>
</template>

<style lang="scss">

</style>