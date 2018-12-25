class EventEmitter extends egret.EventDispatcher {
	private static instance:EventEmitter = null;

	public constructor() {
		super();
	}

	public static getInstance():EventEmitter {
		if (!EventEmitter.instance) {
			this.instance = new EventEmitter();
		}

		return this.instance;
	}
}