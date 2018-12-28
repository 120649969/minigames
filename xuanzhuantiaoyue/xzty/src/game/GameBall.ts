enum GameBallType{
	BALL 		= 1,
	BARREL 		= 2
}

class GameBall extends eui.Component{

	public ballSkin:egret.Bitmap
	public img_ball:eui.Image
	public gameBallType:GameBallType
	private _is_clock_wise:boolean = false

	public constructor() {
		super()
		this.initSkin()
		this.initSelfProperty()
	}

	protected initSkin():void
	{
		this.skinName = "BallSkin"
	}

	protected initSelfProperty():void
	{
		this.gameBallType = GameBallType.BALL
		let ballSkinIndex = Math.ceil(Math.random() * GameConst.BALL_SKIN_COUNT)
		this.img_ball.source = 'xingqiu' + ballSkinIndex + "_png"
		this.anchorOffsetX = this.width / 2
		this.anchorOffsetY = this.height / 2
		GameController.instance.GetMainScenePanel().battleContainer.addChild(this)

		let random_scale = GameConst.MIN_BALL_SCALE + (GameConst.MAX_BALL_SCALE - GameConst.MIN_BALL_SCALE) * Math.random()
		let allBalls = GameController.instance.GetMainScenePanel().GetGameLogicComponent().allBalls
		if(allBalls.length > 0){
			let max_scale_limit_by_last_ball = GameConst.BALL_TOTAL_SCALE_IN_TWO_BALLS - allBalls[allBalls.length - 1].scaleX
			this.scaleX = this.scaleY = Math.min(max_scale_limit_by_last_ball, random_scale)
		}else{
			this.scaleX = this.scaleY = random_scale
		}
		let rotate_time = 2 * 1000
		if(CommonUtils.GetRandomPositive() > 0){
			this._is_clock_wise = false
			egret.Tween.get(this, {loop:true}).to({rotation:-180}, rotate_time).to({rotation:-360}, rotate_time)
		}else{
			this._is_clock_wise = true
			egret.Tween.get(this, {loop:true}).to({rotation:180}, rotate_time).to({rotation:360}, rotate_time)
		}
	}

	//强制顺时针旋转
	public ChangeClockwiseRotate():void
	{
		if(this._is_clock_wise){
			return
		}
		this._is_clock_wise = false
		let rotate_time = 2 * 1000
		egret.Tween.get(this, {loop:true}).to({rotation:-180}, rotate_time).to({rotation:-360}, rotate_time)
	}

	public GetWidth():number
	{
		return this.width * this.scaleX
	}

	public GetGlobalWidth():number
	{
		return this.GetWidth() * GameController.instance.GetMainScenePanel().battleContainer.scaleX
	}

	private _get_distance_of_points(point1:egret.Point, point2:egret.Point):number
	{
		return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2))
	}

	public CheckHitPlayer(player:GamePlayer):boolean
	{
		// let global_center_ball_point = this.localToGlobal(this.width / 2, this.height / 2)
		// let top_center_player_point = player.localToGlobal(this.width / 2, 0)
		// let distance = this._get_distance_of_points(global_center_ball_point, top_center_player_point)
		// if(distance < this.width / 2){
		// 	return true
		// }

		// let down_center_player_point = player.localToGlobal(this.width / 2, this.height)
		// distance = this._get_distance_of_points(global_center_ball_point, down_center_player_point)
		// if(distance < this.width / 2){
		// 	return true
		// }

		// let left_player_point = player.localToGlobal(0, this.height / 2)
		// distance = this._get_distance_of_points(global_center_ball_point, left_player_point)
		// if(distance < this.width / 2){
		// 	return true
		// }

		// let right_player_point = player.localToGlobal(this.width, this.height / 2)
		// distance = this._get_distance_of_points(global_center_ball_point, right_player_point)
		// if(distance < this.width / 2){
		// 	return true
		// }

		// return false
		return this.getBounds().intersects(player.hit_rect.getTransformedBounds(this))
	}

	public OnPlayerLand(player:GamePlayer):void
	{
		let global_player_center_point = player.localToGlobal(player.width / 2, player.height / 2)
		let global_ball_center_point = this.localToGlobal(this.width / 2, this.height / 2)
		let dir = new egret.Point(global_player_center_point.x - global_ball_center_point.x, global_player_center_point.y - global_ball_center_point.y)
		dir.normalize(1)
		let target_point_on_ball = new egret.Point(global_ball_center_point.x + dir.x * this.GetGlobalWidth() / 2, global_ball_center_point.y + dir.y * this.GetGlobalWidth() / 2)
		let local_in_ball_point = this.globalToLocal(target_point_on_ball.x, target_point_on_ball.y)
		player.parent.removeChild(player)
		this.addChild(player)
		player.x = local_in_ball_point.x
		player.y = local_in_ball_point.y
		if(player.status == GamePlayerStatus.FreeFall){
			player.rotation = -1 * this.rotation
		}else{
			let global_rotation = 0
			if(dir.x == 0){
				if(dir.y > 0){
					global_rotation = Math.PI / 2
				}else{
					global_rotation = -1 * Math.PI / 2
				}
			}else{
				let tanValue = dir.y / dir.x
				global_rotation = Math.atan(tanValue)
				let ballRotation = this.rotation
				let degree = global_rotation / Math.PI * 180
				let ballRotationDegree = ballRotation / Math.PI * 180
				if(dir.x < 0){
					global_rotation += Math.PI
				}
			}

			global_rotation = global_rotation / Math.PI * 180
			player.rotation = global_rotation - this.rotation + 90

			GameController.instance.GetMainScenePanel().GetGameLogicComponent().RemoveCurrentRoundBall()
			GameController.instance.GetMainScenePanel().GetGameLogicComponent().MoveNextRound()
		}
		player.scaleX = player.scaleY = 1 / this.scaleX
		player.SwitchStatus(GamePlayerStatus.LandOnBall)
	}
}