export default function ({ store, error, redirect, req,route }) {
  store.commit('SET_ROUTE',route.fullPath)
}
