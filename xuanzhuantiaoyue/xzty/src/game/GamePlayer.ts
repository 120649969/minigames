class GamePlayer extends eui.Component{

	public img_player:eui.Image
	public isLand:boolean = false

	public speedx:number = 0
	public speedy:number = 0

	private move_step_times:number = 30
	public is_jumping:boolean = false
	public is_dead:boolean = false
	public touchJumpTimes:number = 0
	public is_first_land = true
	public constructor() {
		super()
		this.skinName = "PlayerSkin"
		this.anchorOffsetX = this.width / 2
		this.anchorOffsetY = this.height
	}

	public Update():void
	{
		if(this.isLand || this.is_dead){
			return
		}
		for(let index = 0; index < this.move_step_times; index++)
		{
			this.x += this.speedx / this.move_step_times
			this.y += this.speedy / this.move_step_times
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
		if(global_player_center_point.y >= this.stage.stageHeight){
			this.is_dead = true
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
		if(this.is_first_land){
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
		this.is_first_land = false
		this.scaleX = this.scaleY = 1 / ball.scaleX
	}

	public Relive():void
	{
		this.is_dead = false
		this.is_jumping = false
		this.isLand = false
		let allBalls = GameController.instance.GetMainScenePanel().GetGameLogicComponent().allBalls
		let firstBall = allBalls[0]
		this.parent.removeChild(this)
		GameController.instance.GetMainScenePanel().battleContainer.addChild(this)
		this.x = firstBall.x
		this.y = firstBall.y - GameController.instance.GetMainScenePanel().uiContainer.height
		this.touchJumpTimes = 0
	}

	public CanJump():boolean
	{
		if(this.isLand)
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
		if(this.is_jumping){
			return
		}
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
			console.log("######旋转了####", this.rotation)
			GameController.instance.GetMainScenePanel().battleContainer.addChild(this)
			this.x = local_in_battleContainer_point.x
			this.y = local_in_battleContainer_point.y

		}else{
			this.speedy = -50
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