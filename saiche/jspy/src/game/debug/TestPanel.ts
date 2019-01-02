module ui {
	export class TestPanel extends ui.Window{

		private touchLayer:eui.Group
		private startDot:eui.Rect
		private gameHandle:GameHandle
		private img_car:eui.Image

		private is_touching:boolean = false
		public constructor() {
			super()
			this.skinName = "TestSkin"
		}

		public onOpen()
		{
			super.onOpen()
			this.touchLayer.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._onTouchBegin, this)
			this.touchLayer.addEventListener(egret.TouchEvent.ENDED, this._onTouchEnd, this)
			this.stage.addEventListener(egret.Event.ENTER_FRAME, this._onEnterFrame, this)
		}

		private _onTouchBegin(event:egret.TouchEvent):void
		{
			this.is_touching = true
			
			let target_anchor_x = this.img_car.width
			let target_anchor_y =  this.img_car.height / 2
			if(this.img_car.x > this.startDot.x){
				target_anchor_x = 0
			}
			let global_right_center = this.img_car.localToGlobal(target_anchor_x, target_anchor_y)
			let local_point = this.gameHandle.globalToLocal(global_right_center.x, global_right_center.y)
			
			this.gameHandle.SetPoint(new egret.Point(this.startDot.x, this.startDot.y), local_point)

			this.img_car.parent.removeChild(this.img_car)
			this.gameHandle.addChild(this.img_car)

			this.img_car.anchorOffsetX = target_anchor_x
			this.img_car.anchorOffsetY = target_anchor_y

			this.img_car.x = local_point.x
			this.img_car.y = local_point.y
		}

		private _onTouchEnd(event:egret.TouchEvent):void
		{
			this.is_touching = false
		}

		private _onEnterFrame():void
		{
			if(this.is_touching){
				return
			}
			this.img_car.y -= 5
		}
	}
}