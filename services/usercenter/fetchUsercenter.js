import {
  config
} from '../../config/index';

/** 获取个人中心信息 */
function mockFetchUserCenter() {
  const {
    delay
  } = require('../_utils/delay');
  const {
    genUsercenter
  } = require('../../model/usercenter');
  return delay(200).then(() => genUsercenter());
}


/** 获取个人中心信息 */
export function fetchUserCenter() {
  wx.showLoading({
    title: '刷新中',
  })
  if (config.useMock) {
    var result = mockFetchUserCenter()

    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (res) => {
        console.log(res.userInfo);
        wx.showToast({
          title: res.userInfo.nickName,
        })
      }
    })

    wx.showToast({
      title: 'toast',
    })

    return result;

  }


  return new Promise((resolve) => {
    resolve('real api');
  });
}