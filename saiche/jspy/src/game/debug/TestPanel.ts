module ui {
	export class TestPanel extends ui.Window{

		private touchLayer:eui.Group
		private startDot:eui.Rect
		private gameHandle:DragCarHandle
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
			// this.touchLayer.addEventListener(egret.TouchEvent.TOUCH_END, this._onTouchEnd, this)
			// this.stage.addEventListener(egret.Event.ENTER_FRAME, this._onEnterFrame, this)

			// this.img_car.anchorOffsetX = this.img_car.width / 2
			// this.img_car.anchorOffsetY = this.img_car.height / 2
		}

		private _onTouchBegin(event:egret.TouchEvent):void
		{
			let start_degree = -45
			let end_degree = 90
			this.img_car.rotation = start_degree
			egret.Tween.get(this.img_car).to({rotation:end_degree}, 1 * 1000)

			// this.is_touching = true
			
			// let target_anchor_x = this.img_car.width
			// let target_anchor_y =  this.img_car.height / 2
			// if(this._get_delta_degree() < 0){
			// 	target_anchor_x = 0
			// }
			// let global_right_center = this.img_car.localToGlobal(target_anchor_x, target_anchor_y)
			// let local_in_this = this.globalToLocal(global_right_center.x, global_right_center.y)
			
			// this.gameHandle.SetPoint(new egret.Point(this.startDot.x, this.startDot.y), local_in_this)
			// let local_point = this.gameHandle.globalToLocal(global_right_center.x, global_right_center.y)

			// this.img_car.parent.removeChild(this.img_car)
			// this.gameHandle.addChild(this.img_car)

			// this.img_car.anchorOffsetX = target_anchor_x
			// this.img_car.anchorOffsetY = target_anchor_y

			// this.img_car.x = local_point.x
			// this.img_car.y = local_point.y

			// this.img_car.rotation -= this.gameHandle.rotation
		}

		private _onTouchEnd(event:egret.TouchEvent):void
		{
			this.is_touching = false

			let global_car_center_point = this.img_car.localToGlobal(this.img_car.width / 2, this.img_car.height / 2)
			let local_in_this = this.globalToLocal(global_car_center_point.x, global_car_center_point.y)

			this.img_car.parent.removeChild(this.img_car)
			this.addChild(this.img_car)

			this.img_car.anchorOffsetX = this.img_car.width / 2
			this.img_car.anchorOffsetY = this.img_car.height / 2

			this.img_car.rotation += this.gameHandle.rotation
			this.img_car.x = local_in_this.x
			this.img_car.y = local_in_this.y
			// console.log("#####11####", this.img_car.rotation, this.gameHandle.rotation)
		}

		private _onEnterFrame():void
		{
			if(this.is_touching){
				this._on_game_handle_rotate()
				return
			}

			let speed = 5
			let radian = this.img_car.rotation / 180 * Math.PI
			this.img_car.x += speed * Math.sin(radian)
			this.img_car.y += speed * Math.cos(radian) * -1
		}

		private _on_game_handle_rotate():void
		{
			let abs_step_degree = 1
			let step_degree = abs_step_degree * this._get_delta_degree()
			this.gameHandle.rotation += step_degree
		}

		private _get_delta_degree():number
		{
			return 1
		}
	}
}