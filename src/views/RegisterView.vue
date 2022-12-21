<script setup lang="ts">
import Button from '@/components/Button.vue';
import InputText from '@/components/InputText.vue';
import { sidebarWidth } from '@/variables';
import { reactive, watch } from 'vue';
import { register } from '@/firebase';
import { useRouter } from 'vue-router';

const router = useRouter();

const form = reactive({
    email: '',
    password: '',
    confirmPassword: ''
});

const validation = reactive({
    email: '',
    password: '',
    confirmPassword: ''
});

const passwordMinLength = 8;

const validate = function() {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    let validationStatus = true;

    if (!emailRegex.test(form.email) && form.email !== '') {
        validation.email = 'Please enter a valid email address';
        validationStatus = false;
    }
    else {
        validation.email = '';
    }
        

    if (!passwordRegex.test(form.password) && form.password !== '') {
        validation.password = 'Password must contain at least one letter, one number and one special character';
        validationStatus = false;
    } else if (form.password !== form.confirmPassword && form.password !== '' && form.confirmPassword !== '') {
        validation.password = 'Passwords must match';
        validation.confirmPassword = 'Passwords must match';
        validationStatus = false;
    } else {
        validation.password = '';
        validation.confirmPassword = '';
    }    

    return validationStatus;
};

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

    if (form.confirmPassword === '') {
        validation.confirmPassword = 'Field cannot be blank';
        validationStatus = false;
    }

    return validationStatus;   

}

watch(form, () => {
    validate();
});

const onSubmit = function() {
    const validationStatus = validate();
    const submitValidationStatus = submitValidate();
    console.log(validationStatus, submitValidationStatus);
    if (!validationStatus || !submitValidationStatus) return;

    register(form.email, form.password)
    .then(() =>  router.push('/'));
}

</script>
<template>
    <div class="register-view flex w-full h-full">
        <div class="sidebar border-r dark:border-zinc-700" :style="{ 'minWidth': sidebarWidth + 'px' }"></div>
        <div class="form-container flex flex-col flex-grow p-8">
            <h4 class="font-semibold text-[2rem] mb-4">Create An Account</h4>
            <div class="register-form grid grid-cols-2">
                <form>
                <InputText label="E-mail" v-model="form.email" :error="validation.email"></InputText>
                <InputText password label="Password" v-model="form.password" :error="validation.password"></InputText>
                <InputText password label="Confirm Password" v-model="form.confirmPassword" :error="validation.confirmPassword"></InputText>
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