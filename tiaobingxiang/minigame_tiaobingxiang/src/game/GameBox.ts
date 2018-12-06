class GameBox extends eui.Component{

	private _mainPanel:ui.MainScenePanel
	private m_img_box:eui.Image
	private m_hit_rect:eui.Rect

	public speed_x = 0
	public isOver = false
	public isReStart = false

	public init_x = 0
	public init_y = 0
	public constructor(mainPanel:ui.MainScenePanel) {
		super()
		this.skinName = "BoxSkin"
		this._mainPanel = mainPanel
		this.validateNow()
		this.anchorOffsetX = this.width / 2
		this.anchorOffsetY = this.height
	}

	public ReStart():void
	{
		this.x = this.init_x
		this.y = this.init_y
		this.isReStart = false
	}

	public Update(delta:number = 1):void
	{
		if(this.isReStart)
		{
			return
		}
		if(this.isOver){
			return
		}
		this.x += this.speed_x * delta
		this._checkHitPlayer()
	}

	private _global_left_top_point:egret.Point = new egret.Point()
	private _global_right_down_point:egret.Point = new egret.Point()
	private _checkHitPlayer():void
	{
		let mainPlayer:GamePlayer = this._mainPanel.mainPlayer

		this.m_hit_rect.localToGlobal(0, 0, this._global_left_top_point)
		this.m_hit_rect.localToGlobal(this.m_hit_rect.width, this.m_hit_rect.height, this._global_right_down_point)

		for(let index = 0; index < mainPlayer.m_hit_rects.length; index++)
		{
			let hit_rect = mainPlayer.m_hit_rects[index]
			let global_left_top_point = hit_rect.localToGlobal(0, 0)
			let global_right_down_point = hit_rect.localToGlobal(hit_rect.width, hit_rect.height)
			if(this._is_hit(global_left_top_point)){
				this._onHit()
				return
			}
			if(this._is_hit(global_right_down_point)){
				this._onHit()
				return
			}
			if(this._is_hit(new egret.Point(global_left_top_point.x, global_right_down_point.y))){
				this._onHit()
				return
			}
			if(this._is_hit(new egret.Point(global_right_down_point.x, global_left_top_point.y))){
				this._onHit()
				return
			}
		}
	}

	private _is_hit(hit_point:egret.Point):boolean
	{
		return (hit_point.x >= this._global_left_top_point.x && hit_point.x <= this._global_right_down_point.x) && (hit_point.y >= this._global_left_top_point.y && hit_point.x <= this._global_right_down_point.y)
	}

	private _onHit():void
	{
		this.isOver = true
		let mainPlayer:GamePlayer = this._mainPanel.mainPlayer
		let global_player_point = mainPlayer.parent.localToGlobal(mainPlayer.x, mainPlayer.y)
		if(global_player_point.y <= (this._global_left_top_point.y + this._global_right_down_point.y) / 2)
		{
			this._happenLand()
			return
		}
		this._happendHit()
	}

	private _happenLand():void
	{
		this._mainPanel.mainPlayer.OnLand()
	}

	private _happendHit():void
	{
		this._mainPanel.mainPlayer.OnHit()
		this.visible = false
		this.isReStart = true
	}
}