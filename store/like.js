export const actions = {
  async POST_LIKE({ commit, state, getters }, payload) {
    return await this.$axios.$post(`/like`,payload)
  },
  async DEL_LIKE({ commit, state, getters }, id) {
    return await this.$axios.$delete(`/like/${id}`)
  },
  async GET_LIKES({ commit, state, getters }, query) {
    return await this.$axios.$get(`/likes${query}`)
  },
}
