class GameLogicComponent extends BaseComponent{

	public allBalls:Array<GameBall> = []
	private _mainPanel:ui.MainScenePanel
	private _hasStartRound:boolean = false
	public gamePlayer:GamePlayer
	public allProps:Array<GameProp> = []

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
		if(ball1.gameBallType == GameBallType.BALL){
			let total_width = (first_ball.GetWidth() / 2 + second_ball.GetWidth() / 2 + Math.abs(second_ball.x - first_ball.x) + GameConst.DISTANCE_OF_BOUNDARY * 2)
			let scale = this._mainPanel.uiContainer.width / total_width
			return scale
		}else if(ball1.gameBallType == GameBallType.BARREL){
			let total_height =  Math.abs(second_ball.y - first_ball.y) + second_ball.height / 2 + first_ball.height / 2 + GameConst.DISTANCE_OF_BOUNDARY * 2
			let scale = this._mainPanel.uiContainer.height / total_height
			return scale
		}
		return 1
	}

	private _get_center_point(first_ball:GameBall, second_ball:GameBall):egret.Point
	{
		return new egret.Point((first_ball.x - first_ball.GetWidth() / 2 -  GameConst.DISTANCE_OF_BOUNDARY + second_ball.x + second_ball.GetWidth() / 2 +  GameConst.DISTANCE_OF_BOUNDARY) / 2, (first_ball.y + second_ball.y) / 2)
	}

	//生成炮筒
	public Try_generate_barrel():void
	{
		if(this.allBalls.length <= 0){
			return
		}
		let last_ball = this.allBalls[this.allBalls.length - 1]
		let new_barrel = new GameBarrel()
		let next_x = this._get_next_ball_x(last_ball.x, new_barrel.GetWidth())
		new_barrel.x = next_x
		new_barrel.y = last_ball.y + 300
		this.allBalls.push(new_barrel)

		let new_ball_on_top = new GameBall()
		new_ball_on_top.x = next_x
		new_ball_on_top.y = new_barrel.y - new_barrel.height / 2 - 400 - new_ball_on_top.height / 2
		this.allBalls.push(new_ball_on_top)

		this._try_generate_prop()
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

				let is_in_top = CommonUtils.GetRandomPositive() < 0
				if(is_in_top){
					new_ball.y = Math.random() * max_distace_y * -0.6 + last_ball.y
				}else{
					new_ball.y = Math.random() * max_distace_y + last_ball.y
				}
				
			}else{
				new_ball.y = Math.floor(Math.random() * this._mainPanel.uiContainer.height)
			}

			last_x = next_x
			last_ball = new_ball
		}

		this._try_generate_prop()
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

	private _try_generate_prop():void
	{
		let rate = Math.random()
		let is_generate = rate < 0.4
		if(!is_generate){
			return
		}
		
		
		let last_ball_1 = this.allBalls[this.allBalls.length - 2]
		let last_ball_2 = this.allBalls[this.allBalls.length - 1]

		let global_ball1_point = last_ball_1.localToGlobal(last_ball_1.width / 2, last_ball_1.height / 2)
		let global_ball2_point = last_ball_2.localToGlobal(last_ball_2.width / 2, last_ball_2.height / 2)
		let distance = Math.sqrt(Math.pow(last_ball_1.x - last_ball_2.x, 2) + Math.pow(last_ball_1.y - last_ball_2.y, 2))
		if(distance < 500){
			return
		}
		
		
		let max_count = 3 + Math.floor((distance - 500) / 150)
		max_count = Math.min(max_count, 5)
		let generate_count = Math.ceil(Math.random() * max_count)

		let center_point = new egret.Point()
		center_point.x = (last_ball_1.x + last_ball_2.x) / 2
		center_point.y = (last_ball_1.y + last_ball_2.y) / 2

		let dir = new egret.Point(last_ball_2.x - last_ball_1.x, last_ball_2.y - last_ball_1.y)
		dir.normalize(1)

		let start_x = center_point.x + dir.x * -1 * 100 * (generate_count - 1) / 2
		let start_y = center_point.y + dir.y * -1 * 100 * (generate_count - 1) / 2

		for(let index = 0; index < generate_count; index++)
		{
			let new_prop = new GameProp()
			this.allProps.push(new_prop)
			new_prop.x = start_x
			new_prop.y = start_y

			start_x += dir.x * 100
			start_y += dir.y * 100
		}
	}

	//别人对我使用石头道具
	public OnReceiveOtherStone():void
	{
		let last_ball_1 = this.allBalls[1]
		let last_ball_2 = this.allBalls[2]

		if(!last_ball_1 || !last_ball_2){
			return
		}

		let global_ball1_point = last_ball_1.localToGlobal(last_ball_1.width / 2, last_ball_1.height / 2)
		let global_ball2_point = last_ball_2.localToGlobal(last_ball_2.width / 2, last_ball_2.height / 2)
		let distance = Math.sqrt(Math.pow(last_ball_1.x - last_ball_2.x, 2) + Math.pow(last_ball_1.y - last_ball_2.y, 2))
		
		let max_count = Math.floor(distance / 200)
		max_count = Math.max(max_count, 1)
		max_count = Math.min(max_count, 4)
		let generate_count = Math.ceil(Math.random() * max_count)

		let center_point = new egret.Point()
		center_point.x = (last_ball_1.x + last_ball_2.x) / 2
		center_point.y = (last_ball_1.y + last_ball_2.y) / 2

		let dir = new egret.Point(last_ball_2.x - last_ball_1.x, last_ball_2.y - last_ball_1.y)
		dir.normalize(1)

		let start_x = center_point.x + dir.x * -1 * 100 * (generate_count - 1) / 2
		let start_y = center_point.y + dir.y * -1 * 100 * (generate_count - 1) / 2

		for(let index = 0; index < generate_count; index++)
		{
			let new_prop = new GameProp(GamePropType.OtherStone)
			this.allProps.push(new_prop)
			new_prop.x = start_x
			new_prop.y = start_y - 100

			new_prop = new GameProp(GamePropType.OtherStone)
			this.allProps.push(new_prop)
			new_prop.x = start_x
			new_prop.y = start_y + 100

			start_x += dir.x * 100
			start_y += dir.y * 100
		}
	}

	public MoveBg(player_move_x:number, player_move_y:number):void
	{
		this._mainPanel.battleContainer.x += player_move_x * 0.2 * -1
		this._mainPanel.battleContainer.y += player_move_y * 0.2
	}

	public MoveNextRound():void
	{
		if(this._hasStartRound){
			let target_scale = this._try_get_next_round_scale()
			let target_position = this._try_get_next_round_battleContainer_position()
			let delta_x = target_position.x - this._mainPanel.battleContainer.x
			egret.Tween.get(this._mainPanel.battleContainer).to({scaleX:target_scale, scaleY:target_scale, x:target_position.x, y:target_position.y}, 0.3 * 1000).call(function(){
			})
			
			let __this = this
			let bg_move_x = delta_x * 0.2
			if(bg_move_x > 0){
				bg_move_x *= -1
			}
			let target_bg_x = this._mainPanel.backgroundContainer.x + bg_move_x
			egret.Tween.get(this._mainPanel.backgroundContainer).to({x:target_bg_x}, 0.3 * 1000).call(function(){
				let first_bg = __this._mainPanel.backgrounds[0]
				let global_right_pos = first_bg.localToGlobal(first_bg.width, 0)
				if(global_right_pos.x <= 0){
					__this._mainPanel.backgrounds.shift()
					first_bg.x = __this._mainPanel.backgrounds[__this._mainPanel.backgrounds.length - 1].x + first_bg.width
					__this._mainPanel.backgrounds.push(first_bg)
				}
			})
		}else{
			let target_scale = this._try_get_next_round_scale()
			let target_position = this._try_get_next_round_battleContainer_position()
			this._mainPanel.battleContainer.scaleX = this._mainPanel.battleContainer.scaleY = target_scale
			this._mainPanel.battleContainer.x = target_position.x
			this._mainPanel.battleContainer.y = target_position.y

			this.gamePlayer = new GamePlayer()
			this._mainPanel.battleContainer.addChild(this.gamePlayer)
			this._hasStartRound = true
			this.RelivePlayer()
		}
	}

	public MoveBackRound():void
	{
		let target_scale = this._try_get_next_round_scale()
		let target_position = this._try_get_next_round_battleContainer_position()
		let __this = this

		let delta_x = target_position.x - this._mainPanel.battleContainer.x
		egret.Tween.get(this._mainPanel.battleContainer).to({scaleX:target_scale, scaleY:target_scale, x:target_position.x, y:target_position.y}, 0.3 * 1000).call(function(){
			__this.gamePlayer.Relive()
		})
	}

	public RelivePlayer(delay_time:number = 0):void
	{
		if(delay_time == 0){
			this.gamePlayer.Relive()
			return
		}

		let __this = this
		CommonUtils.performDelay(function(){
			__this.MoveBackRound()
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
		this.MoveNextRound()
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

	public ChangeScore(delta_score:number):void
	{
		GameController.instance.serverModel.myRole.score += delta_score
		GameController.instance.serverModel.myRole.score = Math.max(GameController.instance.serverModel.myRole.score, 0)
		this._mainPanel.UpdateScore()
	}
}