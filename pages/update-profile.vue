<template>
    <v-layout>
      <v-app-bar
        color="primary"
        prominent
      >
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

        <v-toolbar-title>User Profile</v-toolbar-title>

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
          <v-img
          :width="100"
          aspect-ratio="16/9"
          cover
          src="/profile-picture.webp"
          rounded="pill"
          style="margin: 20px auto; margin-top: 70px;"
          ></v-img>

            <h3 class="my-3 mb-0 text-center">@{{ userStorage.username }}</h3>

            <v-text-field v-model="firstname" label="First Name"></v-text-field>
            <v-text-field v-model="lastname" label="Last Name"></v-text-field>
            <v-text-field v-model="age" label="Age"></v-text-field>
            <v-select :items="['Male', 'Female', 'Other']" v-model="gender" label="Gender"></v-select>
            <v-text-field v-model="courses" label="Courses"></v-text-field>
            <v-text-field v-model="email" label="Email"></v-text-field>
            <v-text-field v-model="username" label="Username"></v-text-field>
            <v-text-field v-model="password" label="Password (Unchanged)" type="password"></v-text-field>
            <v-textarea label="Your bio description ..." v-model="description"></v-textarea>
            <v-btn @click="login()" block large class="mt-5" color="primary">Save Info</v-btn>

            <v-divider></v-divider>

            <h3 class="my-3 mt-16">Selected Interests ({{itemSelected.length}}/5)</h3>
            
            <div class="text-center my-10" v-if="itemSelected.length === 0">
              <v-icon color="grey" class="my-4" size="50"> mdi-progress-close </v-icon>
              <h4 class="text-grey">No Selected Interests</h4>
            </div>
            <div v-else>
              <v-chip color="primary" class="ma-2" @click:close="itemSelected.includes(interest) ? itemSelected.splice(itemSelected.indexOf(interest), 1) : itemSelected.push(interest)" :prepend-icon="interest.props.prependIcon" size="large" closable v-for="interest in itemSelected">{{ interest.title }}</v-chip>
              <v-btn @click="saveSelected()" block large class="mt-5" color="primary">Update Interests</v-btn>
            </div>
            <h3 class="my-3 mt-4">Find Intersts that suits you</h3>
            <v-list>
              <v-list-item v-for="item in interestWIthoutSelected" :key="item.title" :prepend-icon="item.props.prependIcon" append-icon="mdi-plus" @click="itemSelected.push(item)">
                {{ item.title }}
              </v-list-item>
            </v-list>
        </v-container>
      </v-main>
      <v-bottom-navigation grow>
        <v-btn to="/dashboard" shift>
            <v-icon>mdi-account-multiple-plus</v-icon>

            <span>Find Match</span>
        </v-btn>

        <v-btn to="/chats">
            <v-icon>mdi-chat</v-icon>

            <span>Chats</span>
        </v-btn>

        <v-btn to="/matches">
            <v-icon>mdi-account-multiple</v-icon>

            <span>Matches</span>
        </v-btn>
        </v-bottom-navigation>
    </v-layout>
</template>

<script setup>
import { useStorage} from '@vueuse/core'
import { getFirestore, serverTimestamp, addDoc, collection, updateDoc, doc, getDoc, } from "firebase/firestore";
import { app } from '@/server/firebase';

const db = getFirestore(app);

const drawer =  ref(false)

const firstname = ref('');
const lastname = ref('');
const age = ref('');
const gender = ref('');
const courses = ref('');
const email = ref('');
const username = ref('');
const password = ref('');
const description = ref('');

