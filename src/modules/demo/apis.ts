const config: IAPIsRegisterParam = {
  // 获取用户信息
  getUserInfo: {
    server: 'baseServer',
    method: 'get',
    url: '/api/user/:id'
  },
  // 获取好友列表
  postFriendList: {
    server: 'baseServer',
    method: 'post',
    url: '/api/FriendList'
  }
};

export default config;
