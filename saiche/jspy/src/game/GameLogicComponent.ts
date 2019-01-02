class GameLogicComponent extends BaseComponent{

	public allTerrains:Array<GameTerrain> = []
	public allTerrainConfigs:Array<TerrainConfig> = []

	public constructor() {
		super()
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


	public OnStart():void
	{
		this._generate_map()
	}
}