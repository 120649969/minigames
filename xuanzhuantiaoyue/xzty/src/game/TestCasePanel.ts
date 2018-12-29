module ui {
	export class TestCasePanel extends ui.Window{
		public constructor() {
			super()
			this.skinName = "Test"

			this.validateNow()
			
		}

		private test():void
		{
			let last_ball_1 = this['test1']
			let last_ball_2 = this['test2']

			let generate_count = 2

			let center_point = new egret.Point()
			center_point.x = (last_ball_1.x + last_ball_2.x) / 2
			center_point.y = (last_ball_1.y + last_ball_2.y) / 2

			let dir = new egret.Point(last_ball_2.x - last_ball_1.x, last_ball_2.y - last_ball_1.y)
			dir.normalize(1)

			let dot_dir1 = new egret.Point(dir.y, dir.x * -1)
			let dot_dir2 = new egret.Point(dir.y * -1, dir.x)

			let start_x = center_point.x + dir.x * -1 * 100 * (generate_count - 1) / 2
			let start_y = center_point.y + dir.y * -1 * 100 * (generate_count - 1) / 2

			let line_distance = 100
			let start_line1_x = start_x + dot_dir1.x * line_distance
			let start_line1_y = start_y + dot_dir1.y * line_distance

			let start_line2_x = start_x + dot_dir2.x * line_distance
			let start_line2_y = start_y + dot_dir2.y * line_distance

			for(let index = 0; index < generate_count; index++)
			{
				let new_prop = new GameProp(GamePropType.OtherStone)
				new_prop.x = start_line1_x
				new_prop.y = start_line1_y
				this.addChild(new_prop)

				new_prop = new GameProp(GamePropType.OtherStone)
				new_prop.x = start_line2_x
				new_prop.y = start_line2_y
				this.addChild(new_prop)

				start_line1_x += dir.x * 100
				start_line1_y += dir.y * 100

				start_line2_x += dir.x * 100
				start_line2_y += dir.y * 100
			}
		}

		public onOpen():void
		{
			let __this = this
			CommonUtils.performDelay(function(){
				__this.test()
			}, 1 * 1000, this)
			
		}
	}
}
