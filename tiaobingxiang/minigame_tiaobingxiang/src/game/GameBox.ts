class GameBox extends eui.Component{

	
	private _mainPanel:ui.MainScenePanel
	private m_img_box:eui.Image
	public m_hit_rect:eui.Rect

	public speed_x = 0
	public isOver = false
	public isReStart = false

	public init_x = 0
	public init_y = 0

	private _move_total_x = 0
	public constructor(mainPanel:ui.MainScenePanel) {
		super()
		this.skinName = "BoxSkin"
		this._mainPanel = mainPanel
		this.validateNow()
		this.anchorOffsetX = this.width / 2
		this.anchorOffsetY = this.height
		
		let random_index = Math.ceil(Math.random() * GameConst.MAX_BOX_COUNT)
		this.m_img_box.source = "box" + random_index + "_png"
	}

	public ReStart():void
	{
		this.isOver = false
		this.x = this.init_x
		this.y = this.init_y
		this.isReStart = false
		this.visible = true
		this._move_total_x = 0
	}

	public Update(delta:number = 1):void
	{
		if(!this.IsValid())
		{
			return
		}
		this.x += this.speed_x * delta
		this._move_total_x += this.speed_x * delta
		
		if(Math.abs(this._move_total_x) > this._mainPanel.width * 2){
			this.isReStart = true
			let __this = this
			CommonUtils.performDelay(function(){
				__this._mainPanel.GenerateNextBox()
			}, 0.1 * 1000, this)
		}
	}

	public IsValid():boolean
	{
		return !this.isOver && !this.isReStart
	}

	public IsHitCircle(cirle_point:egret.Point, radius:number):boolean
	{
		let global_left_top_point = this.m_hit_rect.localToGlobal(0, 0)
		let global_right_down_point = this.m_hit_rect.localToGlobal(this.m_hit_rect.width, this.m_hit_rect.height)
		if(this.speed_x > 0){ //向右
			if(this._isPointInCircle(new egret.Point(global_right_down_point.x, global_left_top_point.y), cirle_point, radius)){
				return true
			}
			if(this._isPointInCircle(new egret.Point(global_right_down_point.x, (global_right_down_point.y + global_left_top_point.y) / 2), cirle_point, radius)){
				return true
			}
			if(this._isPointInCircle(global_right_down_point, cirle_point, radius)){
				return true
			}
		} else{
			if(this._isPointInCircle(new egret.Point(global_left_top_point.x, global_right_down_point.y), cirle_point, radius)){
				return true
			}
			if(this._isPointInCircle(new egret.Point(global_left_top_point.x, (global_right_down_point.y + global_left_top_point.y) / 2), cirle_point, radius)){
				return true
			}
			if(this._isPointInCircle(global_left_top_point, cirle_point, radius)){
				return true
			}
		}
		return false
	}

	public _isPointInCircle(testPoint:egret.Point, cirle_point:egret.Point, radius:number):boolean
	{
		let distance = Math.sqrt(Math.pow(testPoint.x - cirle_point.x, 2) + Math.pow(testPoint.y - cirle_point.y, 2))
		return distance <= radius
	}

	public IsHitRect(left_top_point:egret.Point, right_down_point:egret.Point):boolean
	{
		if(this._is_hit(left_top_point)){
			return true
		}
		if(this._is_hit(right_down_point)){
			return true
		}
		if(this._is_hit(new egret.Point(left_top_point.x, right_down_point.y))){
			return true
		}
		if(this._is_hit(new egret.Point(right_down_point.x, left_top_point.y))){
			return true
		}
		if(this._is_hit(new egret.Point(left_top_point.x, (left_top_point.y + right_down_point.y) / 2))){
			return true
		}
		if(this._is_hit(new egret.Point(right_down_point.x,(left_top_point.y + right_down_point.y) / 2))){
			return true
		}
		return false
	}

	private _is_hit(hit_point:egret.Point):boolean
	{
		return this.m_hit_rect.hitTestPoint(hit_point.x, hit_point.y)
	}

	public OnPlayerHit():void
	{
		this.visible = false
		this.isReStart = true
	}

	public OnPlayerLandOn():void
	{
		this.isOver = true
	}
}