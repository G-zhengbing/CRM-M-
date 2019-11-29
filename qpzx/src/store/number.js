import axios from 'axios'
import {
  MONEY
} from '../uilt/url/url'
import storage from '../uilt/storage'

export default {
  state: {
    moneynumber: [],
    refer: [],
    currentPage: 1,
    total: 0,
    pageSize: 10
  },
  mutations: {
    setgetMoneyNumberList(state, payload) {
      state.moneynumber = payload
    },
    setRefer(state, payload) {
      state.refer = payload
    },
    setCurrentPage(state, payload) {
      state.currentPage = payload
    },
    setTotal(state, payload) {
      state.total = payload
    }
  },
  actions: {
    getMoneyNumberList({
      state,
      commit
    }, form, page) {
      return new Promise((resolve, reject) => {
        axios({
          method: "get",
          url: MONEY,
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            Authorization: "bearer " + storage.get()
          },
          params: {
            ...form,
            page: page ? page : state.currentPage
          }
        }).then(res => {
          commit("setgetMoneyNumberList", res.data.data.resources)
          commit("setCurrentPage", res.data.data.links.current_page)
          commit("setRefer", res.data.data.refer)
          commit("setTotal", res.data.data.links.total)
          resolve()
        }).catch(e => {
          reject(e)
        })
      })
    }
  },
  getters: {
    numberData(state) {
      let data = state.moneynumber
      var subjects = new Map([
        [1, '数学'],
        [2, "英语"]
      ])
      return data.map(element => {
        element.subject = subjects.get(element.subject);
        return element;
      });
    }
  }
}
