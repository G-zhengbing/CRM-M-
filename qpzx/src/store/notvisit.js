import axios from 'axios'
import {
  JINRI
} from '../uilt/url/url'
import storage from '../uilt/storage'

export default {
  state: {
    xinfenList: [],
    refer: [],
    currentPage: 1,
    total: 0,
    pageSize: 10
  },
  mutations: {
    setXinfenList(state, payload) {
      state.xinfenList = payload
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
    getXinfenList({
      state,
      commit
    }, form, page) {
      return new Promise((resolve, reject) => {
        axios({
          method: "post",
          url: JINRI,
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            Authorization: "bearer " + storage.get()
          },
          params: {
            ...form,
            type: 1,
            page: page ? page : state.currentPage
          }
        }).then(res => {
          commit("setXinfenList", res.data.data.resources)
          commit("setRefer", res.data.data.links.refer)
          commit("setTotal", res.data.data.links.total)
          resolve()
        }).catch(e => {
          reject(e)
        })
      })
    }
  },
  getters: {
    NotdataArr(state) {
      let data = state.xinfenList
      var maps = new Map([
        [1, '一年级'],
        [2, '二年级'],
        [3, '三年级'],
        [4, '四年级'],
        [5, '五年级'],
        [6, '六年级'],
        [7, '七年级'],
        [8, '八年级'],
        [9, '九年级']
      ]);
      var subjects = new Map([
        [1, '数学'],
        [2, "英语"]
      ])
      var course = new Map([
        [1, '未约课'],
        [2, "已约课"]
      ])
      var intention = new Map([
        [1, "A"],
        [2, "B"],
        [3, "C"],
        [4, "D"],
        [5, "E"]
      ])

      var follow = new Map([
        [1, "待分配"],
        [2, "已分配"],
        [3, "跟进中"],
        [4, "已调库"],
        [5, "已移出"],
      ])

      var gender = new Map([
        [1, "男"],
        [2, "女"]
      ])

      var age = new Map([
        [5,"5岁"],
        [6,"6岁"],
        [7,"7岁"],
        [8,"8岁"],
        [9,"9岁"],
        [10,"10岁"],
        [11,"11岁"],
        [12,"12岁"],
        [13,"13岁"],
        [14,"14岁"],
        [15,"15岁"],
        [16,"16岁"],
        [17,"17岁"],
        [18,"18岁"],
        [19,"19岁"],
        [20,"20岁"]
      ])
      return data.map(element => {
        element.grade = maps.get(element.grade);
        element.sex = gender.get(element.sex);
        element.age = age.get(element.age);
        element.follow_status = follow.get(element.follow_status);
        element.subject = subjects.get(element.subject);
        element.is_course = course.get(element.is_course);
        element.intention_option = intention.get(element.intention_option);
        return element;
      });
    }
  }
}
