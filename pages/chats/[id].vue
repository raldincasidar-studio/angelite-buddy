<template>
    <v-layout>
      <v-app-bar
        color="primary"
        prominent
      >
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

        <v-toolbar-title>{{ chatName?.thePerson ? chatName?.thePerson?.firstname + ' ' + chatName?.thePerson?.lastname : 'Loading ....' }}</v-toolbar-title>

        <v-spacer></v-spacer>
      </v-app-bar>

      <v-navigation-drawer
        v-model="drawer"
      >
        <v-list>
          <Sidenav></Sidenav>
        </v-list>
      </v-navigation-drawer>

      <v-main ref="chatContainer" class="chat-container">
        
        <v-container id="chatContainer">
            <div :class="chat.createdBy === userStorage.id ? 'chat-you my-1 text-right' : 'chat-him my-1 text-left'" v-for="(chat, i) in chatsList" :key="chat.id">
              <div class="message pa-3 px-5 d-inline-block" :class="chat.createdBy === userStorage.id ? 'bg-primary' : 'bg-grey'" style="border-radius: 25px; border-bottom-right-radius: 0; max-width: 70%; text-align: left">
                {{ chat.messages }}
              </div>
            </div>
            <!-- <div class="chat-him my-1 text-left">
              <div class="message pa-3 px-5 bg-grey d-inline-block" style="border-radius: 25px; border-bottom-left-radius: 0; max-width: 70%; text-align: left">
                Lorem ipsum dolor, 
              </div>
            </div>
            <div class="chat-him my-1 text-left">
              <div class="message pa-3 px-5 bg-grey d-inline-block" style="border-radius: 25px; border-bottom-left-radius: 0; max-width: 70%; text-align: left">
                Lorem ipsum dolor, 
              </div>
            </div> -->
        </v-container>
      </v-main>
      <v-bottom-navigation grow>
          <v-text-field label="Your Message ..." v-model="messageText" @keyup.enter="sendMessage()" size="large" append-icon="mdi-send" @click:append="sendMessage()" class="pr-5"></v-text-field>
        </v-bottom-navigation>
    </v-layout>
</template>

<script setup>
import { useStorage} from '@vueuse/core'
import { getFirestore, serverTimestamp, addDoc, collection, updateDoc, deleteDoc, doc, getDocs, getDoc, where, query, orderBy, onSnapshot } from "firebase/firestore";
import { app } from '@/server/firebase';

const db = getFirestore(app);

const drawer =  ref(false)

onMounted( async () => {
  fetchChats();
} )

onUnmounted( async () => {
  unsubscribe();
})

const userStorage = useStorage('user', {});

const { $toast} = useNuxtApp();

const match_id = useRoute().params.id

const matches = ref([]);

const chatsList = ref([]);

const messageText = ref('');

const chatName = ref({});

let unsubscribe;

async function fetchChats() {

  const parentDocRef = doc(db, "matches", match_id);

  const chatInformation = await getDoc(parentDocRef);

  chatName.value = { id: chatInformation.id, ...chatInformation.data(), thePerson: chatInformation.data().users.find(user => user.id !== userStorage.value.id) };

  const q = query(collection(parentDocRef, "chats"), orderBy("created_at", "desc"));

  unsubscribe = onSnapshot(q, (querySnapshot) => {
  const chats = [];
  querySnapshot.forEach((doc) => {
      chats.unshift({ ...doc.data(), id: doc.id });
  });
  console.log("chats: ", chats);

  chatsList.value = chats;
  nextTick(() => {
    const wasAtBottom = isAtBottom();
    if (wasAtBottom) {
      scrollToBottom();
    }
  });
});

}

async function sendMessage() {

  const messageText2 = messageText.value;

  messageText.value = '';

  const parentDocRef = doc(db, "matches", match_id);

  const chatSubcollectionRef = collection(parentDocRef, "chats");

  await addDoc(chatSubcollectionRef, {
    messages: messageText2,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
    createdBy: userStorage.value.id,
    userCreatedBy: userStorage.value,
  });

}

// Ref for the chat container element
const chatContainer = ref(null);

// Function to check if user is at the bottom of the chat container
const isAtBottom = () => {
  const container = chatContainer.value;
  return container.scrollHeight - container.scrollTop === container.clientHeight;
};

// Function to scroll to the bottom of the chat container
const scrollToBottom = () => {
  const container = chatContainer.value;
  container.scrollTop = container.scrollHeight;
};

// Simulate receiving new chat messages
const onNewMessage = () => {
  

  // Add a new message to the array
  messages.value.push('New chat message arrived!');

  // After the DOM updates, check if we need to scroll
  
};
</script>