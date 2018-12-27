class GameLogicComponent extends BaseComponent{

	public allBalls:Array<GameBall> = []
	private _mainPanel:ui.MainScenePanel
	private _hasStartRound:boolean = false
	public gamePlayer:GamePlayer

	public constructor() {
		super()
		this._mainPanel = GameController.instance.GetMainScenePanel()
	}

	private _get_next_ball_x(last_x:number, ball_width:number):number
	{
		if(last_x == -1){
			return 20 + ball_width / 2
		}
		let min_random_width = GameConst.MIN_BALL_DISTANCE_X
		let max_random_width = GameConst.MAX_BALL_DISTANCE_X
		let distance = min_random_width + Math.floor((max_random_width - min_random_width) * Math.random())
		return distance + last_x
	}

	private _get_next_scale(ball1:GameBall, ball2:GameBall):number
	{
		let first_ball = ball1
		let second_ball = ball2

		let total_width = (first_ball.GetWidth() / 2 + second_ball.GetWidth() / 2 + Math.abs(second_ball.x - first_ball.x) + GameConst.DISTANCE_OF_BOUNDARY * 2)
		let scale = this._mainPanel.uiContainer.width / total_width
		return scale
	}

	private _get_center_point(first_ball:GameBall, second_ball:GameBall):egret.Point
	{
		return new egret.Point((first_ball.x - first_ball.GetWidth() / 2 -  GameConst.DISTANCE_OF_BOUNDARY + second_ball.x + second_ball.GetWidth() / 2 +  GameConst.DISTANCE_OF_BOUNDARY) / 2, (first_ball.y + second_ball.y) / 2)
	}

	private _try_generate_ball():void
	{
		let generate_count = GameConst.MIN_BALL_COUNT - this.allBalls.length
		if(generate_count < 0){
			return
		}

		let last_x = -1
		let last_ball:GameBall = null
		if(this.allBalls.length > 0){
			last_ball = this.allBalls[this.allBalls.length - 1]
			last_x = last_ball.x
		}
		for(let index = 0; index < generate_count; index++)
		{
			let new_ball = new GameBall()
			this.allBalls.push(new_ball)
			let next_x = this._get_next_ball_x(last_x, new_ball.GetWidth())
			new_ball.x = next_x

			if(last_x != -1){
				let scale_x = this._get_next_scale(new_ball, last_ball)
				let max_scale_y = scale_x
				let max_distace_y = this._mainPanel.uiContainer.height / max_scale_y
				let cur_ball_height = new_ball.GetWidth()
				let last_ball_height = last_ball.GetWidth()
				max_distace_y -= (cur_ball_height + last_ball_height)
				new_ball.y = Math.random() * max_distace_y * CommonUtils.GetRandomPositive() + last_ball.y
			}else{
				new_ball.y = Math.floor(Math.random() * this._mainPanel.uiContainer.height)
			}

			last_x = next_x
			last_ball = new_ball
		}
	}

	private _try_get_next_round_scale():number
	{
		let first_ball = this.allBalls[0]
		let second_ball = this.allBalls[1]

		let scale = this._get_next_scale(first_ball, second_ball)
		return scale
	}

	private _try_get_next_round_battleContainer_position():egret.Point
	{
		let first_ball = this.allBalls[0]
		let second_ball = this.allBalls[1]

		let scale = this._try_get_next_round_scale()
		let last_scale = this._mainPanel.battleContainer.scaleX
		this._mainPanel.battleContainer.scaleX = this._mainPanel.battleContainer.scaleY = scale

		let center_point = this._get_center_point(first_ball, second_ball)
		let global_center_point = this._mainPanel.battleContainer.localToGlobal(center_point.x, center_point.y)
		let global_target_center_point = new egret.Point(this._mainPanel.stage.stageWidth / 2, this._mainPanel.stage.stageHeight / 2)

		this._mainPanel.battleContainer.scaleX = this._mainPanel.battleContainer.scaleY = last_scale

		let returnPoint = new egret.Point()
		returnPoint.x = this._mainPanel.battleContainer.x + (global_target_center_point.x - global_center_point.x)
		returnPoint.y = this._mainPanel.battleContainer.y + (global_target_center_point.y - global_center_point.y)

		return returnPoint
	}

	public Test_Move_Round():void
	{
		let target_scale = this._try_get_next_round_scale()
		let target_position = this._try_get_next_round_battleContainer_position()
		if(this._hasStartRound){
			egret.Tween.get(this._mainPanel.battleContainer).to({scaleX:target_scale, scaleY:target_scale, x:target_position.x, y:target_position.y}, 0.3 * 1000).call(function(){
			})
		}else{
			this._mainPanel.battleContainer.scaleX = this._mainPanel.battleContainer.scaleY = target_scale
			this._mainPanel.battleContainer.x = target_position.x
			this._mainPanel.battleContainer.y = target_position.y

			this.gamePlayer = new GamePlayer()
			this._mainPanel.battleContainer.addChild(this.gamePlayer)
			
			this._hasStartRound = true
			this.RelivePlayer()
		}
	}

	public RelivePlayer(delay_time:number = 0):void
	{
		
		if(delay_time == 0){
			this.gamePlayer.Relive()
			return
		}

		let __this = this
		CommonUtils.performDelay(function(){
			__this.gamePlayer.Relive()
		}, delay_time * 1000, this)
	}

	public RemoveCurrentRoundBall():void
	{
		let ball = this.allBalls.shift()
		ball.visible = false
		this._try_generate_ball()
	}

	public OnStart():void
	{
		this._try_generate_ball()
		this.Test_Move_Round()
	}

	public OnEnterFrame():void
	{
		if(this.gamePlayer)
		{
			this.gamePlayer.Update()
		}	
	}

	public OnTouchJump():void
	{
		if(!this.gamePlayer || !this.gamePlayer.CanJump()){
			return
		}
		this.gamePlayer.StartJump()
	}
}