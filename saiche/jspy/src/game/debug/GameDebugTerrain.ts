class GameDebugTerrain extends GameTerrain{

	private debugPanel:ui.DebugPanel

	public constructor() {
		super()
		this.debugPanel = window['debugPanel'] as ui.DebugPanel
	}

	public build_first_line_terrain():void
	{
		let terrainConfig:TerrainConfig = this.debugPanel.allTerrainConfigs[0]

		let clz = GameVerticalLineTrack

		let cur_x = this.debugPanel.mapContainer.width / 2
		let cur_y = this.debugPanel.mapContainer.height
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
		if(this.debugPanel.allTerrains.length <= 0){
			return
		}
		let allTerrainConfigs =  this.debugPanel.allTerrainConfigs
		let last_terrain_config = allTerrainConfigs[allTerrainConfigs.length - 2]
		if(last_terrain_config){
			if(last_terrain_config.trackType == TrackType.HeorizontalLine || last_terrain_config.trackType == TrackType.VerticalLine){
				let last_terrain = this.debugPanel.allTerrains[this.debugPanel.allTerrains.length - 1]
				this._generate_arc_track_with_config(last_terrain.allTracks[last_terrain.allTracks.length - 1])
			}
		}
	}

	//3/4弧形地形
	public buildThreeArcTerrain():void
	{
		if(this.debugPanel.allTerrains.length <= 0){
			return
		}
		let allTerrainConfigs =  this.debugPanel.allTerrainConfigs
		let last_terrain_config = allTerrainConfigs[allTerrainConfigs.length - 2]
		if(last_terrain_config){
			if(last_terrain_config.trackType == TrackType.HeorizontalLine || last_terrain_config.trackType == TrackType.VerticalLine){
				let last_terrain = this.debugPanel.allTerrains[this.debugPanel.allTerrains.length - 1]
				this._generate_three_arc_track_with_config(last_terrain.allTracks[last_terrain.allTracks.length - 1])
			}
		}
	}

	private _generate_three_arc_track_with_config(last_track:BaseGameTrack)
	{
		let allTerrainConfigs =  this.debugPanel.allTerrainConfigs
		let last_terrain_config = allTerrainConfigs[allTerrainConfigs.length - 1]
		let new_track = new GameThreeArcTrack()
		new_track.InitWithLastTrackAndDirection(last_track, last_terrain_config.fromDirection, last_terrain_config.toDirection)
		this.allTracks.push(new_track)
	}

	protected _generate_arc_track_with_config(last_track:BaseGameTrack)
	{
		let allTerrainConfigs =  this.debugPanel.allTerrainConfigs
		let last_terrain_config = allTerrainConfigs[allTerrainConfigs.length - 1]
		let new_track = new GameArcTrack()
		new_track.InitWithLastTrackAndDirection(last_track, last_terrain_config.fromDirection, last_terrain_config.toDirection)
		this.allTracks.push(new_track)
	}

	protected _generate_Heorizontal_line_track_with_last_arc_track(last_track:BaseGameTrack)
	{
		let allTerrainConfigs =  this.debugPanel.allTerrainConfigs
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
		let allTerrainConfigs =  this.debugPanel.allTerrainConfigs
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
		let allTerrainConfigs =  this.debugPanel.allTerrainConfigs
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
		let allTerrainConfigs =  this.debugPanel.allTerrainConfigs
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
		if(this.debugPanel.allTerrains.length <= 0){
			return
		}
		let allTerrainConfigs =  this.debugPanel.allTerrainConfigs
		let last_terrain_config = allTerrainConfigs[allTerrainConfigs.length - 2]
		if(last_terrain_config){
			if(last_terrain_config.trackType == TrackType.Arc){
				let last_terrain = this.debugPanel.allTerrains[this.debugPanel.allTerrains.length - 1]
				this._generate_Heorizontal_line_track_with_last_arc_track(last_terrain.allTracks[last_terrain.allTracks.length - 1])
			}else if(last_terrain_config.trackType == TrackType.ThreeArc){
				let last_terrain = this.debugPanel.allTerrains[this.debugPanel.allTerrains.length - 1]
				this._generate_Heorizontal_line_track_with_last_three_arc_track(last_terrain.allTracks[last_terrain.allTracks.length - 1])
			}
		}
	}

	public buildVerticalTerrain():void
	{
		if(this.debugPanel.allTerrains.length <= 0){
			return
		}
		let allTerrainConfigs =  this.debugPanel.allTerrainConfigs
		let last_terrain_config = allTerrainConfigs[allTerrainConfigs.length - 2]
		if(last_terrain_config){
			if(last_terrain_config.trackType == TrackType.Arc){
				let last_terrain = this.debugPanel.allTerrains[this.debugPanel.allTerrains.length - 1]
				this._generate_Vertical_line_track_with_last_arc_track(last_terrain.allTracks[last_terrain.allTracks.length - 1])
			}else if(last_terrain_config.trackType == TrackType.ThreeArc){
				let last_terrain = this.debugPanel.allTerrains[this.debugPanel.allTerrains.length - 1]
				this._generate_Vertical_line_track_with_last_three_arc_track(last_terrain.allTracks[last_terrain.allTracks.length - 1])
			}
		}
	}

}