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
export default {
  data () {
    return {
      categories: [],
      ListData:[],
      openid:"",
      nowIndex: 0,
      nowItem: "奶粉",
      goodsid:"",
      scrollTop: ''
      // listData: [],
      // id: '1005000',
      // detailData: {}
    }
  },
  onShow () {
    this.getListData()
    this.selectItem(this.nowItem, this.nowIndex) 
    this.getCategories()  
    // this.onGotUserInfo()
  },
  methods: {    
    getCategories() {
      wx.cloud.callFunction({
        name: 'getcategories',
        success: res => {
          this.categories = res.result.data
        },
        fail: err => {
          console.error('[云函数] [getcategories] 调用失败', err)
        }
      })
    },
    getListData() {
      wx.cloud.callFunction({
        name: 'getlistdata',
        data: {
          category: this.nowItem||'奶粉'
        },
        success: res => {
          this.ListData = res.result.data
        },
        fail: err => {
          console.error('[云函数] [getlistdata1] 调用失败', err)
        }
      })
    },
    selectItem (item, index) {
      // 获取右边商品的数据
      this.nowIndex = index
      this.nowItem = item.category
      console.log(this.nowIndex)
      console.log(this.nowItem)
      wx.cloud.callFunction({
        name: 'getlistdata',
        data: {
          category: this.nowItem
        },
        success: res => {
          console.log('云函数调用成功')
          console.log(res.result.data)
          this.ListData = res.result.data
        },
        fail: err => {
          console.error('[云函数] [getlistdata2] 调用失败', err)
        }
      })
    },
    goodsdetails(id) {
      console.log(id)
      wx.navigateTo({
        url: '../goodsdetails/main?id=' + id
      })
    }
    // onGotUserInfo: function(){
    //   //将this对象保存到that中
    //   wx.cloud.callFunction({
    //     name: 'login',
    //     success: res => {
    //       console.log('云函数调用成功')
    //       console.log(res.result.openid)
    //       this.openid = res.result.openid
    //     },
    //     fail: err => {
    //       console.error('[云函数] [login] 调用失败', err)
    //     }
    //   })
    // }
  }
}
</script>

<style lang="less" scoped>
@import './style.less';
</style>