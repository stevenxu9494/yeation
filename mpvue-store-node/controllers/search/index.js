const { mysql } = require('../../mysql')

// **********************
// *一个表用一个接口请求*
// **********************

async function indexAction(ctx) {
  // 前端带？问号拼接，用query
  const openId = ctx.query.openId
  // 默认关键字（520红包）
  const defaultKeyword = await mysql('nideshop_keywords').where({
    is_default: 1
  }).limit(1).select()
  // 取出热门关键字（单鞋。。。）
  const hotKeywordList = await mysql('nideshop_keywords').distinct('keyword').column('keyword', 'is_hot').limit(10).select()

  // 取出搜索历史表
  const historyData = await mysql('nideshop_search_history').where({
    'user_id': openId
  }).limit(10).select()

  // 往接口输出
  ctx.body = {
    'defaultKeyword': defaultKeyword[0],
    'hotKeywordList': hotKeywordList,
    'historyData': historyData
  }
}


// 搜索时匹配搜索相关的内容
async function helperAction(ctx) {
  // get方法应该用query
  const keyword = ctx.query.keyword
  var order = ctx.query.order
  // 判断order关键词是否存在，不存在以id为排序标准
  // 如果order关键词存在，以价格为排序标准
  if (!order) {
    order = ''
    orderBy = 'id'
  } else {
    orderBy = 'retail_price'
  }

  // like是mysql匹配语法，在name中是否存在%keyword%
  const keywords = await mysql('nideshop_goods').orderBy(orderBy, order)
  .column('id', 'name', 'list_pic_url', 'retail_price')
  .where('name', 'like', '%' + keyword + '%').limit(10).select()
  
  if (keywords) {
    ctx.body = {
      keywords
    }
  } else {
    ctx.body = {
      keywords: []
    }
  }
}


// 添加搜索历史
async function addHistoryAction(ctx) {
  // 解构前端请求
  // 不带?拼接用request
  const {openId, keyword} = ctx.request.body

  // 查找数据库是否存在此用户openId和关键词keyword
  const oldData = await mysql('nideshop_search_history').where({
    'user_id': openId,
    'keyword': keyword
  })
  // 是否存在这条搜索记录
  // 不存在记录即插入用户id、搜索的内容和搜索的时间
  if (oldData.length == 0) {
    const data = await mysql('nideshop_search_history').insert({
      'user_id': openId,
      'keyword': keyword,
      'add_time': parseInt(new Date().getTime() / 1000)
    })
    // 如果插入成功
    if (data) {
      ctx.body = {
        data: 'success'
      }
    // 插入不成功
    } else {
      ctx.body = {
        data: 'fail'
      }
    }
  // 存在记录即不做改变
  } else {
    ctx.body = {
      data: '已经有记录了'
    }
  }
}

// 清除历史记录
async function clearHistoryAction(ctx) {
  const openId = ctx.request.body.openId
  // console.log(openId)
  // await使用mysql的语句，删除历史记录
  const data = await mysql('nideshop_search_history').where({
    'user_id': openId
  }).del()
  // data的回调是总共删除了多少条数据
  if (data) {
    ctx.body = {
      'data': '清除成功'
    }
  } else {
    ctx.body = {
      'data': null
    }
  }
}

module.exports = {
  indexAction,
  addHistoryAction,
  clearHistoryAction,
  helperAction
}