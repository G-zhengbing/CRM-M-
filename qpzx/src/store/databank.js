import axios from "axios";
import {
  DATA_URL,
  DELEDATA_URL,
  DATASHOW,
  UPDATADATA_URL
} from "../uilt/url/Murl.js";
import storage from '../uilt/storage'
import qs from 'qs'

export default {
  state: {
    databanklList: [],
    currentPage: 1,
    pageSize: 5,
    total: 0
  },
  mutations: {
    setDatabanklList(state, payload) {
      state.databanklList = payload
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
    //是否首页展示
    setDaSwitch({
      dispatch
    }, form) {
      if (form.is_hot) {
        form.is_hot = 1
      } else {
        form.is_hot = 0
      }
      return new Promise((resolve, reject) => {
        axios({
          method: "post",
          url: DATASHOW + "/" + form.id,
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            Authorization: "bearer " + storage.get()
          },
          data: qs.stringify({
            is_hot: form.is_hot
          })
        }).then(res => {
          dispatch("getDatabankList")
          resolve()
        }).catch(e => {
          reject(e)
        })
      })
    },
    //删除资料
    deleDataList({
      dispatch
    }, arr) {
      return new Promise((resolve, reject) => {
        axios({
          method: "post",
          url: DELEDATA_URL,
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            Authorization: "bearer " + storage.get()
          },
          data: qs.stringify({
            material_id: arr
          })
        }).then(res => {
          dispatch("getDatabankList")
          resolve(res)
        }).catch(e => {
          reject(e)
        })
      })
    },
    //修改资料
    updataDataList({
      dispatch
    }, form) {
      return new Promise((resolve, reject) => {
        axios({
          method: "post",
          url: UPDATADATA_URL + "/" + form.id,
          headers: {
            "content-type": "application/json",
            Authorization: "bearer " + storage.get()
          },
          data: {
            ...form
          }
        }).then(res => {
          dispatch("getDatabankList")
          resolve(res)
        }).catch(e => {
          reject(e)
        })
      })
    },
    //资料列表
    getDatabankList({
      state,commit
    }, form,page) {
      return new Promise((resolve, reject) => {
        axios({
          method: "get",
          url: DATA_URL,
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            Authorization: "bearer " + storage.get()
          },
          params: {
            ...form,
            page:page? page :state.currentPage
          }
        }).then(res => {
          commit("setDatabanklList", res.data.data.resources)
          commit("setCurrerntPage", res.data.data.links.current_page)
          console.log(res.data.data.links.current_page)
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
