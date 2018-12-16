module ui {
	export class DebugPanel extends ui.Window{

		private _multiLine:BallMultiLine
		private btn_close:eui.Button
		private btn_1:eui.Button
		private btn_2:eui.Button
		private m_demo_group:eui.Group
		private btn_export:eui.Button
		private m_edit_text:eui.EditableText
		private btn_load:eui.Button

		private _current_ball:Ball
		private _init_10_config:MultiLineConfig
		private _init_9_config:MultiLineConfig

		public constructor() {
			super()
			this.skinName = "DebugSkin"

			let multi_line = new BallMultiLine()

			this.addChild(multi_line)

			let configs = []
			
			configs.push(GameConst.Generate10LineConfig(BALL_TYPE.TYPE_1))
			configs.push(GameConst.Generat9LineConfig(BALL_TYPE.TYPE_1))
			configs.push(GameConst.Generate10LineConfig(BALL_TYPE.TYPE_1))
			configs.push(GameConst.Generat9LineConfig(BALL_TYPE.TYPE_1))
			configs.push(GameConst.Generate10LineConfig(BALL_TYPE.TYPE_1))
			this._init_10_config = new MultiLineConfig(configs)
			
			configs = []
			configs.push(GameConst.Generat9LineConfig(BALL_TYPE.TYPE_1))
			configs.push(GameConst.Generate10LineConfig(BALL_TYPE.TYPE_1))
			configs.push(GameConst.Generat9LineConfig(BALL_TYPE.TYPE_1))
			configs.push(GameConst.Generate10LineConfig(BALL_TYPE.TYPE_1))
			configs.push(GameConst.Generat9LineConfig(BALL_TYPE.TYPE_1))
			this._init_9_config = new MultiLineConfig(configs)

			this._multiLine = multi_line
			this._multiLine.UpdateConfig(this._init_10_config)
			multi_line.y = 300
		}

		protected createChildren(): void {
			super.createChildren()

			CommonUtils.Add_Btn_Click(this.btn_close, function(){
				ui.WindowManager.getInstance().close("DebugPanel")
			}, this)

			let __this = this
			CommonUtils.Add_Btn_Click(this.btn_1, function(){
				__this._multiLine.UpdateConfig(__this._init_10_config)
			}, this)

			CommonUtils.Add_Btn_Click(this.btn_2, function(){
				__this._multiLine.UpdateConfig(__this._init_9_config)
			}, this)

			CommonUtils.Add_Btn_Click(this.btn_export, function(){
				let data = __this._multiLine.ExportJson()
				console.log(data)
				let result = JSON.stringify(data)
				__this.m_edit_text.text = result
			}, this)

			CommonUtils.Add_Btn_Click(this.btn_load, function(){
				let content = __this.m_edit_text.text
				let result:Array<Object> = JSON.parse(content)
				if((result[0] as Array<number>).length == 10){
					__this._init_10_config.all_line_config = result
					__this._multiLine.UpdateConfig(__this._init_10_config)
				}else{
					__this._init_9_config.all_line_config = result
					__this._multiLine.UpdateConfig(__this._init_9_config)
				}
				
			}, this)

			let all_lines = this._multiLine.all_lines
			for(let index = 0; index < all_lines.length; index++)
			{
				let line:BallLine = all_lines[index]
				let all_balls = line.all_balls
				for(let ball_index = 0; ball_index < all_balls.length; ball_index++)
				{
					let ball:Ball = all_balls[ball_index]
					ball.touchEnabled = true
					CommonUtils.Add_Btn_Click(ball, function(){
						__this.m_demo_group.visible = true

						let global_center_point = ball.localToGlobal(ball.width / 2, ball.height / 2)
						let local_point = __this.m_demo_group.parent.globalToLocal(global_center_point.x, global_center_point.y)
						__this.m_demo_group.x = local_point.x
						__this.m_demo_group.y = local_point.y
						__this._current_ball = ball
					}, this)
				}
			}

			for(let index = 0; index < BALL_TYPE.MAX_TYPE; index++)
			{
				let img:eui.Image = this['img_demo_' + (index + 1)] as eui.Image
				CommonUtils.Add_Btn_Click(img, function(){
					if(!__this._current_ball){
						return
					}
					__this.m_demo_group.visible = false
					 __this._current_ball.SetBallType(index + 1)
					__this._current_ball = null
				}, this)
			}

			this.m_demo_group.parent.setChildIndex(this.m_demo_group, this.m_demo_group.parent.numChildren - 1)
		}
	}
}