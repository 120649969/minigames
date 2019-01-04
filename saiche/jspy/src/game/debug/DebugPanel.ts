module ui {
	export class DebugPanel extends ui.Window{

		private btn_close:eui.Button
		private btn_add:eui.Button
		private btn_delete:eui.Button
		private btn_export:eui.Button
		private btn_load:eui.Button
		private btn_test:eui.Button

		public mapContainer:eui.Group
		public allTerrainConfigs:Array<TerrainConfig> = []
		public allTerrains:Array<GameTerrain> = []

		private dataInput:eui.TextInput
		public constructor() {
			super()
			this.skinName = "DebugPanelSkin"

			CommonUtils.Add_Btn_Click(this.btn_add, this.onClickAdd, this)
			CommonUtils.Add_Btn_Click(this.btn_close, this.closePanel, this)
			CommonUtils.Add_Btn_Click(this.btn_delete, this.onClickDelete, this)
			CommonUtils.Add_Btn_Click(this.btn_export, this.onClickExport, this)
			CommonUtils.Add_Btn_Click(this.btn_load, this.onClickLoad, this)
			CommonUtils.Add_Btn_Click(this.btn_test, this._onClickTest, this)
			window['debugPanel'] = this

			let __this = this
			document.addEventListener("keydown",function(evt:any){
				console.log(evt.keyCode)
				if(evt.keyCode == 37){  //left
					__this._move_left()
				}else if(evt.keyCode == 38){  //top
					__this._move_top()
				}else if(evt.keyCode == 39){  //right
					__this._move_right()
				}else if(evt.keyCode == 40){  //down
					__this._move_down()
				}
			})
		}

		private _onClickTest():void
		{
			ui.WindowManager.getInstance().close("DebugPanel")
			GameController.instance.GetMainScenePanel().GetGameLogicComponent().ReStartGame(this.allTerrainConfigs)
		}
			
		public _move_left():void
		{
			this.mapContainer.x += 50
		}

		public _move_top():void
		{
			this.mapContainer.y += 50
		}

		public _move_right():void
		{
			this.mapContainer.x -= 50
		}

		public _move_down():void
		{
			this.mapContainer.y -= 50
		}

		public onClickAdd():void
		{
			ui.WindowManager.getInstance().open("DebugSelectTrackPanel")
		}

		private onClickDelete():void
		{
			this.allTerrainConfigs.pop()
			let last_terrain = this.allTerrains.pop()
			for(let track of last_terrain.allTracks)
			{
				track.parent.removeChild(track)
			}
		}

		private onClickExport():void
		{
			let result_array = []
			for(let terrainConfig of this.allTerrainConfigs)
			{
				let item_array = []
				item_array.push(terrainConfig.trackType)
				item_array.push(terrainConfig.fromDirection)
				item_array.push(terrainConfig.toDirection)
				item_array.push(terrainConfig.trackCount)

				result_array.push(item_array)
			}
			let result = JSON.stringify(result_array)
			this.dataInput.text = result
		}

		private onClickLoad():void
		{
			let inputTxt = this.dataInput.text
			if(!inputTxt){
				return
			}
			let result = JSON.parse(inputTxt)
			if(!result){
				return
			}
			this.mapContainer.removeChildren()
			this.allTerrains = []
			this.allTerrainConfigs = []
			for(let item_array of result){
				let terrainConfig = new TerrainConfig()
				terrainConfig.trackType = item_array[0]
				terrainConfig.fromDirection = item_array[1]
				terrainConfig.toDirection = item_array[2]
				terrainConfig.trackCount = item_array[3]
				this.OnAddTerrainConfig(terrainConfig)
			}
		}

		private closePanel():void
		{
			ui.WindowManager.getInstance().close("DebugPanel")
		}

		public OnAddTerrainConfig(terrainConfig:TerrainConfig):void
		{
			this.allTerrainConfigs.push(terrainConfig)
			if(this.allTerrainConfigs.length == 1){
				let new_debug_terrain = new GameTerrain()
				new_debug_terrain.build_first_line_terrain()
				this.allTerrains.push(new_debug_terrain)
			}else{
				if(terrainConfig.trackType == TrackType.Arc){
					let new_debug_terrain = new GameTerrain()
					new_debug_terrain.buildArcTerrain()
					this.allTerrains.push(new_debug_terrain)
				}else if(terrainConfig.trackType == TrackType.HeorizontalLine){
					let new_debug_terrain = new GameTerrain()
					new_debug_terrain.buildHeorizontalTerrain()
					this.allTerrains.push(new_debug_terrain)
				}else if(terrainConfig.trackType == TrackType.VerticalLine){
					let new_debug_terrain = new GameTerrain()
					new_debug_terrain.buildVerticalTerrain()
					this.allTerrains.push(new_debug_terrain)
				}else if(terrainConfig.trackType == TrackType.ThreeArc){
					let new_debug_terrain = new GameTerrain()
					new_debug_terrain.buildThreeArcTerrain()
					this.allTerrains.push(new_debug_terrain)
				}
			}
		}
	}
}