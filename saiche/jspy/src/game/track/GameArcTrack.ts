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

	public InitWithLastTrack(last_track:BaseGameTrack):void
	{
		if(last_track.trackType == TrackType.HeorizontalLine){
			if(last_track.toDirection == TrackDirection.Right){
				this.fromDirection = TrackDirection.Left
				this.toDirection = Math.random() < 0.5 ? TrackDirection.Top : TrackDirection.Down
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
				this.toDirection = Math.random() < 0.5 ? TrackDirection.Top : TrackDirection.Down
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
				this.toDirection = Math.random() < 0.5 ? TrackDirection.Left : TrackDirection.Right
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
				this.toDirection = Math.random() < 0.5 ? TrackDirection.Left : TrackDirection.Right
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