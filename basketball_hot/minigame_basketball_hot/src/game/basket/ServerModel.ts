
class RoleInfo {
	public icon:string
	public nickname:string
	public openid:string
	public level:number
	public score:number
}

class ServerModel {

	public my_icon_url:string = ""
	public other_icon_url:string = ""
	public left_time:number = 20

	public myRole:RoleInfo
	public otherRole:RoleInfo
	public MAX_TIME:number = 60
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
		new_role.level = roleInfo['level']
		new_role.score = 0
		if(new_role.openid == User.openId){
			this.myRole = new_role
		} else {
			this.otherRole = new_role
		}
		console.log(roleInfo)
	}

	public UpdateRoleScore(new_role_info:Object):void
	{
		let id = new_role_info['openid']
		if(this.myRole.openid == id){
		}else if(this.otherRole.openid == id){
			this.otherRole.score = new_role_info['total']
		}
	}
}