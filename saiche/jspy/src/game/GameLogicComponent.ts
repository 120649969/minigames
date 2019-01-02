class GameLogicComponent extends BaseComponent{

	public allTerrains:Array<GameTerrain> = []
	public allTerrainConfigs:Array<TerrainConfig> = []
	public currentTerrain:GameTerrain
	private _mainPanel:ui.MainScenePanel
	public constructor() {
		super()
		this._mainPanel = GameController.instance.GetMainScenePanel()
	}
	
	public OnAddTerrainConfig(terrainConfig:TerrainConfig):void
	{
		this.allTerrainConfigs.push(terrainConfig)
		if(this.allTerrainConfigs.length == 1){
			let new_debug_terrain = new GameTerrain()
			new_debug_terrain.build_first_line_terrain()
			this.allTerrains.push(new_debug_terrain)
		}else{
			if(terrainConfig.trackType == TrackType.Arc){
				let new_debug_terrain = new GameTerrain()
				new_debug_terrain.buildArcTerrain()
				this.allTerrains.push(new_debug_terrain)
			}else if(terrainConfig.trackType == TrackType.HeorizontalLine){
				let new_debug_terrain = new GameTerrain()
				new_debug_terrain.buildHeorizontalTerrain()
				this.allTerrains.push(new_debug_terrain)
			}else if(terrainConfig.trackType == TrackType.VerticalLine){
				let new_debug_terrain = new GameTerrain()
				new_debug_terrain.buildVerticalTerrain()
				this.allTerrains.push(new_debug_terrain)
			}else if(terrainConfig.trackType == TrackType.ThreeArc){
				let new_debug_terrain = new GameTerrain()
				new_debug_terrain.buildThreeArcTerrain()
				this.allTerrains.push(new_debug_terrain)
			}
		}
	}

	private _generate_map():void
	{
		let native_configs:Array<Object>= RES.getRes("data_json")
		let config_index = Math.floor(Math.random() * native_configs.length)
		config_index = 1
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
		let global_center = new egret.Point(this._mainPanel.stage.stageWidth / 2, this._mainPanel.stage.stageHeight / 2)
		let local_in_role_container = this._mainPanel.roleContainer.globalToLocal(global_center.x, global_center.y)
		this._mainPanel.moveCar.x = local_in_role_container.x
		this._mainPanel.moveCar.y = local_in_role_container.y + this._mainPanel.moveCar.height + 200

		this._mainPanel.moveCar.visible = true
		let __this = this
		egret.Tween.get(this._mainPanel.moveCar).to({y:local_in_role_container.y}, 0.5 * 1000).call(function(){
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
		// this._mainPanel.moveCar.Update()
	}
}