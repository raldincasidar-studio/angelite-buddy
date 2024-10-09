<template>
    <v-layout>
      <v-app-bar
        color="primary"
        prominent
      >
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

        <v-toolbar-title>Chats</v-toolbar-title>

        <v-spacer></v-spacer>
      </v-app-bar>

      <v-navigation-drawer
        v-model="drawer"
      >
        <v-list>
          <Sidenav></Sidenav>
        </v-list>
      </v-navigation-drawer>

      <v-main>
        
        <v-container>
            <div class="text-center my-10" v-if="items.length === 0">
              <v-icon color="grey" class="my-4" size="50"> mdi-chat-remove </v-icon>
              <h4 class="text-grey">No Chats yet</h4>
            </div>
            <div v-else>
              <v-list
                :items="items"
                lines="three"
                item-props
              >
                <template v-slot:subtitle="{ subtitle }">
                  <div v-html="subtitle"></div>
                </template>
              </v-list>
            </div>
        </v-container>
      </v-main>
      <v-bottom-navigation grow>
        <v-btn to="/dashboard" shift>
            <v-icon>mdi-heart-plus</v-icon>

            <span>Find Match</span>
        </v-btn>

        <v-btn to="/chats">
            <v-icon>mdi-chat</v-icon>

            <span>Chats</span>
        </v-btn>

        <v-btn to="/matches">
            <v-icon>mdi-heart-flash</v-icon>

            <span>Matches</span>
        </v-btn>
        </v-bottom-navigation>
    </v-layout>
</template>

<script setup>
import { useStorage} from '@vueuse/core'
import { getFirestore, serverTimestamp, addDoc, collection, updateDoc, doc, getDocs, query, where } from "firebase/firestore";
import { app } from '@/server/firebase';

const db = getFirestore(app);

const drawer =  ref(false)

const items = ref([
        
      ]);

const userStorage = useStorage('user', {});

const { $toast} = useNuxtApp();

onMounted( () => {
  getMatches();
}) 

async function getMatches() {

// get docs from matches collection where user id is included in likedBy

const querySnapshot = await getDocs(query(collection(db, "matches"), where("likedBy", "array-contains", userStorage.value.id), where('chatStarted', '==', true)));

const matchesList = [];

for (const docs of querySnapshot.docs) {
  const thePerson = docs.data().users.find(user => user.id !== userStorage.value.id) ;
  matchesList.push({ 
    id: docs.id, 
    ...docs.data(), 
    thePerson: thePerson,
    to: '/chats/' + docs.id,
    prependAvatar: '/profile-picture.webp',
    title: thePerson.firstname + ' ' + thePerson.lastname,
    subtitle: `Sent you a message`,
  });
}

items.value = matchesList;

console.log(items.value);



}

</script>