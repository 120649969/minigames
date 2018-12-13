module io {
	export class GameNet extends Net {
		private static instance:GameNet = null;

		public static getInstance():GameNet {
			if (!this.instance) {
				this.instance = new GameNet();
			}
			return this.instance;
		}		

		public static GAME_PROTOCOL = {
			CMD_H5_LOGIN_REQ: 1,
			CMD_H5_LOGIN_RSP: 2,
			CMD_H5_JOIN_REQ: 3,  //加入房间
			CMD_H5_JOIN_RSP:4, //加入房间
			CMD_H5_REENTER_REQ: 5,  //重进
			CMD_H5_REENTER_RSP: 6, //重进
			CMD_H5_SURREND_REQ:7, //投降
			CMD_H5_SURREND_RSP:8,
			CMD_H5_SCORE_REQ:9,  //分数
			CMD_H5_SCORE_RSP:10, //分数

			CMD_H5_JOIN_PUSH: 100, //加入房间推送
			CMD_H5_GAME_STATUS_PUSH: 102, //房间状态改变推送
			CMD_H5_GAME_START_PUSH: 104, //游戏开始推送
			CMD_H5_SECOND_PUSH: 106, //已经游戏秒数推送
			CMD_H5_SCORE_PUSH: 108, //分数变化推送
			CMD_H5_GAME_OVER_PUSH: 110, //游戏结束推送
			CMD_H5_REENTER_PUSH: 112, //重进推送
		};

		public sessionKey:string;

		public constructor() {
			super();

			this.name = 'GameNet';

			this.sessionKey = null;
			
			this.regProtocol(GameNet.GAME_PROTOCOL);
		}

		public async connectServer() {
			let self = this
			return new Promise((resolve, reject) => {
				self.onConnected = function () {
					resolve()
				}

				if(DEBUG){
					self.connect(Const.DEBUG_SERVER_URL)
				} else {
					self.connect(Const.RELEASE_SERVER_URL)
				}
			})
		}

		public async reqLogin(roomId) {
			let self = this
			return new Promise((resolve, reject) => {
				self.on(GameNet.GAME_PROTOCOL.CMD_H5_LOGIN_RSP, function (msgId, body) {
					self.off(GameNet.GAME_PROTOCOL.CMD_H5_LOGIN_RSP);
					resolve(body);
				});
				self.send(GameNet.GAME_PROTOCOL.CMD_H5_LOGIN_REQ, {
					openid: User.openId,
					roomid: roomId.toString()
				})
			})
		}

		public async reqJoin(callback ?:any) {
			let self = this;
			return new Promise((resolve, reject) => {
				self.on(GameNet.GAME_PROTOCOL.CMD_H5_JOIN_RSP, function (msgId, body) {
					self.off(GameNet.GAME_PROTOCOL.CMD_H5_JOIN_RSP);
					resolve(body);
					if(callback)
					{
						callback(body);
					}
				});
				self.send(GameNet.GAME_PROTOCOL.CMD_H5_JOIN_REQ, {
					openid: User.openId
				});
			});				
		}

		public async reqReEnter(score) {
			let self = this;
			return new Promise((resolve, reject) => {
				self.on(GameNet.GAME_PROTOCOL.CMD_H5_REENTER_RSP, function (msgId, body) {
					self.off(GameNet.GAME_PROTOCOL.CMD_H5_REENTER_RSP);
					resolve(body);
				});
				self.send(GameNet.GAME_PROTOCOL.CMD_H5_REENTER_REQ, {
					score:score
				});
			});				
		}

		//切换关卡
		public async reqChangeScore(score:number){
			let self = this;
			return new Promise((resolve, reject) => {
				self.on(GameNet.GAME_PROTOCOL.CMD_H5_SCORE_RSP, function (msgId, body) {
					self.off(GameNet.GAME_PROTOCOL.CMD_H5_SCORE_RSP);
					resolve(body);
				});
				self.send(GameNet.GAME_PROTOCOL.CMD_H5_SCORE_REQ, {
					score:score
				});
			});
		}

		public async reqSurrend(){
			let self = this;
			return new Promise((resolve, reject) => {
				self.on(GameNet.GAME_PROTOCOL.CMD_H5_SURREND_RSP, function (msgId, body) {
					self.off(GameNet.GAME_PROTOCOL.CMD_H5_SURREND_RSP);
					resolve(body);
				});
				self.send(GameNet.GAME_PROTOCOL.CMD_H5_SURREND_REQ, {
				});
			});		
		}
	}
}