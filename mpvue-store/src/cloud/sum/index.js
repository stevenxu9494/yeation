// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  console.log(context)
  return {
    sum: event.a + event.b
  }
}