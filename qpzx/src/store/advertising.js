import axios from "axios";
import {
  ADVER_URL,
  ADDADVER_URL,
  DELEADVER_URL,
  ADVEUPDOWN_URL
} from "../uilt/url/Murl";
import qs from 'qs'
import storage from '../uilt/storage'

export default {
  state: {
    adverList: [],
    currentPage: 1,
    pageSize: 5,
    total: 0
  },
  mutations: {
    setAdverList(state, payload) {
      state.adverList = payload
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
    //上线/下线
    setSwitch({dispatch},form){
      if(form.status){
        form.status = 1
      }else{
        form.status = 2
      }
      return new Promise((resolve,reject)=>{
        axios({
          method:"post",
          url:ADVEUPDOWN_URL + "/" + form.id,
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            Authorization: "bearer " + storage.get()
          },
          params:{
            status:form.status
          }
        }).then(res=>{
          dispatch("getAdverList")
          resolve()
        }).catch(e=>{
          reject(e)
        })
      })
    },
    //删除广告
    deleAdverList({
      state,
      commit,
      dispatch
    }, arr) {
      return new Promise((resolve, reject) => {
        axios({
          method: "post",
          url: DELEADVER_URL,
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            Authorization: "bearer " + storage.get()
          },
          params: {
            banner_id: arr
          }
        }).then(res => {
          dispatch("getAdverList")
          resolve(res)
        }).catch(e => {
          reject(e)
        })
      })
    },
    // 创建广告
    // addAdverList({
    //   state,
    //   commit,
    //   dispatch
    // },form) {
    //   return new Promise((resolve, reject) => {
    //     axios({
    //       method: "post",
    //       url: ADDADVER_URL,
    //       headers: {
    //         "content-type": "application/x-www-form-urlencoded",
    //         Authorization: "bearer " + storage.get()
    //       },
    //       data:qs.stringify(form)
    //     }).then(res => {
    //       console.log(res)
    //       dispatch("getAdverList")
    //       resolve()
    //     }).catch(e => {
    //       reject(e)
    //     })
    //   })
    // },
    //得到广告列表
    getAdverList({
      state,
      commit
    }, title) {
      return new Promise((resolve, reject) => {
        axios({
          method: "get",
          url: ADVER_URL,
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            Authorization: "bearer " + storage.get()
          },
          params: {
            title: title ? title : ""
          }
        }).then(res => {
          commit("setAdverList", res.data.data.resources)
          commit("setCurrerntPage", res.data.data.links.current_page)
          commit("setPageSize", res.data.data.links.per_page)
          commit("setTotal", res.data.data.links.total)
          resolve()
        }).catch(e => {
          reject(e)
        })
      })
    }
  },
  getters: {}
}
