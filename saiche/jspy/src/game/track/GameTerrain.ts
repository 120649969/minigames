class GameTerrain {
	public allTracks:Array<BaseGameTrack> = []

	private _gameLogicComponent:GameLogicComponent
	public constructor() {
		this.allTracks = []
		this._gameLogicComponent = GameController.instance.GetMainScenePanel().GetGameLogicComponent()
	}

	public next_copy_terrain:GameTerrain = null
	public CopyTerrain():GameTerrain
	{
		let ret = new GameTerrain()
		for(let track of this.allTracks)
		{
			let new_track = track.CopySelf()
			ret.allTracks.push(new_track)
		}
		return ret
	}

	public HideCopyTerrain():void
	{
		if(!this.next_copy_terrain){
			return
		}
		for(let track of this.next_copy_terrain.allTracks)
		{
			track.parent.removeChild(track)
		}
		this.next_copy_terrain = null
	}

	private _get_next_track_type(config_infos:Array<Object>):TrackType
	{
		let random_rate = Math.random()
		for(let index = 0; index < config_infos.length; index++)
		{
			let info = config_infos[index]
			let rate = info[0]
			let trackType = info[1]
			if(random_rate <= rate){
				return trackType
			}
			random_rate -= rate
		}
		return config_infos[0][1]
	}

	public IsArcTerrain():boolean
	{
		return this.allTracks.length == 1 &&  this.allTracks[0].GetTrackType() == TrackType.Arc
	}

	public IsThreeTerrain():boolean
	{
		return this.allTracks.length == 1 &&  this.allTracks[0].GetTrackType() == TrackType.ThreeArc
	}

	public IsLine():boolean
	{
		if(this.allTracks.length > 1){
			return true
		}
		let first_track = this.allTracks[0]
		if(first_track.trackType == TrackType.HeorizontalLine || first_track.trackType == TrackType.VerticalLine){
			return true
		}
		return false
	}

	public UpdateStep():void
	{
		let terrain_index = this._gameLogicComponent.allTerrains.indexOf(this)
		for(let track of this.allTracks)
		{
			track.label_step.text = terrain_index.toString()
		}
	}

	//构建最开始的轨道
	public build_first_line_terrain():void
	{
		let allTerrainConfigs =  this.GetTerrainConfigs()
		let terrainConfig:TerrainConfig = allTerrainConfigs[0]

		let clz = GameVerticalLineTrack

		let cur_x = this.GetMapContainer().width / 2
		let cur_y = this.GetMapContainer().stage.stageHeight
		let track_count = terrainConfig.trackCount
		
		let first_line_track = new clz()
		first_line_track.fromDirection = terrainConfig.fromDirection
		first_line_track.toDirection = terrainConfig.toDirection
		first_line_track.x = cur_x - first_line_track.width / 2
		first_line_track.y = cur_y - first_line_track.height
		this.allTracks.push(first_line_track)

		let last_sub_track:BaseGameTrack = first_line_track
		let deltaX = first_line_track.GetDeltaX()
		let deltaY = first_line_track.GetDeltaY()
		for(let index = 0; index < track_count - 1; index++)
		{
			let new_track = new clz()
			new_track.fromDirection = first_line_track.fromDirection
			new_track.toDirection = first_line_track.toDirection
			new_track.x = last_sub_track.x + deltaX
			new_track.y = last_sub_track.y + deltaY
			this.allTracks.push(new_track)
			last_sub_track = new_track
		}
	}

	//1/4弧形地形
	public buildArcTerrain():void
	{
		let allTerrains = this.GetTerrains()
		if(allTerrains.length <= 0){
			return
		}
		let allTerrainConfigs =  this.GetTerrainConfigs()
		let last_terrain_config = allTerrainConfigs[allTerrainConfigs.length - 2]
		if(last_terrain_config){
			if(last_terrain_config.trackType == TrackType.HeorizontalLine || last_terrain_config.trackType == TrackType.VerticalLine){
				let last_terrain = allTerrains[allTerrains.length - 1]
				this._generate_arc_track_with_config(last_terrain.allTracks[last_terrain.allTracks.length - 1])
			}
		}
	}

	//3/4弧形地形
	public buildThreeArcTerrain():void
	{
		let allTerrains = this.GetTerrains()
		if(allTerrains.length <= 0){
			return
		}
		let allTerrainConfigs =  this.GetTerrainConfigs()
		let last_terrain_config = allTerrainConfigs[allTerrainConfigs.length - 2]
		if(last_terrain_config){
			if(last_terrain_config.trackType == TrackType.HeorizontalLine || last_terrain_config.trackType == TrackType.VerticalLine){
				let last_terrain = allTerrains[allTerrains.length - 1]
				this._generate_three_arc_track_with_config(last_terrain.allTracks[last_terrain.allTracks.length - 1])
			}
		}
	}

	private _generate_three_arc_track_with_config(last_track:BaseGameTrack)
	{
		let allTerrainConfigs =  this.GetTerrainConfigs()
		let last_terrain_config = allTerrainConfigs[allTerrainConfigs.length - 1]
		let new_track = new GameThreeArcTrack()
		new_track.InitWithLastTrackAndDirection(last_track, last_terrain_config.fromDirection, last_terrain_config.toDirection)
		this.allTracks.push(new_track)
	}

	protected _generate_arc_track_with_config(last_track:BaseGameTrack)
	{
		let allTerrainConfigs =  this.GetTerrainConfigs()
		let last_terrain_config = allTerrainConfigs[allTerrainConfigs.length - 1]
		let new_track = new GameArcTrack()
		new_track.InitWithLastTrackAndDirection(last_track, last_terrain_config.fromDirection, last_terrain_config.toDirection)
		this.allTracks.push(new_track)
	}

	protected _generate_Heorizontal_line_track_with_last_arc_track(last_track:BaseGameTrack)
	{
		let allTerrainConfigs =  this.GetTerrainConfigs()
		let last_terrain_config = allTerrainConfigs[allTerrainConfigs.length - 1]

		let next_track_type = last_track.GetNextTrackType()
		let clz = GameHeorizontalLineTrack

		let cur_x = last_track.x
		let cur_y = last_track.y
		let track_count = last_terrain_config.trackCount
		let first_line_track = new clz()
		first_line_track.InitWithLastTrack(last_track)
		this.allTracks.push(first_line_track)

		let last_sub_track:BaseGameTrack = first_line_track
		let deltaX = first_line_track.GetDeltaX()
		let deltaY = first_line_track.GetDeltaY()
		for(let index = 0; index < track_count - 1; index++)
		{
			let new_track = new clz()
			new_track.fromDirection = first_line_track.fromDirection
			new_track.toDirection = first_line_track.toDirection
			new_track.x = last_sub_track.x + deltaX
			new_track.y = last_sub_track.y + deltaY
			this.allTracks.push(new_track)
			last_sub_track = new_track
		}
	}

	protected _generate_Heorizontal_line_track_with_last_three_arc_track(last_track:BaseGameTrack)
	{
		let allTerrainConfigs = this.GetTerrainConfigs()
		let last_terrain_config = allTerrainConfigs[allTerrainConfigs.length - 1]

		let next_track_type = last_track.GetNextTrackType()
		let clz = GameHeorizontalLineTrack

		let cur_x = last_track.x
		let cur_y = last_track.y
		let track_count = last_terrain_config.trackCount
		let first_line_track = new clz()
		first_line_track.InitWithLastTrack(last_track)
		this.allTracks.push(first_line_track)

		let last_sub_track:BaseGameTrack = first_line_track
		let deltaX = first_line_track.GetDeltaX()
		let deltaY = first_line_track.GetDeltaY()
		for(let index = 0; index < track_count - 1; index++)
		{
			let new_track = new clz()
			new_track.fromDirection = first_line_track.fromDirection
			new_track.toDirection = first_line_track.toDirection
			new_track.x = last_sub_track.x + deltaX
			new_track.y = last_sub_track.y + deltaY
			this.allTracks.push(new_track)
			last_sub_track = new_track
		}
	}

	protected _generate_Vertical_line_track_with_last_arc_track(last_track:BaseGameTrack)
	{
		let allTerrainConfigs = this.GetTerrainConfigs()
		let last_terrain_config = allTerrainConfigs[allTerrainConfigs.length - 1]

		let next_track_type = last_track.GetNextTrackType()
		let clz = GameVerticalLineTrack

		let cur_x = last_track.x
		let cur_y = last_track.y
		let track_count = last_terrain_config.trackCount
		let first_line_track = new clz()
		first_line_track.InitWithLastTrack(last_track)
		this.allTracks.push(first_line_track)

		let last_sub_track:BaseGameTrack = first_line_track
		let deltaX = first_line_track.GetDeltaX()
		let deltaY = first_line_track.GetDeltaY()
		for(let index = 0; index < track_count - 1; index++)
		{
			let new_track = new clz()
			new_track.fromDirection = first_line_track.fromDirection
			new_track.toDirection = first_line_track.toDirection
			new_track.x = last_sub_track.x + deltaX
			new_track.y = last_sub_track.y + deltaY
			this.allTracks.push(new_track)
			last_sub_track = new_track
		}
	}

	protected _generate_Vertical_line_track_with_last_three_arc_track(last_track:BaseGameTrack)
	{
		let allTerrainConfigs =  this.GetTerrainConfigs()
		let last_terrain_config = allTerrainConfigs[allTerrainConfigs.length - 1]

		let next_track_type = last_track.GetNextTrackType()
		let clz = GameVerticalLineTrack

		let cur_x = last_track.x
		let cur_y = last_track.y
		let track_count = last_terrain_config.trackCount
		let first_line_track = new clz()
		first_line_track.InitWithLastTrack(last_track)
		this.allTracks.push(first_line_track)

		let last_sub_track:BaseGameTrack = first_line_track
		let deltaX = first_line_track.GetDeltaX()
		let deltaY = first_line_track.GetDeltaY()
		for(let index = 0; index < track_count - 1; index++)
		{
			let new_track = new clz()
			new_track.fromDirection = first_line_track.fromDirection
			new_track.toDirection = first_line_track.toDirection
			new_track.x = last_sub_track.x + deltaX
			new_track.y = last_sub_track.y + deltaY
			this.allTracks.push(new_track)
			last_sub_track = new_track
		}
	}

	public buildHeorizontalTerrain():void
	{
		let allTerrains = this.GetTerrains()
		if(allTerrains.length <= 0){
			return
		}
		let allTerrainConfigs = this.GetTerrainConfigs()
		let last_terrain_config = allTerrainConfigs[allTerrainConfigs.length - 2]
		if(last_terrain_config){
			if(last_terrain_config.trackType == TrackType.Arc){
				let last_terrain = allTerrains[allTerrains.length - 1]
				this._generate_Heorizontal_line_track_with_last_arc_track(last_terrain.allTracks[last_terrain.allTracks.length - 1])
			}else if(last_terrain_config.trackType == TrackType.ThreeArc){
				let last_terrain = allTerrains[allTerrains.length - 1]
				this._generate_Heorizontal_line_track_with_last_three_arc_track(last_terrain.allTracks[last_terrain.allTracks.length - 1])
			}
		}
	}

	public buildVerticalTerrain():void
	{
		let allTerrains = this.GetTerrains()
		if(allTerrains.length <= 0){
			return
		}
		let allTerrainConfigs = this.GetTerrainConfigs()
		let last_terrain_config = allTerrainConfigs[allTerrainConfigs.length - 2]
		if(last_terrain_config){
			if(last_terrain_config.trackType == TrackType.Arc){
				let last_terrain = allTerrains[allTerrains.length - 1]
				this._generate_Vertical_line_track_with_last_arc_track(last_terrain.allTracks[last_terrain.allTracks.length - 1])
			}else if(last_terrain_config.trackType == TrackType.ThreeArc){
				let last_terrain = allTerrains[allTerrains.length - 1]
				this._generate_Vertical_line_track_with_last_three_arc_track(last_terrain.allTracks[last_terrain.allTracks.length - 1])
			}
		}
	}

	public GetMapContainer():eui.Group
	{
		if(ui.WindowManager.getInstance().isWindowOpening("DebugPanel")){
			return (window['debugPanel'] as ui.DebugPanel).mapContainer
		}
		return GameController.instance.GetMainScenePanel().mapContainer
	}

	public GetTerrainConfigs():Array<TerrainConfig>
	{
		if(ui.WindowManager.getInstance().isWindowOpening("DebugPanel")){
			return (window['debugPanel'] as ui.DebugPanel).allTerrainConfigs
		}
		return GameController.instance.GetMainScenePanel().GetGameLogicComponent().allTerrainConfigs
	}

	public GetTerrains():Array<GameTerrain>
	{
		if(ui.WindowManager.getInstance().isWindowOpening("DebugPanel")){
			return (window['debugPanel'] as ui.DebugPanel).allTerrains
		}
		return GameController.instance.GetMainScenePanel().GetGameLogicComponent().allTerrains
	}

	public GetTrackType():TrackType
	{
		let first_track:BaseGameTrack = this.allTracks[0]
		return first_track.GetTrackType()
	}

	public GetTrackFromDirection():TrackDirection
	{
		let first_track:BaseGameTrack = this.allTracks[0]
		return first_track.fromDirection
	}

	public GetTrackToDirection():TrackDirection
	{
		let first_track:BaseGameTrack = this.allTracks[0]
		return first_track.toDirection
	}
	
	//车bound和Terrain的bound是否相交
	public IsCarInBoard():boolean
	{
		let carBoundInMapCoordinate = GameController.instance.GetMainScenePanel().moveCar.hit_rect.getTransformedBounds(GameController.instance.GetMainScenePanel().mapContainer)
		if(this.IsThreeTerrain()){
			let first_track:GameThreeArcTrack = this.allTracks[0] as GameThreeArcTrack
			let bounds = first_track.GetValidBounds()
			for(let bound of bounds)
			{
				if(bound.intersects(carBoundInMapCoordinate)){
				return true
				}
			}
			return false
		}
		let bounds = this.GetBoundInMapContainer()
		if(bounds.intersects(carBoundInMapCoordinate)){
			return true
		}
		return false
	}

	//获取这个terrain的边界
	private _terrainBound:egret.Rectangle  = null
	public GetBoundInMapContainer():egret.Rectangle
	{
		if(this._terrainBound){
			return this._terrainBound
		}
		if(this.allTracks.length == 1){
			this._terrainBound = this.allTracks[0].getTransformedBounds(GameController.instance.GetMainScenePanel().mapContainer)
		}else{  //直线轨道
			this._terrainBound = new egret.Rectangle()
			let first_track:BaseGameTrack = this.allTracks[0]
			let last_track:BaseGameTrack = this.allTracks[this.allTracks.length - 1]
			if(first_track.toDirection == TrackDirection.Right){
				this._terrainBound.x = first_track.x
				this._terrainBound.y = first_track.y
				this._terrainBound.width = this.allTracks.length * first_track.width
				this._terrainBound.height = first_track.height
			}else if(first_track.toDirection == TrackDirection.Left){
				this._terrainBound.x = last_track.x
				this._terrainBound.y = last_track.y
				this._terrainBound.width = this.allTracks.length * first_track.width
				this._terrainBound.height = first_track.height
			}else if(first_track.toDirection == TrackDirection.Top){
				this._terrainBound.x = last_track.x
				this._terrainBound.y = last_track.y
				this._terrainBound.width = first_track.width
				this._terrainBound.height = this.allTracks.length * first_track.height
			}else if(first_track.toDirection == TrackDirection.Down){
				this._terrainBound.x = last_track.x
				this._terrainBound.y = first_track.y
				this._terrainBound.width = first_track.width
				this._terrainBound.height = this.allTracks.length * first_track.height
			}
			let hit_rect:eui.Rect = first_track['hit_rect']
			this._terrainBound.x += hit_rect.x
			this._terrainBound.y += hit_rect.y
			this._terrainBound.width -= 2 * hit_rect.x
			this._terrainBound.height -= 2 * hit_rect.y
		}
		return this._terrainBound
	}
	
}