import axios from "axios";
import {
  CURR_URL,
  ADDCURR_URL,
  CURRSHOW_URL,
  CURRUPDOWN_URL,
  DELECURR_URL
} from "../uilt/url/Murl.js";
import storage from '../uilt/storage'

export default {
  state: {
    currlList: [],
    currentPage: 1,
    pageSize: 5,
    total: 0
  },
  mutations: {
    setCurrList(state, payload) {
      state.currlList = payload
    },
    setCurrerntPage(state, payload) {
      state.currentPage = payload
    },
    setPageSize(state, payload) {
      state.pageSize = payload
    },
    setTotal(state, payload) {
      state.total = payload
    }
  },
  actions: {
    addCurrList({dispatch},form){
      return new Promise((resolve,reject)=>{
        axios({
          method:"post",
          url:ADDCURR_URL,
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            Authorization: "bearer " + storage.get()
          },
          data:{...form}
        }).then(res=>{
          console.log(res)
          dispatch("getCurrList")
          resolve()
        }).catch(e=>{
          reject(e)
        })
      })
    },
    //课程列表
    getCurrList({commit},form){
      return new Promise((resolve,reject)=>{
        axios({
          method:"post",
          url:CURR_URL,
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            Authorization: "bearer " + storage.get()
          },
          data:{...form}
        }).then(res=>{
          commit("setCurrList", res.data.data.resources)
          commit("setCurrerntPage", res.data.data.links.current_page)
          commit("setPageSize", res.data.data.links.per_page)
          commit("setTotal", res.data.data.links.total)
          console.log(res)
          resolve()
        }).catch(e=>{
          reject(e)
        })
      })
    }
  },
  getters: {}
}
