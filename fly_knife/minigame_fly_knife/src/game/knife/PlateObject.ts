class PlateObject {

	public m_plate_container:egret.DisplayObjectContainer
	private _mainPanel:MainGameScene
	private _isReady:boolean
	private _delta_degree:number = 0

	public all_knife_objects:Array<KnifeObject> = []
	public all_sort_knife_objects:Array<KnifeObject> = []
	private _roundPlateRotateStrategy:RoundPlateRotateStrategy

	public constructor(mainPanel:MainGameScene) {
		this._mainPanel = mainPanel
		this.m_plate_container = mainPanel.m_plate_container
		this.m_plate_container.scaleX = this.m_plate_container.scaleY = 0
	}

	public GetGlobalCenterPoint():egret.Point
	{
		let global_center_point = this.m_plate_container.localToGlobal(this.m_plate_container.width / 2, this.m_plate_container.height / 2);
		return global_center_point
	}

	public EnterNextBigRound(strategyConfig:Object):void
	{
		this._roundPlateRotateStrategy = new RoundPlateRotateStrategy(strategyConfig)
		this._isReady = false
		this._delta_degree = 6
		let __this = this
		this.m_plate_container.visible = true
		this.m_plate_container.scaleX = this.m_plate_container.scaleY = 0
		egret.Tween.get(this.m_plate_container).to({scaleX : 1.2, scaleY : 1.2}, 0.25 * 1000).call(function(){
			egret.Tween.get(__this.m_plate_container).to({scaleX : 1, scaleY : 1}, 0.1 * 1000)
			__this._isReady = true
		})

		for(let index in this.all_knife_objects){
			let knife_object = this.all_knife_objects[index]
			this.m_plate_container.removeChild(knife_object)
		}
		this.all_knife_objects = []
		this.all_sort_knife_objects = []
	}

	public GetMaxKnifeCount():number
	{
		return this._roundPlateRotateStrategy.maxKnifeCount
	}

	public Update():void
	{
		if(!this._isReady){
			return
		}
		let step_value = this._roundPlateRotateStrategy.Step(1 / 30)
		this.m_plate_container.rotation += step_value

		if(this._wait_time >= 0){  //有需要插入的
			this._wait_time -= Math.abs(step_value)
			if(this._wait_time < Math.abs(step_value) * 2){
				this._wait_time = -1
				console.log("#######可以插入了###")
				this._mainPanel.GenerateOtherKnife()
			} else {
				console.log("####等待时间更改##", this._wait_time)
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
		console.log("#######等待时间##", this._wait_time)
	}

	public EnterNextRound():void
	{
		
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

	public OnHit(knifeObject:KnifeObject):void
	{
		let __this = this
		this.all_knife_objects.push(knifeObject)
		
		this.all_sort_knife_objects.push(knifeObject)
		if(knifeObject.isMe){
			this._mainPanel.OnGetScore()
		}

		let isWin = this.GetAllMyKnifeCount() >= this._roundPlateRotateStrategy.maxKnifeCount

		if(knifeObject.isMe){
			let start_x = this.m_plate_container.x
			let start_y = this.m_plate_container.y
			let top_y = start_y - 30
			egret.Tween.get(this.m_plate_container).to({x:start_x, y:top_y}, 0.05 * 1000).to({x:start_x, y:start_y}, 0.05 * 1000).call(function(){
				if(isWin){
					__this.m_plate_container.visible = false
					__this._mainPanel.ShowResult(true)
				}
			})
		}  else {
			let start_x = this.m_plate_container.x
			let start_y = this.m_plate_container.y
			let target_x = start_x - 30
			let target_y = start_y + 30
			egret.Tween.get(this.m_plate_container).to({x:target_x, y:target_y}, 0.05 * 1000).to({x:start_x, y:start_y}, 0.05 * 1000).call(function(){
			})
		}
		
		knifeObject.label_index = this.all_knife_objects.length
		knifeObject.testLabel.text = this.all_knife_objects.length.toString()
		if(!isWin){
			this._mainPanel.NextRound()
		}

		this.all_sort_knife_objects.sort(function(knife_object_a:KnifeObject, knife_object_b:KnifeObject){
			if(this._roundPlateRotateStrategy.GetCurrentStrategy().direction == PlateRotateDirection.POSITIVE){
				return knife_object_a.degree_on_plate < knife_object_b.degree_on_plate
			} else {
				return knife_object_a.degree_on_plate > knife_object_b.degree_on_plate
			}
		}.bind(this))
	}

	//计算等待旋转多少才可以插入
	public CalculateNextEmptyPlace():number
	{
		if(this.all_sort_knife_objects.length <= 0){ //马上插入
			return 0
		}

		if(this.all_sort_knife_objects.length == 1){  //只有一个
			let current_knife_global_degree = (this.all_sort_knife_objects[0].degree_on_plate + (this.m_plate_container.rotation + 360) % 360) % 360
			if(Math.abs(315 - current_knife_global_degree) <= 20) {
				return 90
			}
			return 0
		}

		let max_delta_degree = 0
		let max_degree_knife_a:KnifeObject
		let max_degree_knife_b:KnifeObject

		let dir = this._roundPlateRotateStrategy.GetCurrentStrategy().direction
		for(let index = 0; index < this.all_sort_knife_objects.length ; index++)
		{
			let knife_object_a = this.all_sort_knife_objects[index]
			let knife_object_b = this.all_sort_knife_objects[(index + 1) % this.all_sort_knife_objects.length]

			let cur_delta_degree = (knife_object_a.degree_on_plate - knife_object_b.degree_on_plate + 360) % 360
			// let cur_delta_degree = 0
			// if(dir){
			// 	cur_delta_degree = knife_object_a.degree_on_plate - knife_object_b.degree_on_plate
			// } else {
			// 	cur_delta_degree = knife_object_b.degree_on_plate - knife_object_a.degree_on_plate
			// }
			if (cur_delta_degree > max_delta_degree){
				max_delta_degree = cur_delta_degree
				if(dir == PlateRotateDirection.POSITIVE){
					max_degree_knife_a = knife_object_a
					max_degree_knife_b = knife_object_b
				} else {
					max_degree_knife_a = knife_object_b
					max_degree_knife_b = knife_object_a
				}
			}
		}

		if(max_degree_knife_a && max_degree_knife_b){
			let current_knife_global_degree = (max_degree_knife_a.degree_on_plate - max_delta_degree / 2 * dir + (this.m_plate_container.rotation + 360) % 360) % 360
			if(dir > 0){
				return  (315 - current_knife_global_degree + 360) % 360
			} else {
				return  (45 + current_knife_global_degree + 360) % 360
			}
		}

		return 0
	}
}