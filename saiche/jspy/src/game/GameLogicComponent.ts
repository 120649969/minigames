class GameLogicComponent extends BaseComponent{

	public allTerrains:Array<GameTerrain> = []
	public allTerrainConfigs:Array<TerrainConfig> = []
	public currentTerrain:GameTerrain
	private _mainPanel:ui.MainScenePanel
	public constructor() {
		super()
		this._mainPanel = GameController.instance.GetMainScenePanel()
	}
	
	private trackIndex:number = 0
	public OnAddTerrainConfig(terrainConfig:TerrainConfig):void
	{
		let last_terrain:GameTerrain = null
		if(this.allTerrains.length > 0){
			last_terrain = this.allTerrains[this.allTerrains.length - 1]
		}
		this.allTerrainConfigs.push(terrainConfig)
		let new_debug_terrain:GameTerrain = null
		if(this.allTerrainConfigs.length == 1){
			new_debug_terrain = new GameTerrain()
			new_debug_terrain.build_first_line_terrain()
			this.allTerrains.push(new_debug_terrain)
		}else{
			if(terrainConfig.trackType == TrackType.Arc){
				new_debug_terrain = new GameTerrain()
				new_debug_terrain.buildArcTerrain()
				this.allTerrains.push(new_debug_terrain)
			}else if(terrainConfig.trackType == TrackType.HeorizontalLine){
				new_debug_terrain = new GameTerrain()
				new_debug_terrain.buildHeorizontalTerrain()
				this.allTerrains.push(new_debug_terrain)
			}else if(terrainConfig.trackType == TrackType.VerticalLine){
				new_debug_terrain = new GameTerrain()
				new_debug_terrain.buildVerticalTerrain()
				this.allTerrains.push(new_debug_terrain)
			}else if(terrainConfig.trackType == TrackType.ThreeArc){
				new_debug_terrain = new GameTerrain()
				new_debug_terrain.buildThreeArcTerrain()
				this.allTerrains.push(new_debug_terrain)
			}
		}
		if(last_terrain && last_terrain.IsThreeTerrain()){
			let new_terrain = new_debug_terrain.CopyTerrain()
			last_terrain.next_copy_terrain = new_terrain
		}
	}

	private _generate_map():void
	{
		let native_configs:Array<Object>= RES.getRes("data_json")
		let config_index = Math.floor(Math.random() * native_configs.length)
		config_index = 0
		let native_config:Array<Object> = native_configs[config_index] as Array<Object>
		for(let config of native_config)
		{
			let config_array = config as Array<number>
			let terrainConfig = new TerrainConfig()
			terrainConfig.trackType = config_array[0]
			terrainConfig.fromDirection = config_array[1]
			terrainConfig.toDirection = config_array[2]
			terrainConfig.trackCount = config_array[3]
			this.OnAddTerrainConfig(terrainConfig)
		}
	}

	private _begin_move_car():void
	{
		
		let global_center = new egret.Point(this._mainPanel.stage.stageWidth / 2, this._mainPanel.stage.stageHeight - this._mainPanel.m_start_line.height - this._mainPanel.moveCar.height / 2 - 20)
		let local_in_role_container = this._mainPanel.roleContainer.globalToLocal(global_center.x, global_center.y)
		this._mainPanel.moveCar.x = local_in_role_container.x
		this._mainPanel.moveCar.y = local_in_role_container.y

		let target_point = new egret.Point(this._mainPanel.stage.stageWidth / 2, this._mainPanel.stage.stageHeight / 2)
		let target_local_point = this._mainPanel.roleContainer.globalToLocal(target_point.x, target_point.y)
		this._mainPanel.moveCar.visible = true
		let __this = this
		egret.Tween.get(this._mainPanel.moveCar).to({y:target_local_point.y}, 0.5 * 1000).call(function(){
			__this.On_Move_Begin_Move_Car_End()
		})
	}

	private _has_update:boolean = false
	public On_Move_Begin_Move_Car_End():void
	{
		this._has_update = true
		this._mainPanel.moveCar.ChangeStatus(CarStatus.Moving)
	}


	public OnStart():void
	{
		this._generate_map()
		this._mainPanel.moveCar.OnStart()
		this.currentTerrain = this.allTerrains[0]
		this._begin_move_car()

	}

	public ChangeTerrainToNext():void
	{
		let terrainIndex = this.allTerrains.indexOf(this.currentTerrain)
		let nextTerrain = this.allTerrains[terrainIndex + 1]
		if(!nextTerrain){
			this.currentTerrain = null
			GameController.instance.OnClientOver()
			return
		}
		this.currentTerrain = nextTerrain
	}

	public GetNextTerrain():GameTerrain
	{
		let terrainIndex = this.allTerrains.indexOf(this.currentTerrain)
		let nextTerrain = this.allTerrains[terrainIndex + 1]
		return nextTerrain
	}

	public Move_Container(delta_x:number, delta_y:number):void
	{
		this._mainPanel.moveContainer.x += delta_x * -1
		this._mainPanel.moveContainer.y += delta_y *  -1
	}

	public OnEnterFrame():void
	{
		if(!this._has_update){
			return
		}
		if(this._current_drag_handle)
		{
			this._current_drag_handle.Update()
		}
		this._mainPanel.moveCar.Update()
	}

	private _current_drag_handle:DragCarHandle
	public OnTouchStart(stageX:number, stageY:number):boolean
	{
		let next_drag_game_terrain = DragCarHandle.FindNextDragGameTerrain()
		if(!next_drag_game_terrain){
			return
		}
		let next_drag_track = next_drag_game_terrain.allTracks[0]
		this._current_drag_handle = new DragCarHandle()
		this._current_drag_handle.SetFrameChangeDegreeRate(next_drag_track.GetRotateRate())
		this._mainPanel.mapContainer.addChild(this._current_drag_handle)
		// this._current_drag_handle.parent.setChildIndex(this._current_drag_handle, next_drag_track.parent.getChildIndex(next_drag_track) + 1)
		let dragCenterPoint = next_drag_track.GetCenterPointInMapContainer()

		let target_anchor_x = this._mainPanel.moveCar.m_left.x
		let target_anchor_y =  this._mainPanel.moveCar.m_left.y
		if(next_drag_track.GetRotateRate() > 0){
			target_anchor_x =  this._mainPanel.moveCar.m_right.x
		}
		let global_drag_point = this._mainPanel.moveCar.localToGlobal(target_anchor_x, target_anchor_y)
		let local_in_mapContainer = this._mainPanel.mapContainer.globalToLocal(global_drag_point.x, global_drag_point.y)
		
		this._current_drag_handle.SetPoint(dragCenterPoint, local_in_mapContainer)
		let local_point = this._current_drag_handle.globalToLocal(global_drag_point.x, global_drag_point.y)

		this._mainPanel.moveCar.parent.removeChild(this._mainPanel.moveCar)
		this._current_drag_handle.addChild(this._mainPanel.moveCar)

		this._mainPanel.moveCar.anchorOffsetX = target_anchor_x
		this._mainPanel.moveCar.anchorOffsetY = target_anchor_y

		this._mainPanel.moveCar.x = local_point.x
		this._mainPanel.moveCar.y = local_point.y

		this._mainPanel.moveCar.rotation -= this._current_drag_handle.rotation

		this._mainPanel.moveCar.ChangeStatus(CarStatus.Drag)
		return false
	}

	public OnTouchEnd(stageX:number, stageY:number):void
	{
		if(!this._current_drag_handle){
			return
		}
		let global_car_center_point = this._mainPanel.moveCar.localToGlobal(this._mainPanel.moveCar.width / 2, this._mainPanel.moveCar.height / 2)
		let local_in_roleContainer = this._mainPanel.roleContainer.globalToLocal(global_car_center_point.x, global_car_center_point.y)

		this._mainPanel.moveCar.parent.removeChild(this._mainPanel.moveCar)
		this._mainPanel.roleContainer.addChild(this._mainPanel.moveCar)

		this._mainPanel.moveCar.anchorOffsetX = this._mainPanel.moveCar.width / 2
		this._mainPanel.moveCar.anchorOffsetY = this._mainPanel.moveCar.height / 2

		this._mainPanel.moveCar.rotation += this._current_drag_handle.rotation
		this._mainPanel.moveCar.x = local_in_roleContainer.x
		this._mainPanel.moveCar.y = local_in_roleContainer.y
		this._current_drag_handle.parent.removeChild(this._current_drag_handle)
		this._current_drag_handle = null

		this._mainPanel.moveCar.ChangeStatus(CarStatus.Moving)
		this._mainPanel.moveCar.Auto_adjust_rotate()
	}

	//获取下一个直线地形
	public GetNextLineTerrain():GameTerrain
	{
		if(this.currentTerrain.IsLine()){
			return this.currentTerrain
		}
		let next_terrain = this.GetNextTerrain()
		if(next_terrain.IsLine()){
			return next_terrain
		}
		return null
	}
}