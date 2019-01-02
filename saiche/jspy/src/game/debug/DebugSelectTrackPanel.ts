class TerrainConfig{
	public trackType:TrackType
	public fromDirection:TrackDirection
	public toDirection:TrackDirection
	public trackCount:number = 1
}

module ui {
	export class DebugSelectTrackPanel extends ui.Window{

		public trackContainer:eui.Group
		public numInput:eui.TextInput
		public debugPanel:ui.DebugPanel
		private btn_close:eui.Button
		private btn_ok:eui.Button

		private all_terrain_track_configs:Array<TerrainConfig> = []
		private generate_track_config:TerrainConfig

		private _all_skins:Array<BaseGameTrack>
		private _current_selected_skin_index:number = 0
		public constructor() {
			super()
			this.skinName = "DebugSelectTrackSkin"
			this.debugPanel = window['debugPanel'] as ui.DebugPanel

			this.validateNow()
			this.init()
			CommonUtils.Add_Btn_Click(this.btn_close, this.closePanel, this)
			CommonUtils.Add_Btn_Click(this.btn_ok, this.onClickOk, this)
		}

		public resizeStage():void {
			if (!this.stage) {
				return;
			}
			this.x = (this.stage.stageWidth - this.width) / 2
			this.y = (this.stage.stageHeight - this.height) / 2 
		}	

		private closePanel():void
		{
			ui.WindowManager.getInstance().close("DebugSelectTrackPanel")
		}

		private onClickOk():void
		{
			if(this.all_terrain_track_configs.length <= 0){
				ui.WindowManager.getInstance().close("DebugSelectTrackPanel")
				return
			}
			let returnConfig = this.all_terrain_track_configs[this._current_selected_skin_index]
			if(returnConfig.trackType == TrackType.HeorizontalLine || returnConfig.trackType == TrackType.VerticalLine){
				let count = parseInt( this.numInput.text)
				if(count == null){
					count = 1
				}
				returnConfig.trackCount = count
			}else{
				returnConfig.trackCount = 1
			}
			this.debugPanel.OnAddTerrainConfig(returnConfig)
			ui.WindowManager.getInstance().close("DebugSelectTrackPanel")
		}

		private _generate_terrainConfig(trackType:TrackType, fromDirection:TrackDirection, toDirection:TrackDirection, trackCount:number = 1):TerrainConfig
		{
			let config:TerrainConfig = new TerrainConfig()
			config.trackType = trackType
			config.fromDirection = fromDirection
			config.toDirection = toDirection

			if(trackType == TrackType.Arc || TrackType.ThreeArc){
				config.trackCount = 1
			}else{
				config.trackCount = trackCount
			}
			 
			return config
		}

