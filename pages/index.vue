<template>
<div class="text-center">
    <v-img
    :width="100"
    aspect-ratio="16/9"
    cover
    src="@/assets/img/logo.png"
    style="margin: 20px auto; margin-top: 70px;"
    ></v-img>
    <h2>Angelite Buddy Mobile App</h2>
    <p class="ma-3">Welcome to the Angelite Buddy Mobile App</p>
    
    <div class="ma-3">

        <v-text-field v-model="username" label="Username"</v-text-field>
        <v-text-field v-model="password" label="Password" type="password"</v-text-field>
        <v-btn @click="login()" block large class="mt-5" color="primary">Login</v-btn>
        <p class="text-center text-grey mt-3">
            Don't have an account? <nuxt-link to="/register">Register</nuxt-link>
        </p>
    </div>
</div>
</template>

<script setup>

const router = useRouter();

const username = ref('');
const password = ref('');

async function login() {

    router.replace('/dashboard');
}

</script>