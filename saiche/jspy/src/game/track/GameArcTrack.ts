class GameArcTrack extends BaseGameTrack{
	public img_left_and_top:eui.Image
	public img_left_and_down:eui.Image
	public img_right_and_top:eui.Image
	public img_right_and_down:eui.Image

	public constructor() {
		super()
		this.skinName = "TrakeArcSkin"
		this.trackType = TrackType.Arc
	}

	private _get_next_top_down_direction():TrackDirection
	{
		let all_terrains = GameController.instance.GetMainScenePanel().GetGameLogicComponent().allTerrains
		
		//避免连续两次向下
		for(let index = all_terrains.length - 1; index >= 0; index--)
		{
			let terrain:GameTerrain = all_terrains[index]
			if(terrain.IsArcTerrain()){
				let track:BaseGameTrack = terrain.allTracks[0] as BaseGameTrack
				if(track.toDirection == TrackDirection.Top || track.toDirection == TrackDirection.Down){
					if(track.toDirection == TrackDirection.Top){
						break
					}
					return TrackDirection.Top
				}
			}
		}
		//避免环形
		let last_arc_terrain:GameTerrain = null
		let last_last_arc_terrain:GameTerrain = null
		for(let index = all_terrains.length - 1; index >= 0; index--)
		{
			let terrain:GameTerrain = all_terrains[index]
			if(terrain.IsArcTerrain()){
				if(!last_arc_terrain){
					last_arc_terrain = terrain
				}else if(!last_last_arc_terrain){
					last_last_arc_terrain = terrain
					let track:BaseGameTrack = terrain.allTracks[0] as BaseGameTrack
					if(BaseGameTrack.IsReverseDirection(track.fromDirection, this.fromDirection)){
						return track.toDirection
					}
				}
			}
		}
		return Math.random() < 0.6 ? TrackDirection.Top : TrackDirection.Down
	}

	private _get_next_left_right_direction():TrackDirection
	{
		let all_terrains = GameController.instance.GetMainScenePanel().GetGameLogicComponent().allTerrains

		//避免连续两次向左
		for(let index = all_terrains.length - 1; index >= 0; index--)
		{
			let terrain:GameTerrain = all_terrains[index]
			if(terrain.IsArcTerrain()){
				let track:BaseGameTrack = terrain.allTracks[0] as BaseGameTrack
				if(track.toDirection == TrackDirection.Left || track.toDirection == TrackDirection.Right){
					if(track.toDirection == TrackDirection.Right){
						break
					}
					return TrackDirection.Right
				}
			}
		}

		//避免环形
		let last_arc_terrain:GameTerrain = null
		let last_last_arc_terrain:GameTerrain = null
		for(let index = all_terrains.length - 1; index >= 0; index--)
		{
			let terrain:GameTerrain = all_terrains[index]
			if(terrain.IsArcTerrain()){
				if(!last_arc_terrain){
					last_arc_terrain = terrain
				}else if(!last_last_arc_terrain){
					last_last_arc_terrain = terrain
					let track:BaseGameTrack = terrain.allTracks[0] as BaseGameTrack
					if(BaseGameTrack.IsReverseDirection(track.fromDirection, this.fromDirection)){
						return track.toDirection
					}
					break
				}
			}
		}

		return Math.random() < 0.6 ? TrackDirection.Right : TrackDirection.Left
	}

	public InitWithLastTrack(last_track:BaseGameTrack):void
	{
		if(last_track.trackType == TrackType.HeorizontalLine){
			if(last_track.toDirection == TrackDirection.Right){
				this.fromDirection = TrackDirection.Left
				this.toDirection = this._get_next_top_down_direction()
				if(this.toDirection == TrackDirection.Top){
					this.img_left_and_top.visible = true
					this.x = last_track.x + last_track.width
					this.y = last_track.y - (this.height - last_track.height)
				}else{
					this.img_left_and_down.visible = true
					this.x = last_track.x + last_track.width
					this.y = last_track.y
				}
			}else if(last_track.toDirection == TrackDirection.Left){
				this.fromDirection = TrackDirection.Right
				this.toDirection = this._get_next_top_down_direction()
				if(this.toDirection == TrackDirection.Top){
					this.img_right_and_top.visible = true
					this.x = last_track.x - this.width
					this.y = last_track.y - (this.height - last_track.height)
				}else{
					this.img_right_and_down.visible = true
					this.x = last_track.x - this.width
					this.y = last_track.y
				}
			}else{
				egret.error("invalid last track direction", last_track.toDirection)
			}
		}else if(last_track.trackType == TrackType.VerticalLine){
			if(last_track.toDirection == TrackDirection.Down){
				this.fromDirection = TrackDirection.Top
				this.toDirection = this._get_next_left_right_direction()
				if(this.toDirection == TrackDirection.Left){
					this.img_left_and_top.visible = true
					this.x = last_track.x - (this.width - last_track.width)
					this.y = last_track.y + last_track.height
				}else{
					this.img_right_and_top.visible = true
					this.x = last_track.x
					this.y = last_track.y + last_track.height
				}
			}else if(last_track.toDirection == TrackDirection.Top){
				this.fromDirection = TrackDirection.Down
				this.toDirection = this._get_next_left_right_direction()
				if(this.toDirection == TrackDirection.Left){
					this.img_left_and_down.visible = true
					this.x = last_track.x - (this.width - last_track.width)
					this.y = last_track.y - this.height
				}else{
					this.img_right_and_down.visible = true
					this.x = last_track.x
					this.y = last_track.y - this.height
				}
			}else{
				egret.error("invalid last track direction", last_track.toDirection)
			}
		}else{
			egret.error("invalid laste track", last_track.trackType)
		}
	}

	//获取下一个轨道类型
	public GetNextTrackType():TrackType
	{
		if(this.fromDirection == TrackDirection.Left || this.fromDirection == TrackDirection.Right){
			return TrackType.VerticalLine
		}else if(this.fromDirection == TrackDirection.Top || this.fromDirection == TrackDirection.Down){
			return TrackType.HeorizontalLine
		}
	}
}