class GamePlayer extends eui.Component{

	public hit_rect:eui.Rect
	private _mainPanel:ui.MainScenePanel
	public all_game_bullets:Array<GameBullet> = []
	public cur_frame:number = 0
	public last_send_frame:number = 0

	private img_avatar:eui.Image
	public is_stop:boolean = false
	private _is_first = true
	public prop_type:GamePropType = GamePropType.None

	public constructor() {
		super()
		this.skinName = "PlayerSkin"
	}


	public Init():void
	{
		this._mainPanel = GameController.instance.GetMainScenePanel()
	}

	public GetNode():egret.DisplayObject
	{
		return this
	}

	public UpateBullet():void
	{
		for(let bullet of this.all_game_bullets)
		{
			bullet.Update()
		}

		for(let index = this.all_game_bullets.length - 1; index >= 0; index--)
		{
			let bullet = this.all_game_bullets[index]
			if(!bullet.is_valid)
			{
				this.all_game_bullets.splice(index, 1)
			}
		}
	}

	private _get_bullet_count():number
	{
		if(this.prop_type == GamePropType.SAN)
		{
			return 3
		}
		return 1
	}

	private _get_bullet_speed(cur, max):egret.Point
	{
		if(max == 1){
			return new egret.Point(0, GameConst.BULLET_SPEED)
		}else{
			if(cur == 1){
				return new egret.Point(0, GameConst.BULLET_SPEED)
			}else if(cur == 2){
				return new egret.Point(-5, GameConst.BULLET_SPEED)
			}else if(cur == 3){
				return new egret.Point(5, GameConst.BULLET_SPEED)
			}
		}
		return new egret.Point(0, GameConst.BULLET_SPEED)
	}

	private _get_bullet_speed_scale():number
	{
		if(this.prop_type == GamePropType.SPEED)
		{
			return 2
		}
		return 1
	}

	public Update():void
	{
		let global_top_center_point = this.hit_rect.localToGlobal(this.hit_rect.width / 2, 0)
		let local_in_bullet_layer = this._mainPanel.m_bullet_layer.globalToLocal(global_top_center_point.x, global_top_center_point.y)
		this.cur_frame += 1
		let time_interval = GameConst.SEND_TIME_INTERVAL
		if(this.prop_type == GamePropType.SPEED){
			time_interval /= 1.5
		}
		if(this.cur_frame - this.last_send_frame > time_interval || this._is_first){
			this._is_first = false
			this.last_send_frame = this.cur_frame
			let bullet_count = this._get_bullet_count()
			for(let index = 0; index < bullet_count; index++)
			{
				let new_bullet = new GameBullet()
				this._mainPanel.m_bullet_layer.addChild(new_bullet)
				new_bullet.x = local_in_bullet_layer.x
				new_bullet.y = local_in_bullet_layer.y - new_bullet.height / 2
				this.all_game_bullets.push(new_bullet)
				let speed = this._get_bullet_speed(index + 1, bullet_count)
				new_bullet.speed_y = speed.y * this._get_bullet_speed_scale()
				new_bullet.speed_x = speed.x
			}
			if(bullet_count == 1){
				SoundManager.getInstance().playSound("send_mp3")
			}else{
				SoundManager.getInstance().playSound("send2_mp3")
			}
			
		}

		this._try_get_prop()

		if(this.CheckHit())
		{
			this.is_stop = true
			let __this = this
			this.PlayHitFlyAnimation()
			// CommonUtils.performDelay(function(){
			// 	__this.is_stop = false
			// }, 1 * 1000, this)
		}
	}

	private _prop_armature_display:dragonBones.EgretArmatureDisplay
	private _playPropAnimation():void
	{
		if(!this._prop_armature_display)
		{
			this._prop_armature_display = CommonUtils.createDragonBones("prop_ske_json", "prop_tex_json", "prop_tex_png", "prop_armature")
			this.addChild(this._prop_armature_display)
			this._prop_armature_display.x = this.width / 2
			this._prop_armature_display.y = this.height / 2
			let __this = this
			this._prop_armature_display.addDBEventListener(dragonBones.AnimationEvent.COMPLETE, function(){
				__this._prop_armature_display.visible = false
			}, this)
		}
		this._prop_armature_display.visible = true
		if(this.prop_type == GamePropType.SPEED){
			this._prop_armature_display.animation.play('speed_animation', 1)
		}else{
			this._prop_armature_display.animation.play('sanbei_animation', 1)
		}
	}

