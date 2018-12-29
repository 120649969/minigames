
enum GamePlayerStatus{
	Init			= 0, 		//初始化中
	FreeFall 		= 1, 		//自由下落
	LandOnBall 		= 2,		//落到球上
	LandOnBarrel	= 3,		//落到炮筒上
	Jump 			= 4, 		//跳跃
	BarrelJump 	= 5,		//炮筒往上
	Dead 			= 6,		//死亡
}

class GamePlayer extends eui.Component{

	public img_player:eui.Image
	public img_shadow:eui.Image
	public hit_rect:eui.Rect
	public hit_prop_rect:eui.Rect
	public isLand:boolean = false

	public speedx:number = 0
	public speedy:number = 0

	private move_step_times:number = 30
	public touchJumpTimes:number = 0

	public gameLogicComponent:GameLogicComponent

	public status = GamePlayerStatus.FreeFall
	public propTypes:Array<GamePropType> = []

	public constructor() {
		super()
		this.skinName = "PlayerSkin"
		this.anchorOffsetX = this.width / 2
		this.anchorOffsetY = this.height
		this.status = GamePlayerStatus.Init
		this.visible = false
	}

	public OnStart():void
	{
		this.visible = true
		this.gameLogicComponent = GameController.instance.GetMainScenePanel().GetGameLogicComponent()
	}

	//是否需要更新位置
	private is_need_update_position():boolean
	{
		if(this.status == GamePlayerStatus.FreeFall || this.status == GamePlayerStatus.Jump || this.status == GamePlayerStatus.BarrelJump){
			return true
		}
		return false
	}

	private is_in_kinematics():boolean
	{
		if(this.status == GamePlayerStatus.BarrelJump){
			return true
		}
		return false
	}

	private _try_hit_props():void
	{
		let delete_props:Array<GameProp> = []
		for(let prop of this.gameLogicComponent.allProps)
		{
			if(prop.HitPlayer()){
				prop.Effect()
				delete_props.push(prop)
			}
		}
		for(let prop of delete_props)
		{
			let index = this.gameLogicComponent.allProps.indexOf(prop)
			this.gameLogicComponent.allProps.splice(index , 1)
		}
	}

	public Update():void
	{
		if(!this.is_need_update_position()){
			return
		}
		let move_speed = Math.sqrt(Math.pow(this.speedx, 2) + Math.pow(this.speedy, 2))
		let move_times = move_speed / 2
		for(let index = 0; index < move_times; index++)
		{
			let delta_x = this.speedx / move_times
			let delta_y = this.speedy / move_times
			this.x += delta_x
			this.y += delta_y

			this._try_hit_props()
			if(this.status == GamePlayerStatus.Jump){
				// GameController.instance.GetMainScenePanel().GetGameLogicComponent().MoveBg(delta_x, delta_y)
			}
			if(this.status == GamePlayerStatus.FreeFall){ //下落状态
				if(this._checkHitFirstBall()){
					break
				}
			}else if(this.status == GamePlayerStatus.Jump || this.status == GamePlayerStatus.BarrelJump){
				if(this._checkHitNextBall()){
					break
				}
			}
		}

		let global_player_center_point = this.localToGlobal(this.width / 2, this.height / 2)
		if(global_player_center_point.y >= this.stage.stageHeight + 40 || global_player_center_point.x >= this.stage.stageWidth + 20 || global_player_center_point.x <= -20){
			this.gameLogicComponent.ChangeScore(GameConst.JUMP_FAIL_SCORE)
			this.SwitchStatus(GamePlayerStatus.Dead)
			this.visible = false
			this.gameLogicComponent.RelivePlayer(0.5)
			return
		}
		if(!this.is_in_kinematics()){
			this.speedy += GameConst.Gravity
		}
	}

	public SwitchStatus(new_status:GamePlayerStatus)
	{
		this.status = new_status
		this.img_shadow.visible = false
		if(this.status == GamePlayerStatus.LandOnBall){
			this.img_shadow.visible = true
		}
	}

	private _land_on_ball(ball:GameBall):void
	{
		this.touchJumpTimes = 0
		if(this.status == GamePlayerStatus.Jump || this.status == GamePlayerStatus.BarrelJump){
			this.gameLogicComponent.ChangeScore(GameConst.JUMP_SUCCESS_SCORE)
		}
		ball.OnPlayerLand(this)
	}

	public Relive():void
	{
		this.SwitchStatus(GamePlayerStatus.FreeFall)
		let allBalls = GameController.instance.GetMainScenePanel().GetGameLogicComponent().allBalls
		let firstBall = allBalls[0]
		this.parent.removeChild(this)
		GameController.instance.GetMainScenePanel().battleContainer.addChild(this)
		this.scaleX = this.scaleY = 1
		this.speedx = 0
		this.speedy = 30
		this.rotation = 0
		this.x = firstBall.x
		this.y = firstBall.y - firstBall.height / 2 - 300
		this.touchJumpTimes = 0
		this.visible = true
	}

	public CanJump():boolean
	{
		if(this.status == GamePlayerStatus.Dead){
			return false
		}
		if(this.status == GamePlayerStatus.LandOnBall){
			return true
		}
		if(this.status == GamePlayerStatus.Jump)
		{
			if(this.speedy < 0){ //避免向上跳的时候点击
				return false
			}
			if(this.touchJumpTimes >= 2){
				return false
			}
			return true
		}
		if(this.status == GamePlayerStatus.BarrelJump){
			return false
		}
		return false
	}

	public StartJump():void
	{
		this.SwitchStatus(GamePlayerStatus.Jump)
		this.touchJumpTimes += 1
		
		if(this.touchJumpTimes == 1){
			let top_center_player_point = this.localToGlobal(this.width / 2, 0)
			let down_center_player_point = this.localToGlobal(this.width / 2, this.height)
			
			let move_dir = new egret.Point(top_center_player_point.x - down_center_player_point.x, top_center_player_point.y - down_center_player_point.y)
			move_dir.normalize(1)
			this.speedx = move_dir.x * GameConst.PLAYER_SPEED
			this.speedy = move_dir.y * GameConst.PLAYER_SPEED

			let local_in_battleContainer_point = GameController.instance.GetMainScenePanel().battleContainer.globalToLocal(down_center_player_point.x, down_center_player_point.y)
			let parentBall = this.parent as GameBall
			this.parent.removeChild(this)
			this.rotation += parentBall.rotation
			GameController.instance.GetMainScenePanel().battleContainer.addChild(this)
			this.scaleX = this.scaleY = 1
			this.x = local_in_battleContainer_point.x
			this.y = local_in_battleContainer_point.y

			SoundManager.getInstance().playSound("jump_mp3")
		}else{
			this.speedy *= -1
		}
	}

	private _checkHitFirstBall():boolean
	{
		let allBalls = GameController.instance.GetMainScenePanel().GetGameLogicComponent().allBalls
		let firstBall = allBalls[0]
		if(firstBall.CheckHitPlayer(this)){
			this._land_on_ball(firstBall)
			return true
		}
		return false
	}

	private _checkHitNextBall():boolean
	{
		let allBalls = GameController.instance.GetMainScenePanel().GetGameLogicComponent().allBalls
		let nextBall = allBalls[1]
		if(nextBall.CheckHitPlayer(this)){
			this._land_on_ball(nextBall)
			return true
		}
		return false
	}

} 