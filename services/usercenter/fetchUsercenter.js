import {
  config
} from '../../config/index';

import {
  updateUserInfoWithWeChat,
  checkUserLoginStatus
} from '../../model/usercenter';

/** 获取个人中心信息 */
function mockFetchUserCenter() {
  const {
    delay
  } = require('../_utils/delay');
  const {
    genUsercenter
  } = require('../../model/usercenter');

  return delay(200).then(() => {
    var result = genUsercenter();
    result.userInfo.nickName = "abbbbdasd";
    return result;
  });
}


/** 获取个人中心信息 */
export function fetchUserCenter() {
  if (config.useMock) {
    return mockFetchUserCenter();
  }


  return new Promise((resolve) => {
    resolve('real api');
  });
}

export function updateWeChatUserInfo(s) {
  checkUserLoginStatus((res) => {
    console.log('验证登陆状态成功')
    //updateUserInfoWithWeChat(s);
    s(res)
    console.log('获取缓存token:', wx.getStorageSync('userToken'))
  }, (error) => {
    wx.showToast({
      title: error,
    })
  });
}

export function checkWechatUserLoginStatus(callback) {
  checkUserLoginStatus(callback, () => {

  });
}