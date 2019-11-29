<template>
  <div class="box">
    <div class="section-right-top">
      <ul>
        <li style="margin:0;" @click="goDaiban">
          <p>资源池</p>
          <span>{{resource_pool}}</span>
        </li>
        <li @click="goPublic">
          <p>公共资源池</p>
          <span>{{public_resource_pool}}</span>
        </li>
        <li @click="goNotVisit">
          <p>今日新分</p>
          <span>{{no_follow_up}}</span>
        </li>
        <li @click="goFollowUp">
          <p>今日回访</p>
          <span>{{next_follow_time}}</span>
        </li>
        <li @click="goNotCallBack">
          <p>逾期未回访</p>
          <span>{{no_return_visit}}</span>
        </li>
        <li @click="goMoney">
          <p>成单金额</p>
          <span>{{single_amoun}}</span>
        </li>
        <li @click="goNumber">
          <p>成单数</p>
          <span>{{single_quantity}}</span>
        </li>
      </ul>
    </div>
    <ul v-if="cId == 1">
      <li @click="tab(1)" :class="[num == 1? 'active':'']">
        <span>工作台</span>
      </li>
      <li @click="tab(2)" :class="[num == 2? 'active':'']">
        <span>数据量</span>
      </li>
    </ul>
    <div class="section-right-bottom">
      <div v-if="$store.state.cId == 1">
        <div v-show="num == 1" class="section-right-bottom-one">
          <div id="myCharts3" ref="zhu" style="width:100%;height:500px;"></div>
        </div>
        <div v-show="num ==2" class="section-right-bottom-tow">
          <div id="myCharts2" ref="bing" style="width:100%;height:500px;"></div>
          <div id="myCharts1" ref="zhe" style="width:100%;height:500px;"></div>
        </div>
      </div>
      <div v-else class="center">
        <img src="../assets/img/xiaoshou/png24.png" alt />
        <span>销售小姐姐们加油 ~</span>
      </div>
    </div>
    <Loading v-show="isLoading" />
  </div>
</template>

