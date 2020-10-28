<template>
    <div class="row form-start">
        <h2 class="center">Начать игру</h2>
        <div class="input-field col s6">
            <input id="name" type="text" class="validate"
                   v-model.trim="$v.name.$model"
                   :class="{'invalid': ($v.name.$dirty && !$v.name.required)}"
            >
            <label for="name">Название игры</label>
        </div>
        <div class="input-field col s6">
            <input id="password" type="text" class="validate"
                   v-model.trim="$v.password.$model"
                   :class="{'invalid': ($v.password.$dirty && !$v.password.required)}"
            >
            <label for="password">Пароль</label>
        </div>
        <div class="center">
            <form @submit.prevent="startGame">
                <button
                        class="btn waves-effect waves-light auth-submit"
                        type="submit"
                >
                    Начать
                </button>
            </form>
        </div>
        <div class="center connect-to">
            <span>Игру уже создали?<router-link to="/connect-to"> Присоединиться!</router-link></span>
        </div>
    </div>
</template>

<script>
    import {required} from 'vuelidate/lib/validators'

    export default {
        name: "Start",
        data: () => ({
            password: '',
            name: '',
        }),
        validations: {
            password: {required},
            name: {required},
        },
        methods: {
            async startGame() {
                if (this.$v.$invalid) {
                    this.$v.$touch()
                    return
                }

                const gameConfig = {
                    name: this.name,
                    password: this.password
                }

                await this.$store.dispatch('createGame', gameConfig)
                this.$router.push('/game?message=created')
            },
        }
    }
</script>

<style scoped>

</style>