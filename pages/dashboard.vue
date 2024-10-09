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
            <h2 class="text-center my-5">Find your Match 💘</h2>
            <v-card v-if="userRecommended">
                <v-img
                :src="`/profile-picture.webp`"
                class="align-end"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                height="400px"
                cover
                >
                <v-card-subtitle class="text-white">{{ userRecommended.age }}, {{ userRecommended.gender }}</v-card-subtitle>
                <v-card-title class="text-white">{{ userRecommended.lastname }}, {{ userRecommended.firstname }}</v-card-title>
                </v-img>
                <div class="pa-3 text-center">
                    <v-chip v-for="(interest, index) in userRecommended.interests" :key="index" class="ma-1">{{ interest }} ({{ userRecommended.eloRating[interest] }} elo)</v-chip>
                </div>
                <v-card-text>
                    {{ userRecommended.description }}
                </v-card-text>
                <v-card-actions>
                

                <v-spacer></v-spacer>

                <v-btn
                    @click="rateUser(userStorage.id, userRecommended.id, 'dislike')"
                    color="black"
                    icon="mdi-close"
                    size="large"
                ></v-btn>

                <v-btn
                    @click="rateUser(userStorage.id, userRecommended.id, 'like')"
                    color="pink"
                    icon="mdi-heart"
                    size="large"
                ></v-btn>
                <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
            <div class="ma-4 my-15 text-center" v-else>
              <v-icon size="100" color="grey">mdi-account-heart</v-icon>
              <h2 class="text-grey mt-5">No other users</h2>
              <p class="text-grey my-4">More users are yet to come. Comeback again to see who's for you😉</p>
            </div>
        </v-container>
      </v-main>
    </v-layout>
</template>

<script setup>
import { getFirestore, serverTimestamp, addDoc, collection, getDocs, arrayUnion, doc, updateDoc,  } from "firebase/firestore";
import { app } from '@/server/firebase';
import { md5 } from 'js-md5';
import { useStorage } from '@vueuse/core';

