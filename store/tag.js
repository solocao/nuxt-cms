export const state = () => ({
  tag: ''
})
export const mutations = {
  SET_TAG(state, payload) {
    state.tag = payload
  }
}
export const actions = {
  async GET_TAGS({ commit, state, getters }, payload) {
    return await this.$axios.$get(`/tags`)
  }
}