<script>
import echarts from "echarts";
import storage from "../uilt/storage";
import { mapState,mapMutations } from "vuex";
import axios from "axios";
import { HOMEDATA } from "../uilt/url/url";
import Loading from "../uilt/loading/loading";
export default {
  components: {
    Loading
  },
  mounted() {
    this.getHomeData(1).then(res => {
      setTimeout(() => {
        this.setEachart();
      }, 1000);
    });
  },
  data() {
    return {
      isLoading: false,
      bingzhuang: [],
      zhexian: [],
      data: [],
      num: 1,
      next_follow_time: 0, //今日回访
      no_follow_up: 0, //今日新分
      no_return_visit: 0, //预期未回访
      public_resource_pool: 0, //公共资源池
      resource_pool: 0, //资源池
      single_amoun: 0, //成单金额
      single_quantity: 0 //成单数
    };
  },
  methods: {
    ...mapMutations(["setNum"]),
    getHomeData() {
      return new Promise((resolve, reject) => {
        axios({
          method: "post",
          url: HOMEDATA,
          params: {
            type: this.num
          },
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            Authorization: "bearer " + storage.get()
          }
        })
          .then(res => {
            this.next_follow_time = res.data.data.next_follow_time;
            this.no_follow_up = res.data.data.no_follow_up;
            this.no_return_visit = res.data.data.no_return_visit;
            this.public_resource_pool = res.data.data.public_resource_pool;
            this.overdu_pool = res.data.data.overdu_pool;
            this.resource_pool = res.data.data.resource_pool;
            this.single_amoun = res.data.data.single_amoun;
            this.single_quantity = res.data.data.single_quantity;
            this.data = res.data.data.data.week;
            this.zhexian = res.data.data.data.call;
            this.bingzhuang = res.data.data.data.source;
            this.setNum(res.data.data.no_follow_up)
            // console.log(res)
            resolve();
          })
          .catch(e => {
            reject(e);
          });
      });
    },
    goNotCallBack() {
      this.$router.push("/main/notcallback");
    },
    goNumber() {
      this.$router.push("/main/number");
    },
    goMoney() {
      this.$router.push("/main/money");
    },
    goFollowUp() {
      this.$router.push("/main/followup");
    },
    goPublic() {
      this.$router.push("/main/public");
    },
    goNotVisit() {
      this.$router.push("/main/notvisit");
    },
    setEacharts() {
      let echarts1 = this.$echarts.init(document.getElementById("myCharts1"));
      let echarts2 = this.$echarts.init(document.getElementById("myCharts2"));
      // console.log(this.zhexian)
      let appointment = this.zhexian.map(i => {
        return i.day_appointment_count;
      });
      let call_connect = this.zhexian.map(i => {
        return i.day_call_connect_count;
      });
      let call_count = this.zhexian.map(i => {
        return i.day_call_count;
      });
      let day = this.zhexian.map(i => {
        return i.week;
      });

      let data = this.bingzhuang.map(i => {
        return i;
      });
      echarts1.setOption({
        title: {
          text: "数量/人"
        },
        color: ["#8200f8", "#f7010c", "#00a03f"],
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["拨打量", "有效接听", "邀约量"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: day
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: "{value} "
          }
        },
        series: [
          {
            name: "拨打量",
            type: "line",
            data: call_count
          },
          {
            name: "有效接听",
            type: "line",
            data: call_connect
          },
          {
            name: "邀约量",
            type: "line",
            data: appointment
          }
        ]
      });
      echarts2.setOption({
        title: {
          text: "工作量/本周",
          x: "center"
        },
        color: ["#1b74b0", "#df2d3b", "#e8a928", "#810beb", "#098e3d"],
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: [
            "外部推广渠道",
            "自建私域流量",
            "公司自营渠道",
            "转介绍",
            "自然注册"
          ]
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: "55%",
            radius: [30, 110],
            center: ["50%", "60%"],
            data: data,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(3, 0, 0, 0.5)"
              }
            }
          }
        ]
      });
    },
    goDaiban() {
      this.$router.push("/main/daiban");
    },
    tab(num) {
      this.num = num;
      if (this.num == 1) return;
      this.getHomeData().then(res => {
        setTimeout(() => {
          this.setEacharts();
        }, 1000);
      });
    },
    setEachart() {
      // console.log(this.data)
      let appointment = this.data.map((i, k) => {
        return i.call_connect_count;
      });
      let call_connect = this.data.map(i => {
        return i.appointment_count;
      });
      let call_count = this.data.map(i => {
        return i.audition_count;
      });
      let week = this.data.map(i => {
        return i.order_count;
      });
      let echarts3 = this.$echarts.init(document.getElementById("myCharts3"));
      var posList = [
        "left",
        "right",
        "top",
        "bottom",
        "inside",
        "insideTop",
        "insideLeft",
        "insideRight",
        "insideBottom",
        "insideTopLeft",
        "insideTopRight",
        "insideBottomLeft",
        "insideBottomRight"
      ];

      app.configParameters = {
        rotate: {
          min: -90,
          max: 90
        },
        align: {
          options: {
            left: "left",
            center: "center",
            right: "right"
          }
        },
        verticalAlign: {
          options: {
            top: "top",
            middle: "middle",
            bottom: "bottom"
          }
        },
        position: {
          options: echarts.util.reduce(
            posList,
            function(map, pos) {
              map[pos] = pos;
              return map;
            },
            {}
          )
        },
        distance: {
          min: 0,
          max: 100
        }
      };

      app.config = {
        rotate: 90,
        align: "left",
        verticalAlign: "middle",
        position: "insideBottom",
        distance: 15,
        onChange: function() {
          var labelOption = {
            normal: {
              rotate: app.config.rotate,
              align: app.config.align,
              verticalAlign: app.config.verticalAlign,
              position: app.config.position,
              distance: app.config.distance
            }
          };
          myChart.setOption({
            series: [
              {
                label: labelOption
              },
              {
                label: labelOption
              },
              {
                label: labelOption
              },
              {
                label: labelOption
              }
            ]
          });
        }
      };

      var labelOption = {
        normal: {
          show: true,
          position: app.config.position,
          distance: app.config.distance,
          align: app.config.align,
          verticalAlign: app.config.verticalAlign,
          rotate: app.config.rotate,
          formatter: "{c}  {name|{a}}",
          fontSize: 16,
          rich: {
            name: {
              textBorderColor: "#fff"
            }
          }
        }
      };

      echarts3.setOption({
        title: {
          text: "单位/%"
        },
        color: ["#04aa58", "#057ad9", "#dcdc0a", "#fb9107"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        legend: {
          data: ["有效接听率", "邀约率", "到课率", "签约率"]
        },
        toolbox: {
          show: true,
          orient: "vertical",
          left: "right",
          top: "center",
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar", "stack", "tiled"] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        xAxis: [
          {
            type: "category",
            axisTick: { show: false },
            data: this.data.map(i => {
              return i.date;
            })
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "有效接听率",
            type: "bar",
            barGap: 0,
            label: labelOption,
            data: appointment
          },
          {
            name: "邀约率",
            type: "bar",
            label: labelOption,
            data: call_connect
          },
          {
            name: "到课率",
            type: "bar",
            label: labelOption,
            data: call_count
          },
          {
            name: "签约率",
            type: "bar",
            label: labelOption,
            data: week
          }
        ]
      });
    }
  },
  computed: {
    ...mapState({
      cId: state => state.cId
    })
  }
};
</script>

