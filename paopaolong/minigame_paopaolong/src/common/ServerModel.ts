
class RoleInfo {
	public icon:string = ""
	public nickname:string = ""
	public openid:string = ""
	public level:number = 1
	public score:number = 0
}

class ServerModel {

	public my_icon_url:string = ""
	public other_icon_url:string = ""
	public left_time:number = Const.GAME_TIME

	public myRole:RoleInfo = null
	public otherRole:RoleInfo = null
	public constructor() {
	}

	public AddRole(roleInfo:Object):void
	{
		let new_role = new RoleInfo()
		if(roleInfo['openid'])
		{
			new_role.openid = roleInfo['openid']
		}

		if(roleInfo['Id'])
		{
			new_role.openid = roleInfo['Id']
		}

		if(roleInfo['nickname'])
		{
			new_role.nickname = roleInfo['nickname']
		}

		if(roleInfo['icon'])
		{
			new_role.icon = roleInfo['icon']
		}
		new_role.level = 1
		new_role.score = 0
		if(new_role.openid == User.openId.toString()){
			this.myRole = new_role
		} else {
			this.otherRole = new_role
		}
		console.log(roleInfo)
	}

	public UpdateRoleScore(new_role_info:Object):void
	{

		let id = new_role_info['id']
		if(this.myRole.openid == id){
		}else if(this.otherRole.openid == id){
			this.otherRole.score = new_role_info['total']
		}
	}

	public UpdateRoleLevel(level_info:Object):void
	{
		let id = level_info['id']
		if(this.myRole.openid == id){
		}else if(this.otherRole.openid == id){
			this.otherRole.level = level_info['level']
		}
	}

	public ReEnterUpdateRoleInfo(player_list:Array<Object>, scores:Array<number>):void
	{
		if(typeof(player_list) != "undefined" && typeof(scores) != "undefined" && scores.length == 2 && player_list.length == 2)
		{
			let first_player_info:any = player_list[0]
			let is_first = first_player_info.openid == User.openId
			if(is_first){
				this.myRole.score = scores[0]
				this.otherRole.score = scores[1]
			} else {
				this.myRole.score = scores[1]
				this.otherRole.score = scores[0]
			}
		}
	}
}