		private init():void
		{
			
			if(this.debugPanel.allTerrains.length <= 0){
				let config = this._generate_terrainConfig(TrackType.VerticalLine, TrackDirection.Down, TrackDirection.Top)
				this.all_terrain_track_configs.push(config)
			}else{
				let last_terrain = this.debugPanel.allTerrains[this.debugPanel.allTerrains.length - 1]
				if(last_terrain.GetTrackType() == TrackType.HeorizontalLine){
					let from_direction = last_terrain.GetTrackFromDirection()
					let to_direction = last_terrain.GetTrackToDirection()

					if(from_direction == TrackDirection.Left){
						let config = this._generate_terrainConfig(TrackType.Arc, TrackDirection.Left, TrackDirection.Top)
						this.all_terrain_track_configs.push(config)
						config = this._generate_terrainConfig(TrackType.Arc, TrackDirection.Left, TrackDirection.Down)
						this.all_terrain_track_configs.push(config)
						config = this._generate_terrainConfig(TrackType.ThreeArc, TrackDirection.Left, TrackDirection.Top)
						this.all_terrain_track_configs.push(config)
						config = this._generate_terrainConfig(TrackType.ThreeArc, TrackDirection.Left, TrackDirection.Down)
						this.all_terrain_track_configs.push(config)
					}else if(from_direction == TrackDirection.Right){
						let config = this._generate_terrainConfig(TrackType.Arc, TrackDirection.Right, TrackDirection.Top)
						this.all_terrain_track_configs.push(config)
						config = this._generate_terrainConfig(TrackType.Arc, TrackDirection.Right, TrackDirection.Down)
						this.all_terrain_track_configs.push(config)
						config = this._generate_terrainConfig(TrackType.ThreeArc, TrackDirection.Right, TrackDirection.Top)
						this.all_terrain_track_configs.push(config)
						config = this._generate_terrainConfig(TrackType.ThreeArc, TrackDirection.Right, TrackDirection.Down)
						this.all_terrain_track_configs.push(config)
					}
				}else if(last_terrain.GetTrackType() == TrackType.VerticalLine){
					let from_direction = last_terrain.GetTrackFromDirection()
					let to_direction = last_terrain.GetTrackToDirection()
					if(from_direction == TrackDirection.Top){
						let config = this._generate_terrainConfig(TrackType.Arc, TrackDirection.Top, TrackDirection.Left)
						this.all_terrain_track_configs.push(config)
						config = this._generate_terrainConfig(TrackType.Arc, TrackDirection.Top, TrackDirection.Right)
						this.all_terrain_track_configs.push(config)

						config = this._generate_terrainConfig(TrackType.ThreeArc, TrackDirection.Top, TrackDirection.Left)
						this.all_terrain_track_configs.push(config)
						config = this._generate_terrainConfig(TrackType.ThreeArc, TrackDirection.Top, TrackDirection.Right)
						this.all_terrain_track_configs.push(config)
					}else if(from_direction == TrackDirection.Down){
						let config = this._generate_terrainConfig(TrackType.Arc, TrackDirection.Down, TrackDirection.Left)
						this.all_terrain_track_configs.push(config)
						config = this._generate_terrainConfig(TrackType.Arc, TrackDirection.Down, TrackDirection.Right)
						this.all_terrain_track_configs.push(config)

						config = this._generate_terrainConfig(TrackType.ThreeArc, TrackDirection.Down, TrackDirection.Left)
						this.all_terrain_track_configs.push(config)
						config = this._generate_terrainConfig(TrackType.ThreeArc, TrackDirection.Down, TrackDirection.Right)
						this.all_terrain_track_configs.push(config)
					}
				}else if(last_terrain.GetTrackType() == TrackType.Arc){
					let from_direction = last_terrain.GetTrackFromDirection()
					let to_direction = last_terrain.GetTrackToDirection()
					if(to_direction == TrackDirection.Left || to_direction == TrackDirection.Right){ //下一步肯定是竖直跑道
						let line_from_direction = TrackDirection.Left
						if(to_direction == TrackDirection.Left){
							line_from_direction = TrackDirection.Right
						}
						let config = this._generate_terrainConfig(TrackType.HeorizontalLine, line_from_direction, to_direction)
						this.all_terrain_track_configs.push(config)
					}else{
						let line_from_direction = TrackDirection.Top
						if(to_direction == TrackDirection.Top){
							line_from_direction = TrackDirection.Down
						}
						let config = this._generate_terrainConfig(TrackType.VerticalLine, line_from_direction, to_direction)
						this.all_terrain_track_configs.push(config)
					}
				}else if(last_terrain.GetTrackType() == TrackType.ThreeArc){
					let from_direction = last_terrain.GetTrackFromDirection()
					let to_direction = last_terrain.GetTrackToDirection()
					if(from_direction == TrackDirection.Left || from_direction == TrackDirection.Right){
						if(to_direction == TrackDirection.Top){
							let line_from_direction = TrackDirection.Down
							let config = this._generate_terrainConfig(TrackType.VerticalLine, line_from_direction, to_direction)
							this.all_terrain_track_configs.push(config)
						}else{
							let line_from_direction = TrackDirection.Top
							let config = this._generate_terrainConfig(TrackType.VerticalLine, line_from_direction, to_direction)
							this.all_terrain_track_configs.push(config)
						}
					}else if(from_direction == TrackDirection.Top || from_direction == TrackDirection.Down){
						if(to_direction == TrackDirection.Left){
							let line_from_direction = TrackDirection.Right
							let config = this._generate_terrainConfig(TrackType.HeorizontalLine, line_from_direction, to_direction)
							this.all_terrain_track_configs.push(config)
						}else{
							let line_from_direction = TrackDirection.Left
							let config = this._generate_terrainConfig(TrackType.HeorizontalLine, line_from_direction, to_direction)
							this.all_terrain_track_configs.push(config)
						}
					}
				}
			}
			this._updateView()
		}

