<template>
    <v-layout>
      <v-app-bar
        color="primary"
        prominent
      >
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

        <v-toolbar-title>Find Match</v-toolbar-title>

        <v-spacer></v-spacer>
      </v-app-bar>

      <v-navigation-drawer
        v-model="drawer"
      >
        <v-list>
            <v-list-item>Find Match</v-list-item>
            <v-list-item @click="logout()">Logout</v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main style="height: 500px;">
        
        <v-container>
            <h2 class="text-center ma-5">Find your Match</h2>
            {{ recommendUser(1, users) }}
            <v-card>
                <v-img
                src="https://picsum.photos/400"
                class="align-end"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                height="400px"
                cover
                >
                <v-card-subtitle class="text-white">17, Male</v-card-subtitle>
                <v-card-title class="text-white">Alden Richards</v-card-title>
                </v-img>
                <div class="pa-3 text-center">
                    <v-chip class="ma-1">Gaming</v-chip>
                    <v-chip class="ma-1">Programming</v-chip>
                    <v-chip class="ma-1">Music</v-chip>
                    <v-chip class="ma-1">Sports</v-chip>
                </div>
                <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn
                    color="black"
                    icon="mdi-close"
                    size="large"
                ></v-btn>

                <v-btn
                    color="pink"
                    icon="mdi-heart"
                    size="large"
                ></v-btn>
                <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
        </v-container>
      </v-main>
    </v-layout>
</template>

<script setup>
const drawer =  ref(false)
const group = ref(null)
const items = ref([
    {
        title: 'Home',
        value: 'foo',
    },
    {
        title: 'Find Match',
        value: 'bar',
    },
    {
        title: 'Logout',
        value: 'fizz',
    },
])

const users = ref([
  {
    id: 1,
    name: "Alice Smith",
    age: 25,
    gender: "female",
    location: "New York",
    interests: ["hiking", "cooking", "reading", "traveling"],
    eloRating: 1200,
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
    eloRating: 1250,
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
    eloRating: 1150,
    likedBy: [], // No one liked Emily yet
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
    eloRating: 1300,
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
    eloRating: 1180,
    likedBy: [], // No one liked Jessica yet
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
    eloRating: 1240,
    likedBy: [], // No one liked David yet
    dislikedBy: [], // No one disliked David yet
    rated: [] // David hasn't rated anyone yet
  },
  {
    id: 7,
    name: "Sophia Davis",
    age: 26,
    gender: "female",
    location: "Seattle",
    interests: ["surfing", "photography", "baking", "reading"],
    eloRating: 1220,
    likedBy: [], // No one liked Sophia yet
    dislikedBy: [], // No one disliked Sophia yet
    rated: [] // Sophia hasn't rated anyone yet
  },
  {
    id: 8,
    name: "James Miller",
    age: 31,
    gender: "male",
    location: "Miami",
    interests: ["swimming", "fitness", "yoga", "surfing"],
    eloRating: 1270,
    likedBy: [], // No one liked James yet
    dislikedBy: [], // No one disliked James yet
    rated: [] // James hasn't rated anyone yet
  },
  {
    id: 9,
    name: "Olivia Martinez",
    age: 24,
    gender: "female",
    location: "San Diego",
    interests: ["skateboarding", "music", "movies", "writing"],
    eloRating: 1190,
    likedBy: [], // No one liked Olivia yet
    dislikedBy: [], // No one disliked Olivia yet
    rated: [] // Olivia hasn't rated anyone yet
  },
  {
    id: 10,
    name: "Chris Anderson",
    age: 32,
    gender: "male",
    location: "Dallas",
    interests: ["golf", "traveling", "football", "cooking"],
    eloRating: 1290,
    likedBy: [], // No one liked Chris yet
    dislikedBy: [], // No one disliked Chris yet
    rated: [] // Chris hasn't rated anyone yet
  }
]);

// Cosine similarity function based on interests
function cosineSimilarity(user1, user2) {
    const user1Interests = user1.interests;
    const user2Interests = user2.interests;

    const commonInterests = user1Interests.filter(interest => user2Interests.includes(interest));
    if (commonInterests.length === 0) return 0;

    // Calculate similarity based on common interests
    return commonInterests.length / Math.sqrt(user1Interests.length * user2Interests.length);
}

// Function to recommend the best match for a target user
function recommendUser(targetUserId, users) {
    const targetUser = users.find(user => user.id === targetUserId);

    let bestMatch = null;
    let bestScore = -Infinity;

    users.forEach(user => {
        if (user.id !== targetUserId) {
            // Calculate similarity based on interests
            const similarity = cosineSimilarity(targetUser, user);

            // Weight the similarity by ELO rating (higher rating means better match)
            const score = similarity * (user.eloRating / 1000); // ELO is normalized by dividing by 1000

            // Find the user with the highest score
            if (score > bestScore) {
                bestScore = score;
                bestMatch = user;
            }
        }
    });

    return bestMatch;
}

function logout() {
    const router = useRouter();

    router.replace('/')
}

</script>