class GameThreeArcTrack extends BaseGameTrack{

	public hit_small_rect:eui.Rect
	public hit_big_rect:eui.Rect
	
	public img_right_down:eui.Image
	public img_left_top:eui.Image
	public img_right_top:eui.Image
	public img_left_down:eui.Image

	public constructor(customParent:egret.DisplayObjectContainer = null) {
		super(customParent)
		this.skinName = "TrakeThreeArcSkin"
		this.trackType = TrackType.ThreeArc
	}

	private _local_center_point:egret.Point
	public GetCenterPointInMapContainer():egret.Point
	{
		if(this._local_center_point){
			return this._local_center_point
		}
		let global_point = this.localToGlobal(this.width / 2, this.height / 2)
		this._local_center_point = GameController.instance.GetMainScenePanel().mapContainer.globalToLocal(global_point.x, global_point.y)
		return this._local_center_point
	}

	public GetArcHalfWidth():number
	{
		return this.width / 2
	}

	private _validBounds:Array<egret.Rectangle>
	public GetValidBounds():Array<egret.Rectangle>
	{
		if(this._validBounds){
			return this._validBounds
		}
		let ret = []
		let check_imgs = [this.img_right_top, this.img_left_down, this.img_left_top, this.img_right_down]
		for(let img of check_imgs)
		{
			if(img.visible)
			{
				ret.push(img.getTransformedBounds(GameController.instance.GetMainScenePanel().mapContainer))
			}
		}
		this._validBounds = ret
		return ret
	}

	//旋转方向
	public GetRotateRate():number
	{
		if(this.fromDirection == TrackDirection.Left){
			if(this.toDirection == TrackDirection.Top){
				return 1
			}else{
				return -1
			}
		}else if(this.fromDirection == TrackDirection.Right){
			if(this.toDirection == TrackDirection.Top){
				return -1
			}else{
				return 1
			}
		}else if(this.fromDirection == TrackDirection.Top){
			if(this.toDirection == TrackDirection.Left){
				return -1
			}else{
				return 1
			}
		}else if(this.fromDirection == TrackDirection.Down){
			if(this.toDirection == TrackDirection.Left){
				return 1
			}else{
				return -1
			}
		}
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

	public CopySelf():BaseGameTrack
	{
		let new_track = new GameThreeArcTrack(GameController.instance.GetMainScenePanel().copyContainer)
		new_track.x = this.x
		new_track.y = this.y
		new_track.img_left_top.visible = this.img_left_top.visible
		new_track.img_right_down.visible = this.img_right_down.visible
		new_track.img_right_top.visible = this.img_right_top.visible
		new_track.img_left_down.visible = this.img_left_down.visible
		return new_track
	}
}