module ui {
	export class MainScenePanel extends BaseGameScene{
		
		public mapContainer:eui.Group
		private btn_debug1:eui.Button
		private btn_debug2:eui.Button
		private btn_debug3:eui.Button
		public roleContainer:eui.Group
		public moveContainer:eui.Group
		public copyContainer:eui.Group
		public moveCar:GameMoveCar
		public m_start_line:eui.Image

		public constructor() {
			super()
			this.skinName = "MainSceneSkin"
			let __this = this
			CommonUtils.Add_Btn_Click(this.btn_debug1, function(){
				let win_center_in_local_point = __this.mapContainer.globalToLocal(__this.stage.stageWidth / 2, __this.stage.stageHeight / 2)
				__this.mapContainer.anchorOffsetX = win_center_in_local_point.x
				__this.mapContainer.anchorOffsetY = win_center_in_local_point.y
				let  cur_scale_x = __this.mapContainer.scaleX
				__this.mapContainer.scaleX = __this.mapContainer.scaleY = cur_scale_x * 2
			}, this)
			CommonUtils.Add_Btn_Click(this.btn_debug2, function(){
				let win_center_in_local_point = __this.mapContainer.globalToLocal(__this.stage.stageWidth / 2, __this.stage.stageHeight / 2)
				__this.mapContainer.anchorOffsetX = win_center_in_local_point.x
				__this.mapContainer.anchorOffsetY = win_center_in_local_point.y
				let  cur_scale_x = __this.mapContainer.scaleX
				__this.mapContainer.scaleX = __this.mapContainer.scaleY = cur_scale_x * 0.5
			}, this)

			CommonUtils.Add_Btn_Click(this.btn_debug3, function(){
				ui.WindowManager.getInstance().open("DebugPanel")
				// ui.WindowManager.getInstance().open("TestPanel")
			}, this)

			this.btn_debug1.visible = false
			this.btn_debug2.visible = false
			this.btn_debug3.visible = true
			if(DEBUG){
				this.btn_debug1.visible = true
				this.btn_debug2.visible = true
				this.btn_debug3.visible = true
			}
			this.moveCar.visible = false
			this.m_start_line.visible = false
		}

		public GetGameLogicComponent():GameLogicComponent
		{
			return this._gameLogicComponent as GameLogicComponent
		}

		public onOpen():void
		{
			super.onOpen()
			
			GameController.instance.SetMainScenePanel(this)
			this._commonUIComponent = new CommonUIComponent()
			this._gameLogicComponent = new GameLogicComponent()
			NetManager.instance.StartConnectServer()

			let __this = this
			document.addEventListener("keydown",function(evt:any){
				console.log(evt.keyCode)
				if(evt.keyCode == 37){  //left
					if(ui.WindowManager.getInstance().isWindowOpening("DebugPanel")){
						return (window['debugPanel'] as ui.DebugPanel)._move_left()
					}
					__this._move_left()
				}else if(evt.keyCode == 38){  //top
					if(ui.WindowManager.getInstance().isWindowOpening("DebugPanel")){
						return (window['debugPanel'] as ui.DebugPanel)._move_top()
					}
					__this._move_top()
				}else if(evt.keyCode == 39){  //right
					if(ui.WindowManager.getInstance().isWindowOpening("DebugPanel")){
						return (window['debugPanel'] as ui.DebugPanel)._move_right()
					}
					__this._move_right()
				}else if(evt.keyCode == 40){  //down
					if(ui.WindowManager.getInstance().isWindowOpening("DebugPanel")){
						return (window['debugPanel'] as ui.DebugPanel)._move_down()
					}
					__this._move_down()
				}
			})

			this.m_start_line.y = this.stage.stageHeight - this.m_start_line.height
		}

		public OnConnectServer():void
		{
			let __this = this
			this._commonUIComponent.PlayReadyAnimation(function(){
				CommonUtils.performDelay(function(){
					__this.StartGame()
				}, 0.5 * 1000, __this)
			})
		}

		public StartGame():void
		{
			this.moveCar.AddAnimation()
			super.StartGame()

			this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._onTouchBegin, this)
			this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this._onTouchEnd, this)
		}

		private is_touching:boolean

		private _onTouchBegin(event:egret.TouchEvent):void
		{
			this.is_touching = true
			this._gameLogicComponent.OnTouchStart(event.stageX, event.stageY)
		}

		private _onTouchEnd(event:egret.TouchEvent):void
		{
			this.is_touching = false
			this._gameLogicComponent.OnTouchEnd(event.stageX, event.stageY)
		}


		private _move_left():void
		{
			this.moveContainer.x += 50
		}

		private _move_top():void
		{
			this.moveContainer.y += 50
		}

		private _move_right():void
		{
			this.moveContainer.x -= 50
		}

		private _move_down():void
		{
			this.moveContainer.y -= 50
		}

	}
}