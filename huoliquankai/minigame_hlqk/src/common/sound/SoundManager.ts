class SoundManager {
	protected static instance:SoundManager = null;
	protected static BGM_NAME = 'bg_theme_mp3';

	protected bgmChannel:egret.SoundChannel;

	public constructor() {
		this.bgmChannel = null;
	}	

	public static getInstance() {
		if (this.instance == null) {
			this.instance = new SoundManager();
		}
		return this.instance;
	}

	public playSound(name:string) {
		let s:egret.Sound = RES.getRes(name);
		if (!!s) {
			return s.play(0, 1);
		}

		return null;
	}

	public playBGM() {
		if (!!this.bgmChannel) {
			this.bgmChannel.stop();
			this.bgmChannel = null;
		}

		let name = SoundManager.BGM_NAME;
		RES.getResAsync(name, function (s:egret.Sound) {
			if (!!s) {
				this.bgmChannel = s.play(0, 0);				
				this.bgmChannel.volume = Config.enableBgm ? 1 : 0;
			} else {
				console.error('bgm not found', name);
			}
		}, this);
	}

	public stopBgm() {
		if (!!this.bgmChannel) {
			this.bgmChannel.stop();
			this.bgmChannel = null;
		}
	}
}
