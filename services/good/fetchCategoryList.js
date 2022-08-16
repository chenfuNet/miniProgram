import {
  config
} from '../../config/index';

/** 获取商品列表 */
function mockFetchGoodCategory() {
  const {
    delay
  } = require('../_utils/delay');
  const {
    getCategoryList
  } = require('../../model/category');
  return delay().then(() => getCategoryList());
}

/** 获取商品列表 */
export function getCategoryList() {
  // if (config.useMock) {
  // return mockFetchGoodCategory();
  // }
  return new Promise((resolve) => {
    wx.request({
      url: 'http://8.136.244.224/web/category/tree',
      method: 'GET',
      header: {
        'Content-Type': 'application/json',
        'Authorization': wx.getStorageSync('userToken')
      },
      success: function (res) {
        if (res) {
          resolve(res.data.data);
        }
      },
      fail: function (err) {
        console.log('rjl');
      }
    })
  });
}