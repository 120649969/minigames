
enum RotateDirection{
	POSITIVE = 1,
	NEGATIVE = -1,
}

class StrategyConfig{
	public duration:number
	public direction:number
	public speed:number
	public constructor(strategy_native_config:Object){
		this.duration = strategy_native_config['duration']
		this.direction = strategy_native_config['direction']
		this.speed = strategy_native_config['speed']
	}
}

class MaterialConfig{
	public type:number = 0
	public name:string = ""
	public degree:number = 0
	public constructor(material_native_config:Object){
		this.type = material_native_config['type']
		this.name = material_native_config['name']
		this.degree = material_native_config['degree']
	}
}

class RoundConfig{
	public round:number = 0
	public count:number = 0
	public materialConfigs:Array<MaterialConfig> = []
	public strategys:Array<StrategyConfig> = []

	public constructor(round_native_config:Object){
		this.round = round_native_config['round']
		this.count = round_native_config['count']

		let material_native_configs:Array<Object> = []
		if(round_native_config['materials'] != undefined){
			material_native_configs = round_native_config['materials'] as Array<Object>
		}
		for(let index = 0; index < material_native_configs.length; index++)
		{
			let material_config = new MaterialConfig(material_native_configs[index])
			this.materialConfigs.push(material_config)
		}

		let strategy_native_configs:Array<Object> = []
		if(strategy_native_configs['strategys'] != undefined){
			strategy_native_configs = strategy_native_configs['strategys'] as Array<Object>
		}
		for(let index = 0; index < strategy_native_configs.length; index++)
		{
			let strategy_config = new StrategyConfig(strategy_native_configs[index])
			this.strategys.push(strategy_config)
		}
	}
}

//盘子旋转配置
class PlateRotateStrategy {

	public direction:number
	public speed:number
	public duration:number  //秒

	public curTime:number = 0

	public constructor(config:StrategyConfig) {
		this.direction = RotateDirection.POSITIVE
		this.direction = config.direction
		if(this.direction != RotateDirection.POSITIVE && this.direction != RotateDirection.NEGATIVE){
			this.direction = RotateDirection.POSITIVE
			console.error("this config is error", config)
		}
		this.speed = config.speed
		this.duration = config.duration
	}

	public ReSet():void
	{
		this.curTime = 0
	}

	public Step(step_time:number):boolean
	{
		this.curTime += step_time
		if(this.curTime >= this.duration){
			this.ReSet()
			return true
		}
		return false
	}
}

//每场估计有多个旋转配置
class RoundPlateRotateStrategy {
	public strategys:Array<PlateRotateStrategy> = []

	public strategyIndex:number = 0
	public maxKnifeCount:number = 0;
	public roundConfig:RoundConfig;

	public constructor(roundConfig:RoundConfig){
		this.roundConfig = roundConfig
		let strategy_configs = roundConfig.strategys
		for(let key in strategy_configs){
			let config = strategy_configs[key]
			let new_strategy = new PlateRotateStrategy(config)
			this.strategys.push(new_strategy)
		}
		this.maxKnifeCount = roundConfig.count
	}

	//返回这一个step的旋转角度
	public Step(step_time:number):number
	{
		let cur_strategy = this.strategys[this.strategyIndex]
		if(cur_strategy){
			let is_finish = cur_strategy.Step(step_time)
			if(is_finish){
				this.strategyIndex = (this.strategyIndex + 1) % this.strategys.length
			}
			return cur_strategy.speed * cur_strategy.direction
		}
		return 0
	}

	public GetCurrentStrategy():PlateRotateStrategy
	{
		return this.strategys[this.strategyIndex]
	}
}
