const requestInfo = {
  requestUrl: "https://r-cf.com",
  loginApi: "/api/user/thirdLogin"
}

const userInfo = {
  avatarUrl: null,
  nickName: null,
  phoneNumber: null,
  gender: 2,
  sessionId: "",
  loginCode: "",
};
const countsData = [{
    num: 2,
    name: '积分',
    type: 'point',
  },
  {
    num: 10,
    name: '优惠券',
    type: 'coupon',
  },
];

const orderTagInfos = [{
    orderNum: 1,
    tabType: 5,
  },
  {
    orderNum: 1,
    tabType: 10,
  },
  {
    orderNum: 1,
    tabType: 40,
  },
  {
    orderNum: 0,
    tabType: 0,
  },
];

const customerServiceInfo = {
  servicePhone: '4006336868',
  serviceTimeDuration: '每周三至周五 9:00-12:00  13:00-15:00',
};

export function genSimpleUserInfo() {
  return ({
    avatarUrl: userInfo.avatarUrl,
    nickName: userInfo.nickName,
    phoneNumber: userInfo.phoneNumber,
    gender: userInfo.gender,
  })
};

export function genUsercenter() {
  return {
    userInfo,
    countsData,
    orderTagInfos,
    customerServiceInfo,
  };
}

export function updateUserInfoWithWeChat(s) {
  console.log('获取用户信息')
  wx.request({
    url: 'https://r-cf.com/web/user/profile',
    method: 'GET',
    header: {
      'Content-Type': 'application/json',
      'Authorization': wx.getStorageSync('userToken')
    },
    success: function (res) {
      if (res?.data?.data?.avatarUrl != null && res?.data?.data?.nickName != null) {
        userInfo.avatarUrl = res.data.data.avatarUrl;
        userInfo.nickName = res.data.data.nickName;
        console.log('zdy---用户信息请求成功' + res.data.data.avatarUrl);
        s(userInfo);
      } else {
        console.log('zdy---用户信息请求成功但是无数据');
        wx.getUserProfile({
          desc: '用于完善会员资料',
          success: (res) => {
            userInfo.avatarUrl = res.userInfo.avatarUrl;
            userInfo.nickName = res.userInfo.nickName;
            wx.request({
              url: 'https://r-cf.com/web/user/profile/update',
              method: 'POST',
              header: {
                'Content-Type': 'application/json'
              },
              data: {
                'avatarUrl': userInfo.avatarUrl,
                'nickName': userInfo.nickName
              },
              success: function (res) {},
              fail: function (err) {}
            })
            s(userInfo);
          },
          fail: () => {
            userInfo.avatarUrl = "https://we-retail-static-1300977798.cos.ap-guangzhou.myqcloud.com/retail-ui/components-exp/avatar/avatar-1.jpg";
            userInfo.nickName = "微信用户";
            s(userInfo);
          }
        })
      }
    },
    fail: function (err) {
      console.log('zdy---用户信息失败');
      userInfo.avatarUrl = "https://we-retail-static-1300977798.cos.ap-guangzhou.myqcloud.com/retail-ui/components-exp/avatar/avatar-1.jpg";
      userInfo.nickName = "微信用户";
      s(userInfo)
    }
  })



}


export function checkUserLoginStatus(s, f) {

  if (wx.getStorageSync('userToken').length > 0) { //已登陆 获得用户session
    updateUserInfoWithWeChat(s)
  } else { //未登录
    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求
          userInfo.loginCode = res.code
          wx.request({
            url: 'https://r-cf.com/web/user/thirdLogin',
            method: 'POST',
            header: {
              'Content-Type': 'application/json'
            },
            data: {
              'source': 1,
              'code': userInfo.loginCode
            },
            success: function (res) {
              if (res?.data?.data?.token) {
                wx.setStorageSync('userToken', res.data.data.token)
                console.log('zdy-----登录成功')
                updateUserInfoWithWeChat(s)
              } else {
                console.log('zdy-----接口报错：' + res?.data?.errorMsg)
                f(res.data.errorMsg)
              }
            },
            fail: function (err) {
              console.log('zdy-----请求失败' + err.errMsg);
              f(err.errMsg)
            }
          })
          console.log('登录成功' + res.code)
        } else {
          console.log('zdy-----登录失败！' + res.errMsg)
          f(err.errMsg)
        }
      }
    });
  }
}