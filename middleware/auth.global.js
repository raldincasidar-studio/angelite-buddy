// middleware/auth.global.js
import { useStorage } from "@vueuse/core";

export default defineNuxtRouteMiddleware((to, from) => {
    console.log("middleware working");
    const userJSON = useStorage("user");

    let user;
    try {
        user = JSON.parse(userJSON.value);
    } catch (error) {
        user = null; // Fallback if userJSON.value is not valid JSON
        console.error("Error parsing user JSON:", error);
    }

    console.log(user);

    // Check if the user is logged in
    const isLoggedIn = user && user.tokenLogin;

    console.log(isLoggedIn);

    // Public pages: / and /register
    if (to.path === "/" || to.path === "/register") {
        if (isLoggedIn) {
            // Redirect to /dashboard if already logged in
            return navigateTo("/dashboard");
        }
        return; // Allow access to public pages if not logged in
    } else {
        if (!isLoggedIn) {
            // Redirect to / if not logged in
            return navigateTo("/");
        }
    }
});
