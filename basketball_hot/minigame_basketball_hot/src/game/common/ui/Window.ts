module ui {
	export class Window extends eui.Component {
		public static SHOW_LAYER_UI = 1;
		public static SHOW_LAYER_COVER = 2;
		public static SHOW_LAYER_TOP = 3;

		public name:string;

		public showLayer:number;
		public externalCloseSwitch:boolean; //外部关闭窗口开关
		public resizeWy:boolean; // 缩小维语字体开关

		public param:any;
		public tweening:any;

		public constructor() {
			super();

			this.name = '';

			this.showLayer = Window.SHOW_LAYER_UI;
			this.externalCloseSwitch = false;

			this.param = null;

			this.touchEnabled = false;
			this.resizeWy = true;
		}
		
		public resizeStage():void {
			if (!this.stage) {
				return;
			}
	
			let stageWidth = this.stage.stageWidth;
			let stageHeight = this.stage.stageHeight;
			this.width = stageWidth;
			this.height = stageHeight;

			let r0 = Const.MIN_WIDTH / Const.MIN_HEIGHT;			

			// 如果有背景图片，按屏幕尺寸裁剪背景
			let bg = this['imgBg'];
			if (!!bg) {
				let w = stageWidth;
				let h = stageHeight;
				let r = w / h;
				let offsetX = 0, offsetY = 0;
				if (r > r0)	{
					h = w / r0;
					offsetY = Math.floor((stageHeight - h) / 2);
					h = Math.ceil(h);
				} else if (r < r0) {
					w = h * r0;
					offsetX = Math.floor((stageWidth - w) / 2);
					w = Math.ceil(w);
				}
				bg.width = w;
				bg.height = h;
				bg.x = offsetX;
				bg.y = offsetY;
			}			
		}		

		public onOpen():void {			
			EventEmitter.getInstance().addEventListener(Const.EVENT.ON_STAGE_RESIZE, this.resizeStage, this);

			this.resizeStage();

			if (this.tweening) {
				let root:eui.Component = this['root'];
				if (!!root) {
					root.scaleX = 0.05;
					root.scaleY = 0.05;

					let tween = egret.Tween.get(root);
					tween.to({scaleX: 1, scaleY: 1}, 300, egret.Ease.sineInOut);					
				}				
			}
			
			Util.updateLanguage(this, this.resizeWy);
		}

		public onClose():void {
			let root:eui.Component = this['root'];
			if (!!root)	{
				egret.Tween.removeTweens(root);
			}
			EventEmitter.getInstance().removeEventListener(Const.EVENT.ON_STAGE_RESIZE, this.resizeStage, this);
		}

		public close():void {
			WindowManager.getInstance().close(this.name);
		}

		public refresh():void {			
		}

		public setBgTapEvent(callback):void {
			let bg:eui.Image = this['imgBg'];
			bg.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
				if (typeof callback == 'function') {
					callback();
				}
			}, this);
		}
	}
}