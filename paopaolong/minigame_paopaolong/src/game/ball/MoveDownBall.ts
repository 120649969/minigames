class MoveDownBall extends Ball{

	private _move_down_target_y = 0
	private _reach_target_times = 0
	private _move_down_speed_y:number = 0
	private _move_down_acce_y:number = 3

	public constructor() {
		super()
	}

	public PlayMoveDownAnimation():void
	{
		let global_buttom_line_point = GameController.instance.GetMainScenePanel().m_line.localToGlobal(0, 0)
		let local_point = this.parent.globalToLocal(global_buttom_line_point.x, global_buttom_line_point.y)
		let target_y = local_point.y - this.height
		this._move_down_target_y = target_y
		this._reach_target_times = 0
	}

	
	public UpdateMoveDown():boolean
	{
		this._move_down_speed_y += this._move_down_acce_y
		this.y += this._move_down_speed_y
		this.y = Math.min(this.y, this._move_down_target_y)
		if(this.y == this._move_down_target_y){
			this._reach_target_times += 1
			this._move_down_speed_y *= -0.8
		}
		if(this._reach_target_times == 2){
			this.visible = false
			this.parent.removeChild(this)
			return true
		}
		return false
	}
}