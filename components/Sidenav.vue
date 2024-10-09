<template>
    <v-list-item to="/dashboard" link>Find Match</v-list-item>
    <v-list-item to="/matches" link>Matches</v-list-item>
    <v-list-item @click="logout()">Logout</v-list-item>
</template>

<script setup>

import { useStorage} from '@vueuse/core';
import { getFirestore, serverTimestamp, addDoc, collection, getDocs, where, query } from "firebase/firestore";

const userStorage = useStorage('user', {});

const router = useRouter();
function logout() {
    const router = useRouter();


    useNuxtApp().$toast.fire({
        icon: 'success',
        title: 'Logged out!'
    })

    router.replace('/')
    
    userStorage.value = {};
}
</script>