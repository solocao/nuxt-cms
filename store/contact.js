export const actions = {
  async GET_CONTACT({ commit, state, getters }, id) {
    return await this.$axios.$get(`/contact/${id}`)
  },
  async POST_CONTACT({ commit, state, getters }, payload) {
    return await this.$axios.$post(`/contact`, payload)
  },
  async GET_CONTACTS({ commit, state, getters }, query) {
    return await this.$axios.$get(`/contacts${query}`)
  }
}