	private _deng_armature_display:dragonBones.EgretArmatureDisplay
	public PlayDengAnimation():void
	{
		if(!this._deng_armature_display)
		{
			this._deng_armature_display = CommonUtils.createDragonBones("deng_ske_json", "deng_tex_json", "deng_tex_png", "deng_armature")
			this.addChild(this._deng_armature_display)
			this._deng_armature_display.x = this.width / 2
			this._deng_armature_display.y = this.height / 2
			let __this = this
			this._deng_armature_display.addDBEventListener(dragonBones.AnimationEvent.COMPLETE, function(){
				__this._deng_armature_display.visible = false
			}, this)
		}
		this._deng_armature_display.visible = true
		this._deng_armature_display.animation.play('deng_animation', 1)
	}


	private _hit_fly_display:dragonBones.EgretArmatureDisplay
	public PlayHitFlyAnimation():void
	{
		if(!this._hit_fly_display)
		{
			this._hit_fly_display = CommonUtils.createDragonBones("hit_fly_ske_json", "hit_fly_tex_json", "hit_fly_tex_png", "hit_fly_armature")
			this.addChild(this._hit_fly_display)
			this._hit_fly_display.x = this.width / 2
			this._hit_fly_display.y = this.height / 2
			let __this = this
			this._hit_fly_display.addDBEventListener(dragonBones.AnimationEvent.COMPLETE, function(){
				__this._hit_fly_display.visible = false
				__this.img_avatar.visible = true
				__this.is_stop = false
			}, this)
		}
		this.img_avatar.visible = false
		this._hit_fly_display.visible = true
		this._hit_fly_display.animation.play('hit_fly', 1)

		SoundManager.getInstance().playSound("hit_fly_mp3")
	}

	private _try_get_prop():void
	{
		let prop_object = this._mainPanel.GetGameLogicComponent().currentPropObject
		if(prop_object)
		{
			if(prop_object.getBounds().intersects(this.getTransformedBounds(prop_object))){
				this.prop_type = prop_object.propType
				prop_object.Remove()
				this._playPropAnimation()
				SoundManager.getInstance().playSound("prop_mp3")
				let __this = this
				CommonUtils.performDelay(function(){
					__this.prop_type = GamePropType.None
				}, GameConst.PROP_DURATION, this)
			}
		}
	}

	public CheckHit():boolean
	{
		let global_player_left_top = this.hit_rect.localToGlobal(0, 0)
		let global_player_right_down = this.hit_rect.localToGlobal(this.hit_rect.width, this.hit_rect.height)

		let game_logic_component = GameController.instance.GetMainScenePanel().GetGameLogicComponent()
		let all_point_lines = game_logic_component.all_point_lines
		for(let point_line of all_point_lines)
		{
			let all_lines = point_line.all_lines
			let top_line = all_lines[0]
			let buttoom_line = point_line.GetButtomValidGameLine()
			if(top_line && buttoom_line)
			{
				let top_line_global_left_top = top_line.hit_rect.localToGlobal(0, 0)
				let top_line_global_right_down = top_line.hit_rect.localToGlobal(top_line.hit_rect.width, top_line.hit_rect.height)
				let buttom_line_global_left_top = buttoom_line.hit_rect.localToGlobal(0, 0)
				let buttom_line_global_right_down = buttoom_line.hit_rect.localToGlobal(buttoom_line.hit_rect.width, buttoom_line.hit_rect.height)

				if(global_player_left_top.y > buttom_line_global_right_down.y){ //在下方
					return
				}

				if(global_player_right_down.y < top_line_global_left_top.y){ //在上方
					continue
				}

				for(let index = 0; index < all_lines.length; index++)
				{
					let line = all_lines[index]
					if(line.is_valid)
					{
						for(let box_index = 0; box_index < line.all_boxs.length; box_index++)
						{
							let box =line.all_boxs[box_index]
							if(box && box.is_valid)
							{
								if(box.hit_rect.getBounds().intersects(this.hit_rect.getTransformedBounds(box, null))){
									point_line.RemoveGameLine(line)
									return true
								}
							}
						}
					}
				}
			}
		}
		return false
	}
}