
class MultiLineConfig{
	public all_line_config:Array<Object>
	public constructor(local_config) {
		this.all_line_config = local_config
	}
	
	public IsLong():boolean
	{
		let first_line_config:Array<number> = this.all_line_config[0] as Array<number>
		return first_line_config.length == GameConst.LINE_LONG_BALL_COUNT
	}
}

class GameConfig {

	public longMultiLineConfigs:Array<MultiLineConfig> = []
	public shortMultiLineConfigs:Array<MultiLineConfig> = []

	public constructor(local_configs:Array<Object>) {
		for(let index = 0; index < local_configs.length; index++)
		{
			let local_config = local_configs[index]
			let multiLineConfig = new MultiLineConfig(local_config)
			if(multiLineConfig.IsLong()){
				this.longMultiLineConfigs.push(multiLineConfig)
			}else{
				this.shortMultiLineConfigs.push(multiLineConfig)
			}
		}
	}

	public GetRandomLineConfig(is_last_long):MultiLineConfig
	{
		if(is_last_long){
			let index = Math.floor(Math.random() * this.shortMultiLineConfigs.length)
			return this.shortMultiLineConfigs[index]
		}else{
			let index = Math.floor(Math.random() * this.longMultiLineConfigs.length)
			index = 2
			return this.longMultiLineConfigs[index]
		}
		
	}
}