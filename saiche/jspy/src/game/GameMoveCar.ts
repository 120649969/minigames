
enum CarStatus{
	Idle			= 0,
	Moving 			= 1,
	Drag 			= 2,
	Drag_Moving		= 3,
	Dead			= 4,
}

class GameMoveCar extends eui.Component{

	public status:CarStatus
	private _gameLogicComponent:GameLogicComponent
	private _mainPanel:ui.MainScenePanel

	public m_left:eui.Rect
	public m_right:eui.Rect

	public constructor() {
		super()
		this.skinName = "MoveCard"
		this.status = CarStatus.Idle

		this.anchorOffsetX = this.width / 2
		this.anchorOffsetY = this.height / 2
	}

	public Auto_adjust_rotate():void
	{
		let currentTerrain:GameTerrain = this._gameLogicComponent.currentTerrain
		if(currentTerrain && currentTerrain.IsLine() && this.status != CarStatus.Drag){
			let first_track = currentTerrain.allTracks[0]
			let target_rotate_degree = 0
			if(first_track.fromDirection == TrackDirection.Left){ //左向右
				target_rotate_degree = 90
			}else if(first_track.fromDirection == TrackDirection.Right){
				target_rotate_degree = -90
			}else if(first_track.fromDirection == TrackDirection.Top){
				if(this.rotation < 0){
					target_rotate_degree = -180
				}else{
					target_rotate_degree = 180
				}
			}else{
				target_rotate_degree = 0
			}
			if((this.rotation + 360) % 360 != (target_rotate_degree + 360) % 360){
				let __this = this
				let origin_rotation = this.rotation
				egret.Tween.get(this).to({rotation:target_rotate_degree}, 0.2 * 1000).call(function(){
					__this.ChangeStatus(CarStatus.Moving)
				})
				console.log("######自动调整角度###", origin_rotation, target_rotate_degree)
			}
		}
	}

	public ChangeStatus(new_status:CarStatus):void
	{
		if(new_status == CarStatus.Drag || new_status == CarStatus.Dead){
			egret.Tween.removeTweens(this)
		}
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
			let move_times = 4
			let move_x = GameConst.Car_Move_Speed * Math.sin(this.rotation / 180 * Math.PI)
			let move_y = GameConst.Car_Move_Speed * Math.cos(this.rotation / 180 * Math.PI) * -1

			let move_rate = 1 / move_times
			for(let index = 0; index < move_times; index++)
			{
				this.x += move_x * move_rate
				this.y += move_y * move_rate
				if(this.CheckHit()){
					break
				}
			}
		}else if(this.status == CarStatus.Drag){
			this.CheckHit()
		}

		let global_car_point = this._mainPanel.moveCar.localToGlobal(this._mainPanel.moveCar.width / 2, this._mainPanel.moveCar.height / 2)
		let car_point_in_map = this._mainPanel.mapContainer.globalToLocal(global_car_point.x, global_car_point.y)

		let win_point_in_map = this._mainPanel.mapContainer.globalToLocal(this._mainPanel.stage.stageWidth / 2, this._mainPanel.stage.stageHeight / 2)
		let detal_x = car_point_in_map.x - win_point_in_map.x
		let detal_y = car_point_in_map.y - win_point_in_map.y

