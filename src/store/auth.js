import firebase from 'firebase'

export default {
    actions: {
        async login(context, {email, password}) {
            try {
                await firebase.auth().signInWithEmailAndPassword(email, password)
                const uid = await context.dispatch('getUid')
                const nickname = (await firebase.database().ref(`users/${uid}/info`).once('value')).val()
                context.commit('setInfo', nickname)
            } catch (e) {
                context.commit('setError', e)
                throw e
            }
        },
        async register(context, {email, password, nickname}) {
            try {
                await firebase.auth().createUserWithEmailAndPassword(email, password)
                const uid = await context.dispatch('getUid')
                await firebase.database().ref(`users/${uid}/info`).set({
                    nickname
                })
                context.commit('setInfo', nickname)
            } catch (e) {
                context.commit('setError', e)
                throw e
            }
        },
        async logout(context) {
            await firebase.auth().signOut()
            context.commit('clearInfo')
        },
        getUid() {
            const user = firebase.auth().currentUser
            return user ? user.uid : null
        }
    }
}