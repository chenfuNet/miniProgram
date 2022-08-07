const requestInfo = {
  requestUrl:"http://8.136.244.224",
  loginApi:"/api/user/thirdLogin"
}

const userInfo = {
  avatarUrl: 'https://we-retail-static-1300977798.cos.ap-guangzhou.myqcloud.com/retail-ui/components-exp/avatar/avatar-1.jpg',
  nickName: 'TDesign1 🌟',
  phoneNumber: '13438358888',
  gender: 2,
  sessionId:"",
  loginCode:"",
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

export function updateUserInfoWithWeChat(s,f) {
  wx.getUserProfile({
    desc: '用于完善会员资料',
    success: (res) => {
      userInfo.avatarUrl = res.userInfo.avatarUrl;
      userInfo.nickName = res.userInfo.nickName;
      s(userInfo);
    },
    fail: () => {
      userInfo.avatarUrl = "https://we-retail-static-1300977798.cos.ap-guangzhou.myqcloud.com/retail-ui/components-exp/avatar/avatar-1.jpg";
      userInfo.nickName = "用户10011";
      s(userInfo);
    }
  })
}


export function checkUserLoginStatus(s) {
  if (userInfo.loginCode.length > 0) {//已登陆 获得用户session
    console.log('zdy-----已登录')
    s()
  } else {//未登录
    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求
          userInfo.loginCode = res.code
          wx.request({
            url: 'http://8.136.244.224/web/user/thirdLogin',
            method: 'POST',
            header: {
              'Content-Type':'application/json'
            },
            data: {
                'source':1,
                'code':userInfo.loginCode
            },
            success:function(res){
              if (res) {
                console.log('zdy-----请求成功' + res.data.errorMsg)
                wx.setStorageSync('userToken', res.data.token)
              }
           },
           fail:function(err) {
                console.log('zdy-----请求失败'+err.errMsg);  
           }
          })      
          s()
          console.log('登录成功' + res.code)
        } else {
          console.log('zdy-----登录失败！' + res.errMsg)
        }
      }
  });
  }
}