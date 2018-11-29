class PlateObject {

	public m_plate_container:egret.DisplayObjectContainer
	private m_plate_image:eui.Image
	private _mainPanel:ui.MainGameScene
	private _isReady:boolean

	
	public all_sort_game_objects:Array<BaseGameObject> = []

	public all_knife_objects:Array<KnifeObject> = []
	public all_prop_objects:Array<PropObject> = []

	public roundPlateRotateStrategy:RoundPlateRotateStrategy
	public rotate_scale:number = 1

	public constructor(mainPanel:ui.MainGameScene) {
		this._mainPanel = mainPanel
		this.m_plate_container = mainPanel.m_plate_container
		this.m_plate_container.scaleX = this.m_plate_container.scaleY = 0

		this.m_plate_image = mainPanel.m_plate_image

		this.RandomChangeBallBg()
	}

	public RandomChangeBallBg():void
	{
		
		let random_index = Math.floor(Math.random() * KnifeConst.MAX_BALL_COUNT)
		let ball_key = "ball" + (random_index + 1) + "_png"
		this.m_plate_image.source = ball_key
	}

	
	public GetGlobalCenterPoint():egret.Point
	{
		let global_center_point = this.m_plate_container.localToGlobal(this.m_plate_container.width / 2, this.m_plate_container.height / 2);
		return global_center_point
	}

	public EnterNextBigRound(roundConfig:RoundConfig):void
	{
		this.rotate_scale = 1
		this.roundPlateRotateStrategy = new RoundPlateRotateStrategy(roundConfig)
		this._isReady = false
		let __this = this
		this.m_plate_container.visible = true
		this.m_plate_container.rotation = 0
		this.m_plate_container.scaleX = this.m_plate_container.scaleY = 0
		egret.Tween.get(this.m_plate_container).to({scaleX : 1.2, scaleY : 1.2}, 0.25 * 1000).call(function(){
			egret.Tween.get(__this.m_plate_container).to({scaleX : 1, scaleY : 1}, 0.1 * 1000)
			__this._isReady = true
		})

		for(let index in this.all_knife_objects){
			let knife_object = this.all_knife_objects[index]
			knife_object.parent.removeChild(knife_object)
		}
		for(let index in this.all_prop_objects){
			let prop_object = this.all_prop_objects[index]
			prop_object.parent.removeChild(prop_object)
		}
		this.all_knife_objects = []
		this.all_sort_game_objects = []
		this.all_prop_objects = []

		this._createInitMaterials()
	}

	//添加初始的材料
	private _createInitMaterials():void
	{
		let current_material_configs = this.roundPlateRotateStrategy.roundConfig.materialConfigs
		for(let index = 0; index < current_material_configs.length; index++)
		{
			let current_config = current_material_configs[index]
			let type = current_config.type
			for(let type_index = 0; type_index < current_config.count; type_index ++)
			{
				if(type == 1){ //飞刀类型
					let other_knife_object = new KnifeObject(this._mainPanel, true)
					this.m_plate_container.addChild(other_knife_object)
					other_knife_object.isMe = false
					other_knife_object.anchorOffsetX = other_knife_object.hit_ball_rect.x + other_knife_object.hit_ball_rect.width / 2
					other_knife_object.anchorOffsetY = other_knife_object.hit_ball_rect.y + other_knife_object.hit_ball_rect.height / 2

					let random_degree = current_config.getRandomDegree(type_index)
					other_knife_object.x = this.m_plate_container.width / 2 + (this.m_plate_container.width / 2) * Math.cos(random_degree / 180 * Math.PI)
					other_knife_object.y = this.m_plate_container.height / 2 + (this.m_plate_container.height / 2) * Math.sin(random_degree / 180 * Math.PI)
					other_knife_object.rotation = random_degree - 90
					this._pushNewKnifeObject(other_knife_object)
				} else if(type == 2) {
					let other_prop_object = new PropObject()
					other_prop_object.type = type
					this.m_plate_container.addChild(other_prop_object)
					let random_degree = current_config.getRandomDegree(type_index)
					let __width = other_prop_object.width
					other_prop_object.anchorOffsetX =  other_prop_object.width / 2
					other_prop_object.x = this.m_plate_container.width / 2 + (this.m_plate_container.width / 2) * Math.cos(random_degree / 180 * Math.PI)
					other_prop_object.y = this.m_plate_container.height / 2 + (this.m_plate_container.height / 2) * Math.sin(random_degree / 180 * Math.PI)
					other_prop_object.rotation = random_degree - 90

					other_prop_object.degree_on_plate = random_degree
					if(random_degree < 0){
						random_degree = random_degree + 360  //0--360范围内
					}
					this._pushNewPropObject(other_prop_object)
				}
			}
		}
		this.m_plate_container.setChildIndex(this._mainPanel.m_plate_image, this.m_plate_container.numChildren)
	}

	public GetMaxKnifeCount():number
	{
		return this.roundPlateRotateStrategy.maxKnifeCount
	}

	public Update():void
	{
		if(!this._isReady){
			return
		}
		let step_value = this.roundPlateRotateStrategy.Step(1 / 30) * this.rotate_scale
		this.m_plate_container.rotation += step_value
	}

	public UpdateVersion2(time_delta:number = 1):void
	{
		if(!this._isReady){
			return
		}
		let step_value = this.roundPlateRotateStrategy.Step(1 / 30 * time_delta) * this.rotate_scale * time_delta
		this.m_plate_container.rotation += step_value
	}


	public has_other_knife = false
	public WaitToInsertNewKnife():void
	{
		if(this.has_other_knife){
			return
		}
		this.has_other_knife = true
	}

	public GetAllMyKnifeCount():number
	{
		let count = 0
		for(let index = 0; index < this.all_knife_objects.length; index++)
		{
			let knife_object = this.all_knife_objects[index]
			if(knife_object.isMe)
			{
				count += 1
			}
		}
		return count
	}

	private _pushNewKnifeObject(knife_object:KnifeObject):void
	{
		this.all_knife_objects.push(knife_object)
		this.all_sort_game_objects.push(knife_object)
		this.all_sort_game_objects.sort(function(game_object_a:KnifeObject, game_object_b:KnifeObject){
			return game_object_a.degree_on_plate < game_object_b.degree_on_plate
		}.bind(this))
	}

	private _pushNewPropObject(prop_object:PropObject):void
	{
		this.all_prop_objects.push(prop_object)
		this.all_sort_game_objects.push(prop_object)
		this.all_sort_game_objects.sort(function(game_object_a:KnifeObject, game_object_b:KnifeObject){
			return game_object_a.degree_on_plate < game_object_b.degree_on_plate
		}.bind(this))
	}

	public OnHitOtherKnife(knifeObject:KnifeObject):boolean
	{
		let __this = this
		this._pushNewKnifeObject(knifeObject)
		if(knifeObject.isMe){
			this._mainPanel.OnGetScore()
		}
		let isWin = this.GetAllMyKnifeCount() >= this.roundPlateRotateStrategy.maxKnifeCount

		if(knifeObject.isMe){
			let start_x = this.m_plate_container.x
			let start_y = this.m_plate_container.y
			let top_y = start_y - KnifeConst.Shake_Range
			egret.Tween.get(this.m_plate_container).to({x:start_x, y:top_y}, 0.05 * 1000).to({x:start_x, y:start_y}, 0.05 * 1000).call(function(){
				if(isWin){
					__this.m_plate_container.visible = false
					__this._mainPanel.ShowResult(true)
				}
			})
		}  else {
			let start_x = this.m_plate_container.x
			let start_y = this.m_plate_container.y
			let target_x = start_x - KnifeConst.Shake_Range
			let target_y = start_y + KnifeConst.Shake_Range
			egret.Tween.get(this.m_plate_container).to({x:target_x, y:target_y}, 0.05 * 1000).to({x:start_x, y:start_y}, 0.05 * 1000).call(function(){
			})
		}
		
		knifeObject.label_index = this.all_knife_objects.length
		knifeObject.testLabel.text = this.all_knife_objects.length.toString()
		if(!isWin){
			this._mainPanel.GenerateNextKnife()
		}
		return isWin
	}

	public OnHitPropObject(knifeObject:KnifeObject, prop_object:PropObject):void
	{
		let __index_in_not_sort = this.all_prop_objects.indexOf(prop_object)
		if(__index_in_not_sort >= 0)
		{
			this.all_prop_objects.splice(__index_in_not_sort, 1)
		}

		let __index_in_sort = this.all_sort_game_objects.indexOf(prop_object)
		if(__index_in_sort >= 0)
		{
			this.all_sort_game_objects.splice(__index_in_sort, 1)
		}

		if(prop_object.parent)
		{
			prop_object.parent.removeChild(prop_object)
		}
	}

	public CheckCanInsertOtherKnife():boolean
	{
		let big_delta_degree = 30
		let small_delta_degree = 20
		let dir = this.roundPlateRotateStrategy.GetCurrentStrategy().direction
		let right_top_degree_on_plat = ((360 - 45) - (this.m_plate_container.rotation + 360) % 360 + 360) % 360

		let left_degree = big_delta_degree
		let right_degree = small_delta_degree
		if(dir == RotateDirection.NEGATIVE){
			left_degree = small_delta_degree
			right_degree = big_delta_degree
		}
		for(let index = 0; index < this.all_sort_game_objects.length; index++)
		{
			let cur_game_object = this.all_sort_game_objects[index]
			if(right_top_degree_on_plat >= cur_game_object.degree_on_plate - left_degree && right_top_degree_on_plat <= cur_game_object.degree_on_plate + right_degree)
			{
				return false
			}
		}
		return true	
	}

	public ShowWinAnimation(callback):void
	{
		this._mainPanel.m_copy_plat_container.rotation = this.m_plate_container.rotation
		for(let index = 0; index < this.all_sort_game_objects.length; index++)
		{
			let game_object = this.all_sort_game_objects[index]

			if(game_object == this.all_knife_objects[this.all_knife_objects.length - 1]){

			} else {
				game_object.parent.removeChild(game_object)
				this._mainPanel.m_copy_plat_container.addChild(game_object)
			}

			let global_center_point = game_object.localToGlobal(game_object.width / 2, game_object.height / 2)
			let local_point = game_object.parent.globalToLocal(global_center_point.x, global_center_point.y)
			game_object.anchorOffsetX = game_object.width / 2
			game_object.anchorOffsetY = game_object.height / 2

			game_object.x = local_point.x
			game_object.y = local_point.y

			let __this = this
			if(game_object == this.all_knife_objects[this.all_knife_objects.length - 1]){
				let move_up_global_point = new egret.Point(global_center_point.x, 300)
				let local_move_up_in_global_point = game_object.parent.globalToLocal(move_up_global_point.x, move_up_global_point.y)

				let move_down_global_point = new egret.Point(global_center_point.x, this._mainPanel.height)
				let local_move_down_in_global_point = game_object.parent.globalToLocal(move_down_global_point.x, move_down_global_point.y)

				let time =  1 * 1000
				egret.Tween.get(game_object).to({x:local_move_up_in_global_point.x, y:local_move_up_in_global_point.y + 200}, time * 0.1)
				.call(function(){
					egret.Tween.get(game_object).to({rotation:180}, time * 0.5)
				})
				.to({x:local_move_up_in_global_point.x, y:local_move_up_in_global_point.y}, time * 0.5, egret.Ease.sineOut)
				.call(function(){
					egret.Tween.get(game_object).to({rotation:360}, time * 0.5)
					.call(function(){
						game_object.rotation = 0
						egret.Tween.get(game_object, {loop:true}).to({rotation:180}, time * 0.5)
						.to({rotation:360}, time * 0.5)
					})
				})
				.to({x:local_move_down_in_global_point.x, y:local_move_down_in_global_point.y}, time * 1, egret.Ease.sineIn)
				.call(function(){
					egret.Tween.removeTweens(game_object)
					game_object.visible = false
					if(callback)
					{
						callback()
						callback = null
					}
				})
			} else {
				let global_top_center_point = game_object.localToGlobal(game_object.width / 2,0)
				let dir = new egret.Point(global_center_point.x - global_top_center_point.x, global_center_point.y - global_top_center_point.y)
				dir.normalize(1)

				let global_target_point = new egret.Point(global_center_point.x + dir.x * 100, global_center_point.y + dir.y * 100)

				let move_up_global_point = new egret.Point(global_target_point.x, global_target_point.y)
				let local_move_up_in_global_point = game_object.parent.globalToLocal(move_up_global_point.x, move_up_global_point.y)

				let move_down_global_point = new egret.Point(global_target_point.x, global_target_point.y + 1200)
				let local_move_down_in_global_point = game_object.parent.globalToLocal(move_down_global_point.x, move_down_global_point.y)

				let time =  1 * 1000
				egret.Tween.get(game_object).to({x:local_move_up_in_global_point.x, y:local_move_up_in_global_point.y}, 0.04 * 1000, egret.Ease.sineOut)
				.to({x:local_move_down_in_global_point.x, y:local_move_down_in_global_point.y}, time, egret.Ease.sineIn)
				.call(function(){
					egret.Tween.removeTweens(game_object)
				})
				egret.Tween.get(game_object).to({rotation:game_object.rotation + 180}, time)
			}
		}
	}
}