const db = getFirestore(app);

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
  // {
  //   id: 1,
  //   name: "Alice Smith",
  //   age: 25,
  //   gender: "female",
  //   location: "New York",
  //   interests: ["hiking", "cooking", "reading", "traveling"],
  //   eloRatings: {
  //     hiking: 1200,
  //     cooking: 1150,
  //     reading: 1180,
  //     traveling: 1220,
  //   },
  //   likedBy: [2, 3], // John and Emily liked Alice
  //   dislikedBy: [4], // Michael disliked Alice
  //   rated: [2, 3, 4] // Alice has rated John, Emily, and Michael
  // },
  // {
  //   id: 2,
  //   name: "John Doe",
  //   age: 28,
  //   gender: "male",
  //   location: "Los Angeles",
  //   interests: ["gaming", "traveling", "movies", "basketball"],
  //   eloRatings: {
  //     gaming: 1250,
  //     traveling: 1280,
  //     movies: 1220,
  //     basketball: 1260,
  //   },
  //   likedBy: [1], // Alice liked John
  //   dislikedBy: [], // No one disliked John yet
  //   rated: [1] // John has rated Alice
  // },
  // {
  //   id: 3,
  //   name: "Emily Johnson",
  //   age: 30,
  //   gender: "female",
  //   location: "Chicago",
  //   interests: ["photography", "painting", "yoga", "dancing"],
  //   eloRatings: {
  //     photography: 1150,
  //     painting: 1180,
  //     yoga: 1200,
  //     dancing: 1190,
  //   },
  //   likedBy: [],
  //   dislikedBy: [1], // Alice disliked Emily
  //   rated: [1] // Emily has rated Alice
  // },
  // {
  //   id: 4,
  //   name: "Michael Brown",
  //   age: 27,
  //   gender: "male",
  //   location: "San Francisco",
  //   interests: ["coding", "gaming", "music", "cycling"],
  //   eloRatings: {
  //     coding: 1300,
  //     gaming: 1260,
  //     music: 1220,
  //     cycling: 1250,
  //   },
  //   likedBy: [5], // Jessica liked Michael
  //   dislikedBy: [1], // Alice disliked Michael
  //   rated: [1, 5] // Michael has rated Alice and Jessica
  // },
  // {
  //   id: 5,
  //   name: "Jessica Williams",
  //   age: 22,
  //   gender: "female",
  //   location: "Boston",
  //   interests: ["fashion", "makeup", "music", "dancing"],
  //   eloRatings: {
  //     fashion: 1180,
  //     makeup: 1150,
  //     music: 1200,
  //     dancing: 1190,
  //   },
  //   likedBy: [],
  //   dislikedBy: [4], // Michael disliked Jessica
  //   rated: [4] // Jessica has rated Michael
  // },
  // {
  //   id: 6,
  //   name: "David Wilson",
  //   age: 29,
  //   gender: "male",
  //   location: "Austin",
  //   interests: ["fitness", "cooking", "hiking", "traveling"],
  //   eloRatings: {
  //     fitness: 1240,
  //     cooking: 1210,
  //     hiking: 1200,
  //     traveling: 1225,
  //   },
  //   likedBy: [],
  //   dislikedBy: [],
  //   rated: []
  // },
  // {
  //   id: 7,
  //   name: "Sophia Davis",
  //   age: 26,
  //   gender: "female",
  //   location: "Seattle",
  //   interests: ["surfing", "photography", "baking", "reading"],
  //   eloRatings: {
  //     surfing: 1220,
  //     photography: 1150,
  //     baking: 1190,
  //     reading: 1175,
  //   },
  //   likedBy: [],
  //   dislikedBy: [],
  //   rated: []
  // },
  // {
  //   id: 8,
  //   name: "James Miller",
  //   age: 31,
  //   gender: "male",
  //   location: "Miami",
  //   interests: ["swimming", "fitness", "yoga", "surfing"],
  //   eloRatings: {
  //     swimming: 1270,
  //     fitness: 1250,
  //     yoga: 1200,
  //     surfing: 1235,
  //   },
  //   likedBy: [],
  //   dislikedBy: [],
  //   rated: []
  // },
  // {
  //   id: 9,
  //   name: "Olivia Martinez",
  //   age: 24,
  //   gender: "female",
  //   location: "San Diego",
  //   interests: ["skateboarding", "music", "movies", "writing"],
  //   eloRatings: {
  //     skateboarding: 1190,
  //     music: 1200,
  //     movies: 1180,
  //     writing: 1150,
  //   },
  //   likedBy: [],
  //   dislikedBy: [],
  //   rated: []
  // },
  // {
  //   id: 10,
  //   name: "Chris Anderson",
  //   age: 32,
  //   gender: "male",
  //   location: "Dallas",
  //   interests: ["golf", "traveling", "football", "cooking"],
  //   eloRatings: {
  //     golf: 1290,
  //     traveling: 1265,
  //     football: 1240,
  //     cooking: 1225,
  //   },
  //   likedBy: [],
  //   dislikedBy: [],
  //   rated: []
  // },
  // {
  //   id: 11,
  //   name: "Liam Thompson",
  //   age: 23,
  //   gender: "male",
  //   location: "Atlanta",
  //   interests: ["running", "gaming", "music"],
  //   eloRatings: {
  //     running: 1185,
  //     gaming: 1235,
  //     music: 1210,
  //   },
  //   likedBy: [],
  //   dislikedBy: [],
  //   rated: []
  // },
  // {
  //   id: 12,
  //   name: "Isabella Garcia",
  //   age: 29,
  //   gender: "female",
  //   location: "Phoenix",
  //   interests: ["hiking", "cooking", "traveling"],
  //   eloRatings: {
  //     hiking: 1200,
  //     cooking: 1225,
  //     traveling: 1210,
  //   },
  //   likedBy: [],
  //   dislikedBy: [],
  //   rated: []
  // },
  // {
  //   id: 13,
  //   name: "Noah Johnson",
  //   age: 34,
  //   gender: "male",
  //   location: "Denver",
  //   interests: ["photography", "skiing", "biking"],
  //   eloRatings: {
  //     photography: 1245,
  //     skiing: 1290,
  //     biking: 1230,
  //   },
  //   likedBy: [],
  //   dislikedBy: [],
  //   rated: []
  // },
  // {
  //   id: 14,
  //   name: "Emma Robinson",
  //   age: 26,
  //   gender: "female",
  //   location: "Portland",
  //   interests: ["yoga", "dancing", "traveling"],
  //   eloRatings: {
  //     yoga: 1195,
  //     dancing: 1215,
  //     traveling: 1220,
  //   },
  //   likedBy: [],
  //   dislikedBy: [],
  //   rated: []
  // },
  // {
  //   id: 15,
  //   name: "Oliver Martinez",
  //   age: 30,
  //   gender: "male",
  //   location: "Baltimore",
  //   interests: ["running", "music", "coding"],
  //   eloRatings: {
  //     running: 1225,
  //     music: 1240,
  //     coding: 1200,
  //   },
  //   likedBy: [],
  //   dislikedBy: [],
  //   rated: []
  // }
]);


const userRecommended = ref({});
const userStorage = useStorage('user', {});


onMounted( async () => {
  

  await getUsers();
} )

