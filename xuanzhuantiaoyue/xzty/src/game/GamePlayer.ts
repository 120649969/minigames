class GamePlayer extends eui.Component{

	public img_player:eui.Image
	public isLand:boolean = false

	public speedx:number = 0
	public speedy:number = 0

	private move_step_times:number = 30
	public is_jumping:boolean = false
	public is_dead:boolean = false
	public touchJumpTimes:number = 0
	public is_top_down = true
	public first_land_ball:GameBall = null

	public gameLogicComponent:GameLogicComponent
	public constructor() {
		super()
		this.skinName = "PlayerSkin"
		this.anchorOffsetX = this.width / 2
		this.anchorOffsetY = this.height
		this.gameLogicComponent = GameController.instance.GetMainScenePanel().GetGameLogicComponent()
	}

	public Update():void
	{
		if(this.isLand || this.is_dead){
			return
		}
		let move_speed = Math.sqrt(Math.pow(this.speedx, 2) + Math.pow(this.speedy, 2))
		let move_times = move_speed / 5
		for(let index = 0; index < move_times; index++)
		{
			let delta_x = this.speedx / move_times
			let delta_y = this.speedy / move_times
			this.x += delta_x
			this.y += delta_y
			if(this.is_jumping){
				// GameController.instance.GetMainScenePanel().GetGameLogicComponent().MoveBg(delta_x, delta_y)
			}
			if(!this.is_jumping){
				if(this._checkHitFirstBall()){
					break
				}
			}else{
				if(this._checkHitNextBall()){
					break
				}
			}
		}

		let global_player_center_point = this.localToGlobal(this.width / 2, this.height / 2)
		if(global_player_center_point.y >= this.stage.stageHeight + 40 || global_player_center_point.x >= this.stage.stageWidth + 20 || global_player_center_point.x <= -20){
			this.is_dead = true
			this.visible = false
			this.gameLogicComponent.RelivePlayer(0.5)
			return
		}

		this.speedy += GameConst.Gravity
	}

	private _land_on_ball(ball:GameBall):void
	{
		this.touchJumpTimes = 0
		this.isLand = true
		this.is_jumping = false
		let global_player_center_point = this.localToGlobal(this.width / 2, this.height / 2)
		let global_ball_center_point = ball.localToGlobal(ball.width / 2, ball.height / 2)
		let dir = new egret.Point(global_player_center_point.x - global_ball_center_point.x, global_player_center_point.y - global_ball_center_point.y)
		dir.normalize(1)
		let target_point_on_ball = new egret.Point(global_ball_center_point.x + dir.x * ball.GetGlobalWidth() / 2, global_ball_center_point.y + dir.y * ball.GetGlobalWidth() / 2)
		let local_in_ball_point = ball.globalToLocal(target_point_on_ball.x, target_point_on_ball.y)
		this.parent.removeChild(this)
		ball.addChild(this)
		this.x = local_in_ball_point.x
		this.y = local_in_ball_point.y
		if(this.is_top_down){
			this.rotation = -1 * ball.rotation
		}else{
			let global_rotation = 0
			if(dir.x == 0){
				if(dir.y > 0){
					global_rotation = Math.PI / 2
				}else{
					global_rotation = Math.PI / 2 * -1
				}
			}else{
				let tanValue = dir.y / dir.x
				global_rotation = Math.atan(tanValue)
				let ballRotation = ball.rotation
				let degree = global_rotation / Math.PI * 180
				let ballRotationDegree = ballRotation / Math.PI * 180
				if(dir.x < 0){
					global_rotation += Math.PI
				}
				global_rotation = global_rotation / Math.PI * 180
			}
			this.rotation = global_rotation - ball.rotation + 90
		}
		if(!this.is_top_down){
			this.gameLogicComponent.RemoveCurrentRoundBall()
			this.gameLogicComponent.MoveNextRound()
		}
		this.is_top_down = false
		this.scaleX = this.scaleY = 1 / ball.scaleX
	}

	public Relive():void
	{
		this.is_dead = false
		this.is_jumping = false
		this.isLand = false
		this.is_top_down = true
		let allBalls = GameController.instance.GetMainScenePanel().GetGameLogicComponent().allBalls
		let firstBall = allBalls[0]
		this.parent.removeChild(this)
		GameController.instance.GetMainScenePanel().battleContainer.addChild(this)
		this.scaleX = this.scaleY = 1
		this.speedx = 0
		this.speedy = 30
		this.rotation = 0
		this.x = firstBall.x
		this.y = firstBall.y - GameController.instance.GetMainScenePanel().uiContainer.height
		this.touchJumpTimes = 0
		this.visible = true
	}

	public CanJump():boolean
	{
		if(this.is_dead){
			return false
		}
		if(this.isLand){
			return true
		}
		if(this.is_jumping)
		{
			if(this.touchJumpTimes >= 2){
				return false
			}
			return true
		}
		return false
	}

	public StartJump():void
	{
		this.isLand = false
		this.is_jumping = true
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
		}else{
			this.speedy *= -1
		}
	}

	private _checkHitFirstBall():boolean
	{
		let allBalls = GameController.instance.GetMainScenePanel().GetGameLogicComponent().allBalls
		let firstBall = allBalls[0]
		if(this._checkHitBall(firstBall)){
			this._land_on_ball(firstBall)
			return true
		}
		return false
	}

	private _checkHitNextBall():boolean
	{
		let allBalls = GameController.instance.GetMainScenePanel().GetGameLogicComponent().allBalls
		let nextBall = allBalls[1]
		if(this._checkHitBall(nextBall)){
			this._land_on_ball(nextBall)
			return true
		}
		return false
	}

	private _get_distance_of_points(point1:egret.Point, point2:egret.Point):number
	{
		return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2))
	}

	private _checkHitBall(ball:GameBall):boolean
	{
		let global_center_ball_point = ball.localToGlobal(ball.width / 2, ball.height / 2)
		let top_center_player_point = this.localToGlobal(this.width / 2, 0)
		let distance = this._get_distance_of_points(global_center_ball_point, top_center_player_point)
		if(distance < ball.width / 2){
			return true
		}

		let down_center_player_point = this.localToGlobal(this.width / 2, this.height)
		distance = this._get_distance_of_points(global_center_ball_point, down_center_player_point)
		if(distance < ball.width / 2){
			return true
		}

		let left_player_point = this.localToGlobal(0, this.height / 2)
		distance = this._get_distance_of_points(global_center_ball_point, left_player_point)
		if(distance < ball.width / 2){
			return true
		}

		let right_player_point = this.localToGlobal(this.width, this.height / 2)
		distance = this._get_distance_of_points(global_center_ball_point, right_player_point)
		if(distance < ball.width / 2){
			return true
		}

		return false
	}

} 