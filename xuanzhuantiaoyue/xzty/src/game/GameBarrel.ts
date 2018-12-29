class GameBarrel extends GameBall{

	private _shakeArmatureDisplay:dragonBones.EgretArmatureDisplay
	private _sendArmatureDisplay:dragonBones.EgretArmatureDisplay

	private _isInSending:boolean = false
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
			if(__this._isInSending){
				return
			}
			__this._isInSending = true
			__this.playSendPlayer()
		}, this)
		armatureDisplay.visible = false
		armatureDisplay.x = this.width / 2
		armatureDisplay.y = this.height / 2

		let send_armatureDisplay = CommonUtils.createDragonBones("shake_ske_json", "shake_tex_json", "shake_tex_png", "shake_armature")
		this.addChild(send_armatureDisplay)
		this._sendArmatureDisplay = send_armatureDisplay
		send_armatureDisplay.x = this.width / 2
		send_armatureDisplay.y = this.height / 2
		send_armatureDisplay.visible = false
		this._sendArmatureDisplay.addDBEventListener(dragonBones.AnimationEvent.COMPLETE, function(){
			__this._sendArmatureDisplay.visible = false
			__this._shakeArmatureDisplay.visible = false
			__this.img_ball.visible = true
		}, this)
	}

	public CheckHitPlayer(player:GamePlayer):boolean
	{
		return this.img_ball.getBounds().intersects(player.getTransformedBounds(this.img_ball))
	}

	public OnPlayerLand(player:GamePlayer):void
	{
		player.parent.removeChild(player)
		this.addChild(player)
		player.x = this.width / 2
		player.y = player.height + 10
		player.rotation = 0
		player.visible = false
		player.scaleX = player.scaleY = 1 / this.scaleX
		player.SwitchStatus(GamePlayerStatus.LandOnBarrel)
		this.playShakeAnimation()
		GameController.instance.GetMainScenePanel().GetGameLogicComponent().RemoveCurrentRoundBall()
		GameController.instance.GetMainScenePanel().GetGameLogicComponent().MoveNextRound()
		this.setChildIndex(this._sendArmatureDisplay, 1)
		this.setChildIndex(player, 2)
	}

	private playShakeAnimation():void
	{
		this.img_ball.visible = false
		this._shakeArmatureDisplay.animation.play("shake_animation", 1)
		this._shakeArmatureDisplay.visible = true
	}

	private playMovePlayer():void
	{
		let player = GameController.instance.GetMainScenePanel().GetGameLogicComponent().gamePlayer
		player.visible = true
		player.speedx = 0
		player.speedy = -1 * GameConst.PLAYER_SPEED
		player.SwitchStatus(GamePlayerStatus.BarrelJump)
	}

	private playSendPlayer():void
	{
		let player = GameController.instance.GetMainScenePanel().GetGameLogicComponent().gamePlayer
		player.visible = true
		this._isInSending = true
		this._shakeArmatureDisplay.visible = true
		this._shakeArmatureDisplay.animation.play("send_hou", 1)

		this._sendArmatureDisplay.visible = true
		this._sendArmatureDisplay.animation.play("send_qian", 1)
		let __this = this
		CommonUtils.performDelay(function(){
			SoundManager.getInstance().playSound("fashe_mp3")
			__this.playMovePlayer()
		}, 0.2 * 1000, this)
	}
}