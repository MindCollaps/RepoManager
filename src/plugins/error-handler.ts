export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
        console.error(`VUE ERROR: ${ error } in ${ instance } with info ${ info }`);
    };
});
