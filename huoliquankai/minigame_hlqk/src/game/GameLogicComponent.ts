class GameLogicComponent extends BaseComponent{
	
	public all_point_lines:Array<GamePoint> = []

	private _mainScenePanel:ui.MainScenePanel
	public mainPlayer:GamePlayer

	public currentPropObject:GameProp
	private _is_in_generate_cd:boolean = false

	public constructor() {
		super()
		this._mainScenePanel = GameController.instance.GetMainScenePanel()
		this.mainPlayer = this._mainScenePanel.m_player
		this.mainPlayer.Init()
	}

	private _tryChangeBgPosition():void
	{
		let bg = this._mainScenePanel.all_img_bgs[0]
		let lastbg = this._mainScenePanel.all_img_bgs[this._mainScenePanel.all_img_bgs.length - 1]
		let global_point = bg.localToGlobal(0, 0)
		if(global_point.y >= this._mainScenePanel.height + 400){
			this._mainScenePanel.all_img_bgs.splice(0, 1)
			this._mainScenePanel.all_img_bgs.push(bg)
			bg.y = lastbg.y - lastbg.height + 2
		}
	}

	private _try_generate_new_prop():void
	{
		if(this.currentPropObject)
		{
			return
		}
		if(this._is_in_generate_cd){
			return
		}
		this._is_in_generate_cd = true
		let __this = this
		CommonUtils.performDelay(function(){
			__this._is_in_generate_cd = false
		}, 1 * 1000, this)
		let is_generate = Math.random() < 0.2
		if(is_generate)
		{
			this.currentPropObject = new GameProp()
			this._mainScenePanel.m_prop_layer.addChild(this.currentPropObject)
			this.currentPropObject.x = Math.random() * (this._mainScenePanel.width - this.currentPropObject.width)
			let top_point_line = this.all_point_lines[this.all_point_lines.length - 1]
			this.currentPropObject.y = top_point_line.y - 500
		}
	}

	private _try_generate_new_point_line():void
	{
		let cur_y = 0
		if(this.all_point_lines.length < 5)
		{
			let is_two = Math.random() < 0.4
			let line_count = 1
			if(is_two){
				line_count = 2
			}
			if(this.all_point_lines.length > 0){
				cur_y = this.all_point_lines[this.all_point_lines.length - 1].y
				cur_y -= this._mainScenePanel.height / 2 + Math.ceil(Math.random() * 100) * CommonUtils.GetRandomPositive()
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


	private _try_recycle_point_line():void
	{
		let delete_point_lines = []
		for(let point_line of this.all_point_lines)
		{
			let game_line:BaseGameBoxLine = point_line.all_lines[0]
			let global_top_point = game_line.localToGlobal(0, 0)
			if(global_top_point.y > GameController.instance.GetMainScenePanel().height + 400){
				delete_point_lines.push(point_line)
			}else{
				break
			}
		}
		
		for(let index = 0; index < delete_point_lines.length; index++)
		{
			let point_line = delete_point_lines[index]
			let index_of_point_line = this.all_point_lines.indexOf(point_line)
			this.all_point_lines.splice(index_of_point_line, 1)
		}
	}

	private _updateBgPosition():void
	{
		this._mainScenePanel.m_bg_layer1.y += GameConst.BG_SPEED
		this._mainScenePanel.m_prop_layer.y += GameConst.BG_SPEED
	}

	public OnEnterFrame():void
	{
		this.mainPlayer.UpateBullet()
		if(this.mainPlayer.is_stop){
			return
		}
		
		this._tryChangeBgPosition()
		this._try_generate_new_point_line()
		this._updateBgPosition()
		this._try_recycle_point_line()
		this._try_generate_new_prop()
		if(this.currentPropObject)
		{
			this.currentPropObject.Update()
		}
		this.mainPlayer.Update()
	}

	public PlayFlyStarAnimation(box:GameBox):void
	{
		let star = new egret.Bitmap()
		star.texture = RES.getRes('deng2_png')

		this._mainScenePanel.addChild(star)

		let global_point = box.img_deng.localToGlobal(0, 0)
		let local_point = this._mainScenePanel.globalToLocal(global_point.x, global_point.y)
		star.x = local_point.x
		star.y = local_point.y

		let __this = this
		let global_player_point = this.mainPlayer.localToGlobal(this.mainPlayer.width / 2, this.mainPlayer.height / 2)
		let local_player_point = this._mainScenePanel.globalToLocal(global_player_point.x, global_player_point.y)
		egret.Tween.get(star).to({x:local_player_point.x - star.width / 2 * 0.5, y:local_player_point.y - star.height / 2 * 0.5, scaleX:0.5, scaleY:0.5}, 0.3 * 1000).call(function(){
			star.parent.removeChild(star)
			__this.mainPlayer.PlayDengAnimation()
		})
		SoundManager.getInstance().playSound("deng_mp3")
	}

	private _cache_broken_displays:Array<dragonBones.EgretArmatureDisplay> = []
	private _broken_width:number
	private _broken_height:number
	private _get_or_create_broken_display():dragonBones.EgretArmatureDisplay
	{
		if(this._cache_broken_displays.length > 0){
			return this._cache_broken_displays.pop()
		}
		let armatureDisplay = CommonUtils.createDragonBones("broken_ske_json", "broken_tex_json", "broken_tex_png", "broken_armature")
		this._mainScenePanel.addChild(armatureDisplay)

		this._broken_width = armatureDisplay.width 
		this._broken_height = armatureDisplay.height
		let __this = this
		armatureDisplay.addDBEventListener(dragonBones.AnimationEvent.COMPLETE, function(){
			armatureDisplay.visible = false
			armatureDisplay.scaleX = 1
			armatureDisplay.scaleY = 1
			__this._cache_broken_displays.push(armatureDisplay)
		}, this)
		return armatureDisplay
	}

	public PlayBrokenAnimation(box:GameBox):void
	{
		let armatureDisplay = this._get_or_create_broken_display()
		armatureDisplay.visible = true
		let global_point = box.localToGlobal(box.width / 2, box.height / 2)
		let local_point = this._mainScenePanel.globalToLocal(global_point.x, global_point.y)
		armatureDisplay.x = local_point.x
		armatureDisplay.y = local_point.y
		armatureDisplay.scaleX = box.width / this._broken_width
		armatureDisplay.scaleY = box.height / this._broken_height
		armatureDisplay.animation.play("broken_animation", 1)
	}

	private _cache_hit_displays:Array<dragonBones.EgretArmatureDisplay> = []
	private _get_or_create_hit_display():dragonBones.EgretArmatureDisplay
	{
		if(this._cache_hit_displays.length > 0)
		{
			return this._cache_hit_displays.pop()
		}
		let armatureDisplay = CommonUtils.createDragonBones("hit_ske_json", "hit_tex_json", "hit_tex_png", "hit_armature")
		this._mainScenePanel.addChild(armatureDisplay)
		let __this = this
		armatureDisplay.addDBEventListener(dragonBones.AnimationEvent.COMPLETE, function(){
			armatureDisplay.visible = false
			__this._cache_hit_displays.push(armatureDisplay)
		}, this)
		return armatureDisplay
	}

	public PlayHitAnimation(bullet:GameBullet):void
	{
		let armatureDisplay = this._get_or_create_hit_display()
		armatureDisplay.visible = true
		let global_point = bullet.localToGlobal(bullet.width / 2, bullet.height / 2)
		let local_point = this._mainScenePanel.globalToLocal(global_point.x, global_point.y)
		armatureDisplay.x = local_point.x
		armatureDisplay.y = local_point.y
		armatureDisplay.animation.play("hit_animation", 1)
	}


	public AddScore(score:number):void
	{
		GameController.instance.serverModel.myRole.score += score
		if(!GameNet.isConnected()){
			GameController.instance.offline_score += score
		}else{
			GameNet.reqChangeScore(score)
		}
		this._mainScenePanel.UpdateScore()
	}
}