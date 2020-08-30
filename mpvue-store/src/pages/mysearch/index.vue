<template>
  <div class="search">
    <div class="head">
      <div>
        <!-- v-model双向绑定 -->
        <!-- @focus允许聚焦(点击时结果隐藏，显示搜索内容及联想) -->
        <!-- @input实时联想 -->
        <!-- @confirm点击搜索-->
        <img src="http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/search2-2fb94833aa.png" alt="">
        <input type="text" confirm-type="search" focus="true" v-model="words" @focus="inputFocus" @input="tipsearch" @confirm="searchWords" placeholder="商品搜索">
        <img @click="clearInput" class="del" src="http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/clearIpt-f71b83e3c2.png" alt="">
      </div>
      <div @click="cancel">取消</div>
    </div>
    <div class="searchtips" v-if="words">
      <div v-if="tipsData.length != 0">
        <div v-for="(item, index) in tipsData" :key="index" @click="searchWords" :data-value="item.name">
          {{item.name}}
        </div>
      </div>
      <div class="nogoods" v-else>数据库暂无此类商品...</div>
    </div>
    <div class="history" v-if="historyData.length!==0">
      <div class="t">
        <div>历史记录</div>
        <div @click="clearHistory"></div>
      </div>
      <div class="cont">
        <!-- 赋值给event物品的名称 -->
        <div v-for="(item, index) in historyData" :key="index" @click="searchWords" :data-value="item.keyword">
          {{item.keyword}}
        </div>
      </div>
    </div>    
    <!-- 热门搜索 -->
    <!-- <div class="history hotsearch">
      <div class="t">
        <div>热门搜索</div>
      </div>
      <div class="cont">
        <div v-for="(item, index) in hotData" :key="index" :class="{active: item.is_hot === 1}" @click="searchWords" :data-value="item.keyword">
          {{item.keyword}}
        </div>
      </div>
    </div> -->
    <!-- 商品列表 -->
    <div class="goodsList" v-if="listData.length!==0">
      <div class="sortnav">
        <div @click="changeTab(0)" :class="[0 === nowIndex ? 'active' : '']">综合</div>
        <div @click="changeTab(1)" :class="[1 === nowIndex ? 'active' : '']" class="price">价格</div>
        <div @click="changeTab(2)" :class="[2 === nowIndex ? 'active' : '']">分类</div>
      </div>
      <div class="sortlist">
        <div @click="goodsDetail(item.id)" class="item" v-for="(item, index) in listData" :key="index">
          <img :src="item.thumbUrl" alt="">
          <p class="name">{{item.name}}</p>
          <p v-if="item.price !== 0" class="price">¥{{item.sellPrice}}</p>
          <p v-else class="price">价格波动，请联系客服</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { showLoading, hideLoading } from '../../utils/loading'
export default {
  data () {
    return {
      words: '',
      historyData: [],
      openid: '',
      hotData: [],
      tipsData: [],
      order:'',
      listData:[],
      nowIndex: 0
    }
  },
  onShow () {
    // 获取用户id
    this.openid = wx.getStorageSync('openid') || '';
    this.getHistoryData()
  },
  methods: {
    clearInput() {
      this.words = ''
      this.listData = []
    },
    cancel() {
      wx.navigateBack({
        delta: 1
      })
    },
    clearHistory() {
      showLoading('加载中...');
      wx.cloud.callFunction({
        name: 'search',
        data: {
            type: "delete",
            openid: this.openid
          },
        success: res => {
          hideLoading();
          this.historyData = []
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 1500
          })
        },
        fail: err => {
          console.error('[云函数] [login] 调用失败', err)
        }
      }) 
    },
    inputFocus() {
      // 商品清空
      this.listData = []
      // 展示搜索提示信息
      this.tipsearch()
    },
    tipsearch() {
      // 因为v-model双向绑定，实时获得keyword
      wx.cloud.callFunction({
        name: 'search',
        data: {
            type: "gettips",
            keyword: this.words,
            order: this.order
          },
        success: res => {
          this.tipsData = res.result.data
          console.log(this.tipsData)
        },
        fail: err => {
          console.error('[云函数] [login] 调用失败', err)
        }
      }) 
    },
    // 异步请求，回车之后绑定搜索值words
    searchWords(e) {
      // 取出赋值给event的物品名称
      let value = e.currentTarget.dataset.value
      // 搜索或者点击的名称赋值给words
      this.words = value || this.words
      console.log(this.words)
      wx.cloud.callFunction({
        name: 'search',
        data: {
            type: "check",
            openid:this.openid,
            keyword: value || this.words
          },
        success: res => {
          if (res.result.data.length === 0){
            wx.cloud.callFunction({
              name: 'search',
              data: {
                  type: "insert",
                  openid:this.openid,
                  keyword: value || this.words
                },
              success: res => {
                console.log("搜索内容插入成功")
              },
              fail: err => {
                console.error('[云函数] [login] 调用失败', err)
              }
            }) 
          } else {
            console.log("已经存在数据")
          }
        },
        fail: err => {
          console.error('[云函数] [login] 调用失败', err)
        }
      })       
      // console.log(data)
      // 获取历史数据
      this.getHistoryData()
      this.getlistData()
    },
    getHistoryData () {
      wx.cloud.callFunction({
        name: 'search',
        data: {
            type: "get",
            openid:this.openid
          },
        success: res => {
          hideLoading()
          this.historyData = res.result.data
        },
        fail: err => {
          hideLoading()
          console.error('[云函数] [login] 调用失败', err)
        }
      }) 
    },
    getlistData () {
      showLoading('加载中...');
      wx.cloud.callFunction({
        name: 'search',
        data: {
            type: "gettips",
            keyword: this.words,
            order: this.order
          },
        success: res => {
          hideLoading()
          this.listData = res.result.data
          this.tipsData = []
        },
        fail: err => {
          hideLoading()
          console.error('[云函数] [login] 调用失败', err)
        }
      }) 
    },
    changeTab(index) {
      // 点击分类每次都产生一次接口请求
      this.nowIndex = index
      if (index === 1) {
        this.order = this.order == 'asc' ? 'desc' : 'asc'
      } else {
        this.order = ''
      }
      console.log(this.order)
      this.getlistData()
    },
    goodsDetail (id) {
      wx.navigateTo({
        // 带形参去新的页面
        url: '/pages/goodsdetails/main?id=' + id
      });
    }
  }
}
</script>

<style lang='less' scoped>
@import './style';
</style>