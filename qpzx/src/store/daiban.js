import axios from 'axios'
import {
  KEHULIST,
  FENPEI,
  FENPAIXS,
  YIRUGONG,
  DINGDAN,
  HUCHU
} from '../uilt/url/url'
import storage from '../uilt/storage'

export default {
  state: {
    status: 1,
    type: null,
    genjinType: null,
    data: [],
    refer: [],
    currentPage: 1,
    total: 0,
    pageSize: 10,
    fenpeiList: [],
    xiansuoId: [],
    xiaoshowId: 0
  },
  mutations: {
    setStatusNum(state, payload) {
      state.status = payload
    },
    setGenjinType(state, payload) {
      state.genjinType = payload
    },
    setType(state, payload) {
      state.type = payload
    },
    setXiaoshowId(state, payload) {
      state.xiaoshowId = payload
    },
    setXiansuoId(state, payload) {
      state.xiansuoId = payload
    },
    setColumns(state, payload) {
      state.columns = payload
    },
    setData(state, payload) {
      state.data = payload
    },
    setRefer(state, payload) {
      state.refer = payload
    },
    setCurrentPage(state, payload) {
      state.currentPage = payload
    },
    setTotal(state, payload) {
      state.total = payload
    },
    setFenpeiList(state, payload) {
      state.fenpeiList = payload
    }
  },
  actions: {
    //呼出
    RingUp({}, form) {
      return new Promise((resolve, reject) => {
        axios({
          method: "post",
          url: HUCHU,
          params: {
            mobile: form.mobile
          },
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            Authorization: "bearer " + storage.get()
          }
        }).then(res => {
          console.log(res)
          resolve(res)
        }).catch(e => {
          reject(e)
        })
      })
    },
    //创建订单
    updataDing({
      state,
      commit,
      dispatch
    }, {
      cid,
      item
    }) {
      return new Promise((resolve, reject) => {
        axios({
          method: "post",
          url: DINGDAN + '/' + cid,
          params: {
            ...item
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
    //移入公共客户区域
    ShiftOut({
      state,
      commit,
      dispatch
    }, data) {
      return new Promise((resolve, reject) => {
        var num = 5
        if (data.classify == "shiftTo") {
          num = 2
        }
        axios({
          method: "put",
          url: YIRUGONG + "/" + data.data.id,
          params: {
            status: num,
            page: state.currentPage
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

    //分配
    fenPai({
      state,
      commit,
      dispatch
    }, form) {
      return new Promise((resolve, reject) => {
        axios({
          method: "put",
          url: FENPAIXS,
          params: {
            account_ids: state.xiansuoId,
            sale_id: state.xiaoshowId.id,
            assign_note: form.assign_note,
            sale_name: form.sale_name,
            page: state.currentPage
          },
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            Authorization: "bearer " + storage.get()
          }
        }).then(res => {
          dispatch("getKehuList", 1)
          resolve()
        }).catch(e => {
          reject(e)
        })
      })
    },
    //得到列表数据
    getKehuList({
      state,
      commit,
      dispatch
    }, {
      status,
      form,
      page
    }) {
      return new Promise((resolve, reject) => {
        axios({
          method: "get",
          url: KEHULIST,
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            Authorization: "bearer " + storage.get()
          },
          params: {
            ...form,
            highsea_status: status ? status : 1,
            page: page ? page : state.currentPage
          }
        }).then(res => {
          commit("setData", res.data.data.resources)
          commit("setRefer", res.data.data.links.refer)
          commit("setCurrentPage", res.data.data.links.current_page)
          commit("setTotal", res.data.data.links.total)
          resolve()
        }).catch(e => {
          reject(e)
        })
      })
    },
    //分配
    getFenpeiList({
      state,
      commit
    }) {
      return new Promise((resolve, reject) => {
        axios({
          method: "get",
          url: FENPEI,
          params: {

          },
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            Authorization: "bearer " + storage.get()
          }
        }).then(res => {
          commit("setFenpeiList", res.data.data)
          resolve()
        }).catch(e => {
          reject(e)
        })
      })
    }
  },
  getters: {
    Types(state) {
      let type = state.genjinType
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

      var gender = new Map([
        ["男", 1],
        ["女", 2]
      ])

      var follow = new Map([
        ["待分配", 1],
        ["已分配", 2],
        ["跟进中", 3],
        ["已调库", 4],
        ["已移出", 5]
      ])

      var age = new Map([
        ["5岁", 5],
        ["6岁", 6],
        ["7岁", 7],
        ["8岁", 8],
        ["9岁", 9],
        ["10岁", 10],
        ["11岁", 11],
        ["12岁", 12],
        ["13岁", 13],
        ["14岁", 14],
        ["15岁", 15],
        ["16岁", 16],
        ["17岁", 17],
        ["18岁", 18],
        ["19岁", 19],
        ["20岁", 20],
      ])

      type.grade = maps.get(type.grade)
      type.sex = gender.get(type.sex)
      type.age = age.get(type.age)
      type.follow_status = follow.get(type.follow_status)
      type.subject = subjects.get(type.subject)
      type.is_course = course.get(type.is_course)
      type.intention_option = intention.get(type.intention_option)
      return type
    },
    dataArr(state) {
      let data = state.data
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

      var gender = new Map([
        [1, "男"],
        [2, "女"]
      ])
      var follow = new Map([
        [1, "待分配"],
        [2, "已分配"],
        [3, "跟进中"],
        [4, "已调库"],
        [5, "已移出"],
      ])

      var age = new Map([
        [5, "5岁"],
        [6, "6岁"],
        [7, "7岁"],
        [8, "8岁"],
        [9, "9岁"],
        [10, "10岁"],
        [11, "11岁"],
        [12, "12岁"],
        [13, "13岁"],
        [14, "14岁"],
        [15, "15岁"],
        [16, "16岁"],
        [17, "17岁"],
        [18, "18岁"],
        [19, "19岁"],
        [20, "20岁"]
      ])

      return data.map(element => {
        if (state.status == 1) {
          var phone = element.mobile.toString()
          var str = phone.split('')
          for (let i = 0; i < str.length; i++) {
            if (i === 3 | i === 4 | i === 5 | i === 6) {
              str[i] = '*'
            }
          }
          element.mobile = str.join("")
        }
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
