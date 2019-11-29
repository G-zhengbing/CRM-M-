const ADVER_URL = "http://192.168.1.101:3000/api/banner" //广告列表
const ADDADVER_URL = "http://192.168.1.101:3000/api/ad" //新增广告
const DELEADVER_URL = "http://192.168.1.101:3000/api/delete_banner" //删除广告
const ADVEUPDOWN_URL = "http://192.168.1.101:3000/api/line" //广告上线/下线

const SPECIAL_URL = "http://192.168.1.101:3000/api/event" //专题列表
const DELESPECIAL_URL = "http://192.168.1.101:3000/api/delete_event" //删除专题
const SPECIALUPDOWN_URL = "http://192.168.1.101:3000/api/line_event" //专题上线/下线
const ADDSPECIAL_URL = "http://192.168.1.101:3000/api/store_event" //新建专题
const UPDATASPECIAL_URL = "http://192.168.1.101:3000/api/modify_event" //修改专题

const CURR_URL = "http://192.168.1.101:3000/api/product_list" //课程列表
const ADDCURR_URL = "http://192.168.1.101:3000/api/create_products" //新增课程
const CURRSHOW_URL = "http://192.168.1.101:3000/api/update_show" //课程首页显示状态
const CURRUPDOWN_URL = "http://192.168.1.101:3000/api/update_status" //课程上线/下线
const DELECURR_URL ="http://192.168.1.101:3000/api/delete_products" //删除课程

const DATA_URL ="http://192.168.1.101:3000/api/materials" //资料列表
const ADDDATA_URL = "http://192.168.1.101:3000/api/store_material" //新建资料
const DELEDATA_URL = "http://192.168.1.101:3000/api/delete_material" //删除资料
const DATASHOW = "http://192.168.1.101:3000/api/line_material" //资料首页显示状态
const UPDATADATA_URL = "http://192.168.1.101:3000/api/modify_material" //修改资料


export {
  ADVER_URL,
  ADDADVER_URL,
  DELEADVER_URL,
  SPECIAL_URL,
  DELESPECIAL_URL,
  ADVEUPDOWN_URL,
  SPECIALUPDOWN_URL,
  ADDSPECIAL_URL,
  UPDATASPECIAL_URL,
  CURR_URL,
  ADDCURR_URL,
  CURRSHOW_URL,
  CURRUPDOWN_URL,
  DELECURR_URL,
  DATA_URL,
  ADDDATA_URL,
  DELEDATA_URL,
  DATASHOW,
  UPDATADATA_URL
}