		this._mainPanel.moveContainer.x += detal_x * -1
		this._mainPanel.moveContainer.y += detal_y * -1
	}

	public CheckHit():boolean
	{
		if(!this._gameLogicComponent.currentTerrain){
			return false
		}
		let is_in_current_terrain = this._gameLogicComponent.currentTerrain.IsCarInBoard()
		if(!is_in_current_terrain){//如果没有相交，那么就完全进入下一个terrain
			this._gameLogicComponent.ChangeTerrainToNext()
			this.Auto_adjust_rotate()
			console.log("#########进入下一个轨道####")
		}
		if(this._gameLogicComponent.currentTerrain == null){  //到最后地形的尽头
			return false
		}
		let bounds = this._gameLogicComponent.currentTerrain.GetBoundInMapContainer()
		let carBoundInMapCoordinate = GameController.instance.GetMainScenePanel().moveCar.getTransformedBounds(GameController.instance.GetMainScenePanel().mapContainer)
		if(bounds.containsRect(carBoundInMapCoordinate)){ //完全包含
			if(this._gameLogicComponent.currentTerrain.IsLine()){ //完全包含的情况，如果是直线地形，肯定不碰撞
				return false
			}
			if(this._gameLogicComponent.currentTerrain.IsThreeTerrain()){
				this._gameLogicComponent.currentTerrain.HideCopyTerrain()
				if(this._check_hit_terrain(this._gameLogicComponent.currentTerrain)){
					this._on_hit()
					return true
				}
				
				let next_terrain = this._gameLogicComponent.GetNextTerrain()
				if(next_terrain && next_terrain.GetBoundInMapContainer().intersects(carBoundInMapCoordinate) && this._check_hit_terrain(next_terrain)){
					this._on_hit()
					return true
				}
			}else{
				if(this._check_hit_terrain(this._gameLogicComponent.currentTerrain)){
					this._on_hit()
					return true
				}
			}
		}else{
			if(this._check_hit_terrain(this._gameLogicComponent.currentTerrain)){
				this._on_hit()
				return true
			}
			let next_terrain = this._gameLogicComponent.GetNextTerrain()
			if(next_terrain && this._check_hit_terrain(next_terrain)){
				this._on_hit()
				return true
			}
		}
		return false
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
			if(terrain.IsArcTerrain()){
				let is_hit_arc = this._check_hit_terrain_arc(terrain)
				if(is_hit_arc){
					console.log("########is_hit_arc")
				}
				return is_hit_arc
			}else if(terrain.IsThreeTerrain()){
				let is_hit_three_arc = this._check_hit_terrain_three_arc(terrain)
				if(is_hit_three_arc){
					console.log("########is_hit_three_arc")
				}
				return is_hit_three_arc
			}
		}
	}

	private _on_hit():void
	{
		this.ChangeStatus(CarStatus.Dead)
		GameController.instance.OnClientOver()
	}

	private get_instance(point1:egret.Point, point2:egret.Point)
	{
		return CommonUtils.GetDistance(point1, point2)
	}

	private _check_hit_terrain_three_arc(terrain:GameTerrain):boolean
	{
		let first_track:GameThreeArcTrack = terrain.allTracks[0] as GameThreeArcTrack
		let all_valid_bounds = first_track.GetValidBounds()

		let global_car_left_top_point = this._mainPanel.moveCar.localToGlobal(0, 0)
		let global_car_right_top_point = this._mainPanel.moveCar.localToGlobal(this._mainPanel.moveCar.width, 0)
		let global_car_left_down_point = this._mainPanel.moveCar.localToGlobal(0, this._mainPanel.moveCar.height)
		let global_car_right_down_point = this._mainPanel.moveCar.localToGlobal(this._mainPanel.moveCar.width, this._mainPanel.moveCar.height)

		let car_left_top = this._mainPanel.mapContainer.globalToLocal(global_car_left_top_point.x, global_car_left_top_point.y)
		let car_right_top = this._mainPanel.mapContainer.globalToLocal(global_car_right_top_point.x, global_car_right_top_point.y)
		let car_left_down = this._mainPanel.mapContainer.globalToLocal(global_car_left_down_point.x, global_car_left_down_point.y)
		let car_right_down = this._mainPanel.mapContainer.globalToLocal(global_car_right_down_point.x, global_car_right_down_point.y)

		let center_point = first_track.GetCenterPointInMapContainer()

		let big_distance = first_track.hit_big_rect.width / 2
		let small_distance = first_track.hit_small_rect.width / 2
		for(let bound of all_valid_bounds)
		{
			if(bound.containsPoint(car_left_top)){
				let distance = this.get_instance(car_left_top, center_point)
				if(distance > big_distance || distance < small_distance){
					return true
				}
			}
			if(bound.containsPoint(car_right_top)){
				let distance = this.get_instance(car_right_top, center_point)
				if(distance > big_distance || distance < small_distance){
					return true
				}
			}
			if(bound.containsPoint(car_left_down)){
				let distance = this.get_instance(car_left_down, center_point)
				if(distance > big_distance || distance < small_distance){
					return true
				}
			}
			if(bound.containsPoint(car_right_down)){
				let distance = this.get_instance(car_right_down, center_point)
				if(distance > big_distance || distance < small_distance){
					return true
				}
			}
		}
		
		return false
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
			let distance = this.get_instance(car_left_top, center_point)
			if(distance > first_track.hit_big_rect.width || distance < first_track.hit_small_rect.width){
				return true
			}
		}
		if(terrain_line_bounds.containsPoint(car_right_top)){
			let distance = this.get_instance(car_right_top, center_point)
			if(distance > first_track.hit_big_rect.width || distance < first_track.hit_small_rect.width){
				return true
			}
		}
		if(terrain_line_bounds.containsPoint(car_left_down)){
			let distance = this.get_instance(car_left_down, center_point)
			if(distance > first_track.hit_big_rect.width || distance < first_track.hit_small_rect.width){
				return true
			}
		}
		if(terrain_line_bounds.containsPoint(car_right_down)){
			let distance = this.get_instance(car_right_down, center_point)
			if(distance > first_track.hit_big_rect.width || distance < first_track.hit_small_rect.width){
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
		if(first_track.toDirection == TrackDirection.Top || first_track.toDirection == TrackDirection.Down){ //竖直方向比较x
			let left_x = terrain_line_bounds.x
			let right_x = left_x + (first_track as GameVerticalLineTrack).hit_rect.width
			if(car_left_top.x < left_x ||car_left_down.x < left_x || car_right_top.x < left_x ||car_right_down.x < left_x){
				return true
			}
			if(car_right_top.x > right_x || car_right_down.x > right_x || car_left_top.x > right_x || car_left_down.x > right_x){
				return true
			}
			return false
		}else{//横方向比较y
			let top_y = terrain_line_bounds.y
			let buttom_y = top_y + (first_track as GameHeorizontalLineTrack).hit_rect.height
			if(car_left_top.y < top_y ||car_left_down.y < top_y || car_right_top.y < top_y ||car_right_down.y < top_y){
				return true
			}
			if(car_right_top.y > buttom_y || car_right_down.y > buttom_y || car_left_top.y > buttom_y || car_left_down.y > buttom_y){
				return true
			}
		}

		return false
	}
}