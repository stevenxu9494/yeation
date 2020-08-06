<template>
  <div class="category">
    <!-- <div class="search" @click="tosearch"> -->
    <div class="search">
      <div class="ser">
        <span class="icon"></span>
        <span>商品搜索，共239款好物</span>
      </div>
    </div>
    <div class="content">
      <scroll-view class="left" scroll-y="true">
        <!-- <div class="iconText" @click="selectItem(item.id, index)" v-for="(item, index) in listData" :key="index" :class="[index === nowIndex ? 'active' : '']"> -->
        <div class="iconText" v-for="(item, index) in categories" :key="index">
          {{item}}
        </div>
      </scroll-view>
      <scroll-view class="right" scroll-y="true">
        <!-- <div class="banner">
          <img :src="detailData.banner_url" alt="">
        </div>
        <div class="title">
          <span>-</span>
          <span>{{detailData.name}}分类</span>
          <span>-</span>
        </div> -->
        <div class="bottom">
          <!-- <div class="item" @click="categoryList(item.id)" v-for="(item, index) in detailData.subList" :key="index"> -->
          <div class="item">
            <!-- <img :src="item.wap_banner_url" alt=""> -->
            <span>奶粉A</span>
            <span>奶粉B</span>
            <span>奶粉C</span>
            <span>奶粉D</span>
          </div>
          <div>{{openid}}</div>
        </div>
      </scroll-view>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      categories: [],
      products:[],
      openid:""
      // listData: [],
      // nowIndex: 0,
      // id: '1005000',
      // detailData: {}
    }
  },
  onShow () {
    // this.getListData()
    // this.selectItem(this.id, this.nowIndex)
    this.getListData()
    this.onGotUserInfo()
  },
  methods: {
    getListData() {
      wx.cloud.callFunction({
      name: 'getdata',
      success: res => {
        console.log('云函数调用成功')
        console.log(res.result.data)
        this.categories = res.result.data[0].categories
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
    },
    onGotUserInfo: function(){
    //将this对象保存到that中
    wx.cloud.callFunction({
      name: 'login',
      success: res => {
        console.log('云函数调用成功')
        console.log(res.result.openid)
        this.openid = res.result.openid
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  }
  }
}
</script>

<style lang="less" scoped>
@import './style.less';
</style>