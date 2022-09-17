import {
  config
} from '../../config/index';

import {
  checkUserLoginStatus
} from '../../model/usercenter';

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
/** 添加购物车 */
export function addCartGroupData(params) {
  return new Promise((resolve) => {
    checkUserLoginStatus(() => {
      wx.request({
        url: 'https://r-cf.com/web/shopCart/add',
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          'Authorization': wx.getStorageSync('userToken')
        },
        data: {
          'itemId': params,
          'quantity': 1
        },
        success: function (res) {
          console.log('rjl6');

          if (res.data.errorMsg) {
            wx.showToast({
              title: res.data.errorMsg,
              icon: 'error'
            });
          } else {
            wx.showToast({
              title: '加入购物车成功',
            });
          }
        },
        fail: function (err) {
          wx.showToast({
            title: err,
            icon: 'error'
          });
        }
      })
    }, (error) => {
      wx.showToast({
        title: error,
      })
    });
  });
}


/** 获取购物车数据 */
export default function fetchCartGroupData(params) {
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
    console.log('zdy-购物车---获取token：', token)

    wx.request({
      url: 'https://r-cf.com/web/shopCart/listAll',
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