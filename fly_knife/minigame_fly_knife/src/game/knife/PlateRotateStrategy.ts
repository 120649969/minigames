
enum PlateRotateDirection{
	POSITIVE = 1,
	NEGATIVE = -1,
}


class DataConfig{
	public duration:number
	public direction:number
	public speed:number
}

//盘子旋转配置
class PlateRotateStrategy {

	public direction:number
	public speed:number
	public duration:number  //秒

	public curTime:number = 0

	public constructor(config) {
		this.direction = PlateRotateDirection.POSITIVE
		if(config['direction'] != undefined){
			this.direction = config['direction']
			if(this.direction != PlateRotateDirection.POSITIVE && this.direction != PlateRotateDirection.NEGATIVE){
				this.direction = PlateRotateDirection.POSITIVE
				console.error("this config is error", config)
			}
		}

		this.speed = 1
		if(config['speed'] != undefined){
			this.speed = config['speed']
		}

		this.duration = 1
		if(config['duration'] != undefined){
			this.duration = config['duration']
		}
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

	public constructor(configs){
		let strategy_configs = configs.sub_configs || []
		for(let key in strategy_configs){
			let config = strategy_configs[key]
			let new_strategy = new PlateRotateStrategy(config)
			this.strategys.push(new_strategy)
		}

		this.maxKnifeCount = 1
		if(configs['count'] != undefined){
			this.maxKnifeCount = configs['count']
		}
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

	public static GetConfig1():Object
	{
		let new_configs = {}

		let sub_configs = []

		let new_config = new DataConfig()
		new_config.direction = 1
		new_config.speed = 6
		new_config.duration = 3
		sub_configs.push(new_config)

		new_config = new DataConfig()
		new_config.direction = -1
		new_config.speed = 6
		new_config.duration = 3
		sub_configs.push(new_config)

		new_configs['sub_configs'] = sub_configs
		new_configs['count'] = 3 + Math.ceil(Math.random() * 4)

		return new_configs
	}

	public static CurrentConfig = RoundPlateRotateStrategy.GetConfig1()
}
