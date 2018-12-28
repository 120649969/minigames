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

	public constructor(prop_id:GamePropType = GamePropType.None) {
		super()
		this.skinName = "PropSkin"

		this.prop_id = prop_id
		if(this.prop_id == GamePropType.None){
			this.prop_id = Math.ceil(Math.random() * GamePropType.My_Random_Max)
		}
		if(this.prop_id == GamePropType.OtherStone){
			this.img_prop.source = "prop_" + (GamePropType.Stone) + "_png"
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
		let player = GameController.instance.GetMainScenePanel().GetGameLogicComponent().gamePlayer
		return this.getBounds().intersects(player.hit_rect.getTransformedBounds(this))
	}

	public Effect():void
	{
		this.parent.removeChild(this)

		let gameLogicComponent:GameLogicComponent = GameController.instance.GetMainScenePanel().GetGameLogicComponent()
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
		}else if(this.prop_id == GamePropType.XuanZhuan){
			let next_ball = allBalls[1]
			if(next_ball){
				next_ball.ChangeClockwiseRotate()
			}
		}else if(this.prop_id == GamePropType.Stone){
			//给别人加一个道具
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
