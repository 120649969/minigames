module io {
	export class Net {
		protected name:string;

		protected socket:egret.WebSocket;
		protected ssl:boolean;

		protected protocol:any;		
		protected protocolReverse:any; // 协议键值反向表，用于打印协议日志

		protected protocolCallback:any;

		protected heartbeatInterval:any;
		protected logHeartbeat:boolean;

		protected url:string;

		public onConnected:Function;
		public onDisconnected:Function;
		public onSocketErrorCb:Function;

		protected closeFlag:boolean;		// 主动断开链接时，会设置
		protected reconnectFlag:boolean;

		protected static COMMON_PROTOCOL = {
			CMD_COMMON_REMOTE_LOGIN_PUSH: 1000000,
			CMD_COMMON_HEART_BEAT_REQ: 1000001,
			CMD_COMMON_HEART_BEAT_RSP: 1000002,				
			CMD_COMPRESS_REQ: 1000003,
			CMD_COMPRESS_RSP: 1000004
		};

		public constructor() {
			this.socket = new egret.WebSocket();

			this.ssl = false;

			this.socket.addEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
			this.socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onMessage, this);
			this.socket.addEventListener(egret.Event.CLOSE, this.onSocketClose, this);
			this.socket.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onError, this);

			this.name = '';
			this.url = '';

			this.protocol = {};

			this.protocolCallback = {};

			this.regProtocol(Net.COMMON_PROTOCOL);

			this.closeFlag = false;
			this.reconnectFlag = false;
			this.ssl = true
			this.logHeartbeat = false;
		}

		protected regProtocol(protocol) {
			for (let k in protocol) {
				this.protocol[k] = protocol[k];
			}			
			this.protocolReverse = {};
			for (let k in this.protocol) {
				this.protocolReverse[this.protocol[k]] = k;
			}
		}

		public connect(url):void {
			if (this.socket.connected) {
				console.error('connect: socket connected already');
				return;
			}

			this.url = url;
			let u = 'ws' + (this.ssl ? 's' : '') + '://' + url;
			console.log(this.name, 'connect to', u);
			this.socket.connectByUrl(u);
		}

		public disconnect():void {
			if (!this.socket.connected) {
				console.error('disconnect: socket not connected');
				return;
			}

			this.closeFlag = true;
			this.socket.close();

			this.protocolCallback = {};
		}

		protected onError(event):void {
			console.error('socket error');

			if (typeof this.onSocketErrorCb == 'function') {
				this.onSocketErrorCb();
				this.onSocketErrorCb = null;
			}
		}

		protected onSocketOpen(event:egret.Event):void {
			console.log(this.name, 'connected');

			if (!!this.heartbeatInterval) {
				clearInterval(this.heartbeatInterval);
			}
			this.heartbeatInterval = setInterval(this.heartbeatRoutine.bind(this), Const.HEARTBEAT_DUR);			

			if (typeof this.onConnected == 'function') {
				this.onConnected();
				this.onConnected = null;
			}

			if (this.reconnectFlag) {				
				this.onReconnected();
			}			
		}

		protected onMessage(event:egret.Event):void {			
			let msg = this.socket.readUTF();
			if (msg.length == 0) {
				return;
			}

			let obj;
			try {
				obj = Util.parseNetObject(msg);
			} catch (e) {
				console.error(e);
				return;
			}

			let msgId = obj['MsgId'];
			let body = obj['Body'];

			this.logProtocol(msgId, body);

			if (msgId == 2) {
				let a = 0;
				obj = Util.parseNetObject(msg);
			}

			if (msgId >= 0) {
				let callback = this.protocolCallback[msgId];
				if (!!callback) {
					callback(msgId, body);
					delete this.protocolCallback[this.protocolCallback[msgId]];
				} else {
					if (msgId < 1000) {
						console.warn('[' + this.name + ']', 'no callback found', msgId);
					}					
				}
			} else {
				body = Util.parseNetObject(body);
				// let config = RES.getRes('error_json');
				// if (!!config[body.code - 1]) {
				// 	let pre = Config.lang;
				// 	Util.showTips(config[body.code - 1][pre]);
				// } else {
				// 	Util.showTips(body.msg);
				// }

				// ui.WindowManager.getInstance().close('WaitingWindow');
				
				// let data = {name: this.name, msgId: msgId, body: body};
				// EventEmitter.getInstance().dispatchEventWith(Const.EVENT.ON_NET_ERROR_MESSAGE, false, data);
			}
		}

		protected onSocketClose(event:egret.Event):void {			
			console.log(this.name, 'disconnected');
			// log('disconnected onSocketClose')
			if (!this.closeFlag) {
				// ui.WindowManager.getInstance().open('WaitingWindow', 1000606);
				setTimeout(this.reconnect.bind(this), 3000);
			}

			this.closeFlag = false;

			if (!!this.heartbeatInterval) {
				clearInterval(this.heartbeatInterval);
				this.heartbeatInterval = null;
			}

			// this.protocolCallback = {};

			if (typeof this.onDisconnected == 'function') {
				let temp_callback = this.onDisconnected
				this.onDisconnected = null;
				temp_callback();
			}			
		}

		protected logProtocol(msgId, body):void {
			if (!this.logHeartbeat && (msgId == Net.COMMON_PROTOCOL.CMD_COMMON_HEART_BEAT_REQ || msgId == Net.COMMON_PROTOCOL.CMD_COMMON_HEART_BEAT_RSP)) {
				return;
			}
			
			if (!this.protocolReverse) {
				this.protocolReverse = {};
				for (let k in this.protocol) {
					this.protocolReverse[this.protocol[k]] = k;
				}				
			}

			let str = '[' + Util.formatDateTimeFull(new Date()) + ']';

			if (!!this.protocolReverse[msgId]) {
				console.log(str, 'protocol', this.protocolReverse[msgId], msgId, 'body', body);
				// log(str, 'protocol', this.protocolReverse[msgId], msgId, 'body', body);
			} else {
				console.log(str, 'protocol', msgId, 'body', body);
				// log(str, 'protocol', msgId, 'body', body);
			}
		}

		public send(msgId, body) {
			if (!this.socket.connected) {
				console.log('send: socket not connected');
				return;
			}

			if (typeof msgId == 'string') {
				let id = this.protocol[msgId];
				if (!id) {
					console.error('protocol not found', msgId);
					return;
				}
				msgId = id;
			}

			if (!body || Object.keys(body).length == 0) {
				body = {empty: true};
			}

			let msg = JSON.stringify({MsgId: msgId, Body: JSON.stringify(body)});

			this.socket.writeUTF(msg);

			this.logProtocol(msgId, body);
		}

		public isConnected():boolean {
			return this.socket.connected;
		}

		public on(msgId, callback):void {
			this.protocolCallback[msgId] = callback;
		}

		public off(msgId):void {
			delete this.protocolCallback[msgId];
		}

		public clearCallback():void {
			this.protocolCallback = {};
		}

		protected heartbeatRoutine():void {
			this.send(Net.COMMON_PROTOCOL.CMD_COMMON_HEART_BEAT_REQ, null);
		}

		protected reconnect():void {
			this.reconnectFlag = true;
		}

		protected onReconnected():void {
		}
	}
}