import {
  config
} from '../../config/index';

/** 获取购物车mock数据 */
function mockFetchCartGroupData(params) {
  const {
    delay
  } = require('../_utils/delay');
  const {
    genCartGroupData
  } = require('../../model/cart');

  return delay().then(() => genCartGroupData(params));
}

/** 获取购物车数据 */
export function fetchCartGroupData(params) {
  // if (config.useMock) {
  //   return mockFetchCartGroupData(params);
  // }

  return new Promise((resolve) => {

    const {
      delay
    } = require('../_utils/delay');
    const {
      genCartGroupData
    } = require('../../model/cart');

    let token = wx.getStorageSync('userToken');
    console.log('获取token：',token)

    wx.request({
      url: 'http://47.98.117.117/web/shopCart/listAll',
      method: 'GET',
      header: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      data: params,
      success: function (res) {
        if (res.data.errorMsg) {
          console.log('zdy-购物车----接口报错：' + res.data.errorMsg)
        } else {
          console.log('zdy-购物车---请求成功：' + res.data)
          resolve(delay().then(() => genCartGroupData(res.data)));
        }
      },
      fail: function (err) {
        console.log('zdy-购物车----请求失败' + err.errMsg);
      }
    })
  });
}