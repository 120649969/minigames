class GameLogicComponent extends BaseComponent{
	
	public all_point_lines:Array<GamePoint> = []

	private _mainScenePanel:ui.MainScenePanel
	public constructor() {
		super()
		this._mainScenePanel = GameController.instance.GetMainScenePanel()
	}

	private _tryChangeBgPosition():void
	{
		let bg = this._mainScenePanel.all_img_bgs[0]
		let lastbg = this._mainScenePanel.all_img_bgs[this._mainScenePanel.all_img_bgs.length - 1]
		let global_point = bg.localToGlobal(0, 0)
		if(global_point.y >= this._mainScenePanel.height + 400){
			this._mainScenePanel.all_img_bgs.splice(0, 1)
			this._mainScenePanel.all_img_bgs.push(bg)
			bg.y = lastbg.y - lastbg.height
		}
	}

	private _try_generate_new_point_line():void
	{
		let cur_y = 0
		if(this.all_point_lines.length < 5)
		{
			let is_two = Math.random() < 0.2
			let line_count = 1
			if(is_two){
				line_count = 2
			}
			if(this.all_point_lines.length > 0){
				cur_y = this.all_point_lines[this.all_point_lines.length - 1].y
				cur_y -= GameConst.Standard_Distance
			}else{
				let global_player_point = this._mainScenePanel.m_player.localToGlobal(this._mainScenePanel.m_player.width / 2, this._mainScenePanel.m_player.height / 2)
				let local_point = this._mainScenePanel.prop_container.globalToLocal(global_player_point.x, global_player_point.y)
				cur_y = local_point.y - GameConst.Standard_Distance * 0.8
			}
			
			let new_point = new GamePoint()
			new_point.Show(line_count)
			this.all_point_lines.push(new_point)
			new_point.y = cur_y
		}
	}

	private _updateBgPosition():void
	{
		// for(let bg of this._mainScenePanel.all_img_bgs){
		// 	bg.y += GameConst.BG_SPEED
		// }
		this._mainScenePanel.m_bg_layer1.y += GameConst.BG_SPEED
	}

	public OnEnterFrame():void
	{
		this._tryChangeBgPosition()
		this._try_generate_new_point_line()
		this._updateBgPosition()
	}
}