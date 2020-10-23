import firebase from "firebase"

export default {
    actions: {
        async createGame(context, {name, password}) {
            try {
                const uid = await context.dispatch('getUid')
                const game = await firebase.database().ref(`activeGames/`).push({name, password, player1: uid, move: 'player1'})
                context.commit('setCurrentGame', {name, password, player1: uid, id: game.key, playerX: true, move: 'player1'})
                return {name, password, id: game.key, playerX: true, move: 'player1'}
            } catch (e) {
                context.commit('setError', e)
                throw e
            }
        },
        async connectToGame(context, {name, password}) {
            try {
                const uid = await context.dispatch('getUid')
                const games = (await firebase.database().ref(`activeGames/`).once('value')).val() || {}
                const massGames = Object.keys(games).map(key => ({...games[key], id: key}))

                for (let game in massGames) {
                    const thisGameName = massGames[game].name
                    const thisGamePassword = massGames[game].password
                    if ((thisGameName === name) && (thisGamePassword === password)) {
                        await firebase.database().ref(`activeGames/`).child(massGames[game].id).update({player2: uid})
                        context.commit('setCurrentGame', {...massGames[game], playerX: false, player2: uid})
                        return ({...massGames[game], playerX: false, player2: uid})
                    }
                }
            } catch (e) {
                context.commit('setError', e)
                throw e
            }
        },

    }
}