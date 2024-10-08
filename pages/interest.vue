<template>
    <v-layout>
      <v-app-bar
        color="primary"
        prominent
      >
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

        <v-toolbar-title>User Setup</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn @click="saveSelected()" append-icon="mdi-chevron-right" :disabled="itemSelected.length < 5">Next</v-btn>
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
            <h3 class="my-3 mt-4">Selected Interests ({{itemSelected.length}}/5)</h3>
            
            <div class="text-center my-10" v-if="itemSelected.length === 0">
              <v-icon color="grey" class="my-4" size="50"> mdi-progress-close </v-icon>
              <h4 class="text-grey">No Selected Interests</h4>
            </div>
            <div v-else>
              <v-chip color="primary" class="ma-2" @click:close="itemSelected.includes(interest) ? itemSelected.splice(itemSelected.indexOf(interest), 1) : itemSelected.push(interest)" :prepend-icon="interest.props.prependIcon" size="large" closable v-for="interest in itemSelected">{{ interest.title }}</v-chip>
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
import { getFirestore, serverTimestamp, addDoc, collection, updateDoc, doc } from "firebase/firestore";
import { app } from '@/server/firebase';

const db = getFirestore(app);

const drawer =  ref(false)
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
const itemSelected = ref([
  ])

const users = ref([
  {
    id: 1,
    name: "Alice Smith",
    age: 25,
    gender: "female",
    location: "New York",
    interests: ["hiking", "cooking", "reading", "traveling"],
    eloRatings: {
      hiking: 1200,
      cooking: 1150,
      reading: 1180,
      traveling: 1220,
    },
    likedBy: [2, 3], // John and Emily liked Alice
    dislikedBy: [4], // Michael disliked Alice
    rated: [2, 3, 4] // Alice has rated John, Emily, and Michael
  },
  {
    id: 2,
    name: "John Doe",
    age: 28,
    gender: "male",
    location: "Los Angeles",
    interests: ["gaming", "traveling", "movies", "basketball"],
    eloRatings: {
      gaming: 1250,
      traveling: 1280,
      movies: 1220,
      basketball: 1260,
    },
    likedBy: [1], // Alice liked John
    dislikedBy: [], // No one disliked John yet
    rated: [1] // John has rated Alice
  },
  {
    id: 3,
    name: "Emily Johnson",
    age: 30,
    gender: "female",
    location: "Chicago",
    interests: ["photography", "painting", "yoga", "dancing"],
    eloRatings: {
      photography: 1150,
      painting: 1180,
      yoga: 1200,
      dancing: 1190,
    },
    likedBy: [],
    dislikedBy: [1], // Alice disliked Emily
    rated: [1] // Emily has rated Alice
  },
  {
    id: 4,
    name: "Michael Brown",
    age: 27,
    gender: "male",
    location: "San Francisco",
    interests: ["coding", "gaming", "music", "cycling"],
    eloRatings: {
      coding: 1300,
      gaming: 1260,
      music: 1220,
      cycling: 1250,
    },
    likedBy: [5], // Jessica liked Michael
    dislikedBy: [1], // Alice disliked Michael
    rated: [1, 5] // Michael has rated Alice and Jessica
  },
  {
    id: 5,
    name: "Jessica Williams",
    age: 22,
    gender: "female",
    location: "Boston",
    interests: ["fashion", "makeup", "music", "dancing"],
    eloRatings: {
      fashion: 1180,
      makeup: 1150,
      music: 1200,
      dancing: 1190,
    },
    likedBy: [],
    dislikedBy: [4], // Michael disliked Jessica
    rated: [4] // Jessica has rated Michael
  },
  {
    id: 6,
    name: "David Wilson",
    age: 29,
    gender: "male",
    location: "Austin",
    interests: ["fitness", "cooking", "hiking", "traveling"],
    eloRatings: {
      fitness: 1240,
      cooking: 1210,
      hiking: 1200,
      traveling: 1225,
    },
    likedBy: [],
    dislikedBy: [],
    rated: []
  },
  {
    id: 7,
    name: "Sophia Davis",
    age: 26,
    gender: "female",
    location: "Seattle",
    interests: ["surfing", "photography", "baking", "reading"],
    eloRatings: {
      surfing: 1220,
      photography: 1150,
      baking: 1190,
      reading: 1175,
    },
    likedBy: [],
    dislikedBy: [],
    rated: []
  },
  {
    id: 8,
    name: "James Miller",
    age: 31,
    gender: "male",
    location: "Miami",
    interests: ["swimming", "fitness", "yoga", "surfing"],
    eloRatings: {
      swimming: 1270,
      fitness: 1250,
      yoga: 1200,
      surfing: 1235,
    },
    likedBy: [],
    dislikedBy: [],
    rated: []
  },
  {
    id: 9,
    name: "Olivia Martinez",
    age: 24,
    gender: "female",
    location: "San Diego",
    interests: ["skateboarding", "music", "movies", "writing"],
    eloRatings: {
      skateboarding: 1190,
      music: 1200,
      movies: 1180,
      writing: 1150,
    },
    likedBy: [],
    dislikedBy: [],
    rated: []
  },
  {
    id: 10,
    name: "Chris Anderson",
    age: 32,
    gender: "male",
    location: "Dallas",
    interests: ["golf", "traveling", "football", "cooking"],
    eloRatings: {
      golf: 1290,
      traveling: 1265,
      football: 1240,
      cooking: 1225,
    },
    likedBy: [],
    dislikedBy: [],
    rated: []
  },
  {
    id: 11,
    name: "Liam Thompson",
    age: 23,
    gender: "male",
    location: "Atlanta",
    interests: ["running", "gaming", "music"],
    eloRatings: {
      running: 1185,
      gaming: 1235,
      music: 1210,
    },
    likedBy: [],
    dislikedBy: [],
    rated: []
  },
  {
    id: 12,
    name: "Isabella Garcia",
    age: 29,
    gender: "female",
    location: "Phoenix",
    interests: ["hiking", "cooking", "traveling"],
    eloRatings: {
      hiking: 1200,
      cooking: 1225,
      traveling: 1210,
    },
    likedBy: [],
    dislikedBy: [],
    rated: []
  },
  {
    id: 13,
    name: "Noah Johnson",
    age: 34,
    gender: "male",
    location: "Denver",
    interests: ["photography", "skiing", "biking"],
    eloRatings: {
      photography: 1245,
      skiing: 1290,
      biking: 1230,
    },
    likedBy: [],
    dislikedBy: [],
    rated: []
  },
  {
    id: 14,
    name: "Emma Robinson",
    age: 26,
    gender: "female",
    location: "Portland",
    interests: ["yoga", "dancing", "traveling"],
    eloRatings: {
      yoga: 1195,
      dancing: 1215,
      traveling: 1220,
    },
    likedBy: [],
    dislikedBy: [],
    rated: []
  },
  {
    id: 15,
    name: "Oliver Martinez",
    age: 30,
    gender: "male",
    location: "Baltimore",
    interests: ["running", "music", "coding"],
    eloRatings: {
      running: 1225,
      music: 1240,
      coding: 1200,
    },
    likedBy: [],
    dislikedBy: [],
    rated: []
  }
]);

const interestWIthoutSelected = computed(() => {
  return items.value.filter(interest => !itemSelected.value.includes(interest));
})

const userRecommended = ref({});

onMounted( async () => {
  
} )

const userStorage = useStorage('user', {});

const { $toast} = useNuxtApp();

async function saveSelected() {
  const finalInterest = ref([]);
  const finalEloRating = ref({});

  for (let i = 0; i < itemSelected.value.length; i++) {
    finalInterest.value.push(itemSelected.value[i].title);
  }

  for (let i = 0; i < itemSelected.value.length; i++) {
    finalEloRating.value[itemSelected.value[i].title] = 1200; // Initial Set of Elo Rating
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

  console.table(finalEloRating.value);
  console.log(finalInterest.value);

  $toast.fire({
      icon: "success",
      title: 'Interest saved succesfuly'
  })

  useRouter().replace('/description');
}


function logout() {
    const router = useRouter();

    router.replace('/')
}

</script>