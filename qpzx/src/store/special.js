import axios from "axios";
import {
  SPECIAL_URL,
  DELESPECIAL_URL,
  SPECIALUPDOWN_URL,
  ADDSPECIAL_URL,
  UPDATASPECIAL_URL
} from "../uilt/url/Murl.js";
import storage from '../uilt/storage'

export default {
  state: {
    specialList: [],
    currentPage: 1,
    pageSize: 5,
    total: 0
  },
  mutations: {
    setSpecialList(state, payload) {
      state.specialList = payload
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
    //修改专题
    updataSpecialLIst({dispatch},form){
      return new Promise((resolve,reject)=>{
        axios({
          method:"post",
          url:UPDATASPECIAL_URL + "/" + form.id,
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            Authorization: "bearer " + storage.get()
          },
          data:{...form}
        }).then(res=>{
          console.log(res)
          dispatch("getSpecialList")
          resolve(res)
        }).catch(e=>{
          reject(e)
        })
      })
    },
    //新建专题
    addSpecialList({dispatch},form){
      return new Promise((resolve,reject)=>{
        axios({
          method:"post",
          url:ADDSPECIAL_URL,
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            Authorization: "bearer " + storage.get()
          },
          data:{...form}
        }).then(res=>{
          dispatch("getSpecialList")
          resolve(res)
        }).catch(e=>{
          reject(e)
        })
      })
    },
    //上线/下线
    setSpSwitch({
      dispatch
    }, form) {
      if (form.status) {
        form.status = 1
      } else {
        form.status = 2
      }
      return new Promise((resolve, reject) => {
        axios({
          method: "post",
          url: SPECIALUPDOWN_URL + "/" + form.id,
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            Authorization: "bearer " + storage.get()
          },
          params: {
            status: form.status
          }
        }).then(res => {
          resolve()
        }).catch(e => {
          reject(e)
        })
      })
    },
    //删除专题
    deleSpecialList({
      dispatch
    }, arr) {
      console.log(arr)
      return new Promise((resolve, reject) => {
        axios({
          method: "post",
          url: DELESPECIAL_URL,
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            Authorization: "bearer " + storage.get()
          },
          params: {
            event_id: arr
          }
        }).then(res => {
          dispatch("getSpecialList")
          resolve(res)
        }).catch(e => {
          reject(e)
        })
      })
    },
    //专题列表
    getSpecialList({
      commit
    }, title) {
      return new Promise((resolve, reject) => {
        axios({
          method: "get",
          url: SPECIAL_URL,
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            Authorization: "bearer " + storage.get()
          },
          params: {
            title
          }
        }).then(res => {
          commit("setSpecialList", res.data.data.resources)
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
