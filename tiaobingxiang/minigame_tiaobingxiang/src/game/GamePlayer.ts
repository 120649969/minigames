class GamePlayer extends eui.Component{
	
	public m_behit_rects:Array<eui.Rect> = []
	public m_hit_rect:eui.Rect

	private _mainPanel:ui.MainScenePanel
	public move_speed_y = 0
	public move_speed_x = 0

	public isOnLand:boolean = true
	public isInFly:boolean = false

	public constructor(mainPanel:ui.MainScenePanel) {
		super()
		this.skinName = "PlayerSkin"
		this._mainPanel = mainPanel
		this.validateNow()
		this.anchorOffsetX = this.width / 2
		this.anchorOffsetY = this.height

		for(let index = 0; index < GameConst.HIT_NUM; index++)
		{
			this.m_behit_rects.push(this['m_behit_rect' + (index + 1)])
		}
		this.touchEnabled = false
	}

	
	public OnTouch():void
	{
		if(!this.isOnLand){
			return
		}
		this.move_speed_y = GameConst.PLAYER_MOVE_SPEED_INIT_Y
		this.isOnLand = false
		this._checkChangeBoxMove()
	}

	private _checkChangeBoxMove():void
	{
		let box_count = this._mainPanel.all_boxs.length
		if(box_count <= 1){
			return
		}
		let last_box = this._mainPanel.all_boxs[box_count - 2]
		let delta_x = 0
		if(this._mainPanel.currentBox.speed_x > 0){
			delta_x = last_box.x - this._mainPanel.currentBox.x - this._mainPanel.currentBox.width
		} else {
			delta_x = this._mainPanel.currentBox.x - last_box.x - this._mainPanel.currentBox.width
		}
		
		if(delta_x >= GameConst.MIN_COMBOX_DELTA_X && delta_x <= GameConst.MAX_COMBOX_DELTA_X){
			this._mainPanel.currentBox.MoveToDesition(last_box.x)
		}
	}

	public Update(_time_step_callback:Function = null):void
	{
		if(this.isInFly || this.isOnLand) {
			this._invalidUpate(_time_step_callback)
		} else {
			this._touchFlyUpdate(_time_step_callback)
		}
	}

	private _invalidUpate(_time_step_callback:Function = null):void
	{
		if(this._mainPanel.currentBox)
		{
			let time_scale = 1 / GameConst.TOTAL_TIME
			for(let index = 0; index < GameConst.TOTAL_TIME; index ++)
			{
				if(_time_step_callback)
				{
					_time_step_callback(time_scale)
				}
				if(this._checkHitBox())
				{
					return
				}
			}
		}
	}

	private _touchFlyUpdate(_time_step_callback:Function = null):void
	{
		let gravity:number = GameConst.GRAVITY
		let total_time = GameConst.TOTAL_TIME
		for(let index = 0; index < total_time; index ++)
		{
			let start_speed_y = this.move_speed_y - gravity / total_time * index
			let end_speed_y = this.move_speed_y - gravity / total_time * total_time
			let avage_speed_y = (start_speed_y + end_speed_y) / 2 / total_time
			this.y += avage_speed_y
			if(_time_step_callback)
			{
				_time_step_callback(1/ total_time)
			}

			if(this._checkLandOnBox())
			{
				return
			}

			if(this._checkHitBox())
			{
				return
			}

			if(this._checkHitFloor())
			{
				return
			}
		}
		this.move_speed_y += gravity
	}

	private _checkHitBox():boolean
	{
		if(!this._mainPanel.currentBox || !this._mainPanel.currentBox.IsValid())
		{
			return false
		}
		for(let index = 0; index < this.m_behit_rects.length; index++)
		{
			let hit_rect = this.m_behit_rects[index]
			let global_center_point = hit_rect.localToGlobal(hit_rect.width  / 2, hit_rect.height / 2)
			let radius = hit_rect.width  / 2
			if(this._mainPanel.currentBox.IsHitCircle(global_center_point, radius)){
				this._mainPanel.currentBox.OnPlayerHit()
				this.OnHit()
				return true
			}
			// let global_left_top_point = hit_rect.localToGlobal(0, 0)
			// let global_right_down_point = hit_rect.localToGlobal(hit_rect.width, hit_rect.height)
			// if(this._mainPanel.currentBox.IsHitRect(global_left_top_point, global_right_down_point)){
			// 	this._mainPanel.currentBox.OnPlayerHit()
			// 	this.OnHit()
			// 	return true
			// }
		}
		return false
	}

	private _checkLandOnBox():boolean
	{
		let global_buttom_point = this.m_hit_rect.localToGlobal(this.m_hit_rect.width / 2, this.m_hit_rect.height)
		for(let index = this._mainPanel.all_boxs.length - 1; index >= 0; index--)
		{
			let currentBox = this._mainPanel.all_boxs[index]
			if(currentBox.m_hit_rect.hitTestPoint(global_buttom_point.x, global_buttom_point.y)){
				this.isOnLand = true
				this.y = currentBox.y - this._mainPanel.box_height
				this._mainPanel.UpdateBg()
				if(!currentBox.isOver)
				{
					currentBox.OnPlayerLandOn()
					this._mainPanel.AddScore(1)
					let __this = this
					CommonUtils.performDelay(function(){
						__this._mainPanel.GenerateNextBox()
					}, 1 * 1000, this)
				}
				return true
			}
		}
		return false
	}

	private _checkHitFloor():boolean
	{
		let floor_y = this._mainPanel.GetFloorY()
		if(this.y >= floor_y){
			this.y = floor_y
			this.isOnLand = true
			return true
		}
		return false
	}

	public OnHit():void
	{
		this.isInFly = true
		let target_x = this.x - 500
		if(this._mainPanel.currentBox.speed_x > 0){
			target_x = this.x + 500
		}
		let __this = this
		egret.Tween.get(this).to({x:target_x}, 0.3 * 1000).call(function(){
			__this.ReSet()
		},this)
	}

	public ReSet():void
	{
		this.x = this._mainPanel.width / 2
		this.y = this._mainPanel.current_box_y
		this.isOnLand = true
		this.isInFly = false
		this.move_speed_x = 0

		let __this = this
		CommonUtils.performDelay(function(){
			__this._mainPanel.GenerateNextBox()
		}, 0.5 * 1000, this)
	}
}