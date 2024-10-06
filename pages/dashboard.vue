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

      <v-main>
        
        <v-container>
            <h2 class="text-center ma-5">Our Interest</h2>
            <div class="ma-3 my-5 mb-10">
              <v-chip v-for="(interest, index) in users[0].interests" :key="index" class="ma-1">{{ interest }} ({{ users[0].eloRatings[interest] }} elo)</v-chip>
            </div>
            <h2 class="text-center ma-5">Find your Match</h2>
            <v-card v-if="userRecommended">
                <v-img
                :src="`https://picsum.photos/id/${userRecommended.id}/200/300`"
                class="align-end"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                height="400px"
                cover
                >
                <v-card-subtitle class="text-white">{{ userRecommended.age }}, {{ userRecommended.gender }}</v-card-subtitle>
                <v-card-title class="text-white">{{ userRecommended.name }}</v-card-title>
                </v-img>
                <div class="pa-3 text-center">
                    <v-chip v-for="(interest, index) in userRecommended.interests" :key="index" class="ma-1">{{ interest }} ({{ userRecommended.eloRatings[interest] }} elo)</v-chip>
                </div>
                <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn
                    @click="rateUser(1, userRecommended.id, 'dislike')"
                    color="black"
                    icon="mdi-close"
                    size="large"
                ></v-btn>

                <v-btn
                    @click="rateUser(1, userRecommended.id, 'like')"
                    color="pink"
                    icon="mdi-heart"
                    size="large"
                ></v-btn>
                <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
            <div class="ma-4 my-10 text-center" v-else>
              <v-icon size="100" color="grey">mdi-account-heart</v-icon>
              <h3 class="text-grey">No other users</h3>
            </div>
            <pre>{{ users }}</pre>
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


const userRecommended = ref({});

onMounted( async () => {
  userRecommended.value = recommendUser(1, users.value);
} )

// Cosine similarity function based on interests (Collaborative Filtering)
function cosineSimilarity(user1, user2) {
    const user1Interests = user1.interests;
    const user2Interests = user2.interests;

    const commonInterests = user1Interests.filter(interest => user2Interests.includes(interest));
    if (commonInterests.length === 0) return 0;

    // Calculate similarity based on common interests
    return commonInterests.length / Math.sqrt(user1Interests.length * user2Interests.length);
}

// Function to recommend the best match for a target user
function recommendUser(targetUserId) {
    const users2 = users.value;

    // Find the target user
    const targetUser = users2.find(user => user.id === targetUserId);
    if (!targetUser) return null;

    // Step 1: Sort target user's interests based on their Elo ratings (highest first)
    const sortedInterests = Object.keys(targetUser.eloRatings)
        .filter(interest => targetUser.eloRatings[interest] !== undefined)
        .sort((a, b) => targetUser.eloRatings[b] - targetUser.eloRatings[a]);

    let bestMatch = null;
    let bestScore = -Infinity;

    // Step 2: Iterate over all other users
    users2.forEach(user => {
        if (user.id !== targetUserId && !targetUser.rated.includes(user.id)) {
            let similarityScore = 0;

            // Step 3: Give higher priority to users with similar interests and weight by Elo rating
            sortedInterests.forEach(interest => {
                if (user.interests.includes(interest)) {
                    // Calculate similarity based on the Elo rating and common interest
                    const targetUserElo = targetUser.eloRatings[interest] || 1200;
                    const userElo = user.eloRatings[interest] || 1200;

                    // Weight by interest Elo rating
                    similarityScore += cosineSimilarity(targetUser, user) * (targetUserElo / 1000) * (userElo / 1000);
                }
            });

            // Step 4: Find the user with the highest score
            if (similarityScore > bestScore) {
                bestScore = similarityScore;
                bestMatch = user;
            }
        }
    });

    return bestMatch;
}

// Function to calculate the new ELO rating
// function calculateNewEloRating(userRating, opponentRating, score, K = 32) {
//     const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - userRating) / 400));
//     const newRating = userRating + K * (score - expectedScore);
//     return Math.round(newRating); // Round the result to keep it clean
// }

function calculateNewEloRating(userRating, opponentRating, score, K = 32) {
    const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - userRating) / 400));
    const newRating = userRating + K * (score - expectedScore);
    return Math.round(newRating); // Round the result for cleaner values
}

// Function to like or dislike a user and update ELO ratings
// Function to like or dislike a user and update ELO ratings
function rateUser(targetUserId, ratedUserId, action) {
    const users2 = users.value;

    // Find target user and rated user
    const targetUser = users2.find(user => user.id === targetUserId);
    const ratedUser = users2.find(user => user.id === ratedUserId);

    if (!targetUser || !ratedUser || targetUser.rated.includes(ratedUserId)) {
        console.log("Rating already done or invalid users.");
        return;
    }

    if (action === "like") {
        // Step 1: Add ratedUser's interests to targetUser if not already present
        ratedUser.interests.forEach(interest => {
            if (!targetUser.interests.includes(interest)) {
                targetUser.interests.push(interest);
                // Step 2: Initialize the Elo rating for the new interest with 1200
                if (!targetUser.eloRatings[interest]) {
                    targetUser.eloRatings[interest] = 1200;
                }
            }
        });

        // Step 3: Update Elo ratings based on the "like"
        ratedUser.likedBy.push(targetUserId);
        console.log(`${targetUser.name} liked ${ratedUser.name}`);
        
        // Update Elo for targetUser, increasing the Elo rating by using the formula
        ratedUser.interests.forEach(interest => {
            if (targetUser.eloRatings[interest]) {
                const newElo = calculateNewEloRating(
                    targetUser.eloRatings[interest], 
                    ratedUser.eloRatings[interest] || 1200, 
                    1 // Liking gives a positive score
                );
                targetUser.eloRatings[interest] = newElo;
            }
        });

    } else if (action === "dislike") {
        // Handle the "dislike" action but without copying interests
        ratedUser.dislikedBy.push(targetUserId);
        console.log(`${targetUser.name} disliked ${ratedUser.name}`);
        
        // Update Elo for targetUser, decreasing the Elo rating by using the formula
        ratedUser.interests.forEach(interest => {
            if (targetUser.eloRatings[interest]) {
                const newElo = calculateNewEloRating(
                    targetUser.eloRatings[interest], 
                    ratedUser.eloRatings[interest] || 1200, 
                    0 // Disliking gives a neutral score, or 0
                );
                targetUser.eloRatings[interest] = newElo;
            }
        });
    }

    // Mark the rated user in the target user's rated list
    targetUser.rated.push(ratedUserId);

    console.log(`${targetUser.name}'s updated interests:`, targetUser.interests);
    console.log(`${targetUser.name}'s new ELO ratings:`, targetUser.eloRatings);
    
    // Recommend a new user after the rating
    userRecommended.value = recommendUser(targetUserId);
}



function logout() {
    const router = useRouter();

    router.replace('/')
}

</script>