class GamePlayer extends eui.Component{

	private HIT_NUM = 2
	public m_hit_rects:Array<eui.Rect> = []
	private _mainPanel:ui.MainScenePanel

	public move_speed_y = 0
	public move_speed_x = 0

	public isOnLand:boolean = true
	public isInFly:boolean = false

	private _fly_times = 15
	private _cur_fly_times = 0

	public constructor(mainPanel:ui.MainScenePanel) {
		super()
		this.skinName = "PlayerSkin"
		this._mainPanel = mainPanel
		this.validateNow()
		this.anchorOffsetX = this.width / 2
		this.anchorOffsetY = this.height

		for(let index = 0; index < this.HIT_NUM; index ++)
		{
			this.m_hit_rects.push(this['m_hit_rect' + (index + 1)])
		}
	}

	
	public OnTouch():void
	{
		if(!this.isOnLand){
			return
		}
		this.move_speed_y = -40
		this.isOnLand = false
	}

	public Update(_time_step_callback:Function = null):void
	{
		if(this.isInFly) {
			this._hitFlyUpdate()
		} else {
			if(this.isOnLand)
			{
				return 
			}
			this._touchFlyUpdate(_time_step_callback)
		}
	}

	private _touchFlyUpdate(_time_step_callback:Function = null):void
	{
		let gravity:number = 5
		let total_time = 30
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

			this._checkHitFloor()

			if(this.isOnLand || this.isInFly)
			{
				return
			}
		}
		this.move_speed_y += gravity
	}

	private _checkHitFloor():void
	{
		let global_player_point = this.parent.localToGlobal(this.x, this.y)
		global_player_point.y = Math.min(global_player_point.y, this._mainPanel.GetMaxY())
		if(global_player_point.y == this._mainPanel.GetMaxY()){
			let local_player_point = this.parent.globalToLocal(global_player_point.x, global_player_point.y)
			this.y = local_player_point.y
			this.OnLand(false)
		}
	}

	private _hitFlyUpdate():void
	{
		let gravity:number = 5
		this._cur_fly_times += 1
		this.x += this.move_speed_x
		let target_speed_y = this.move_speed_y + gravity
		this.y += (target_speed_y + this.move_speed_y) / 2
		this.move_speed_y = target_speed_y

		if(this._cur_fly_times >= this._fly_times){
			this.ReSet()
		}
	}

	public OnLand(is_land_on_box:boolean = true):void
	{
		this.isOnLand = true
		if(is_land_on_box)
		{
			let __this = this
			CommonUtils.performDelay(function(){
				__this._mainPanel.GenerateNextBox()
			}, 1 * 1000, this)
		}
	}

	public OnHit():void
	{
		this.isInFly = true
	}

	public ReSet():void
	{
		this.x = this._mainPanel.width / 2
		this.y = this._mainPanel.last_box_y
		this.isOnLand = true
		this.isInFly = false
		this.move_speed_x = 0

		let __this = this
		CommonUtils.performDelay(function(){
			__this._mainPanel.GenerateNextBox()
		}, 0.5 * 1000, this)
	}
}