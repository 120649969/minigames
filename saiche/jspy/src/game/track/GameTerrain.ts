class GameTerrain {
	public allTracks:Array<BaseGameTrack> = []

	private _gameLogicComponent:GameLogicComponent
	public constructor() {
		this.allTracks = []
		this._gameLogicComponent = GameController.instance.GetMainScenePanel().GetGameLogicComponent()
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

	public UpdateStep():void
	{
		let terrain_index = this._gameLogicComponent.allTerrains.indexOf(this)
		for(let track of this.allTracks)
		{
			track.label_step.text = terrain_index.toString()
		}
	}

	public build_first_line_terrain():void
	{
		let clz = GameVerticalLineTrack

		let cur_x = GameController.instance.GetMainScenePanel().mapContainer.width / 2
		let cur_y = GameController.instance.GetMainScenePanel().mapContainer.height
		let track_count = GameConst.MIN_LINE_COUNT + Math.floor((GameConst.MAX_LINE_COUNT - GameConst.MIN_LINE_COUNT) * Math.random())
		
		let first_line_track = new clz()
		first_line_track.InitWithLastTrack(null)
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

	public buildTerrain():void
	{
		if(this._gameLogicComponent.allTerrains.length <= 0){
			return
		}
		let last_terrain = this._gameLogicComponent.allTerrains[this._gameLogicComponent.allTerrains.length - 1]
		//横着的直线和竖着的直线 它们的下一个轨道类型是一样的，肯定是1/4弧线和3/4弧线
		if(last_terrain.GetTrackType() == TrackType.HeorizontalLine || last_terrain.GetTrackType() == TrackType.VerticalLine){
			let infos = GameConst.Track_Type_2_Next_Track_Infos[last_terrain.GetTrackType()]
			let next_track_type = this._get_next_track_type(infos)
			if(next_track_type == TrackType.Arc){
				this._generate_arc_track_with_last_line_track(last_terrain.allTracks[last_terrain.allTracks.length - 1])
			} else if(next_track_type == TrackType.ThreeArc){
				let new_track = new GameThreeArcTrack()
				new_track.InitWithLastTrack(last_terrain.allTracks[last_terrain.allTracks.length - 1])
				this.allTracks.push(new_track)
			}
		}else if (last_terrain.GetTrackType() == TrackType.Arc){
			//半弧的下一个轨道类型也是固定的，肯定为直线，但是具体是横着的直线还是竖着的直线，需要根据半弧的方向确定
			let last_track = last_terrain.allTracks[last_terrain.allTracks.length - 1]
			this._generate_line_track_with_last_arc_track(last_track)
		}
	}

	private _generate_arc_track_with_last_line_track(last_track:BaseGameTrack)
	{
		let new_track = new GameArcTrack()
		new_track.InitWithLastTrack(last_track)
		this.allTracks.push(new_track)
	}

	//根据上一个半弧生成直线
	private _generate_line_track_with_last_arc_track(last_track:BaseGameTrack)
	{
		let next_track_type = last_track.GetNextTrackType()
		let clz = null
		if(next_track_type == TrackType.HeorizontalLine){
			clz = GameHeorizontalLineTrack
		}else{
			clz = GameVerticalLineTrack
		}

		let cur_x = last_track.x
		let cur_y = last_track.y
		let track_count = GameConst.MIN_LINE_COUNT + Math.floor((GameConst.MAX_LINE_COUNT - GameConst.MIN_LINE_COUNT) * Math.random())
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


	public GetTrackType():TrackType
	{
		let first_track:BaseGameTrack = this.allTracks[0]
		return first_track.GetTrackType()
	}
}