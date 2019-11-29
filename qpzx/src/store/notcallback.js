import axios from 'axios'
import {
  YUQI
} from '../uilt/url/url'
import storage from '../uilt/storage'

export default {
  state: {
    yuqiList: [],
    refer: [],
    currentPage: 1,
    total: 0,
    pageSize: 10,
    notCallBackTyps: null
  },
  mutations: {
    setNotCallBackTyps(state, payload) {
      state.notCallBackTyps = payload
    },
    setYuQiList(state, payload) {
      state.yuqiList = payload
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
    getYuQiList({
      state,
      commit
    }, form, page) {
      return new Promise((resolve, reject) => {
        axios({
          method: "get",
          url: YUQI,
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            Authorization: "bearer " + storage.get()
          },
          params: {
            ...form,
            page: page ? page : state.currentPage
          }
        }).then(res => {
          commit("setYuQiList", res.data.data.resources)
          commit("setCurrentPage",res.data.data.links.current_page)
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
    notcallbackTypes(state) {
      let type = state.notCallBackTyps
      var maps = new Map([
        ["一年级", 1],
        ["二年级", 2],
        ["三年级", 3],
        ["四年级", 4],
        ["五年级", 5],
        ["六年级", 6],
        ["七年级", 7],
        ["八年级", 8],
        ["九年级", 9],
      ])
      var subjects = new Map([
        ["数学", 1],
        ["英语", 2]
      ])
      var course = new Map([
        ["未约课", 1],
        ["已约课", 2]
      ])
      var intention = new Map([
        ["A", 1],
        ["B", 2],
        ["C", 3],
        ["D", 4],
        ["E", 5]
      ])
      type.grade = maps.get(type.grade)
      type.subject = subjects.get(type.subject)
      type.is_course = course.get(type.is_course)
      type.intention_option = intention.get(type.intention_option)
      return type
    },
    notCallBackData(state) {
      let data = state.yuqiList
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
        [1, '英语'],
        [2, "数学"]
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
