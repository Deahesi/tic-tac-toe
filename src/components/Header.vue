<template>
    <nav>
        <div class="nav-wrapper">
            <router-link to="/start" class="brand-logo">X / 0</router-link>
            <ul id="nav-mobile" class="right hide-on-med-and-down">
                <li><a href @click.prevent="logout" v-if="!currentUser">Выйти</a></li>
            </ul>
        </div>
    </nav>
</template>

<script>
    import firebase from "firebase";

    export default {
        name: "Header",
        data: () => ({
            currentUser: firebase.auth().currentUser
        }),
        methods: {
            async logout() {
                try {
                    if (firebase.auth().currentUser) {
                        await this.$store.dispatch('logout')
                        this.$router.push('/login?message=logout')
                    } else {
                        this.$message('Вы ещё не зашли в аккаунт!')
                    }
                } catch (e) {
                    console.log(e)
                }
            }
        }
    }
</script>

<style scoped>

</style>