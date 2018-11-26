class PlateObject {

	public m_plate_container:egret.DisplayObjectContainer
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
			this.m_plate_container.removeChild(knife_object)
		}
		for(let index in this.all_prop_objects){
			let prop_object = this.all_prop_objects[index]
			this.m_plate_container.removeChild(prop_object)
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

		if(this._wait_time >= 0){  //有需要插入的
			if(this.roundPlateRotateStrategy.hasChangeStrategy){
				this._wait_time = -1
				this.WaitToInsertNewKnife()
			} else {
				this._wait_time -= Math.abs(step_value)
				if(this._wait_time < Math.abs(step_value) * 2){
					this._wait_time = -1
					this._mainPanel.GenerateOtherKnife()
				}
			}
		}
	}

	private _wait_time:number = -1
	public WaitToInsertNewKnife():void
	{
		if(this._wait_time > 0){
			return
		}
		let wait_degree = this.CalculateNextEmptyPlace()
		this._wait_time  = wait_degree
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

	public OnHitOtherKnife(knifeObject:KnifeObject):void
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

	//计算等待旋转多少才可以插入
	//可以再考虑第二个方式，先计算到某个点的角度，然后如果转到改点就发射
	public CalculateNextEmptyPlace():number
	{
		if(this.all_sort_game_objects.length <= 0){ //马上插入
			return 0
		}

		if(this.all_sort_game_objects.length == 1){  //只有一个
			let current_knife_global_degree = (this.all_sort_game_objects[0].degree_on_plate + (this.m_plate_container.rotation + 360) % 360) % 360
			if(Math.abs(315 - current_knife_global_degree) <= 20) {
				return 90
			}
			return 0
		}

		let max_delta_degree = 0
		let max_degree_game_obejct_a:BaseGameObject
		let max_degree_game_obejct_b:BaseGameObject

		let dir = this.roundPlateRotateStrategy.GetCurrentStrategy().direction
		for(let index = 0; index < this.all_sort_game_objects.length ; index++)
		{
			let knife_object_a = this.all_sort_game_objects[index]
			let knife_object_b = this.all_sort_game_objects[(index + 1) % this.all_sort_game_objects.length]

			let cur_delta_degree = 0
			if(dir > 0){
				cur_delta_degree = (knife_object_a.degree_on_plate - knife_object_b.degree_on_plate + 360) % 360
			} else {
				cur_delta_degree = (knife_object_a.degree_on_plate - knife_object_b.degree_on_plate + 360) % 360
			}
			
			if (cur_delta_degree > max_delta_degree){
				max_delta_degree = cur_delta_degree
				if(dir == RotateDirection.POSITIVE){
					max_degree_game_obejct_a = knife_object_a
					max_degree_game_obejct_b = knife_object_b
				} else {
					max_degree_game_obejct_a = knife_object_b
					max_degree_game_obejct_b = knife_object_a
				}
			}
		}

		if(max_degree_game_obejct_a && max_degree_game_obejct_b){
			let current_knife_global_degree = (max_degree_game_obejct_a.degree_on_plate - max_delta_degree / 2 * dir + (this.m_plate_container.rotation + 360) % 360) % 360
			if(dir > 0){
				return  (315 - current_knife_global_degree + 360) % 360
			} else {
				return  (45 + current_knife_global_degree + 360) % 360
			}
		}
		return 0
	}
}