<style scoped>
.section-right-bottom-one > div,
.section-right-bottom-tow {
  margin-top: 20px;
  margin-left: 30px;
}
.section-right-bottom-one,
.section-right-bottom-tow {
  display: flex;
}
.center {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.section-right-bottom span {
  font-size: 40px;
  color: #333;
}
.section-right-bottom img {
  width: 388px;
  height: 422px;
  margin-right: 75px;
}
.box .section-right-top ul li span {
  color: #ff0000;
}
.box .section-right-top ul li p {
  border-bottom: 1px solid #aaa;
  width: 100%;
  color: #1b73b0;
}
.box .section-right-top ul li {
  height: 98px;
  border: 1px solid #aaa;
  border-radius: 5px;
  margin-left: 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  font-weight: 600;
}
.box .section-right-top ul {
  display: flex;
  margin: 0 16px;
  width: 100%;
}
.box ul li.active {
  background-color: #1b73b0;
  color: #fff;
}
.box ul li.active span {
  color: #fff;
}

.box .section-right-bottom {
  flex: 1;
  background-color: #fff;
  border-radius: 5px;
  margin-bottom: 10px;
  min-height: 422px;
}

.box .section-right-top {
  background-color: #fff;
  width: 100%;
  height: 140px;
  margin: 10px 0;
  border-radius: 5px;
  min-height: 140px;
  display: flex;
  align-items: center;
}
.box ul li span {
  transform: scale(0.88);
  color: #1b73b0;
  font-size: 16px;
}
.box ul li {
  font-size: 16px;
  flex: 1;
  text-align: center;
  line-height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  cursor: pointer;
}
.box > ul {
  width: 200px;
  height: 34px;
  border: 2px solid #1b73b0;
  box-sizing: border-box;
  border-radius: 3px;
  display: flex;
  margin-bottom: 10px;
}
.box {
  margin: 0 10px;
  display: flex;
  flex-direction: column;
}
section .section-left p {
  margin-top: 13px;
  cursor: pointer;
}
section .section-left p:hover {
  font-weight: 600;
}
section .section-left {
  width: 255px;
  background-color: #edf6fb;
  color: #1b73b0;
  font-size: 20px;
  text-align: center;
}
section .section-left,
.section-right {
  height: 100%;
}
</style>