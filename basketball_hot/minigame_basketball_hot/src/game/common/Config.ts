class Config {
	public constructor() {
	}

	public static platform = '';
	public static enableBgm = true;
	public static enableSound = true;
	public static lang = 'wy';
	public static debug = 0;
	public static maintain = 0;

	public static setConfig(key, value) {
		Config[key] = value;
	}

	public static getConfig(key) {
		return Config[key];
	}

	// public static load():void {
	// 	this.lang = egret.localStorage.getItem('lang') || 'wy';
	// }

	// public static save():void {
	// 	egret.localStorage.setItem('lang', this.lang || 'wy');
	// }
}