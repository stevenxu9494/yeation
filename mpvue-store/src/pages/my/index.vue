<template>
  <div class="my">
    <div class="myinfo">      
      <open-data type="userAvatarUrl" class="avatar"></open-data>
      <div>
        <open-data type="userNickName" class="nickname"></open-data>
      </div>
    </div>
    <div class="iconlist">
      <div @click="goTo(item.url)" v-for="(item, index) in listData" :key="index">
        <span class="iconfont" :class="item.icon"></span>
        <span>-{{item.title}}-</span>
      </div>
    </div>
  </div>
</template>

<script>
import { showLoading, hideLoading } from '../../utils/loading'
export default {
  data() {
    return {
      listData: [
        {
          title: "我的订单",
          icon: "icon-unie64a",
          url: "/pages/myorderlist/main"
        },
        {
          title: "优惠券",
          icon: "icon-youhuiquan",
          url: ""
        },
        {
          title: "我的足迹",
          icon: "icon-zuji",
          url: ""
        },
        {
          title: "我的收藏",
          icon: "icon-shoucang",
          url: "/pages/collectlist/main"
        },
        {
          title: "地址管理",
          icon: "icon-dizhiguanli",
          url: "/pages/myaddress/main"
        },
        {
          title: "联系客服",
          icon: "icon-lianxikefu",
          url: ""
        },
        {
          title: "帮助中心",
          icon: "icon-bangzhuzhongxin",
          url: ""
        },
        {
          title: "意见反馈",
          icon: "icon-yijianfankui",
          url: ""
        }
      ],
      avator: 'http://yanxuan.nosdn.127.net/8945ae63d940cc42406c3f67019c5cb6.png',// 默认
      allcheck: false,
      userInfo: {},
      Listids: []
    };
  },
  onShow () {
    // if (login()) {
    //   this.userInfo = login()
    //   console.log(this.userInfo)
    //   this.avator = this.userInfo.avatarUrl
    // }
  },
  methods: {
    goTo (url) {
      if(url!= ""){
        wx.navigateTo({
          url: url
        });     
      }else{
        wx.showToast({
          title: '功能暂未开发',
          icon: 'none',
          duration: 1500,
          mask: false,
          success: res => {}
        })
      }   
    }
  }
};
</script>

<style lang="less" scoped>
@import "./style.less";
</style>