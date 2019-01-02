module ui {
	export class MainScenePanel extends BaseGameScene{
		
		public mapContainer:eui.Group
		private btn_debug1:eui.Button
		private btn_debug2:eui.Button
		private btn_debug3:eui.Button

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
			}, this)

			this.btn_debug1.visible = false
			this.btn_debug2.visible = false
			this.btn_debug3.visible = true
			if(DEBUG){
				this.btn_debug1.visible = true
				this.btn_debug2.visible = true
				this.btn_debug3.visible = true
			}
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
		}

		public StartGame():void
		{
			super.StartGame()
		}

		private _move_left():void
		{
			this.mapContainer.x += 50
		}

		private _move_top():void
		{
			this.mapContainer.y += 50
		}

		private _move_right():void
		{
			this.mapContainer.x -= 50
		}

		private _move_down():void
		{
			this.mapContainer.y -= 50
		}

	}
}