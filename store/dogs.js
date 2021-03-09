export const state = () => ({
  dogs: []
})

export const mutations = {
  set(state, dogs) {
    state.dogs = dogs
  }
}
