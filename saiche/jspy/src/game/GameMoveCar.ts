
enum CarStatus{
	Idle		= 0,
	Moving 		= 1,
	Drag 		= 2
}

class GameMoveCar extends eui.Component{

	public status:CarStatus
	private _gameLogicComponent:GameLogicComponent
	private _mainPanel:ui.MainScenePanel

	public constructor() {
		super()
		this.skinName = "MoveCard"
		this.status = CarStatus.Idle
	}

	public ChangeStatus(new_status:CarStatus):void
	{
		this.status = new_status
	}

	public OnStart():void
	{
		this._gameLogicComponent = GameController.instance.GetMainScenePanel().GetGameLogicComponent()
		this._mainPanel = GameController.instance.GetMainScenePanel()
	}
	
	public Update():void
	{
		if(this.status == CarStatus.Moving){
			let move_x = GameConst.Car_Move_Speed * Math.sin(this.rotation / 180 * Math.PI)
			let move_y = GameConst.Car_Move_Speed * Math.cos(this.rotation / 180 * Math.PI) * -1
			this.x += move_x
			this.y += move_y

			this._gameLogicComponent.Move_Container(move_x, move_y)

			this.CheckHit()
		}
	}

	public CheckHit():void
	{
		let is_in_current_terrain = this._gameLogicComponent.currentTerrain.IsCardInBoard()
		if(!is_in_current_terrain){
			this._gameLogicComponent.ChangeTerrainToNext()
		}else{
			let bounds = this._gameLogicComponent.currentTerrain.GetBoundInMapContainer()
			let carBoundInMapCoordinate = GameController.instance.GetMainScenePanel().moveCar.getTransformedBounds(GameController.instance.GetMainScenePanel().mapContainer)
			if(bounds.containsRect(carBoundInMapCoordinate)){ //完全包含
				this._check_hit_terrain(this._gameLogicComponent.currentTerrain)
			}else{
				this._check_hit_terrain(this._gameLogicComponent.currentTerrain)
				this._check_hit_terrain(this._gameLogicComponent.GetNextTerrain())
			}
		}
	}

	private _check_hit_terrain(terrain:GameTerrain):boolean
	{
		if(terrain.IsLine()){
			let is_hit_line = this._check_hit_terrain_line(terrain)
			if(is_hit_line){
				console.log("########hit_line")
			}
			return is_hit_line
		}else{

		}
	}

	private get_instance(point1:egret.Point, point2:egret.Point)
	{
		return CommonUtils.GetDistance(point1, point2)
	}

	private _check_hit_terrain_arc(terrain:GameTerrain):boolean
	{
		
		let terrain_line_bounds = terrain.GetBoundInMapContainer()

		let global_car_left_top_point = this._mainPanel.moveCar.localToGlobal(0, 0)
		let global_car_right_top_point = this._mainPanel.moveCar.localToGlobal(this._mainPanel.moveCar.width, 0)
		let global_car_left_down_point = this._mainPanel.moveCar.localToGlobal(0, this._mainPanel.moveCar.height)
		let global_car_right_down_point = this._mainPanel.moveCar.localToGlobal(this._mainPanel.moveCar.width, this._mainPanel.moveCar.height)

		let car_left_top = this._mainPanel.mapContainer.globalToLocal(global_car_left_top_point.x, global_car_left_top_point.y)
		let car_right_top = this._mainPanel.mapContainer.globalToLocal(global_car_right_top_point.x, global_car_right_top_point.y)
		let car_left_down = this._mainPanel.mapContainer.globalToLocal(global_car_left_down_point.x, global_car_left_down_point.y)
		let car_right_down = this._mainPanel.mapContainer.globalToLocal(global_car_right_down_point.x, global_car_right_down_point.y)

		let first_track:GameArcTrack = terrain.allTracks[0] as GameArcTrack
		let center_point = first_track.GetCenterPointInMapContainer()
		if(terrain_line_bounds.containsPoint(car_left_top)){
			if(this.get_instance(car_left_top, center_point) > first_track.width){
				return true
			}
		}
		if(terrain_line_bounds.containsPoint(car_right_top)){
			if(this.get_instance(car_right_top, center_point) > first_track.width){
				return true
			}
		}
		if(terrain_line_bounds.containsPoint(car_left_down)){
			if(this.get_instance(car_left_down, center_point) > first_track.width){
				return true
			}
		}
		if(terrain_line_bounds.containsPoint(car_right_down)){
			if(this.get_instance(car_right_down, center_point) > first_track.width){
				return true
			}
		}
		return false
	}

	private _check_hit_terrain_line(terrain:GameTerrain):boolean
	{
		let terrain_line_bounds = terrain.GetBoundInMapContainer()

		let global_car_left_top_point = this._mainPanel.moveCar.localToGlobal(0, 0)
		let global_car_right_top_point = this._mainPanel.moveCar.localToGlobal(this._mainPanel.moveCar.width, 0)
		let global_car_left_down_point = this._mainPanel.moveCar.localToGlobal(0, this._mainPanel.moveCar.height)
		let global_car_right_down_point = this._mainPanel.moveCar.localToGlobal(this._mainPanel.moveCar.width, this._mainPanel.moveCar.height)

		let car_left_top = this._mainPanel.mapContainer.globalToLocal(global_car_left_top_point.x, global_car_left_top_point.y)
		let car_right_top = this._mainPanel.mapContainer.globalToLocal(global_car_right_top_point.x, global_car_right_top_point.y)
		let car_left_down = this._mainPanel.mapContainer.globalToLocal(global_car_left_down_point.x, global_car_left_down_point.y)
		let car_right_down = this._mainPanel.mapContainer.globalToLocal(global_car_right_down_point.x, global_car_right_down_point.y)

		let first_track = terrain.allTracks[0]
		if(first_track.toDirection == TrackDirection.Left || first_track.toDirection == TrackDirection.Right){ //左右方向
			if(car_left_top.x < terrain_line_bounds.x ||car_left_down.x < terrain_line_bounds.x || car_right_top.x < terrain_line_bounds.x ||car_right_down.x < terrain_line_bounds.x){
				return true
			}
			if(car_right_top.x > terrain_line_bounds.x + terrain_line_bounds.width || car_right_down.x > terrain_line_bounds.x + terrain_line_bounds.width || car_left_top.x > terrain_line_bounds.x + terrain_line_bounds.width || car_left_down.x > terrain_line_bounds.x + terrain_line_bounds.width){
				return true
			}
			return false
		}else{
			if(car_left_top.y < terrain_line_bounds.y ||car_left_down.y < terrain_line_bounds.y || car_right_top.y < terrain_line_bounds.y ||car_right_down.y < terrain_line_bounds.y){
				return true
			}
			if(car_right_top.y > terrain_line_bounds.y + terrain_line_bounds.height || car_right_down.y > terrain_line_bounds.y + terrain_line_bounds.height || car_left_top.y > terrain_line_bounds.y + terrain_line_bounds.height || car_left_down.y > terrain_line_bounds.y + terrain_line_bounds.height){
				return true
			}
		}

		return false
	}
}