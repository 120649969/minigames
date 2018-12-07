module ui {
	export class DebugPanel extends ui.Window{

		private m_input_gravity:eui.TextInput
		private m_input_player_speed_y:eui.TextInput
		private m_input_box_speed_x:eui.TextInput

		private btn_close:eui.Button
		private btn_yes:eui.Button

		public constructor() {
			super()
			this.skinName = "DebugSkin"
		}

		protected createChildren(): void {
			super.createChildren()
			
			this.btn_close.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function(){
				WindowManager.getInstance().close("DebugPanel")
			}.bind(this), this)

			let __this = this
			this.btn_yes.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function(){
				let new_value = parseFloat( __this.m_input_gravity.text)
				if(new_value != null){
					GameConst.GRAVITY = new_value
				}

				new_value = parseFloat( __this.m_input_player_speed_y.text)
				if(new_value != null){
					GameConst.PLAYER_MOVE_SPEED_INIT_Y = new_value
				}
				
				new_value = parseFloat( __this.m_input_box_speed_x.text)
				if(new_value != null){
					GameConst.BOX_MOVE_SPEED_X = new_value
				}

				WindowManager.getInstance().close("DebugPanel")
			}.bind(this), this)

			this.m_input_gravity.text = GameConst.GRAVITY.toString()
			this.m_input_box_speed_x.text = GameConst.BOX_MOVE_SPEED_X.toString()
			this.m_input_player_speed_y.text = GameConst.PLAYER_MOVE_SPEED_INIT_Y.toString()
		}

	}
}