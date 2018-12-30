class GameLogicComponent extends BaseComponent{

	public allTerrains:Array<GameTerrain> = []
	
	public constructor() {
		super()
	}
	
	private _generate_map():void
	{
		let first_vertical_terrain = new GameTerrain()
		first_vertical_terrain.build_first_line_terrain()
		this.allTerrains.push(first_vertical_terrain)

		let max_terrain_count = 40
		for(let index = 0; index < max_terrain_count; index++)
		{
			let new_terrain = new GameTerrain()
			new_terrain.buildTerrain()
			this.allTerrains.push(new_terrain)
		}
	}


	public OnStart():void
	{
		this._generate_map()
	}
}