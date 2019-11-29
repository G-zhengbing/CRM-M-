import axios from 'axios'
import {
  ERWEIMA,
  DELEERWEIMA,
  ERWEIMALIST,
  ERWEIMACITY,
  QUDAO,
  TYPESHOOL,
  DAORU
} from '../uilt/url/url'
import storage from '../uilt/storage'

export default {
  state: {
    erweimaList: [],
    refer: [],
    checkArr: [],
    currentPage: 1,
    total: 0,
    pageSize: 10,
    cityList: [],
    cityRefre: [],
    cityShool: [],
    erweimaUrl: "",
    qudaoList: [],
    tuiCurrent: 1,
    tuiTotal: 0,
    tuiPageSize: 5,
    qudaoTypes: null
  },
  mutations: {
    setQudaoTypes(state, payload) {
      state.qudaoTypes = payload
    },
    setTuiTotal(state, payload) {
      state.tuiTotal = payload
    },
    setTuiCurrent(state, payload) {
      state.tuiCurrent = payload
    },
    setQudaoList(state, payload) {
      state.qudaoList = payload
    },
    setErweimaUrl(state, payload) {
      state.erweimaUrl = payload
    },
    setCityShool(state, payload) {
      state.cityShool = payload
    },
    setCityRefre(state, payload) {
      state.cityRefre = payload
    },
    setCityList(state, payload) {
      state.cityList = payload
    },
    setPageSize(state, payload) {
      state.pageSize = payload
    },
    setTotal(state, payload) {
      state.total = payload
    },
    setCurrentPage(state, payload) {
      state.currentPage = payload
    },
    setCheckArr(state, payload) {
      state.checkArr = payload
    },
    setErweimaList(state, payload) {
      state.erweimaList = payload
    },
    setRefer(state, payload) {
      state.refer = payload
    }
  },
  actions: {
    //导入
    setDaoru({
      state
    }, form, fileName, data) {
      return new Promise((resolve, reject) => {
        axios({
          method: "post",
          urL: DAORU,
          data: {
            qcode_id: form,
            fileName: fileName,
            data: data
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
    //类型/学校
    getTypeShool({
      state,
      commit
    }) {
      return new Promise((resolve, reject) => {
        axios({
          method: "get",
          url: TYPESHOOL,
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            Authorization: "bearer " + storage.get()
          }
        }).then(res => {
          commit("setCityRefre", res.data.data.refer)
          commit("setCityShool", res.data.data.school)
          resolve()
        }).catch(e => {
          reject(e)
        })
      })
    },
    //渠道
    getQudao({
      state,
      commit
    }, form) {
      return new Promise((resolve, reject) => {
        axios({
          method: "get",
          url: QUDAO + "/" + form.id,
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            Authorization: "bearer " + storage.get()
          },
          params:{
            page:state.tuiCurrent
          }
        }).then(res => {
          commit("setTuiCurrent", res.data.data.links.current_page)
          commit("setTuiTotal", res.data.data.links.total)
          commit("setQudaoList", res.data.data.resources)
          resolve()
        }).catch(e => {
          reject(e)
        })
      })
    },
    //获取城市列表
    getErwemaCity({
      state,
      commit
    }, city) {
      return new Promise((resolve, reject) => {
        axios({
          method: "post",
          url: ERWEIMACITY,
          params: {
            name: city
          },
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            Authorization: "bearer " + storage.get()
          }
        }).then(res => {
          commit("setCityList", res.data.data)
          resolve()
        }).catch(e => {
          reject(e)
        })
      })
    },
    //二维码列表
    getErweimaList({
      state,
      commit
    }, form, page) {
      return new Promise((resolve, reject) => {
        axios({
          method: "post",
          url: ERWEIMALIST,
          params: {
            page: page ? page : state.currentPage,
            ...form
          },
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            Authorization: "bearer " + storage.get()
          }
        }).then(res => {
          commit("setErweimaList", res.data.data.data)
          commit("setCurrentPage", res.data.data.links.current_page)
          commit("setRefer", res.data.data.refer)
          commit("setTotal", res.data.data.links.total)
          resolve()
        }).catch(e => {
          reject(e)
        })
      })
    },
    //新生成二维码
    NewErweimaList({
      state,
      commit,
      dispatch
    }, {
      form,
      cityId,
      channels_id
    }) {
      return new Promise((resolve, reject) => {
        axios({
          method: "post",
          url: ERWEIMA,
          params: {
            ...form,
            city: cityId,
            channels_id:channels_id? channels_id :""
          },
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            Authorization: "bearer " + storage.get()
          }
        }).then(res => {
          resolve(res)
        }).catch(e => {
          reject(e)
        })
      })
    },
    //删除二维码
    deleErweima({
      state,
      commit,
      dispatch
    }, form) {
      return new Promise((resolve, reject) => {
        axios({
          method: "post",
          url: DELEERWEIMA,
          params: {
            qrcode_id: form.qcode_id
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
    }
  },
  getters: {
    erweimaArr(state) {
      let data = state.erweimaList
      var maps = new Map([
        [1, "未使用"],
        [2, "已使用"],
        [4, "已删除"]
      ])
      return data.map(item => {
        item.status = maps.get(item.status);
        return item
      })
    }
  }
}
