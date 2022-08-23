import { config } from '../../config/index';
import Toast from 'tdesign-miniprogram/toast/index';

/** 获取商品列表 */
function mockFetchGood(ID = 0) {
  const { delay } = require('../_utils/delay');
  const { genGood } = require('../../model/good');
  return delay().then(() => genGood(ID));
}

/** 获取商品列表 */
export function fetchGood(ID = 0) {
  console.log('rjl___itemtId+'+ID);
  if (!config.useMock) {
    return mockFetchGood(ID);
  }
  return new Promise((resolve) => {
    wx.request({
      url: 'http://47.98.117.117/web/item/detail',
      method: 'GET',
      header: {
        'Content-Type':'application/json',
        'Authorization':wx.getStorageSync('userToken')
      },
      data: {
          'itemId':ID,
      },
      success:function(res){
        if (res.data.errorMsg) {
          Toast({
            context: this,
            selector: '#t-toast',
            message: res.data.errorMsg,
          });
        }
        else {
          resolve(res.data.data)
          Toast({
            context: this,
            selector: '#t-toast',
            message: '商品详情拉取成功',
          });
        }
     },
     fail:function(err) {
          console.log('rjl');  
     }
    })
  });
}
