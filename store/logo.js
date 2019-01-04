export const actions = {
  async GET_LOGO({ commit, state, getters }, id) {
    return await this.$axios.$get(`/logo/${id}`)
  },
  async POST_LOGO({ commit, state, getters }, payload) {
    return await this.$axios.$post(`/logo`, payload)
  },
  async PATCH_LOGO({ commit, state, getters }, logo) {
    return await this.$axios.$patch(`/logo/${logo.id}`, logo)
  },
  async DEL_LOGO({ commit, state, getters }, id) {
    return await this.$axios.$delete(`/logo/${id}`)
  },
  async GET_LOGOS({ commit, state, getters }, query) {
    return await this.$axios.$get(`/logos${query}`)
  }
}