		private _is_dir(direction1:TrackDirection, direction2:TrackDirection, config:TerrainConfig):boolean
		{
			if(config.fromDirection == direction1 && config.toDirection == direction2){
				return true
			}	
			if(config.fromDirection == direction2 && config.toDirection == direction1){
				return true
			}
			return false
		}

		private _updateView():void
		{
			let allSkins:Array<BaseGameTrack> = []
			for(let terrain_track_config of this.all_terrain_track_configs)
			{
				if(terrain_track_config.trackType == TrackType.VerticalLine){
					let track:BaseGameTrack = new GameVerticalLineTrack()
					allSkins.push(track)
				}else if(terrain_track_config.trackType == TrackType.HeorizontalLine){
					let track:BaseGameTrack = new GameHeorizontalLineTrack()
					allSkins.push(track)
				}else if(terrain_track_config.trackType == TrackType.Arc){
					let track:GameArcTrack = new GameArcTrack()
					track.img_left_and_top.visible = false
					track.img_left_and_down.visible = false
					track.img_right_and_top.visible = false
					track.img_right_and_down.visible = false

					if(this._is_dir(TrackDirection.Left, TrackDirection.Top, terrain_track_config)){
						track.img_left_and_top.visible = true
					}else if(this._is_dir(TrackDirection.Left, TrackDirection.Down, terrain_track_config)){
						track.img_left_and_down.visible = true
					}else if(this._is_dir(TrackDirection.Right, TrackDirection.Top, terrain_track_config)){
						track.img_right_and_top.visible = true
					}else if(this._is_dir(TrackDirection.Right, TrackDirection.Down, terrain_track_config)){
						track.img_right_and_down.visible = true
					}

					allSkins.push(track)
				}else if(terrain_track_config.trackType == TrackType.ThreeArc){
					let track:GameThreeArcTrack = new GameThreeArcTrack()
					track.img_right_down.visible = true
					track.img_left_top.visible = true
					track.img_right_top.visible = true
					track.img_left_down.visible = true

					if(this._is_dir(TrackDirection.Left, TrackDirection.Top, terrain_track_config)){
						track.img_left_top.visible = false
					}else if(this._is_dir(TrackDirection.Left, TrackDirection.Down, terrain_track_config)){
						track.img_left_down.visible = false
					}else if(this._is_dir(TrackDirection.Right, TrackDirection.Top, terrain_track_config)){
						track.img_right_top.visible = false
					}else if(this._is_dir(TrackDirection.Right, TrackDirection.Down, terrain_track_config)){
						track.img_right_down.visible = false
					}
					allSkins.push(track)
				}

				let step_width = this.trackContainer.width / allSkins.length
				let center_x = step_width / 2
				let center_y = this.trackContainer.height / 2
				for(let skin of allSkins)
				{
					skin.anchorOffsetX = skin.width / 2
					skin.anchorOffsetY = skin.height / 2
					if(skin.width > step_width * 0.5)
					{
						skin.scaleX = skin.scaleY = step_width * 0.5 / skin.width
					}
					this.trackContainer.addChild(skin)
					skin.x = center_x
					skin.y = center_y
					center_x += step_width

					skin.touchEnabled = true
					let __this = this
					CommonUtils.Add_Btn_Click(skin, function(){
						__this._on_click_skin(allSkins.indexOf(skin))
					}.bind(this), this)
				}
			}
			this._all_skins = allSkins
			this._on_click_skin(0)
		}

		private _on_click_skin(index:number):void
		{
			for(let _index = 0; _index < this._all_skins.length; _index++)
			{
				let skin = this._all_skins[_index]
				if(_index == index){
					CommonUtils.ClearFilter(skin)
				}else{
					CommonUtils.GrayDisplayObject(skin)
				}
			}
			this._current_selected_skin_index = index
		}
	}
}