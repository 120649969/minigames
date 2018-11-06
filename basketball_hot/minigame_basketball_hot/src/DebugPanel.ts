class DebugPanel extends eui.Component{

	private btn_close:eui.Button
	private btn_ok:eui.Button
	private label_gravity:eui.TextInput
	private label_max_x:eui.TextInput
	private label_min_y:eui.TextInput
	private label_impluse_y:eui.TextInput
	private label_wind:eui.TextInput

	private btn_reset:eui.Button
	public constructor() {
		super()
		this.skinName = "Setting"

		let __this = this
		this.btn_close.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function(){
			__this.parent.removeChild(__this)
		}.bind(this), this)

		this.btn_ok.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function(){
			let new_value = parseFloat( __this.label_gravity.text)
			if(new_value){
				 HitConst.Gravity = new_value
			}

			new_value = parseFloat( __this.label_max_x.text)
			if(new_value){
				 HitConst.Max_Speed_X = new_value
			}

			new_value = parseFloat( __this.label_min_y.text)
			if(new_value){
				 HitConst.MIN_SPEED_Y = new_value
			}

			new_value = parseFloat( __this.label_impluse_y.text)
			if(new_value){
				 HitConst.PUSH_DOWN_IMPLUSE_Y = new_value
			}

			new_value = parseFloat( __this.label_wind.text)
			if(new_value){
				 HitConst.Frame_Speed_X = new_value
			}

			__this.parent.removeChild(__this)	
		}.bind(this), this)

		this.btn_reset.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function(){
			this.label_gravity.text = HitConst.BACK_Gravity.toString();
			this.label_max_x.text = HitConst.BACK_Max_Speed_X.toString();
			this.label_min_y.text = HitConst.BACK_MIN_SPEED_Y.toString();
			this.label_impluse_y.text = HitConst.BACK_PUSH_DOWN_IMPLUSE_Y.toString();
			this.label_wind.text = HitConst.BACK_Frame_Speed_X.toString();
		}.bind(this), this)

		this.label_gravity.text = HitConst.Gravity.toString();
		this.label_max_x.text = HitConst.Max_Speed_X.toString();
		this.label_min_y.text = HitConst.MIN_SPEED_Y.toString();
		this.label_impluse_y.text = HitConst.PUSH_DOWN_IMPLUSE_Y.toString();
		this.label_wind.text = HitConst.Frame_Speed_X.toString();
	}

}