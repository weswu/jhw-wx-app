/*
 * @author: wes
 * @date: 2017-7-28
 * @desc: 时间格式化
*/
function formatTime(date) {
  date = new Date(date)
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
/*
 * @author: wes
 * @date: 2017-7-28
 * @desc: 图片缩略图
*/
function picUrl(src, number) {
  var url = src;
  if (src == null || src.length == 0) return 'http://img.jihui88.com/upload/j/j2/jihui88/picture/2015/04/01/72041ac7-51fa-4163-906d-8b576955d29e.jpg';
  if (number > 10) {
    url = url + '!' + number
  } else {
    var url2 = url.substring(url.lastIndexOf(".") + 1, url.length);
    url = url.substring(0, url.lastIndexOf(".")) + "_" + number + "." + url2;
  }

  return url ? url : '';
}

module.exports = {
  formatTime: formatTime,
  picUrl: picUrl
}
