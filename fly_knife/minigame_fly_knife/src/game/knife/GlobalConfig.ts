
enum RotateDirection{
	POSITIVE = 1,
	NEGATIVE = -1,
}

class StrategyConfig{
	public duration:number
	public direction:number
	public speed:number
	public fadeTime:number
	public constructor(strategy_native_config:Object){
		this.duration = strategy_native_config['duration']
		this.direction = strategy_native_config['direction']
		this.speed = strategy_native_config['speed']
		this.fadeTime = strategy_native_config['fadeTime'] || 2
	}
}

class MaterialConfig{
	public type:number = 0
	public name:string = ""
	public degrees:Array<number> = []
	public count:number = 0
	private backup_degrees:Array<number> = []
	public constructor(material_native_config:Object){
		this.type = material_native_config['type']
		this.name = material_native_config['name']
		this.count = material_native_config['count']
		this.degrees = material_native_config['degree']
		this.Reset()
	}

	public getRandomDegree():number
	{
		let ret = 0
		let index = Math.floor(Math.random() * this.backup_degrees.length)
		ret = this.backup_degrees[index]
		this.backup_degrees.splice(index, 1)
		console.log(this.backup_degrees, ret)
		return ret
	}

	public Reset():void
	{
		this.backup_degrees = []
		for(let index = 0; index < this.degrees.length; index++)
		{
			this.backup_degrees.push(this.degrees[index])
		}
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
			if(material_config.count > 0){
				this.materialConfigs.push(material_config)
			}
		}

		let strategy_native_configs:Array<Object> = []
		if(round_native_config['strategys'] != undefined){
			strategy_native_configs = round_native_config['strategys'] as Array<Object>
		}
		for(let index = 0; index < strategy_native_configs.length; index++)
		{
			let strategy_config = new StrategyConfig(strategy_native_configs[index])
			if (strategy_config.speed < KnifeConst.InValid_Config_Value){
				this.strategys.push(strategy_config)
			}
			
		}
	}

	public Reset():void
	{
		for(let index = 0; index < this.materialConfigs.length; index ++)
		{
			let material_config = this.materialConfigs[index]
			material_config.Reset()
		}
	}
}

//盘子旋转配置
class PlateRotateStrategy {

	public direction:number
	public speed:number
	public duration:number  //秒
	public fadeTime:number
	public curTime:number = 0

	private _current_speed:number = 0
	private _target_speed:number = 0
	public constructor(config:StrategyConfig, next_speed: number) {
		this._target_speed = next_speed
		this.speed = config.speed
		this.duration = config.duration
		this.fadeTime = config.fadeTime

		this._current_speed = this.speed
	}

	public ReSet():void
	{
		this.curTime = 0
		this._current_speed = this.speed
	}

	public Step(step_time:number):boolean
	{
		this.curTime += step_time
		if(this.curTime >= this.duration - this.fadeTime &&  this.fadeTime > 0){
			this._current_speed = this.speed + (this._target_speed - this.speed) * (this.curTime - this.duration + this.fadeTime) / this.fadeTime
		} else {
			this._current_speed = this.speed
		}
		this.direction = this._current_speed > 0 ? RotateDirection.POSITIVE : RotateDirection.NEGATIVE
		if(this.curTime >= this.duration){
			return true
		}
		return false
	}

	public getCurrentSpeed():number
	{
		return this._current_speed
	}
}

//每场估计有多个旋转配置
class RoundPlateRotateStrategy {
	public strategys:Array<PlateRotateStrategy> = []

	public strategyIndex:number = 0
	public maxKnifeCount:number = 0;
	public roundConfig:RoundConfig;

	public hasChangeStrategy:boolean = false
	public constructor(roundConfig:RoundConfig){
		this.roundConfig = roundConfig
		let strategy_configs = roundConfig.strategys
		for(let index = 0; index < strategy_configs.length; index ++)
		{
			let config = strategy_configs[index]
			let next_speed = strategy_configs[(index + 1) % strategy_configs.length].speed
			let new_strategy = new PlateRotateStrategy(config, next_speed)
			this.strategys.push(new_strategy)
		}
		this.maxKnifeCount = roundConfig.count
	}

	//返回这一个step的旋转角度
	public Step(step_time:number):number
	{
		this.hasChangeStrategy = false
		let cur_strategy = this.strategys[this.strategyIndex]
		if(cur_strategy){
			let is_finish = cur_strategy.Step(step_time)
			if(is_finish){
				this.strategyIndex = (this.strategyIndex + 1) % this.strategys.length
			}
			let ret = cur_strategy.getCurrentSpeed()
			if(is_finish){
				this.hasChangeStrategy = true
				cur_strategy.ReSet()
			}
			return ret
		}
		return 0
	}

	public GetCurrentStrategy():PlateRotateStrategy
	{
		return this.strategys[this.strategyIndex]
	}

	public GetCurrentStrategyConfig():StrategyConfig
	{
		return this.roundConfig.strategys[this.strategyIndex]
	}
}
