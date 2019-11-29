import Vue from 'vue'
import Vuex from 'vuex'
import erweima from './erweima'
import main from './main'
import daiban from './daiban'
import publics from './public'
import money from './money'
import followup from './followup'
import notcallback from './notcallback'
import number from './number'
import notvisit from './notvisit'
import advertising from './advertising'
import special from './special'
import curriculum from './curriculum'
import databank from './databank'
import axios from "axios";
import {
  GETUSER,
  GENJIN
} from "../uilt/url/url";
import storage from '../uilt/storage'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    cId: 0,
    uName: ""
  },
  mutations: {
    setuName(state, payload) {
      state.uName = payload
    },
    setCid(state, payload) {
      state.cId = payload
    },
    clearuName(state) {
      state.uName = ""
    }
  },
  actions: {
    //跟进
    Genjin({
      dispatch
    }, {
      type,
      status
    }) {
      if (!type.data.note) {
        type.data.note = ""
      }
      return new Promise((resolve, reject) => {
        axios({
          method: "put",
          url: GENJIN + "/" + type.data.id,
          params: {
            ...type.data,
            page: status
          },
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            Authorization: "bearer " + storage.get()
          }
        }).then(res => {
          resolve()
        }).catch(e => {
          reject(e)
        })
      })
    },
    getUser({
      state,
      commit
    }) {
      return new Promise((resolve, reject) => {
        axios({
          method: "get",
          url: GETUSER,
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            Authorization: "bearer " + storage.get()
          }
        }).then(res => {
          commit('setuName', res.data.data.user_name)
          commit("setCid", res.data.data.role)
          resolve(res)
        }).catch(e => {
          reject(e);
        })
      })
    }
  },
  getters: {},
  modules: {
    erweima, //二维码页面
    main, //主页面
    daiban, //资源池
    publics, //公共资源池
    money, //成单金额
    followup, //今日回访
    notcallback, //预期未回访
    number, //成单数
    notvisit, //今日新分
    advertising ,//广告管理,
    special,//专题管理
    curriculum,//课程管理
    databank//资料管理
  }
})
