<template>
  <div class="topic">
    <ui class="list">
      <li v-for="(item, index) in topicList" :key="index" @click="topicDetail(item.id)">
        <div class="t-img">
          <img :src="item.scene_pic_url" alt="">
        </div>
        <div class="info">
          <p>{{item.title}}</p>
          <p>{{item.subtitle}}</p>
          <p>{{item.price_info}}元起</p>
        </div>
      </li>
    </ui>
  </div>
</template>

<script>
import { get } from '../../utils'
export default {
  data () {
    return {
      page: 1,
      topicList: [],
      total: ''
    }
  },
  // 小程序自带方法=>下拉刷新
  onPullDownRefresh () {
    this.page = 1
    this.getListData()
    // 下拉完成刷新自动归位
    wx.stopPullDownRefresh()
  },
  // 上拉加载更多
  onReachBottom () {
    this.page = this.page + 1
    // 判断页面是否超出
    if (this.page > this.total) {
      return false
    }
    this.getListData()
  },
  mounted () {
    this.getListData(true)
  },
  methods: {
    // 传first参数
    async getListData (first) {
      const data = await get ('/topic/listaction', {
        page: this.page
      })
      console.log(data)
      this.total = data.total
      // 判断是否是第一次加载页面
      if (first) {
        this.topicList = data.data
      } else {
        // 不是第一次加载页面即拼接页面concat
        this.topicList = this.topicList.concat(data.data)
      }
    },
    topicDetail (id) {
      wx.navigateTo({
        url: '/pages/topicdetail/main?id=' + id
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import './style.less';
</style>