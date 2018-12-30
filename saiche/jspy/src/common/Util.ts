class Util {
	public constructor() {
	}

	public static setButtonTapEvent(button:egret.DisplayObject, callback, target:egret.DisplayObject = null):void {
		target = target || button;

		button.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function (event) {
			this.scaleX = 0.9;
			this.scaleY = 0.9;
		}, target);

		button.addEventListener(egret.TouchEvent.TOUCH_END, function (event) {
			this.scaleX = 1;
			this.scaleY = 1;
			if (typeof callback == 'function') {
				callback();
			}
		}, target);

		button.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, function (event) {
			this.scaleX = 1;
			this.scaleY = 1;
		}, target);		
	}

	public static parseNetObject(data) {
		let obj = null;
		if (typeof data == 'string') {
			try {
				obj = JSON.parse(data);
				if (typeof obj == 'number') {
					obj = data;
				}
			} catch (e) {
				obj = data;				
			}
		} else {
			obj = data;
		}

		if (typeof obj == 'object') {
			for (let i in obj) {
				obj[i] = this.parseNetObject(obj[i]);
			}
		}

		return obj;	
	}	

	// 多语言
	public static T(id, transform = true):string {
		let lang = Config.lang;
		let config = RES.getRes('multi_language_json');
		if (!config) {
			return '';
		}

		let o = config[id];
		if (!o) {
			return '';
		}

		let str = o[lang];
		return str;
	}

	public static format(...args):string {
		if (args.length == 0) {
			return;
		}
		
		var str = args[0];
		if (typeof str != 'string') {
			return null;
		}

		if (args.length == 1) {
			return str;
		}

		for (let i = 1; i < args.length; i++) {
			let tag = '{' + i.toString() + '}';
			while (str.indexOf(tag) >= 0) {
				str = str.replace(tag, args[i]);
			}			
		}

		return str;
	}

	public static getMultiLanguageRes(name) {
		if (Config.lang != 'cn') {
			name = Config.lang + '_' + name; 
		}

		return RES.getRes(name);
	}

	// 此方法替换为需要从外部URL加载的资源
	public static updateRes(displayObject:egret.DisplayObject):void {
		// 只在微信环境下才使用外部资源
		// 另外，当使用GetResByUrl获取的图片资源时，引擎渲染时会抛出异常，但资源是没有为题的，这可能是个bug。	
		if (!displayObject || !displayObject.$children) {
			return;
		}

		for (let obj of displayObject.$children) {
			if (obj instanceof eui.Image) {
				let img = <eui.Image>obj;
				if (typeof img.source == 'string') {
					let res = <string>img.source;
					if (Config.lang != 'cn' && RES.hasRes(Config.lang + '_' + res)) {
						res = Config.lang + '_' + res;
						let cr = RES.getRes(res);
						if (!!cr) {
							// console.log('updateRes', res);
							img.source = cr;
						}						
					}
				}
			} else {
				this.updateRes(obj);
			}
		}		
	}

	public static updateLanguage(displayObject:egret.DisplayObject, resize = true):void {
		if (!displayObject || !displayObject.$children) {
			return;
		}

		for (let obj of displayObject.$children) {
			if (obj instanceof eui.Image) {
				let img = <eui.Image>obj;
				if (typeof img.source == 'string') {
					let res = <string>img.source;
					if (Config.lang != 'cn') {
						res = Config.lang + '_' + res;
						let txtr:egret.Texture = RES.getRes(res);
						if (!!txtr) {
							img.source = res;
							img.width = txtr.textureWidth;
							img.height = txtr.textureHeight;
						}						
					}											
				}
			} else if (obj instanceof eui.Label) {
				if (!!obj.text && obj.visible && obj.text.indexOf('#') == 0) {
					let n = Number(obj.text.substring(1));
					if (!isNaN(n)) {
						obj.text = Util.T(n);
						if (Config.lang == 'wy' && resize) {
							obj.size = Math.floor(obj.size * 0.8);
						}							
					}
				}
			} else {
				this.updateLanguage(obj, resize);
			}
		}
	}

	public static deepCopy(obj) {
		if (!obj) {
			return null;
		}
		
		let str = JSON.stringify(obj);
		return JSON.parse(str);
	}

	public static formatDateTime(date:Date):string {
		let y = date.getFullYear().toString();
		let m = (date.getMonth() + 1).toString();
		let d = date.getDate().toString();
		let hour = date.getHours().toString();
		let min = date.getMinutes().toString();

		function fill(s, len = 2) {
			let r = '';
			for (let i = s.length; i < len; i++) {
				r = r + '0';
			}
			return r + s;
		}

		return y + '/' + fill(m) + '/' + fill(d) + ' ' + fill(hour) + ':' + fill(min);
	}

	public static formatDateTimeFull(date:Date):string {
		let y = date.getFullYear().toString();
		let m = (date.getMonth() + 1).toString();
		let d = date.getDate().toString();
		let hour = date.getHours().toString();
		let min = date.getMinutes().toString();
		let sec = date.getSeconds().toString();
		let msec = date.getMilliseconds().toString();

		function fill(s, len = 2) {
			let r = '';
			for (let i = s.length; i < len; i++) {
				r = r + '0';
			}
			return r + s;
		}

		return y + '/' + fill(m) + '/' + fill(d) + ' ' + fill(hour) + ':' + fill(min) + ':' + fill(sec) + '.' + fill(msec, 3);
	}

	public static getUrlParam(name:string):any {
		let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
		let r = window.location.search.substr(1).match(reg);
		if (r != null) {
			return decodeURI(r[2]);
		} 		
		return null;
	}

	public static getAllUrlParam():void {
		let ret:any = {};
		if (window.location.search == '') {
			return ret;
		}

		let query = window.location.search.substring(1);
		let list = query.split('&');
		let item = [];
		for (let i = 0; i < list.length; i++) {
			item = list[i].split('=');
			ret[item[0]] = item[1] || '';
		}

		return ret;
	}

	// 给定一个时间与系统时间比较，返回以下格式的字符串
	// 1min以内----刚刚	
	// 1~60min---- xx分钟前	
	// 1h~24h------xx小时前	
	// X天-----x天前		
	public static getTimeString(time:Date):string {
		let now = new Date();
		let diff = Math.floor((now.getTime() - time.getTime()) / 1000);
		if (diff < 60) {
			return Util.T(1000062);
		} else if (diff >= 60 && diff < 3600) {
			return Util.format(Util.T(1000063), Math.floor(diff / 60));
		} else if (diff >= 3600 && diff < 86400) {
			return Util.format(Util.T(1000064), Math.floor(diff / 3600));
		} else {
			return Util.format(Util.T(1000065), Math.floor(diff / 86400));
		}
	}

	public static rightToLeftWordSplit(str:string) {
		str = str.replace(/\r\n/g, '\n');
		str = str.replace(/\t/g, '  ');

		function splitChar(c) {
			let l = [' ', '\n', '(', ')', '[', ']', '{', '}', '【', '】', '.', '-', '!', '؟'];
			for (let i = 0; i < l.length; i++) {
				if (c == l[i]) {
					return true;
				}
			}
			return false;
		}

		function isNumber(c) {
			return c >= '0' && c <= '9';
		}

		let list = [];
		let i = 0, p, s;
		while (i < str.length) {
			p = i;
			s = '';
			let c, sf;
			do {
				c = str[p++];				
				sf = splitChar(c);
				if (!sf) {
					s += c;
				} else {
					if (c == '.') {
						if (isNumber(str[p - 2]) && isNumber(str[p])) {
							sf = false;
							s += c;
						}
					}
				}
			} while (!sf && p < str.length);

			if (s.length > 0) {
				list.push(s);				
			}
			// if (p < str.length) {
			// 	list.push(c);
			// }	
			list.push(c);

			i = p;
		}

		function inList(c, list) {
			for (let i = 0; i < list.length; i++) {
				if (c == list[i]) {
					return i;
				}
			}
			return -1;
		}

		let left = ['(', '[', '{', '【'];
		let right = [')', ']', '}', '】'];

		// 处理单层括号位置对调
		p = -1;
		let pi = -1;
		for (i = 0; i < list.length; i++) {
			let kl = inList(list[i], left);
			let kr = inList(list[i], right);
			if (kl > 0) {
				p = i;
			} else if (kr > 0) {
				let t = list[p];
				list[p] = list[i];
				list[i] = t;
				p = -1;
			}
		}

		return list;
	}

	public static async sleep(time) {
		return new Promise((resolve, reject) => {
			setTimeout(resolve, time);
		});
	}		
}
