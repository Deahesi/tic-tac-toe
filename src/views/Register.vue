<template>
    <div>
        <form class=" auth-card center-block" @submit.prevent="submitHandler">
            <div class="inputs">
                <div class="input-field">
                    <input
                            id="nickname"
                            type="text"
                            v-model.trim="$v.nickname.$model"
                            :class="{'invalid': (($v.nickname.$dirty && !$v.nickname.required))}"
                    >
                    <label for="nickname">Никнейм</label>
                </div>
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
            </div>
            <div class="card-action center">
                <div>
                    <button
                            class="btn waves-effect waves-light auth-submit"
                            type="submit"
                    >
                        Зарегистрироваться
                    </button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    import {email, required, minLength} from 'vuelidate/lib/validators'
    import messages from "../utils/messages";

    export default {
        name: "Register",
        validations: {
            email: {email, required},
            password: {required, minLength: minLength(7)},
            nickname: {required}
        },
        data: () => ({
            email: '',
            password: '',
            nickname: ''
        }),
        methods: {
            async submitHandler() {
                if (this.$v.$invalid) {
                    this.$v.$touch()
                    return
                }

                try {
                    await this.$store.dispatch('register', {
                        email: this.email,
                        password: this.password,
                        nickname: this.nickname
                    })
                    this.$router.push('/login?message=register')
                } catch (e) {
                    console.log()
                }
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

<style scoped>

</style>