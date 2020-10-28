<template>
    <div class="row form-start">
        <h2 class="center">Подключиться к игре</h2>
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
            <form @submit.prevent="connectToGame">
                <button
                        class="btn waves-effect waves-light auth-submit"
                        type="submit"
                >
                    Подключиться
                </button>
            </form>
        </div>
        <div class="center connect-to">
            <span>Игру ещё не создали?<router-link to="/start"> Так создайте!</router-link></span>
        </div>
    </div>
</template>

<script>
    import {required} from 'vuelidate/lib/validators'

    export default {
        name: "Connect",
        data: () => ({
           name: '',
           password: ''
        }),
        validations: {
            name: {required},
            password: {required}
        },
        methods: {
            async connectToGame() {
                if (this.$v.$invalid) {
                    this.$v.$touch()
                    return
                }

                const game = await this.$store.dispatch('connectToGame', {name: this.name, password: this.password})
                if (game) {
                    this.$router.push('/game?message=connect')
                }
            }
        }
    }
</script>

<style scoped>

</style>