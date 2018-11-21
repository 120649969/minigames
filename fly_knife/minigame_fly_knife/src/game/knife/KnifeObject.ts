class KnifeObject extends egret.DisplayObjectContainer{

	public is_end:boolean = false
	public knife_bitmap:egret.Bitmap
	public lastY:number = 0
	public speedY:number = 0
	public acceY:number = 0
	private _mainPanel:MainGameScene
	private _platObject:PlateObject

	public testLabel:eui.Label
	public constructor(mainPanel:MainGameScene) {
		super()

		this._mainPanel = mainPanel
		this._platObject = this._mainPanel.m_plate_object
		let new_bitmap = new egret.Bitmap()
		new_bitmap.texture = RES.getRes("nife_png")
		new_bitmap.anchorOffsetX = new_bitmap.width / 2
		new_bitmap.anchorOffsetY = 0
		this.knife_bitmap = new_bitmap
		this.addChild(new_bitmap)

		let label = new eui.Label()
		label.text = ""
		this.testLabel = label
		this.addChild(label)
		label.x = this.knife_bitmap.width / 2
		label.y = this.knife_bitmap.height / 2

		this.is_end = false
	}

	public StartTouchMove():void
	{
		egret.Tween.removeTweens(this.knife_bitmap)

		this.speedY = KnifeConst.KNIFE_INIT_SPEED
		this.acceY = KnifeConst.KNIFE_ACCE
	}

	public StartBirthMove(targetX:number, targetY:number):void
	{
		this.x = targetX
		this.y = targetY + 500
		egret.Tween.get(this).to({x:targetX, y:targetY}, 0.1 * 1000)
	}

	public Update():void
	{
		if(this.is_end){
			return
		}

		let target_speed_y = this.speedY + this.acceY
		let move_distance = (target_speed_y + this.speedY) / 2
		let step_move_distance = 10
		
		let move_step_times = Math.ceil(Math.abs(move_distance / step_move_distance))
		for(let move_step_index = 0; move_step_index < move_step_times; move_step_index ++)
		{
			let this_move_distance = 1 / move_step_times * move_distance
			this.y += this_move_distance
			if(this._checkHitBall()){
				this._onHitBall()
				break
			}

			if(this._checkOtherKnife())
			{
				this._onHitOtherKnife()
				break
			}
		}
		this.speedY = target_speed_y
	}

	private _checkHitBall():boolean
	{
		if(Math.abs(this.y + KnifeConst.KNIFE_HIT_HEIGHT * 4 / 5 - this._platObject.m_plate_container.y) < this._platObject.m_plate_container.width / 2){
			return true
		}
		return false
	}

	private _checkOtherKnife():boolean
	{
		let global_knife_left_point = this.localToGlobal(KnifeConst.KNIFE_WIDTH / 2 * -1, 0)
		let global_knife_right_point = this.localToGlobal(KnifeConst.KNIFE_WIDTH / 2, 0)
		let all_knife_objects = this._platObject.all_knife_objects
		for(let index = 0; index < all_knife_objects.length; index++)
		{
			let other_knife_object = all_knife_objects[index]
			let left_local_in_knife_object = other_knife_object.globalToLocal(global_knife_left_point.x, global_knife_left_point.y)
			if(left_local_in_knife_object.x >= 0 && left_local_in_knife_object.x <= KnifeConst.KNIFE_WIDTH)
			{
				if(left_local_in_knife_object.y >= 0 && left_local_in_knife_object.y <= KnifeConst.KNIFE_BEHIT_HEIGHT)
				{
					return true
				}
			}

			let right_local_in_knife_object = other_knife_object.globalToLocal(global_knife_right_point.x, global_knife_right_point.y)
			if(right_local_in_knife_object.x >= 0 && right_local_in_knife_object.x <= KnifeConst.KNIFE_WIDTH)
			{
				if(right_local_in_knife_object.y >= 0 && right_local_in_knife_object.y <= KnifeConst.KNIFE_BEHIT_HEIGHT)
				{
					return true
				}
			}
		}
		return false
	}

	public _onHitBall():void
	{
		this.is_end = true
		let global_knife_point = this.localToGlobal(0, 0)
		let local_in_ball_object = this._platObject.m_plate_container.globalToLocal(global_knife_point.x, global_knife_point.y)
		this.parent.removeChild(this)
		this._platObject.m_plate_container.addChild(this)
		// this._mainPanel.m_plate_image.parent.setChildIndex(this._mainPanel.m_plate_image, this._mainPanel.m_plate_image.parent.numChildren)
		this.rotation = this._platObject.m_plate_container.rotation * -1  //egret好奇葩呀
		this.x = local_in_ball_object.x
		this.y = local_in_ball_object.y
		this._platObject.OnHit(this)
	}

	private _onHitOtherKnife():void
	{
		this.is_end = true
		egret.Tween.get(this, {loop:true}).to({rotation:180}, 0.3 * 1000).to({rotation:360}, 0.3 * 1000)
		let target_x = this.x + 100
		let target_y = this.y + 1000

		this.knife_bitmap.anchorOffsetY = this.knife_bitmap.height / 2
		let __this = this
		egret.Tween.get(this).to({x: target_x, y: target_y}, 1 * 1000, egret.Ease.sineIn).call(function(){
			egret.Tween.removeTweens(__this)
			__this._mainPanel.NextRound()
		})
	}
}