async function getUsers() {

  const usersFirebase = await getDocs(collection(db, "users"));
  const usersList = [];

  for (const user of usersFirebase.docs) {
    usersList.push({ id: user.id, ...user.data() });
  }

  users.value = usersList;

  console.log(users.value);

  userRecommended.value = recommendUser(userStorage.value.id, users.value);
}


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
function recommendUser(targetUserId, users) {
    const targetUser = users.find(user => user.id === targetUserId);

    if (!targetUser) {
        console.log('Target user not found');
        return null;
    }

    let bestMatch = null;
    let bestScore = -Infinity;

    // Loop through all users
    users.forEach(user => {
        if (user.id !== targetUserId && !targetUser.rated.includes(user.id)) {
            let totalScore = 0;
            let matchedInterests = 0;

            // Loop through the target user's interests
            targetUser.interests.forEach(interest => {
                // Check if the user shares the same interest
                if (user.interests.includes(interest)) {
                    matchedInterests++;

                    // Add the Elo rating for this interest to the total score
                    totalScore += user.eloRating[interest] ? user.eloRating[interest] : 1200; // Default Elo of 1200 if not set
                }
            });

            // Calculate an average score based on matched interests
            const averageScore = matchedInterests > 0 ? totalScore / matchedInterests : 0;

            // Update the best match if the current user has a higher score
            if (averageScore > bestScore) {
                bestScore = averageScore;
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
async function rateUser(targetUserId, ratedUserId, action) {
    // Find target user and rated user from the users data
    const targetUser = users.value.find(user => user.id === targetUserId);
    const ratedUser = users.value.find(user => user.id === ratedUserId);
    
    console.log(targetUser, targetUserId, users.value);

    if (!targetUser || !ratedUser || targetUser.rated.includes(ratedUserId)) {
        console.log("Rating already done or invalid users.");
        return;
    }

    if (action === "like") {
        // Step 1: Add ratedUser's interests to targetUser if not already present
        ratedUser.interests.forEach(async interest => {
            if (!targetUser.interests.includes(interest)) {
                targetUser.interests.push(interest);
                // Step 2: Initialize the Elo rating for the new interest with 1200
                if (!targetUser.eloRating[interest]) {
                    targetUser.eloRating[interest] = 1200;
                    await updateUserFirebase(targetUser.id, {eloRating: targetUser.eloRating});
                }
            }
        });

        // Step 3: Update Elo ratings based on the "like"
        ratedUser.likedBy.push(targetUserId);
        await updateUserFirebase(ratedUser.id, {likedBy: arrayUnion(targetUserId)});
        console.log(`${targetUser.firstname} liked ${ratedUser.firstname}`);

        // Update Elo for targetUser based on shared interests
        ratedUser.interests.forEach(async interest => {
            if (targetUser.eloRating[interest]) {
                const newElo = calculateNewEloRating(
                    targetUser.eloRating[interest], 
                    ratedUser.eloRating[interest] || 1200, 
                    1 // Liking gives a positive score
                );
                targetUser.eloRating[interest] = newElo;
                await updateUserFirebase(targetUser.id, {eloRating: targetUser.eloRating});
            }
        });


        // Check if the ratedUser also has liked the targetUser
        if (targetUser.likedBy.includes(ratedUserId)) {
            // Add a new data to firebase collection named matches
            const matchData = {
                likedBy: [targetUserId, ratedUserId],
                users: [targetUser, ratedUser],
                dislikedBy: [],
                interests: ratedUser.interests,
                date_added: serverTimestamp()
            }

            await addDoc(collection(db, "matches"), matchData);
        }

    } else if (action === "dislike") {
        // Handle the "dislike" action but without copying interests
        ratedUser.dislikedBy.push(targetUserId);
        console.log(`${targetUser.firstname} disliked ${ratedUser.firstname}`);

        // Update Elo for targetUser based on shared interests
        ratedUser.interests.forEach(async interest => {
            if (targetUser.eloRating[interest]) {
                const newElo = calculateNewEloRating(
                    targetUser.eloRating[interest], 
                    ratedUser.eloRating[interest] || 1200, 
                    0 // Disliking gives a neutral score, or 0
                );
                targetUser.eloRating[interest] = newElo;
                await updateUserFirebase(targetUser.id, {eloRating: targetUser.eloRating});
            }
        });
    }

    // Step 4: Mark the rated user in the target user's rated list
    targetUser.rated.push(ratedUserId);
    await updateUserFirebase(targetUser.id, {rated: arrayUnion(ratedUserId)});

    // Log the updates for debugging purposes
    console.log(`${targetUser.firstname}'s updated interests:`, targetUser.interests);
    console.log(`${targetUser.firstname}'s new ELO ratings:`, targetUser.eloRating);

    // Step 5: Recommend a new user after rating
    userRecommended.value = recommendUser(targetUserId, users.value);
}

async function updateUserFirebase(user_id, json) {
    console.log('Updated the data based on rate: ', user_id, json);
    const docRef = doc(db, "users", user_id);
    await updateDoc(docRef, json);
}



function logout() {
    const router = useRouter();

    router.replace('/')
}

</script>