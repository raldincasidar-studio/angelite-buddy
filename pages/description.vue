<template>
    <v-layout>
      <v-app-bar
        color="primary"
        prominent
      >
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

        <v-toolbar-title>User Setup</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn @click="saveSelected()" append-icon="mdi-chevron-right" :disabled="description.length < 50">Finish</v-btn>
      </v-app-bar>

      <v-navigation-drawer
        v-model="drawer"
      >
        <v-list>
            <v-list-item>Find Match</v-list-item>
            <v-list-item @click="logout()">Logout</v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main>
        
        <v-container>
            <h3 class="my-3 mb-0">Write a brief description of yourself</h3>
            <p class="my-3 mt-1" :class="{'text-red': description.length < 50, 'text-green': description.length >= 50}">Required {{description.length}}/50 characters</p>
            
            <v-textarea label="Your description ..." v-model="description"></v-textarea>
        </v-container>
      </v-main>
    </v-layout>
</template>

<script setup>
import { useStorage} from '@vueuse/core'
import { getFirestore, serverTimestamp, addDoc, collection, updateDoc, doc } from "firebase/firestore";
import { app } from '@/server/firebase';

const db = getFirestore(app);

const drawer =  ref(false)

const description = ref('');


onMounted( async () => {
  
} )

const userStorage = useStorage('user', {});

const { $toast} = useNuxtApp();

async function saveSelected() {
  try {
      console.log(userStorage.value.id);
      await updateDoc(doc(db, "users", userStorage.value.id), {
          description: description.value,
          updatedBy: serverTimestamp(),
      });
  } catch (error) {
      $toast.fire({
          icon: "error",
          title: 'Something went wrong'
      });
      console.error(error);
      return;
  }

  $toast.fire({
      icon: "success",
      title: 'Success'
  })

  useRouter().replace('/dashboard');
}


function logout() {
    const router = useRouter();

    router.replace('/')
}

</script>