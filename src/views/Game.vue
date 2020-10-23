<template>
    <Loader v-if="loading"/>
    <div class="game" v-else>
        <div>
            <p class="enemy-name center">Ваш соперник - {{enemyName}}</p>
            <div class="game-field" v-if="player2">
                <div class="cell" :class="{'target': (cell.target && moveT) || cell.pointed}" v-for="cell in uCells"
                     :key="cell.number"
                     :id="cell.number" @click="cellClick">
                    <span class="cross" v-if="cell.X">X</span>
                    <span class="cross" v-else>0</span>
                </div>
            </div>
            <p v-else>Ждём второго игрока!</p>
            <div class="center">
                <form @submit.prevent="point" v-if="moveT">
                    <button
                            class="btn waves-effect waves-light auth-submit"
                            type="submit"
                    >
                        Поставить
                    </button>
                </form>
                <p v-else>Ждём хода другого игрока!</p>
            </div>
        </div>
    </div>
</template>

<script>
    import firebase from 'firebase'

    export default {
        name: "Game",
        data: () => ({
            rows: 3,
            cols: 3,
            num: 0,
            uCells: [],
            loading: true,
            currGame: null,
            pointed: [],
            player2: undefined,
            move: null,
            moveT: null,
            enemyName: null,
        }),
        async mounted() {
            this.currGame = this.$store.getters.currGame
            let X
            if (this.$route.query.message === 'connect') {
                this.moveT = this.currGame.move === 'player2'
                this.move = 'player2'
                X = true
            } else {
                this.moveT = this.currGame.move === 'player1'
                this.move = 'player1'
                X = false
            }

            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    this.uCells.push({
                        row: i,
                        col: j,
                        number: this.num,
                        target: false,
                        X
                    })
                    this.num++
                }
            }

            await firebase.database().ref(`activeGames/${this.currGame.id}/player2`).on('value', async (player2) => {
                this.player2 = player2.val()
                if (this.$route.query.message === 'connect') {
                    this.enemyName = (await firebase.database().ref(`users/${this.currGame.player1}/info/nickname`).once('value')).val()
                } else {
                    this.enemyName = (await firebase.database().ref(`users/${player2.val()}/info/nickname`).once('value')).val()
                }
                this.$store.commit('addPlayer2ToCurrentGame', player2.val())
                this.loading = false
                await firebase.database().ref(`activeGames/${this.currGame.id}/move`).on('value', async (move) => {
                    this.pointed = (await firebase.database().ref(`activeGames/${this.currGame.id}/pointed`).once('value')).val()
                    for (let point in this.pointed) {
                        this.uCells[this.pointed[point].id].target = true
                        this.uCells[this.pointed[point].id].pointed = true
                        this.uCells[this.pointed[point].id].X = this.pointed[point].X
                    }

                    const winObj = this.checkWin(this.uCells)

                    if (winObj.win) {
                        this.$message(`Выйграл ${winObj.winner}`)
                        this.$store.commit('clearCurrentGame')
                        await firebase.database().ref(`activeGames/${this.currGame.id}`).remove()
                        this.$router.push('/start')

                    }

                    if (this.$route.query.message === 'connect') {
                        this.move = move.val()
                        this.moveT = move.val() === 'player2'
                    } else {
                        this.move = move.val()
                        this.moveT = move.val() === 'player1'
                    }
                })
            })

        },
        methods: {
            cellClick(e) {
                for (let cell in this.uCells) {
                    this.uCells[cell].target = false
                }
                this.uCells[e.target.id].target = true
            },
            async point() {
                if (this.$route.query.message === 'connect') {
                    this.move = this.moveT ? 'player1' : 'player2'
                } else {
                    this.move = this.moveT ? 'player2' : 'player1'
                }
                for (let cell in this.uCells) {
                    let X = null
                    if (this.$route.query.message === 'connect') {
                        X = this.move === 'player1'
                    } else {
                        X = this.move === 'player1'
                    }

                    if (this.uCells[cell].target && !this.uCells[cell].pointed) {
                        this.pointed = this.pointed || []
                        this.pointed.push({
                            id: this.uCells[cell].number,
                            point: true,
                            X
                        })
                        await firebase.database().ref(`activeGames/`).child(this.currGame.id).update({pointed: this.pointed})
                        await firebase.database().ref(`activeGames/`).child(this.currGame.id).update({move: this.move})
                        return
                    }
                }
                this.$message('Вы не поставили X/0!!!')
            },
            checkWin(uCells) {
                if (
                    (
                        (uCells[0].pointed && !uCells[0].X) &&
                        (uCells[1].pointed && !uCells[1].X) &&
                        (uCells[2].pointed && !uCells[2].X)
                    ) ||
                    (
                        (uCells[0].pointed && !uCells[0].X) &&
                        (uCells[4].pointed && !uCells[4].X) &&
                        (uCells[8].pointed && !uCells[8].X)
                    ) ||
                    (
                        (uCells[2].pointed && !uCells[2].X) &&
                        (uCells[4].pointed && !uCells[4].X) &&
                        (uCells[6].pointed && !uCells[6].X)
                    ) ||
                    (
                        (uCells[3].pointed && !uCells[3].X) &&
                        (uCells[4].pointed && !uCells[4].X) &&
                        (uCells[5].pointed && !uCells[5].X)
                    ) ||
                    (
                        (uCells[6].pointed && !uCells[6].X) &&
                        (uCells[7].pointed && !uCells[7].X) &&
                        (uCells[8].pointed && !uCells[8].X)
                    ) ||
                    (
                        (uCells[0].pointed && !uCells[0].X) &&
                        (uCells[3].pointed && !uCells[3].X) &&
                        (uCells[6].pointed && !uCells[6].X)
                    ) ||
                    (
                        (uCells[1].pointed && !uCells[1].X) &&
                        (uCells[4].pointed && !uCells[4].X) &&
                        (uCells[7].pointed && !uCells[7].X)
                    ) ||
                    (
                        (uCells[2].pointed && !uCells[2].X) &&
                        (uCells[5].pointed && !uCells[5].X) &&
                        (uCells[8].pointed && !uCells[8].X)
                    )
                ) {
                    return {
                        winner: 'player1',
                        win: true
                    }
                } else if (
                    (
                        (uCells[0].pointed && uCells[0].X) &&
                        (uCells[1].pointed && uCells[1].X) &&
                        (uCells[2].pointed && uCells[2].X)
                    ) ||
                    (
                        (uCells[0].pointed && uCells[0].X) &&
                        (uCells[4].pointed && uCells[4].X) &&
                        (uCells[8].pointed && uCells[8].X)
                    ) ||
                    (
                        (uCells[2].pointed && uCells[2].X) &&
                        (uCells[4].pointed && uCells[4].X) &&
                        (uCells[6].pointed && uCells[6].X)
                    ) ||
                    (
                        (uCells[3].pointed && uCells[3].X) &&
                        (uCells[4].pointed && uCells[4].X) &&
                        (uCells[5].pointed && uCells[5].X)
                    ) ||
                    (
                        (uCells[6].pointed && uCells[6].X) &&
                        (uCells[7].pointed && uCells[7].X) &&
                        (uCells[8].pointed && uCells[8].X)
                    ) ||
                    (
                        (uCells[0].pointed && uCells[0].X) &&
                        (uCells[3].pointed && uCells[3].X) &&
                        (uCells[6].pointed && uCells[6].X)
                    ) ||
                    (
                        (uCells[1].pointed && uCells[1].X) &&
                        (uCells[4].pointed && uCells[4].X) &&
                        (uCells[7].pointed && uCells[7].X)
                    ) ||
                    (
                        (uCells[2].pointed && uCells[2].X) &&
                        (uCells[5].pointed && uCells[5].X) &&
                        (uCells[8].pointed && uCells[8].X)
                    )
                ) {
                    return {
                        winner: 'player2',
                        win: true
                    }
                } else if (
                    (uCells[0].pointed && uCells[0].X) &&
                    (uCells[1].pointed && uCells[1].X) &&
                    (uCells[2].pointed && uCells[2].X) &&
                    (uCells[3].pointed && uCells[3].X) &&
                    (uCells[4].pointed && uCells[4].X) &&
                    (uCells[5].pointed && uCells[5].X) &&
                    (uCells[6].pointed && uCells[6].X) &&
                    (uCells[7].pointed && uCells[7].X) &&
                    (uCells[8].pointed && uCells[8].X)
                ) {
                    return {
                        winner: 'Ничья',
                        win: true
                    }
                } else {
                    return {
                        winner: null,
                        win: false
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>