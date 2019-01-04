import D from '../utils/tools/date'
export const state = () => ({
  pageIndex: 1,
  table: []
})

export const mutations = {
  SET_TABLE(state, payload) {
    state.pageIndex ++
    state.table = payload
  },
  RESET_PAGEINDEX(state, payload) {
    state.pageIndex = 1
  }
}

export const actions = {
  async GET_ARTICLE({ commit, state, getters }, id) {
    return await this.$axios.$get(`/article/${id}`)
  },
  async POST_ARTICLE({ commit, state, getters }, payload) {
    return await this.$axios.$post(`/article`, payload)
  },
  async PATCH_ARTICLE({ commit, state, getters }, article) {
    return await this.$axios.$patch(`/article/${article.id}`, article)
  },
  async DEL_ARTICLE({ commit, state, getters }, id) {
    return await this.$axios.$delete(`/article/${id}`)
  },
  async GET_ARTICLES({ commit, state, getters }, query) {
    return await this.$axios.$get(`/articles${query}`)
  },
  async GET_ARTICLES_BY_SEARCH({ commit, state, getters }, payload){
    return await this.$axios.$get(`/articles/search/${payload.keyword}${payload.query}`)
  },
  async GET_ARTICLES_BY_TAG({ commit, state, getters }, payload){
    return await this.$axios.$get(`/articles/tag/${payload.tag}${payload.query}`)
  }
}