const items = ref([
    { "title": "Programming", "value": "programming", "props": { "appendIcon": "mdi-plus", "prependIcon": "mdi-code-braces" } },
    { "title": "Web Development", "value": "web-development", "props": { "appendIcon": "mdi-plus", "prependIcon": "mdi-web" } },
    { "title": "Mobile App Development", "value": "mobile-app-development", "props": { "appendIcon": "mdi-plus", "prependIcon": "mdi-cellphone" } },
    { "title": "UI/UX Design", "value": "ui-ux-design", "props": { "appendIcon": "mdi-plus", "prependIcon": "mdi-palette" } },
    { "title": "Database Management", "value": "database-management", "props": { "appendIcon": "mdi-plus", "prependIcon": "mdi-database" } },
    { "title": "Network Administration", "value": "network-administration", "props": { "appendIcon": "mdi-plus", "prependIcon": "mdi-router" } },
    { "title": "Cyber Security", "value": "cyber-security", "props": { "appendIcon": "mdi-plus", "prependIcon": "mdi-shield-lock" } },
    { "title": "Cloud Computing", "value": "cloud-computing", "props": { "appendIcon": "mdi-plus", "prependIcon": "mdi-cloud" } },
    { "title": "Machine Learning/AI", "value": "machine-learning-ai", "props": { "appendIcon": "mdi-plus", "prependIcon": "mdi-brain" } },
    { "title": "Data Analysis", "value": "data-analysis", "props": { "appendIcon": "mdi-plus", "prependIcon": "mdi-chart-bar" } },
    { "title": "DevOps", "value": "devops", "props": { "appendIcon": "mdi-plus", "prependIcon": "mdi-tools" } },
    { "title": "Software Testing", "value": "software-testing", "props": { "appendIcon": "mdi-plus", "prependIcon": "mdi-checkbox-marked" } },
    { "title": "IT Support & Troubleshooting", "value": "it-support-troubleshooting", "props": { "appendIcon": "mdi-plus", "prependIcon": "mdi-help-circle" } },
    { "title": "Animation", "value": "animation", "props": { "appendIcon": "mdi-plus", "prependIcon": "mdi-animation" } },
    { "title": "Game Development", "value": "game-development", "props": { "appendIcon": "mdi-plus", "prependIcon": "mdi-gamepad" } }
])
const itemSelected = ref([])

const interestWIthoutSelected = computed(() => {
  return items.value.filter(interest => !itemSelected.value.includes(interest));
})

onMounted( async () => {
  firstname.value = userStorage.value.firstname;
  lastname.value = userStorage.value.lastname;
  age.value = userStorage.value.age;
  gender.value = userStorage.value.gender;
  courses.value = userStorage.value?.courses  || '';
  email.value = userStorage.value.email;
  username.value = userStorage.value.username;
  description.value = userStorage.value.description;

  for (const interest of userStorage.value.interests) {
    // find the item in the items array
    const item = items.value.find(item => item.title === interest);
    if (item) {
      itemSelected.value.push(item);
    }
  }
} )

async function saveSelected() {
  const finalInterest = ref([]);
  const finalEloRating = ref({});

  for (let i = 0; i < itemSelected.value.length; i++) {
    if (!finalInterest.value.includes(itemSelected.value[i].title)) finalInterest.value.push(itemSelected.value[i].title);
  }

  for (let i = 0; i < itemSelected.value.length; i++) {
    finalEloRating.value[itemSelected.value[i].title] = finalEloRating[itemSelected.value[i].title] || 1200; // Initial Set of Elo Rating
  }

  try {
      // Add a new document in collection "cities"
      console.log(userStorage.value.id);
      await updateDoc(doc(db, "users", userStorage.value.id), {
          interests: finalInterest.value,
          eloRating: finalEloRating.value,
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

  userStorage.value.interests = finalInterest.value;
  userStorage.value.eloRating = finalEloRating.value;

  console.table(finalEloRating.value);
  console.log(finalInterest.value);

  $toast.fire({
      icon: "success",
      title: 'Interest updated succesfuly'
  })
}

async function login() {

if (username.value == "" || firstname == "" || lastname == "" || email == "") {
    
    $toast.fire({
        icon: "error",
        title: 'Please fill in all fields'
    })

    return;
}

let data = {
        firstname: firstname.value,
        lastname: lastname.value,
        courses: courses.value,
        email: email.value,
        username: username.value,
        age: age.value,
        description: description.value,
        gender: gender.value,
    };


if (password.value != "") {
    data[password] = password.value;
}
let docsRef;
let docRef = doc(db, "users", userStorage.value.id);
try {
    // Add a new document in collection "cities"
    docsRef = await updateDoc(docRef, data);
} catch (error) {
    $toast.fire({
        icon: "error",
        title: 'Something went wrong'
    });
    console.error(error);
    return;
}

const userRef = await getDoc(docRef);

const userData = { id: userRef.id, ...userRef.data() };

userStorage.value = userData;

$toast.fire({
        icon: "success",
        title: 'Data Update Complete!'
    });

}

const userStorage = useStorage('user', {});

const { $toast} = useNuxtApp();


</script>