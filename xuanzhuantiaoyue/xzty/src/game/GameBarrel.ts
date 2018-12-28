class GameBarrel extends GameBall{

	private _shakeArmatureDisplay:dragonBones.EgretArmatureDisplay
	public constructor() {
		super()
	}

	protected initSkin():void
	{
		this.skinName = "BarrelSkin"
	}

	protected initSelfProperty():void
	{
		this.gameBallType = GameBallType.BARREL
		this.anchorOffsetX = this.width / 2
		this.anchorOffsetY = this.height / 2
		GameController.instance.GetMainScenePanel().battleContainer.addChild(this)

		let armatureDisplay = CommonUtils.createDragonBones("shake_ske_json", "shake_tex_json", "shake_tex_png", "shake_armature")
		this.addChild(armatureDisplay)
		this._shakeArmatureDisplay = armatureDisplay
		let __this = this
		this._shakeArmatureDisplay.addDBEventListener(dragonBones.AnimationEvent.COMPLETE, function(){
			__this._shakeArmatureDisplay.visible = false
			__this.playMovePlayer()
		}, this)
		armatureDisplay.visible = false
		armatureDisplay.x = this.width / 2
		armatureDisplay.y = this.height / 2
	}

	public CheckHitPlayer(player:GamePlayer):boolean
	{
		return this.getBounds().intersects(player.getTransformedBounds(this))
	}

	public OnPlayerLand(player:GamePlayer):void
	{
		player.visible = false
		player.parent.removeChild(player)
		this.addChild(player)
		player.x = this.width / 2
		player.y = this.height / 2
		player.rotation = 0
		player.scaleX = player.scaleY = 1 / this.scaleX
		player.SwitchStatus(GamePlayerStatus.LandOnBarrel)
		this.playShakeAnimation()
		GameController.instance.GetMainScenePanel().GetGameLogicComponent().RemoveCurrentRoundBall()
		GameController.instance.GetMainScenePanel().GetGameLogicComponent().MoveNextRound()
		this.setChildIndex(player, 1)
	}

	private playShakeAnimation():void
	{
		this.img_ball.visible = false
		this._shakeArmatureDisplay.animation.play("shake_animation", 1)
		this._shakeArmatureDisplay.visible = true
	}

	private playMovePlayer():void
	{
		this.img_ball.visible = true
		let player = GameController.instance.GetMainScenePanel().GetGameLogicComponent().gamePlayer
		player.visible = true
		player.speedx = 0
		player.speedy = -1 * GameConst.PLAYER_SPEED
		player.SwitchStatus(GamePlayerStatus.BarrelJump)
		SoundManager.getInstance().playSound("fashe_mp3")
	}
}