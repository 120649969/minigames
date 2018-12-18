class GameLogicComponent extends BaseComponent {

	private _mainScenePanel:ui.MainScenePanel
	public gameConfig:GameConfig
	public all_lines:Array<BallLine> = []
	private _myBall:MyBall

	public combo_times:number = 0
	private _global_start_point:egret.Point
	
	public max_line:number = 0
	public constructor() {
		super()
		this._mainScenePanel = GameController.instance.GetMainScenePanel()
		let native_configs:Array<Object>= RES.getRes("data_json")
		this.gameConfig = new GameConfig(native_configs)

		let global_start_point = this._mainScenePanel.m_start.localToGlobal(this._mainScenePanel.m_start.width / 2, this._mainScenePanel.m_start.height / 2)
		this._global_start_point = global_start_point
		let local_in_cointainer = this._mainScenePanel.m_fixline.parent.globalToLocal(global_start_point.x, global_start_point.y)
		this._mainScenePanel.m_fixline.x = local_in_cointainer.x
		this._mainScenePanel.m_fixline.y = local_in_cointainer.y

		this._calc_line()
	}

	private _calc_line():void
	{
		let game_container_top = this._mainScenePanel.m_game_container.localToGlobal(0, 0)
		let end_point = this._mainScenePanel.m_line.localToGlobal(0, 0)
		let max_height = end_point.y - game_container_top.y
		this.max_line = Math.ceil((max_height - GameConst.LINE_HEIGHT) / (GameConst.LINE_HEIGHT * Math.cos(Math.PI / 6)) + 1)
	}

	private _get_rotate(stageX:number, stageY:number):number
	{
		let distance = Math.sqrt(Math.pow(stageX - this._global_start_point.x, 2) + Math.pow(stageY - this._global_start_point.y, 2))
		let rate_x = (stageX - this._global_start_point.x) / distance
		let rate_y = (stageY - this._global_start_point.y) / distance

		let degree = Math.acos(rate_x)
		return degree
	}

	public OnTouchStart(stageX:number, stageY:number):boolean
	{
		super.OnTouchStart(stageX, stageY)
		if(this._myBall && this._myBall.is_moving){
			return false
		}

		this._mainScenePanel.m_fixline.visible = true
		let degree = this._get_rotate(stageX, stageY)
		degree = degree / Math.PI * 180
		degree = Math.min(GameConst.MAX_DEGREE, Math.max(GameConst.MIN_DEGREE, degree))
		this._mainScenePanel.m_fixline.rotation = degree * -1
		return false
	}

	public OnTouchMove(stageX:number, stageY:number):void
	{
		super.OnTouchMove(stageX, stageY)
		let degree = this._get_rotate(stageX, stageY)
		degree = degree / Math.PI * 180
		degree = Math.min(GameConst.MAX_DEGREE, Math.max(GameConst.MIN_DEGREE, degree))
		this._mainScenePanel.m_fixline.rotation = degree * -1
	}

	public OnTouchEnd(stageX:number, stageY:number):void
	{
		super.OnTouchEnd(stageX, stageY)
		this._mainScenePanel.m_fixline.visible = false
		if(this._myBall && this._myBall.is_moving){
			return
		}

		if(this._mainScenePanel.m_fixline.rotation == -1 * GameConst.MIN_DEGREE || this._mainScenePanel.m_fixline.rotation == -1 * GameConst.MAX_DEGREE)
		{
			return
		}
		let rate_x = Math.cos(this._mainScenePanel.m_fixline.rotation * -1 / 180 * Math.PI)
		let rate_y = Math.sin(this._mainScenePanel.m_fixline.rotation * -1 / 180 * Math.PI) * -1

		let speed_x = rate_x * GameConst.MY_BALL_SPEED
		let speed_y = rate_y * GameConst.MY_BALL_SPEED
		this._myBall.speed_x = speed_x
		this._myBall.speed_y = speed_y

		this._myBall.is_moving = true
		SoundManager.getInstance().playSound('touch_down_mp3')
	}

	public TryGenerateMultiLine():void
	{
		let generate_count = GameConst.MIN_KEPP_LINE_COUNT - this.all_lines.length
		if(generate_count > 0){
			let top_y = 0
			let is_last_long = false
			if(this.all_lines.length > 0){
				let top_line = this.all_lines[this.all_lines.length - 1]
				top_y = top_line.y
				is_last_long = top_line.is_long
			}
			let multi_line_config = this.gameConfig.GetRandomLineConfig(is_last_long)
			for(let index = 0; index < GameConst.GENERATE_STEP_LINE_COUNT; index++)
			{
				let line_config:Array<number> = multi_line_config.all_line_config[GameConst.GENERATE_STEP_LINE_COUNT - 1 - index] as Array<number>
				let new_line = new BallLine()
				new_line.UpdateConfig(line_config)
				this._mainScenePanel.m_game_container.addChild(new_line)
				let circle_width = new_line.height
				new_line.y = top_y - new_line.height + circle_width / 2 * (1 - Math.cos(30 / 180 * Math.PI)) + 5
				this.all_lines.push(new_line)
				top_y = new_line.y
			}
		}
	}

	public CheckOver():boolean
	{
		if(this.all_lines.length <= 0){
			return false
		}
		let buttom_multi_line = this.all_lines[0]
		let buttom_point = buttom_multi_line.localToGlobal(0, buttom_multi_line.height)
		let dead_line_point = this._mainScenePanel.m_line.localToGlobal(0, 0)
		if(buttom_point.y >= dead_line_point.y){
			GameNet.reqDeadEnd()
			GameController.instance.OnClientOver()
			return true
		}
		return false
	}

	public _get_current_speed():number
	{
		if(this.all_lines.length <= 0){
			return 0
		}
		let buttom_multi_line = this.all_lines[0]
		if(buttom_multi_line.y <= 2 * buttom_multi_line.height){
			return GameConst.quick_ball_speed
		}
		let buttom_point = buttom_multi_line.localToGlobal(0, buttom_multi_line.height)
		let dead_line_point = this._mainScenePanel.m_line.localToGlobal(0, 0)
		
		if(Math.abs(buttom_point.y -  dead_line_point.y) < 100){
			return GameConst.slow_ball_speed
		}
		return GameConst.normal_ball_speed
	}	

	private _isStop:boolean = false
	public OnEnterFrame():void
	{
		for(let index = this._all_move_down_balls.length - 1; index >= 0; index--)
		{
			let ball = this._all_move_down_balls[index]
			if(ball.UpdateMoveDown()){
				this._all_move_down_balls.splice(index, 1)
			}
		}
		
		if(this.CheckOver()){
			return
		}
		this.TryGenerateMultiLine()
		let speed = this._get_current_speed()
		for(let index = 0; index < this.all_lines.length; index++)
		{
			let line = this.all_lines[index]
			line.MoveDown(speed)
		}
		
		if(this._myBall)
		{
			this._myBall.Update()
		}
	}

	public onTimer():void
	{
		GameNet.reqScore(0, this.max_line, this.GetLineCountInVisible())
	}

	public GetLineCountInVisible():number
	{
		let cur_line = 0
		for(let ball_line of this.all_lines)
		{
			if(ball_line.isVisible){
				cur_line++
			}else{
				break
			}
		}
		return cur_line
	}

	public OnStart():void
	{
		super.OnStart()
		this.next_ball_type = this.GetNextBallType()
		this.GenerateNextMyBall()
		this._mainScenePanel.m_role_armature.visible = true
	}

	public next_ball_type:number
	public GenerateNextMyBall():void
	{
		this._myBall = new MyBall()
		this.next_ball_type = this.GetNextBallType()
		this._mainScenePanel.m_role_armature.animation.play("role_animation_2", 1)
		CommonUtils.setNewSlot(this._mainScenePanel.m_role_armature, "001ball", "ball" + (this.next_ball_type) + "_png")
	}

	private _all_move_down_balls:Array<MoveDownBall> = []
	public AddMoveDownBalls(source_ball:Ball):void
	{
		let move_down_ball:MoveDownBall = new MoveDownBall()
		move_down_ball.SetBallType(source_ball.ball_type)
		move_down_ball.x = source_ball.x
		move_down_ball.y = source_ball.y
		let global_source_ball_point = source_ball.parent.localToGlobal(source_ball.x, source_ball.y)
		let local_point = this._mainScenePanel.m_ui_down.globalToLocal(global_source_ball_point.x, global_source_ball_point.y)
		this._mainScenePanel.m_ui_down.addChild(move_down_ball)
		move_down_ball.x = local_point.x
		move_down_ball.y = local_point.y

		move_down_ball.PlayMoveDownAnimation()
		this._all_move_down_balls.push(move_down_ball)
	}

	public InsertNewLineToButtom():BallLine
	{
		let ball_line = new BallLine()
		let line_config = null
		let is_last_long = false
		if(this.all_lines.length > 0){
			is_last_long = this.all_lines[0].is_long
		}
		if(is_last_long){
			ball_line.UpdateConfig(GameConst.Generat9LineConfig())
		}else{
			ball_line.UpdateConfig(GameConst.Generate10LineConfig())
		}
		ball_line.isVisible = true
		this._mainScenePanel.m_game_container.addChild(ball_line)
		let circle_width = ball_line.height
		ball_line.y = this.all_lines[0].y + ball_line.height - circle_width / 2 * (1 - Math.cos(30 / 180 * Math.PI)) - 5
		this.all_lines.unshift(ball_line)
		return ball_line
	}


	public OnUseProp(data):void
	{
		let id = data['id'] || data['openid']
		if(id == User.openId){
			return
		}
		if(data['prop']){
			if(data['prop'] == SKILL_PROP_TYPE.ADD_LINE){
				this._add_line()
			}else if(data['prop'] == SKILL_PROP_TYPE.INVALID_BALL){
				this._invalid_ball()
			}
		}
	}

	private _add_line():void
	{
		let speed = GameConst.LINE_HEIGHT
		for(let index = 0; index < this.all_lines.length; index++)
		{
			let line = this.all_lines[index]
			line.MoveDown(speed)
		}
		this._mainScenePanel.ShowOtherToMeMoveDownSkillTips()
	}

	private _invalid_ball():void
	{
		let count = 0
		for(let line of this.all_lines){
			if(line.isVisible){
				count ++
			}
		}
		if(count <= 0){
			return
		}
		let random_line_index = Math.floor(Math.random() * count)
		let line = this.all_lines[random_line_index]
		let valid_balls = []
		for(let ball of line.all_balls){
			if(ball.IsValid() && !ball.isMarkedSameColorClear){
				valid_balls.push(ball)
			}
		}
		let random_ball_index = Math.floor(Math.random() * valid_balls.length)
		let ball:Ball= valid_balls[random_ball_index]
		ball.SetBallType(BALL_TYPE.TYPE_7)
		this._mainScenePanel.ShowOtherToMeValidBallSkillTips()
	}

	//根据当前可视范围的球出现的次数来动态获取下一个球的颜色
	public GetNextBallType():number
	{
		let ret = -1
		let num_counts = []
		let total_num = 0
		for(let index = 0; index < BALL_TYPE.TYPE_6; index++)
		{
			num_counts.push(0)
		}

		for(let line of this.all_lines)
		{
			if(!line.isVisible){
				break
			}
			for(let ball of line.all_balls)
			{
				if(ball.IsValid() && !ball.isMarkedSameColorClear && ball.ball_type < BALL_TYPE.MAX_TYPE){
					num_counts[ball.ball_type - 1] ++
					total_num++
				}
			}
		}
		
		let random_num = Math.floor(Math.random() * total_num)
		for(let index = 0; index < num_counts.length; index++)
		{
			if(random_num < num_counts[index]){
				return index + 1
			}
			random_num -= num_counts[index]
		}
		return Math.ceil(Math.random() * (BALL_TYPE.MAX_TYPE - 1))
	}

	private _cache_boom_armatures = []
	public GetNextBoomArmature():dragonBones.EgretArmatureDisplay
	{
		if(this._cache_boom_armatures.length > 0){
			let armature = this._cache_boom_armatures.pop()
			armature.visible = true
			return armature
		}
		let __this = this
		let boom_armature = CommonUtils.createDragonBones("boom_ske_json", "boom_tex_json", "boom_tex_png", "boom_armature")
		this._mainScenePanel.m_game_container.addChild(boom_armature)
		boom_armature.addDBEventListener(dragonBones.AnimationEvent.COMPLETE, function(){
			boom_armature.visible = false
			__this._cache_boom_armatures.push(boom_armature)
		}, this)
		return boom_armature
	}
}
