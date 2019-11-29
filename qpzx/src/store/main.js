import axios from "axios";
import {
  LOGINOUT
} from "../uilt/url/url";
import storage from '../uilt/storage'

export default {
  state: {
    num: 0
  },
  mutations: {
    setNum(state, payload) {
      state.num = payload
    }
  },
  actions: {
    loginOut() {
      return new Promise((resolve, reject) => {
        axios({
          method: "post",
          url: LOGINOUT,
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
    }
  },
  getters: {}
}
