class GameThreeArcTrack extends BaseGameTrack{

	public img_right_down:eui.Image
	public img_left_top:eui.Image
	public img_right_top:eui.Image
	public img_left_down:eui.Image

	public constructor() {
		super()
		this.skinName = "TrakeThreeArcSkin"
		this.trackType = TrackType.ThreeArc
	}

	public InitWithLastTrackAndDirection(last_track:BaseGameTrack, fromDirection:TrackDirection, toDirection:TrackDirection):void
	{
		this.fromDirection = fromDirection
		this.toDirection = toDirection
		if(this.fromDirection == TrackDirection.Left){
			if(this.toDirection == TrackDirection.Top){
				this.x = last_track.x + last_track.width - this.width / 2
				this.y = last_track.y
				this.img_left_top.visible = false
			}else{
				this.x = last_track.x + last_track.width - this.width / 2
				this.y = last_track.y + last_track.height - this.height
				this.img_left_down.visible = false
			}
		}else if(this.fromDirection == TrackDirection.Right){
			if(this.toDirection == TrackDirection.Top){
				this.x = last_track.x - this.width / 2
				this.y = last_track.y
				this.img_right_top.visible = false
			}else{
				this.x = last_track.x - this.width / 2
				this.y = last_track.y + last_track.height - this.height
				this.img_right_down.visible = false
			}
		}else if(this.fromDirection == TrackDirection.Top){
			if(this.toDirection == TrackDirection.Left){
				this.x = last_track.x
				this.y = last_track.y + last_track.height - this.height / 2
				this.img_left_top.visible = false
			}else{
				this.x = last_track.x + last_track.width - this.width
				this.y = last_track.y + last_track.height - this.height / 2 
				this.img_right_top.visible = false
			}
		}else if(this.fromDirection == TrackDirection.Down){
			if(this.toDirection == TrackDirection.Left){
				this.x = last_track.x
				this.y = last_track.y - this.height / 2
				this.img_left_down.visible = false
			}else{
				this.x = last_track.x + last_track.width - this.width
				this.y = last_track.y - this.height / 2
				this.img_right_down.visible = false
			}
		}
	}
}