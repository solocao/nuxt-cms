export const state = () => ({
  isMenuCollapse: false
})

export const mutations = {
  SET_COLLAPSE(state) {
    state.isMenuCollapse = !state.isMenuCollapse
  }
}
