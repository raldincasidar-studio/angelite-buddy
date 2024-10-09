<template>
<div class="text-center">
    <v-img
    :width="100"
    aspect-ratio="16/9"
    cover
    src="@/assets/img/logo.png"
    style="margin: 20px auto; margin-top: 70px;"
    ></v-img>
    <h2>Get Started</h2>
    <p class="ma-3">by creating a free account</p>
    
    <div class="ma-3">

        <v-text-field v-model="firstname" label="First Name"></v-text-field>
        <v-text-field v-model="lastname" label="Last Name"></v-text-field>
        <v-text-field v-model="age" label="Age"></v-text-field>
        <v-select :items="['Male', 'Female']" v-model="gender" label="Gender"></v-select>
        <v-text-field v-model="location" label="Location"></v-text-field>
        <v-text-field v-model="email" label="Email"></v-text-field>
        <v-text-field v-model="username" label="Username"></v-text-field>
        <v-text-field v-model="password" label="Password" type="password"></v-text-field>
        <v-btn @click="login()" block large class="mt-5" color="primary">Register</v-btn>
        <p class="text-center text-grey mt-3">
            Already a member? <nuxt-link to="/">Login</nuxt-link>
        </p>
    </div>
</div>
</template>

<script setup>
import { getFirestore, serverTimestamp, addDoc, collection, getDoc } from "firebase/firestore";
import { app } from '@/server/firebase';
import { md5 } from 'js-md5';
import { useStorage } from '@vueuse/core';

const db = getFirestore(app);
const { $toast } = useNuxtApp();
const userStorage = useStorage('user', {});
const router = useRouter();

const firstname = ref('');
const lastname = ref('');
const age = ref('');
const gender = ref('');
const location = ref('');
const email = ref('');
const username = ref('');
const password = ref('');


async function login() {

    if (username.value == "" || password.value == "" || firstname == "" || lastname == "" || email == "") {
        router.replace('/dashboard');
        return;
    }

    let docsRef;
    try {
        // Add a new document in collection "cities"
        docsRef = await addDoc(collection(db, "users"), {
            firstname: firstname.value,
            lastname: lastname.value,
            email: email.value,
            username: username.value,
            password: md5(password.value),
            age: age.value,
            gender: gender.value,
            location: location.value,
            interests: [],
            eloRating: {},
            likedBy: [],
            dislikedBy: [],
            rated: [],
            profile_picture: '',
            tokenLogin: generateToken(16),
            date_added: serverTimestamp(),
        });
    } catch (error) {
        $toast.fire({
            icon: "error",
            title: 'Something went wrong'
        });
        console.error(error);
        return;
    }

    const userRef = await getDoc(docsRef);

    const userData = { id: userRef.id, ...userRef.data() };

    userStorage.value = userData;

    $toast.fire({
            icon: "success",
            title: 'Registration Complete!'
        });

    router.push('/interest');
    
}

function generateToken(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
        token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return token;
}

</script>