export const state = () => ({
  comments: []
})
export const mutations = {
  SET_COMMENTS(state, payload) {
    state.comments = payload
  },
}
export const actions = {
  async POST_COMMENT({ commit, state, getters }, payload) {
    return await this.$axios.$post(`/comment`,payload)
  },
  async DEL_COMMENT({ commit, state, getters }, id) {
    return await this.$axios.$delete(`/comment/${id}`)
  },
  async GET_COMMENTS({ commit, state, getters }, query) {
    return await this.$axios.$get(`/comments${query}`)
  }
}
