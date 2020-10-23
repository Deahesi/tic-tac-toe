<template>
    <div>
        <form class="main-login center-block" @submit.prevent="submitHandler">
            <div class="input-field">
                <input
                        id="email"
                        type="text"
                        v-model.trim="$v.email.$model"
                        :class="{'invalid': (($v.email.$dirty && !$v.email.required) || ($v.email.$dirty && !$v.email.email))}"
                >
                <label for="email">Email</label>
                <small class="helper-text invalid" v-if="$v.email.$dirty && !$v.email.required">Поле Email не должно
                    быть пустым!</small>
                <small class="helper-text invalid" v-else-if="$v.email.$dirty && !$v.email.email">Введите корректный
                    Email!</small>
            </div>
            <div class="input-field">
                <input
                        id="password"
                        type="password"
                        class="validate"
                        v-model.trim="$v.password.$model"
                        :class="{'invalid': (($v.password.$dirty && !$v.password.required) || ($v.password.$dirty && !$v.password.minLength))}"
                >
                <label for="password">Пароль</label>

                <small class="helper-text invalid"
                       v-if="$v.password.$dirty && !$v.password.required"
                >Поле пароль не должно быть пустым!</small>

                <small class="helper-text invalid"
                       v-else-if="$v.password.$dirty && !$v.password.minLength"
                >Введите корректный пароль!</small>
            </div>
            <div class="card-action center">
                <div>
                    <button
                            class="btn waves-effect waves-light auth-submit"
                            type="submit"
                    >
                        Войти
                    </button>
                </div>

                <p class="center">
                    Нет аккаунта?
                    <router-link to="/register">Зарегистрироваться</router-link>
                </p>
            </div>
        </form>
    </div>
</template>

<script>
    import {email, required, minLength} from 'vuelidate/lib/validators'
    import messages from "../utils/messages";

    export default {
        name: 'Login',
        validations: {
            email: {email, required},
            password: {required, minLength: minLength(7)}
        },
        data: () => ({
            email: '',
            password: ''
        }),
        methods: {
            async submitHandler() {
                if (this.$v.$invalid) {
                    this.$v.$touch()
                    return
                }

                try {
                    await this.$store.dispatch('login', {email: this.email, password: this.password})
                    this.$router.push('/start')
                } catch (e) {
                    console.log()
                }
            }
        },
        mounted() {
            if (messages[this.$route.query.message]) {
                this.$message(messages[this.$route.query.message])
            }
        },
        computed: {
            error() {
                return this.$store.getters.error
            }
        },
        watch: {
            error(fbError) {
                this.$error(messages[fbError.code] || 'Что-то пошло не так')
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
