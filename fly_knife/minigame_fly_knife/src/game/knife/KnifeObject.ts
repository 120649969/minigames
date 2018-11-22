class KnifeObject extends eui.Component{

	public is_end:boolean = false
	public lastY:number = 0
	public speedY:number = 0
	public speedX:number = 0
	public acceY:number = 0
	private _mainPanel:MainGameScene
	private _platObject:PlateObject
	public m_img:egret.DisplayObject
	public behit_rect:eui.Rect
	public hit_rect:eui.Rect
	public hit_ball_rect:eui.Rect

	public testLabel:eui.Label
	public degree_on_plate:number = 0
	public label_index:number = 0
	public isMe:boolean = true

	public constructor(mainPanel:MainGameScene) {
		super()
		this.skinName = "KnifeSkin"
		this._mainPanel = mainPanel
		this._platObject = this._mainPanel.m_plate_object
		this.is_end = false
	}

	public StartTouchMove():void
	{
		egret.Tween.removeTweens(this)

		this.speedY = KnifeConst.KNIFE_INIT_SPEED
		this.acceY = KnifeConst.KNIFE_ACCE
	}

	public StartBirthMove(targetX:number, targetY:number):void
	{
		this.x = targetX - this.width / 2
		this.y = targetY + 500
		egret.Tween.get(this).to({x:targetX, y:targetY}, 0.1 * 1000)
	}

	public Update():void
	{
		if(this.is_end){
			return
		}

		let target_speed_x = this.speedX
		let target_speed_y = this.speedY + this.acceY

		let total_speed = Math.sqrt(Math.pow(target_speed_x, 2) + Math.pow(target_speed_y, 2))
		let step_speed = 2
		let times = Math.ceil(total_speed / step_speed)
		let step_speend_x = target_speed_x / times
		let step_speend_y = target_speed_y / times
		for(let step_idx = 1; step_idx <= times; step_idx++)
		{
			this.x += step_speend_x
			this.y += step_speend_y
			if(this._checkHitBall()){
				this._onHitBall()
				break
			}

			if(this.isMe && this._checkOtherKnife())
			{
				this._onHitOtherKnife()
				break
			}
		}

		// let move_distance = (target_speed_y + this.speedY) / 2
		// let step_move_distance = 10
		
		// let move_step_times = Math.ceil(Math.abs(move_distance / step_move_distance))
		// for(let move_step_index = 0; move_step_index < move_step_times; move_step_index ++)
		// {
		// 	let this_move_distance = 1 / move_step_times * move_distance
		// 	this.y += this_move_distance
		// 	if(this._checkHitBall()){
		// 		this._onHitBall()
		// 		break
		// 	}

		// 	if(this.isMe && this._checkOtherKnife())
		// 	{
		// 		this._onHitOtherKnife()
		// 		break
		// 	}
		// }
		// this.speedY = target_speed_y
	}

	private _checkHitBall():boolean
	{
		let global_ball_point = this._mainPanel.m_plate_object.GetGlobalCenterPoint()
		let global_hit_ball_point = this.localToGlobal(this.hit_ball_rect.x + this.hit_ball_rect.width / 2, this.hit_ball_rect.y + this.hit_ball_rect.height / 2)
		if(Math.sqrt(Math.pow(global_ball_point.x - global_hit_ball_point.x, 2) + Math.pow(global_ball_point.y - global_hit_ball_point.y, 2)) <= this._mainPanel.m_plate_object.m_plate_container.width / 2){
			return true
		}
		return false
	}

	private _checkOtherKnife():boolean
	{
		let global_knife_left_point = this.localToGlobal(this.hit_rect.x, 0)
		let global_knife_right_point = this.localToGlobal(this.hit_rect.x + this.hit_rect.width, 0)
		let all_knife_objects = this._platObject.all_knife_objects
		for(let index = 0; index < all_knife_objects.length; index++)
		{
			let other_knife_object = all_knife_objects[index]
			let left_local_in_knife_object = other_knife_object.globalToLocal(global_knife_left_point.x, global_knife_left_point.y)
			if(left_local_in_knife_object.x >= other_knife_object.behit_rect.x && left_local_in_knife_object.x <= other_knife_object.behit_rect.x + other_knife_object.behit_rect.width)
			{
				if(left_local_in_knife_object.y >= other_knife_object.behit_rect.y && left_local_in_knife_object.y <= other_knife_object.behit_rect.y + other_knife_object.behit_rect.height)
				{
					return true
				}
			}

			let right_local_in_knife_object = other_knife_object.globalToLocal(global_knife_right_point.x, global_knife_right_point.y)
			if(right_local_in_knife_object.x >= other_knife_object.behit_rect.x && right_local_in_knife_object.x <=  other_knife_object.behit_rect.x + other_knife_object.behit_rect.width)
			{
				if(right_local_in_knife_object.y >= other_knife_object.behit_rect.y && right_local_in_knife_object.y <= other_knife_object.behit_rect.y + other_knife_object.behit_rect.height)
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
		this._platObject.m_plate_container.setChildIndex(this._mainPanel.m_plate_image, this._platObject.m_plate_container.numChildren)
		this.rotation -= this._platObject.m_plate_container.rotation  //egret好奇葩呀
		this.x = local_in_ball_object.x
		this.y = local_in_ball_object.y
		

		//a
		let local_point_in_center = new egret.Point()
		local_point_in_center.x = this._platObject.m_plate_container.width / 2
		local_point_in_center.y = this._platObject.m_plate_container.height / 2

		//b
		let local_point_in_right_center = new egret.Point()
		local_point_in_right_center.x = this._platObject.m_plate_container.width
		local_point_in_right_center.y = this._platObject.m_plate_container.height / 2

		let vec_ab = new egret.Point(local_point_in_right_center.x - local_point_in_center.x, local_point_in_right_center.y - local_point_in_center.y)
		let vec_ac = new egret.Point(local_in_ball_object.x - local_point_in_center.x, local_in_ball_object.y - local_point_in_center.y)
		let cos_a_value = (vec_ac.x * vec_ab.x + vec_ac.y * vec_ab.y) / (vec_ab.length * vec_ac.length)
		let degree = Math.acos(cos_a_value) / Math.PI * 180
		

		if(local_in_ball_object.y < local_point_in_center.y){
			degree = 360 - degree
		}
		this.degree_on_plate = degree //0--360范围，已右中间的点为起点，测试计算正确
		console.log("当前的角度", this.degree_on_plate)

		this._platObject.OnHit(this)
	}

	private _onHitOtherKnife():void
	{
		this.is_end = true
		egret.Tween.get(this, {loop:true}).to({rotation:180}, 0.3 * 1000).to({rotation:360}, 0.3 * 1000)
		let target_x = this.x + 100
		let target_y = this.y + 1000
		
		this.anchorOffsetX = this.width / 2
		this.anchorOffsetY = this.height / 2
		let __this = this
		egret.Tween.get(this).to({x: target_x, y: target_y}, 1 * 1000, egret.Ease.sineIn).call(function(){
			egret.Tween.removeTweens(__this)
			__this._mainPanel.ShowResult(false)
		})
	}
}