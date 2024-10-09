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

        <v-text-field v-model="username" label="Username"></v-text-field>
        <v-text-field v-model="password" label="Password" type="password"></v-text-field>
        <v-btn @click="login()" block large class="mt-5" color="primary">Login</v-btn>
        <p class="text-center text-grey mt-3">
            Don't have an account? <nuxt-link to="/register">Register</nuxt-link>
        </p>
    </div>
</div>
</template>

<script setup>
import { getFirestore, serverTimestamp, addDoc, collection, getDocs, where, query } from "firebase/firestore";
import { app } from '@/server/firebase';
import { md5 } from 'js-md5';
import { useStorage } from '@vueuse/core';

const db = getFirestore(app);
const { $toast } = useNuxtApp();
const userStorage = useStorage('user', {});
const router = useRouter();

const username = ref('');
const password = ref('');

async function login() {

    if (username.value == "" || password.value == "") {
        $toast.fire({
            icon: "error",
            title: 'Please enter username and password',
        })
        return;
    }

    // fire on collection "user" where username is username.value and password is md5 password.value and return a doc if it has found 1
    const querySnapshot = await getDocs(query(collection(db, "users"), where("username", "==", username.value), where("password", "==", md5(password.value))));

    if (querySnapshot.size < 1) {
        $toast.fire({
            icon: "error",
            title: 'Invalid username or password',
        })
        return;
    }

    const userData = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };

    userStorage.value = userData;
    router.replace('/dashboard');
}

</script>