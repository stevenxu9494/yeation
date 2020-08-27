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
        <div class="iconText" @click="selectItem(item, index)" v-for="(item, index) in categories" :key="index" :class="[index === nowIndex ? 'active' : '']">
          {{item.category}}
        </div>
      </scroll-view>
      <scroll-view class="right" scroll-y="true" :scroll-top='scrollTop'>
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
          <div class="item" v-for="item in ListData" :key="item" @click="goodsdetails(item.id)">
            <!-- <img :src="item.wap_banner_url" alt=""> -->
            <img :src="item.thumbUrl">
            <!-- <span>{{item.thumbUrl}}</span> -->
            <span>{{item.name}}</span>
          </div>
          <div>{{openid}}</div>
        </div>
      </scroll-view>
    </div>
  </div>
</template>

<script>
import { showLoading, hideLoading } from '../../utils/loading'
export default {
  data () {
    return {
      categories: [],
      ListData:[],
      openid:"",
      nowIndex: 0,
      nowItem: "奶粉",
      goodsid:"",
      scrollTop: 0
      // listData: [],
      // id: '1005000',
      // detailData: {}
    }
  },
  onShow () {
    this.nowItem = "奶粉"
    this.nowIndex = 0
    this.getListData()
    this.selectItem(this.nowItem, this.nowIndex) 
    this.getCategories()  
    // this.onGotUserInfo()
  },
  methods: {    
    getCategories() {
      showLoading('加载中...');
      wx.cloud.callFunction({
        name: 'getcategories',
        success: res => {
          hideLoading()
          this.categories = res.result.data
          this.nowItem = res.result.data[0]
        },
        fail: err => {
          hideLoading()
          console.error('[云函数] [getcategories] 调用失败', err)
        }
      })
    },
    getListData() {
      showLoading('加载中...');
      wx.cloud.callFunction({
        name: 'getlistdata',
        data: {
          category: this.nowItem||'奶粉'
        },
        success: res => {
          hideLoading()
          this.ListData = res.result.data
        },
        fail: err => {
          hideLoading()
          console.error('[云函数] [getlistdata1] 调用失败', err)
        }
      })
    },
    goTop: function (e) {  // 一键回到顶部
      if (wx.pageScrollTo) {
        wx.pageScrollTo({
          scrollTop: 0
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '当前微信版本过低，暂无法使用该功能，请升级后重试。'
        })
      }
    },
    selectItem (item, index) {
      // 获取右边商品的数据
      showLoading('加载中...');
      this.nowIndex = index
      this.nowItem = item.category
      // console.log(this.nowIndex)
      // console.log(this.nowItem)
      this.getListData()
    },
    goodsdetails(id) {
      console.log(id)
      wx.navigateTo({
        url: '../goodsdetails/main?id=' + id
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import './style.less';
</style>