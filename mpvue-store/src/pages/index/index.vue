<template>
  <div class="index">
    <!-- 头部搜索 -->
    <div class="search">
      <!-- <div @click="toMappage">{{ cityName }}</div> -->
      <div @click="toSearch">
        <input type="text" placeholder="搜索商品" />
        <span class="icon"></span>
      </div>
    </div>
    <div class="swiper">
      <swiper class="swiper-container" indicator-dots="true" autoplay="true" interval="3000" circular="true" duration="500">
        <block v-for="(item, index) in banner" :key="index">
          <swiper-item class="swiper-item">
            <image class="slide-image" :src="item.address" mode='widthFix'/>
          </swiper-item>
        </block>
      </swiper>
    </div>
    <!-- <div class="channel">
      <div v-for="(item, index) in channel" :key="index" @click="categoryList(item.id)">
        <img :src="item.icon_url" alt="">
        <p>{{item.name}}</p>
      </div>
    </div> -->
    <div class="brand">
      <div class="head">
        品牌制造商直供
      </div>
    </div>
    <div class="newgoods hotgoods">
      <div class="newgoods-top" @click="goodsList()">
        <div class="top">
          <p>
            人气推荐
            <span></span>
            好物精选
          </p>
          <p>查看全部</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      banner:[],
      channel:[],
      brandList:[],
      newGoods:[],
      hotGoods:[],
      topicList:[],
      newCategoryList:[]
    }
  },

  mounted() {
    this.getData()
  },
  methods: {
    // async getData() {
    //   // http://localhost:5757/lm/index/index
    //   const data = await get('/index/index') 
    //   this.banner = data.banner
    //   this.channel = data.channel
    //   this.brandList = data.brandList
    //   this.newGoods = data.newGoods
    //   this.hotGoods = data.hotGoods
    //   this.topicList = data.topicList
    //   this.newCategoryList = data.newCategoryList
    // },
    getData() {
      wx.cloud.callFunction({
        name: 'banner',
        success: res => {
          // console.log('云函数调用成功')
          // console.log(res.result.data)
          this.banner = res.result.data
        },
        fail: err => {
          // console.error('[云函数] [getlistdata2] 调用失败', err)
        }
      })
    },

    toSearch () {
      wx.navigateTo({
        url: '/pages/mysearch/main'
      })
    },
    categoryList (id) {
      // console.log(123)
      wx.navigateTo({
        url: '/pages/categorylist/main?id=' + id
      })
    },
    branddetail (id) {
      wx.navigateTo({
        url: '/pages/branddetail/main?id=' + id
      })
    },
    tobrandList () {
      wx.navigateTo({
        url: '/pages/brandlist/main'
      })
    },
    goodsList () {
      wx.switchTab({
        url: '/pages/goodslist/main'
      })
    },
    topicdetail (id) {
      wx.navigateTo({
        url: '/pages/topicdetail/main?id=' + id
      })
    }
  }
}
</script>

<style lang="less" scoped> 
  @import "./style.less";
</style>