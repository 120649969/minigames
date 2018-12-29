enum GamePropType{
	None		= -1,
	Diamond1 	= 1,
	Diamond2 	= 2,
	HuDun		= 3,
	XuanZhuan	= 4,
	Stone		= 5,
	OtherStone	= 6,
	My_Random_Max = 5
}


class GameProp extends eui.Component{
	
	public img_prop:eui.Image
	public img_bg:eui.Image
	public prop_id:GamePropType

	public armatureDisplay:dragonBones.EgretArmatureDisplay
	public has_be_eat:boolean = false
	public speedY:number = 0

	public constructor(prop_id:GamePropType = GamePropType.None) {
		super()
		this.skinName = "PropSkin"

		this.prop_id = prop_id
		if(this.prop_id == GamePropType.None){
			let prop_rates = [0.4, 0.3, 0.1, 0.1, 0.1]
			let random = Math.random()
			let target_index = 0
			let cur_rate = 0
			for(let index = 0; index < prop_rates.length; index++)
			{
				cur_rate += prop_rates[index]
				if(random < cur_rate){
					target_index = index
					break
				}
			}
			this.prop_id = target_index + 1
		}
		if(this.prop_id == GamePropType.OtherStone){
			this.img_prop.source = "prop_" + (GamePropType.Stone) + "_png"
			this.armatureDisplay = CommonUtils.createDragonBones("stone_ske_json", "stone_tex_json", "stone_tex_png", "stone_armature")
			this.addChild(this.armatureDisplay)
			this.armatureDisplay.x = this.width / 2
			this.armatureDisplay.y = this.height / 2
			this.armatureDisplay.visible = false
			let __this = this
			this.armatureDisplay.addDBEventListener(dragonBones.AnimationEvent.COMPLETE, function(){
				__this.armatureDisplay.visible = false
			}, this)
		}else{
			this.img_prop.source = "prop_" + (this.prop_id) + "_png"
		}
		

		this.anchorOffsetX = this.width / 2
		this.anchorOffsetY = this.height / 2

		this.img_bg.visible = true
		if(this.prop_id == GamePropType.OtherStone){
			this.img_bg.visible = false
		}

		GameController.instance.GetMainScenePanel().battleContainer.addChild(this)
	}

	public HitPlayer():boolean
	{
		if(this.has_be_eat){
			return false
		}
		let player = GameController.instance.GetMainScenePanel().GetGameLogicComponent().gamePlayer
		let bound1 = this.img_prop.getBounds()
		let bound2 = player.hit_prop_rect.getTransformedBounds(this.img_prop)
		this.has_be_eat = bound1.intersects(bound2)
		return this.has_be_eat
	}

	public Update():void
	{
		if(this.prop_id != GamePropType.OtherStone)
		{
			return
		}
		this.speedY += GameConst.Gravity
		this.y += this.speedY
		let global_point = this.parent.localToGlobal(this.x, this.y)
		if(global_point.y > this.stage.stageHeight){
			this.removeEventListener(egret.Event.ENTER_FRAME, this.Update, this)
			this.parent.removeChild(this)
		}
	}

	public Effect():void
	{
		if(this.prop_id != GamePropType.OtherStone){
			this.parent.removeChild(this)
		}else{
			this.armatureDisplay.visible = true
			this.armatureDisplay.animation.play("boom_animation", 1)
			this.speedY = 0
			this.addEventListener(egret.Event.ENTER_FRAME, this.Update, this)
		}

		let mainPanel = GameController.instance.GetMainScenePanel()
		let gameLogicComponent:GameLogicComponent = mainPanel.GetGameLogicComponent()
		let player = gameLogicComponent.gamePlayer
		let allBalls = gameLogicComponent.allBalls

		if(this.prop_id == GamePropType.Diamond1 || this.prop_id == GamePropType.Diamond2){
			gameLogicComponent.ChangeScore(GameConst.DIAMOND_SCORE)
		}else if(this.prop_id == GamePropType.HuDun){
			if(player.propTypes.indexOf(this.prop_id) >= 0){
				return
			}
			player.propTypes.push(this.prop_id)
			let __this = this
			CommonUtils.performDelay(function(){
				let propTypes = player.propTypes
				let index = propTypes.indexOf(__this.prop_id)
				if(index >= 0){
					propTypes.splice(index , 1)
				}
			}, 10 * 1000, this)
			mainPanel.ShowPropTips(GamePropType.HuDun)
		}else if(this.prop_id == GamePropType.XuanZhuan){
			let next_ball = allBalls[1]
			if(next_ball){
				next_ball.ChangeClockwiseRotate()
			}
			mainPanel.ShowPropTips(GamePropType.XuanZhuan)
		}else if(this.prop_id == GamePropType.Stone){
			//给别人加一个道具
			mainPanel.ShowPropTips(GamePropType.Stone)
		}else if(this.prop_id == GamePropType.OtherStone){
			if(player.propTypes.indexOf(GamePropType.HuDun) >= 0){
				return
			}
			gameLogicComponent.ChangeScore(GameConst.STONE_SCORE)
		}

		if(this.prop_id != GamePropType.OtherStone){
			SoundManager.getInstance().playSound("prop_mp3")
		}else{
			SoundManager.getInstance().playSound("stone_mp3")
		}
	}
}
