class GameArcTrack extends BaseGameTrack{
	public img_left_and_top:eui.Image
	public img_left_and_down:eui.Image
	public img_right_and_top:eui.Image
	public img_right_and_down:eui.Image

	public constructor() {
		super()
		this.skinName = "TrakeArcSkin"
		this.trackType = TrackType.Arc

		this.img_left_and_top.visible = false
		this.img_left_and_down.visible = false
		this.img_right_and_top.visible = false
		this.img_right_and_down.visible = false
	}

	//旋转方向
	public GetRotateRate():number
	{
		if(this.fromDirection == TrackDirection.Left){
			if(this.toDirection == TrackDirection.Top){
				return -1
			}else{
				return 1
			}
		}else if(this.fromDirection == TrackDirection.Right){
			if(this.toDirection == TrackDirection.Top){
				return 1
			}else{
				return -1
			}
		}else if(this.fromDirection == TrackDirection.Top){
			if(this.toDirection == TrackDirection.Left){
				return 1
			}else{
				return -1
			}
		}else if(this.fromDirection == TrackDirection.Down){
			if(this.toDirection == TrackDirection.Left){
				return -1
			}else{
				return 1
			}
		}
	}

	private _local_center_point:egret.Point
	public GetCenterPointInMapContainer():egret.Point
	{
		if(this._local_center_point){
			return this._local_center_point
		}
		let global_left_top = null
		if(this.img_left_and_top.visible){
			global_left_top = this.localToGlobal(0, 0)
		}else if(this.img_left_and_down.visible){
			global_left_top = this.localToGlobal(0, this.height)
		}else if(this.img_right_and_top.visible){
			global_left_top = this.localToGlobal(this.width, 0)
		}else if(this.img_right_and_down.visible){
			global_left_top = this.localToGlobal(this.width, this.height)
		}
		egret.assert(global_left_top != null, 'has no visible arc')
		this._local_center_point = GameController.instance.GetMainScenePanel().mapContainer.globalToLocal(global_left_top.x, global_left_top.y)
		return this._local_center_point
	}

	public InitWithLastTrackAndDirection(last_track:BaseGameTrack, fromDirection:TrackDirection, toDirection:TrackDirection):void
	{
		this.fromDirection = fromDirection
		this.toDirection = toDirection
		if(this.fromDirection == TrackDirection.Left){
			if(this.toDirection == TrackDirection.Top){
				this.img_left_and_top.visible = true
				this.x = last_track.x + last_track.width
				this.y = last_track.y - (this.height - last_track.height)
			}else{
				this.img_left_and_down.visible = true
				this.x = last_track.x + last_track.width
				this.y = last_track.y
			}
		}else if(this.fromDirection == TrackDirection.Right){
			if(this.toDirection == TrackDirection.Top){
				this.img_right_and_top.visible = true
				this.x = last_track.x - this.width
				this.y = last_track.y - (this.height - last_track.height)
			}else{
				this.img_right_and_down.visible = true
				this.x = last_track.x - this.width
				this.y = last_track.y
			}
		}else if(this.fromDirection == TrackDirection.Top){
			if(this.toDirection == TrackDirection.Left){
				this.img_left_and_top.visible = true
				this.x = last_track.x - (this.width - last_track.width)
				this.y = last_track.y + last_track.height
			}else{
				this.img_right_and_top.visible = true
				this.x = last_track.x
				this.y = last_track.y + last_track.height
			}
		}else if(this.fromDirection == TrackDirection.Down){
			if(this.toDirection == TrackDirection.Left){
				this.img_left_and_down.visible = true
				this.x = last_track.x - (this.width - last_track.width)
				this.y = last_track.y - this.height
			}else{
				this.img_right_and_down.visible = true
				this.x = last_track.x
				this.y = last_track.y - this.height
			}
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