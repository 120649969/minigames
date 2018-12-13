module ui {
	export class WindowManager {
		protected static instance:WindowManager = null;

		protected windows:any;	// 存放各个窗口的实例

		protected container:eui.UILayer;

		public constructor() {
			this.windows = {};
		}

		public static getInstance() {
			if (this.instance == null) {
				this.instance = new WindowManager();
			}
			return this.instance;
		}

		public initialize(main:eui.UILayer):void {
			this.container = main;
		}

		protected createWindow(windowName):Window {
			let clazz = ui[windowName];
			if (!clazz) {
				return null;
			}

			let window = new clazz();
			window.name = windowName;
			
			this.windows[windowName] = window;

			return window;
		}

		/**
		 * 获取窗口，如果窗口没有打开时返回null
		 */
		public getWindow(windowName):Window {
			let window = this.windows[windowName];
			if (!window) {
				return null;
			}

			return window;
		}

		/**
		 * windowName: 窗口的类名
		 * param: 打开窗口时的参数，例如用于打开窗口后，转跳到某个子窗口等
		 * tweening:是否启动tween动画
		 */
		public open(windowName:string, param = null, tweening = false):Window {			
			if (!this.container) {
				return null;
			}
			
			let window = this.getWindow(windowName);
			if (!!window) {
				return window;
			}

			window = this.createWindow(windowName);
			if (!window) {
				return null;
			}

			let layer:egret.DisplayObjectContainer;
			switch (window.showLayer) {
				case Window.SHOW_LAYER_UI:
					layer = this.container['uiLayer'];
					break;
				case Window.SHOW_LAYER_COVER:
					layer = this.container['coverLayer'];
					break;
				case Window.SHOW_LAYER_TOP:
					layer = this.container['topLayer'];
					break;
				default:
					layer = this.container['uiLayer'];
					break;				
			}

			if (!layer.contains(window)) {
				console.log('Open window:', window.name);
				window.param = param;
				window.tweening = tweening;
				layer.addChild(window);
				window.onOpen();

				EventEmitter.getInstance().dispatchEventWith(Const.EVENT.ON_WINDOW_OPEN, false, window.name);
			}
			
			return window;
		}

		public close(windowName:string):void {
			if (!this.container) {
				return;
			}

			let window = this.windows[windowName];
			if (!window) {
				return;
			}

			let layer:egret.DisplayObjectContainer;
			switch (window.showLayer) {
				case Window.SHOW_LAYER_UI:
					layer = this.container['uiLayer'];
					break;
				case Window.SHOW_LAYER_COVER:
					layer = this.container['coverLayer'];
					break;
				case Window.SHOW_LAYER_TOP:
					layer = this.container['topLayer'];
					break;
				default:
					layer = this.container['uiLayer'];
					break;					
			}

			delete this.windows[windowName];

			window.onClose();

			EventEmitter.getInstance().dispatchEventWith(Const.EVENT.ON_WINDOW_CLOSED, false, windowName);
			
			if (layer.contains(window)) {			
				layer.removeChild(window);

				console.log('Window closed:', window.name);
			}
		}

		public closeAllWindow(exceptList = []):void {
			let list = [];
			if (exceptList.length > 0) {
				list = list.concat(exceptList);
			}

			let keys = Object.keys(this.windows);
			for (let i = 0; i < keys.length; i++) {
				let found = false;
				for (let j = 0; j < list.length; j++) {
					if (list[j] == keys[i]) {
						found = true;
						break;
					}
				}

				if (!found)	{
					this.close(keys[i]);
				}
			}
		}

		public isWindowOpening(windowName:string):boolean {
			return !!this.windows[windowName];
		}
	}
}