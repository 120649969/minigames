class Config {
	public constructor() {
	}

	public static platform = '';
	public static enableBgm = true;
	public static enableSound = true;
	public static lang = 'wy';
	public static debug = 1;
	public static maintain = 0;

	public static Pushlish = 1; //标志发布

	public static setConfig(key, value) {
		Config[key] = value;
	}

	public static getConfig(key) {
		return Config[key];
	}
}
