window.skins={};
                function __extends(d, b) {
                    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                        function __() {
                            this.constructor = d;
                        }
                    __.prototype = b.prototype;
                    d.prototype = new __();
                };
                window.generateEUI = {};
                generateEUI.paths = {};
                generateEUI.styles = undefined;
                generateEUI.skins = {"eui.Button":"resource/eui_skins/ButtonSkin.exml","eui.CheckBox":"resource/eui_skins/CheckBoxSkin.exml","eui.HScrollBar":"resource/eui_skins/HScrollBarSkin.exml","eui.HSlider":"resource/eui_skins/HSliderSkin.exml","eui.Panel":"resource/eui_skins/PanelSkin.exml","eui.TextInput":"resource/eui_skins/TextInputSkin.exml","eui.ProgressBar":"resource/eui_skins/ProgressBarSkin.exml","eui.RadioButton":"resource/eui_skins/RadioButtonSkin.exml","eui.Scroller":"resource/eui_skins/ScrollerSkin.exml","eui.ToggleSwitch":"resource/eui_skins/ToggleSwitchSkin.exml","eui.VScrollBar":"resource/eui_skins/VScrollBarSkin.exml","eui.VSlider":"resource/eui_skins/VSliderSkin.exml","eui.ItemRenderer":"resource/eui_skins/ItemRendererSkin.exml"};generateEUI.paths['resource/eui_skins/ButtonSkin.exml'] = window.skins.ButtonSkin = (function (_super) {
	__extends(ButtonSkin, _super);
	function ButtonSkin() {
		_super.call(this);
		this.skinParts = ["labelDisplay","iconDisplay"];
		
		this.minHeight = 50;
		this.minWidth = 100;
		this.elementsContent = [this._Image1_i(),this.labelDisplay_i(),this.iconDisplay_i()];
		this.states = [
			new eui.State ("up",
				[
				])
			,
			new eui.State ("down",
				[
					new eui.SetProperty("_Image1","source","button_down_png")
				])
			,
			new eui.State ("disabled",
				[
					new eui.SetProperty("_Image1","alpha",0.5)
				])
		];
	}
	var _proto = ButtonSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		this._Image1 = t;
		t.percentHeight = 100;
		t.scale9Grid = new egret.Rectangle(1,3,8,8);
		t.source = "button_up_png";
		t.percentWidth = 100;
		return t;
	};
	_proto.labelDisplay_i = function () {
		var t = new eui.Label();
		this.labelDisplay = t;
		t.bottom = 8;
		t.left = 8;
		t.right = 8;
		t.size = 20;
		t.textAlign = "center";
		t.textColor = 0xFFFFFF;
		t.top = 8;
		t.verticalAlign = "middle";
		return t;
	};
	_proto.iconDisplay_i = function () {
		var t = new eui.Image();
		this.iconDisplay = t;
		t.horizontalCenter = 0;
		t.verticalCenter = 0;
		return t;
	};
	return ButtonSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/CheckBoxSkin.exml'] = window.skins.CheckBoxSkin = (function (_super) {
	__extends(CheckBoxSkin, _super);
	function CheckBoxSkin() {
		_super.call(this);
		this.skinParts = ["labelDisplay"];
		
		this.elementsContent = [this._Group1_i()];
		this.states = [
			new eui.State ("up",
				[
				])
			,
			new eui.State ("down",
				[
					new eui.SetProperty("_Image1","alpha",0.7)
				])
			,
			new eui.State ("disabled",
				[
					new eui.SetProperty("_Image1","alpha",0.5)
				])
			,
			new eui.State ("upAndSelected",
				[
					new eui.SetProperty("_Image1","source","checkbox_select_up_png")
				])
			,
			new eui.State ("downAndSelected",
				[
					new eui.SetProperty("_Image1","source","checkbox_select_down_png")
				])
			,
			new eui.State ("disabledAndSelected",
				[
					new eui.SetProperty("_Image1","source","checkbox_select_disabled_png")
				])
		];
	}
	var _proto = CheckBoxSkin.prototype;

	_proto._Group1_i = function () {
		var t = new eui.Group();
		t.percentHeight = 100;
		t.percentWidth = 100;
		t.layout = this._HorizontalLayout1_i();
		t.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
		return t;
	};
	_proto._HorizontalLayout1_i = function () {
		var t = new eui.HorizontalLayout();
		t.verticalAlign = "middle";
		return t;
	};
	_proto._Image1_i = function () {
		var t = new eui.Image();
		this._Image1 = t;
		t.alpha = 1;
		t.fillMode = "scale";
		t.source = "checkbox_unselect_png";
		return t;
	};
	_proto.labelDisplay_i = function () {
		var t = new eui.Label();
		this.labelDisplay = t;
		t.fontFamily = "Tahoma";
		t.size = 20;
		t.textAlign = "center";
		t.textColor = 0x707070;
		t.verticalAlign = "middle";
		return t;
	};
	return CheckBoxSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/HScrollBarSkin.exml'] = window.skins.HScrollBarSkin = (function (_super) {
	__extends(HScrollBarSkin, _super);
	function HScrollBarSkin() {
		_super.call(this);
		this.skinParts = ["thumb"];
		
		this.minHeight = 8;
		this.minWidth = 20;
		this.elementsContent = [this.thumb_i()];
	}
	var _proto = HScrollBarSkin.prototype;

	_proto.thumb_i = function () {
		var t = new eui.Image();
		this.thumb = t;
		t.height = 8;
		t.scale9Grid = new egret.Rectangle(3,3,2,2);
		t.source = "roundthumb_png";
		t.verticalCenter = 0;
		t.width = 30;
		return t;
	};
	return HScrollBarSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/HSliderSkin.exml'] = window.skins.HSliderSkin = (function (_super) {
	__extends(HSliderSkin, _super);
	function HSliderSkin() {
		_super.call(this);
		this.skinParts = ["track","thumb"];
		
		this.minHeight = 8;
		this.minWidth = 20;
		this.elementsContent = [this.track_i(),this.thumb_i()];
	}
	var _proto = HSliderSkin.prototype;

	_proto.track_i = function () {
		var t = new eui.Image();
		this.track = t;
		t.height = 6;
		t.scale9Grid = new egret.Rectangle(1,1,4,4);
		t.source = "track_sb_png";
		t.verticalCenter = 0;
		t.percentWidth = 100;
		return t;
	};
	_proto.thumb_i = function () {
		var t = new eui.Image();
		this.thumb = t;
		t.source = "thumb_png";
		t.verticalCenter = 0;
		return t;
	};
	return HSliderSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/ItemRendererSkin.exml'] = window.skins.ItemRendererSkin = (function (_super) {
	__extends(ItemRendererSkin, _super);
	function ItemRendererSkin() {
		_super.call(this);
		this.skinParts = ["labelDisplay"];
		
		this.minHeight = 50;
		this.minWidth = 100;
		this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
		this.states = [
			new eui.State ("up",
				[
				])
			,
			new eui.State ("down",
				[
					new eui.SetProperty("_Image1","source","button_down_png")
				])
			,
			new eui.State ("disabled",
				[
					new eui.SetProperty("_Image1","alpha",0.5)
				])
		];
		
		eui.Binding.$bindProperties(this, ["hostComponent.data"],[0],this.labelDisplay,"text");
	}
	var _proto = ItemRendererSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		this._Image1 = t;
		t.percentHeight = 100;
		t.scale9Grid = new egret.Rectangle(1,3,8,8);
		t.source = "button_up_png";
		t.percentWidth = 100;
		return t;
	};
	_proto.labelDisplay_i = function () {
		var t = new eui.Label();
		this.labelDisplay = t;
		t.bottom = 8;
		t.fontFamily = "Tahoma";
		t.left = 8;
		t.right = 8;
		t.size = 20;
		t.textAlign = "center";
		t.textColor = 0xFFFFFF;
		t.top = 8;
		t.verticalAlign = "middle";
		return t;
	};
	return ItemRendererSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/MainScene.exml'] = window.MainScene = (function (_super) {
	__extends(MainScene, _super);
	var MainScene$Skin1 = 	(function (_super) {
		__extends(MainScene$Skin1, _super);
		function MainScene$Skin1() {
			_super.call(this);
			this.skinParts = ["labelDisplay"];
			
			this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
			this.states = [
				new eui.State ("up",
					[
					])
				,
				new eui.State ("down",
					[
						new eui.SetProperty("_Image1","source","Button_yellow03_png")
					])
				,
				new eui.State ("disabled",
					[
						new eui.SetProperty("_Image1","source","Button_yellow03_png")
					])
			];
		}
		var _proto = MainScene$Skin1.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			this._Image1 = t;
			t.percentHeight = 100;
			t.source = "Button_yellow03_png";
			t.percentWidth = 100;
			return t;
		};
		_proto.labelDisplay_i = function () {
			var t = new eui.Label();
			this.labelDisplay = t;
			t.horizontalCenter = 0;
			t.verticalCenter = 0;
			return t;
		};
		return MainScene$Skin1;
	})(eui.Skin);

	function MainScene() {
		_super.call(this);
		this.skinParts = ["m_bg","m_floor","m_board_scope","m_left_line","m_circle_scope","m_net_scope","m_right_line","m_basket_container_back","m_top","m_image_ball","m_basket_ball","m_basket_container_pre","btn_debug","m_container"];
		
		this.height = 1136;
		this.width = 640;
		this.elementsContent = [this.m_container_i()];
	}
	var _proto = MainScene.prototype;

	_proto.m_container_i = function () {
		var t = new eui.Group();
		this.m_container = t;
		t.bottom = 0;
		t.height = 1136;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		t.touchEnabled = true;
		t.touchThrough = false;
		t.width = 640;
		t.elementsContent = [this.m_bg_i(),this.m_floor_i(),this.m_basket_container_back_i(),this.m_top_i(),this.m_basket_ball_i(),this.m_basket_container_pre_i(),this.btn_debug_i()];
		return t;
	};
	_proto.m_bg_i = function () {
		var t = new eui.Image();
		this.m_bg = t;
		t.bottom = 0;
		t.fillMode = "scale";
		t.height = 1136;
		t.left = 0;
		t.right = 0;
		t.source = "bj2_jpg";
		t.top = 0;
		t.width = 640;
		return t;
	};
	_proto.m_floor_i = function () {
		var t = new eui.Group();
		this.m_floor = t;
		t.anchorOffsetX = 320;
		t.height = 10;
		t.left = 0;
		t.right = 0;
		t.y = 967;
		t.elementsContent = [this._Rect1_i()];
		return t;
	};
	_proto._Rect1_i = function () {
		var t = new eui.Rect();
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.scaleX = 1;
		t.scaleY = 1;
		t.top = 0;
		return t;
	};
	_proto.m_basket_container_back_i = function () {
		var t = new eui.Group();
		this.m_basket_container_back = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 569;
		t.height = 1138;
		t.scaleX = 0.7;
		t.scaleY = 0.7;
		t.verticalCenter = -2.5;
		t.width = 640;
		t.x = 0;
		t.elementsContent = [this._Image1_i(),this._Image2_i(),this._Image3_i(),this.m_board_scope_i(),this.m_left_line_i(),this.m_circle_scope_i(),this.m_net_scope_i(),this.m_right_line_i()];
		return t;
	};
	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "wang_png";
		t.x = 85.2;
		t.y = 465.46;
		return t;
	};
	_proto._Image2_i = function () {
		var t = new eui.Image();
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "ban_png";
		t.x = 0;
		t.y = 278;
		return t;
	};
	_proto._Image3_i = function () {
		var t = new eui.Image();
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "kuang_png";
		t.x = 64.25;
		t.y = 455;
		return t;
	};
	_proto.m_board_scope_i = function () {
		var t = new eui.Group();
		this.m_board_scope = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 281;
		t.scaleX = 1;
		t.scaleY = 1;
		t.visible = false;
		t.width = 24;
		t.x = 38.93;
		t.y = 276.34;
		return t;
	};
	_proto.m_left_line_i = function () {
		var t = new eui.Group();
		this.m_left_line = t;
		t.height = 1;
		t.scaleX = 1;
		t.scaleY = 1;
		t.visible = false;
		t.width = 23;
		t.x = 65.5;
		t.y = 473.67;
		return t;
	};
	_proto.m_circle_scope_i = function () {
		var t = new eui.Group();
		this.m_circle_scope = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 30;
		t.scaleX = 1;
		t.scaleY = 1;
		t.visible = false;
		t.width = 135;
		t.x = 88.75;
		t.y = 462;
		return t;
	};
	_proto.m_net_scope_i = function () {
		var t = new eui.Group();
		this.m_net_scope = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 91;
		t.scaleX = 1;
		t.scaleY = 1;
		t.visible = false;
		t.width = 97;
		t.x = 109;
		t.y = 496.0000000000001;
		return t;
	};
	_proto.m_right_line_i = function () {
		var t = new eui.Group();
		this.m_right_line = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 1;
		t.scaleX = 1;
		t.scaleY = 1;
		t.visible = false;
		t.width = 13;
		t.x = 220.04000000000002;
		t.y = 473;
		return t;
	};
	_proto.m_top_i = function () {
		var t = new eui.Group();
		this.m_top = t;
		t.anchorOffsetX = 320;
		t.height = 10;
		t.left = 0;
		t.right = 0;
		t.y = 157;
		t.elementsContent = [this._Rect2_i()];
		return t;
	};
	_proto._Rect2_i = function () {
		var t = new eui.Rect();
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.scaleX = 1;
		t.scaleY = 1;
		t.top = 0;
		return t;
	};
	_proto.m_basket_ball_i = function () {
		var t = new eui.Group();
		this.m_basket_ball = t;
		t.height = 60;
		t.width = 60;
		t.x = 404;
		t.y = 417;
		t.elementsContent = [this.m_image_ball_i()];
		return t;
	};
	_proto.m_image_ball_i = function () {
		var t = new eui.Image();
		this.m_image_ball = t;
		t.anchorOffsetX = 94;
		t.anchorOffsetY = 94;
		t.horizontalCenter = 0;
		t.scaleX = 0.4;
		t.scaleY = 0.4;
		t.source = "qiu_png";
		t.verticalCenter = -0.5;
		return t;
	};
	_proto.m_basket_container_pre_i = function () {
		var t = new eui.Group();
		this.m_basket_container_pre = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 569;
		t.height = 1138;
		t.scaleX = 0.7;
		t.scaleY = 0.7;
		t.verticalCenter = -2.5;
		t.width = 640;
		t.x = 0;
		t.elementsContent = [this._Image4_i(),this._Image5_i()];
		return t;
	};
	_proto._Image4_i = function () {
		var t = new eui.Image();
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "wang2_png";
		t.x = 85.2;
		t.y = 487;
		return t;
	};
	_proto._Image5_i = function () {
		var t = new eui.Image();
		t.source = "kuang2_png";
		t.x = 64.25;
		t.y = 475;
		return t;
	};
	_proto.btn_debug_i = function () {
		var t = new eui.Button();
		this.btn_debug = t;
		t.anchorOffsetX = 114;
		t.anchorOffsetY = 36;
		t.enabled = true;
		t.height = 74;
		t.horizontalCenter = 0;
		t.label = "测试面板";
		t.scaleX = 1;
		t.scaleY = 1;
		t.top = 43;
		t.touchEnabled = true;
		t.width = 228;
		t.skinName = MainScene$Skin1;
		return t;
	};
	return MainScene;
})(eui.Skin);generateEUI.paths['resource/eui_skins/PanelSkin.exml'] = window.skins.PanelSkin = (function (_super) {
	__extends(PanelSkin, _super);
	function PanelSkin() {
		_super.call(this);
		this.skinParts = ["titleDisplay","moveArea","closeButton"];
		
		this.minHeight = 230;
		this.minWidth = 450;
		this.elementsContent = [this._Image1_i(),this.moveArea_i(),this.closeButton_i()];
	}
	var _proto = PanelSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.scale9Grid = new egret.Rectangle(2,2,12,12);
		t.source = "border_png";
		t.top = 0;
		return t;
	};
	_proto.moveArea_i = function () {
		var t = new eui.Group();
		this.moveArea = t;
		t.height = 45;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		t.elementsContent = [this._Image2_i(),this.titleDisplay_i()];
		return t;
	};
	_proto._Image2_i = function () {
		var t = new eui.Image();
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.source = "header_png";
		t.top = 0;
		return t;
	};
	_proto.titleDisplay_i = function () {
		var t = new eui.Label();
		this.titleDisplay = t;
		t.fontFamily = "Tahoma";
		t.left = 15;
		t.right = 5;
		t.size = 20;
		t.textColor = 0xFFFFFF;
		t.verticalCenter = 0;
		t.wordWrap = false;
		return t;
	};
	_proto.closeButton_i = function () {
		var t = new eui.Button();
		this.closeButton = t;
		t.bottom = 5;
		t.horizontalCenter = 0;
		t.label = "close";
		return t;
	};
	return PanelSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/ProgressBarSkin.exml'] = window.skins.ProgressBarSkin = (function (_super) {
	__extends(ProgressBarSkin, _super);
	function ProgressBarSkin() {
		_super.call(this);
		this.skinParts = ["thumb","labelDisplay"];
		
		this.minHeight = 18;
		this.minWidth = 30;
		this.elementsContent = [this._Image1_i(),this.thumb_i(),this.labelDisplay_i()];
	}
	var _proto = ProgressBarSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.percentHeight = 100;
		t.scale9Grid = new egret.Rectangle(1,1,4,4);
		t.source = "track_pb_png";
		t.verticalCenter = 0;
		t.percentWidth = 100;
		return t;
	};
	_proto.thumb_i = function () {
		var t = new eui.Image();
		this.thumb = t;
		t.percentHeight = 100;
		t.source = "thumb_pb_png";
		t.percentWidth = 100;
		return t;
	};
	_proto.labelDisplay_i = function () {
		var t = new eui.Label();
		this.labelDisplay = t;
		t.fontFamily = "Tahoma";
		t.horizontalCenter = 0;
		t.size = 15;
		t.textAlign = "center";
		t.textColor = 0x707070;
		t.verticalAlign = "middle";
		t.verticalCenter = 0;
		return t;
	};
	return ProgressBarSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/RadioButtonSkin.exml'] = window.skins.RadioButtonSkin = (function (_super) {
	__extends(RadioButtonSkin, _super);
	function RadioButtonSkin() {
		_super.call(this);
		this.skinParts = ["labelDisplay"];
		
		this.elementsContent = [this._Group1_i()];
		this.states = [
			new eui.State ("up",
				[
				])
			,
			new eui.State ("down",
				[
					new eui.SetProperty("_Image1","alpha",0.7)
				])
			,
			new eui.State ("disabled",
				[
					new eui.SetProperty("_Image1","alpha",0.5)
				])
			,
			new eui.State ("upAndSelected",
				[
					new eui.SetProperty("_Image1","source","radiobutton_select_up_png")
				])
			,
			new eui.State ("downAndSelected",
				[
					new eui.SetProperty("_Image1","source","radiobutton_select_down_png")
				])
			,
			new eui.State ("disabledAndSelected",
				[
					new eui.SetProperty("_Image1","source","radiobutton_select_disabled_png")
				])
		];
	}
	var _proto = RadioButtonSkin.prototype;

	_proto._Group1_i = function () {
		var t = new eui.Group();
		t.percentHeight = 100;
		t.percentWidth = 100;
		t.layout = this._HorizontalLayout1_i();
		t.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
		return t;
	};
	_proto._HorizontalLayout1_i = function () {
		var t = new eui.HorizontalLayout();
		t.verticalAlign = "middle";
		return t;
	};
	_proto._Image1_i = function () {
		var t = new eui.Image();
		this._Image1 = t;
		t.alpha = 1;
		t.fillMode = "scale";
		t.source = "radiobutton_unselect_png";
		return t;
	};
	_proto.labelDisplay_i = function () {
		var t = new eui.Label();
		this.labelDisplay = t;
		t.fontFamily = "Tahoma";
		t.size = 20;
		t.textAlign = "center";
		t.textColor = 0x707070;
		t.verticalAlign = "middle";
		return t;
	};
	return RadioButtonSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/ScrollerSkin.exml'] = window.skins.ScrollerSkin = (function (_super) {
	__extends(ScrollerSkin, _super);
	function ScrollerSkin() {
		_super.call(this);
		this.skinParts = ["horizontalScrollBar","verticalScrollBar"];
		
		this.minHeight = 20;
		this.minWidth = 20;
		this.elementsContent = [this.horizontalScrollBar_i(),this.verticalScrollBar_i()];
	}
	var _proto = ScrollerSkin.prototype;

	_proto.horizontalScrollBar_i = function () {
		var t = new eui.HScrollBar();
		this.horizontalScrollBar = t;
		t.bottom = 0;
		t.percentWidth = 100;
		return t;
	};
	_proto.verticalScrollBar_i = function () {
		var t = new eui.VScrollBar();
		this.verticalScrollBar = t;
		t.percentHeight = 100;
		t.right = 0;
		return t;
	};
	return ScrollerSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/Setting.exml'] = window.Setting = (function (_super) {
	__extends(Setting, _super);
	var Setting$Skin2 = 	(function (_super) {
		__extends(Setting$Skin2, _super);
		function Setting$Skin2() {
			_super.call(this);
			this.skinParts = ["labelDisplay"];
			
			this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
			this.states = [
				new eui.State ("up",
					[
					])
				,
				new eui.State ("down",
					[
						new eui.SetProperty("_Image1","source","Qiand_close_png")
					])
				,
				new eui.State ("disabled",
					[
						new eui.SetProperty("_Image1","source","Qiand_close_png")
					])
			];
		}
		var _proto = Setting$Skin2.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			this._Image1 = t;
			t.percentHeight = 100;
			t.source = "Qiand_close_png";
			t.percentWidth = 100;
			return t;
		};
		_proto.labelDisplay_i = function () {
			var t = new eui.Label();
			this.labelDisplay = t;
			t.horizontalCenter = 0;
			t.verticalCenter = 0;
			return t;
		};
		return Setting$Skin2;
	})(eui.Skin);

	var Setting$Skin3 = 	(function (_super) {
		__extends(Setting$Skin3, _super);
		function Setting$Skin3() {
			_super.call(this);
			this.skinParts = ["labelDisplay"];
			
			this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
			this.states = [
				new eui.State ("up",
					[
					])
				,
				new eui.State ("down",
					[
						new eui.SetProperty("_Image1","source","Button_yellow03_png")
					])
				,
				new eui.State ("disabled",
					[
						new eui.SetProperty("_Image1","source","Button_yellow03_png")
					])
			];
		}
		var _proto = Setting$Skin3.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			this._Image1 = t;
			t.percentHeight = 100;
			t.source = "Button_yellow03_png";
			t.percentWidth = 100;
			return t;
		};
		_proto.labelDisplay_i = function () {
			var t = new eui.Label();
			this.labelDisplay = t;
			t.horizontalCenter = 0;
			t.verticalCenter = 0;
			return t;
		};
		return Setting$Skin3;
	})(eui.Skin);

	var Setting$Skin4 = 	(function (_super) {
		__extends(Setting$Skin4, _super);
		function Setting$Skin4() {
			_super.call(this);
			this.skinParts = ["labelDisplay"];
			
			this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
			this.states = [
				new eui.State ("up",
					[
					])
				,
				new eui.State ("down",
					[
						new eui.SetProperty("_Image1","source","Button_yellow03_png")
					])
				,
				new eui.State ("disabled",
					[
						new eui.SetProperty("_Image1","source","Button_yellow03_png")
					])
			];
		}
		var _proto = Setting$Skin4.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			this._Image1 = t;
			t.percentHeight = 100;
			t.source = "Button_yellow03_png";
			t.percentWidth = 100;
			return t;
		};
		_proto.labelDisplay_i = function () {
			var t = new eui.Label();
			this.labelDisplay = t;
			t.horizontalCenter = 0;
			t.verticalCenter = 0;
			return t;
		};
		return Setting$Skin4;
	})(eui.Skin);

	function Setting() {
		_super.call(this);
		this.skinParts = ["m_bg0","btn_close","label_gravity","label_max_x","label_min_y","label_impluse_y","label_wind","label_floor_restitution","label_right_restitution","label_left_restitution","label_board_restitution","btn_ok","btn_reset","m_container"];
		
		this.height = 1136;
		this.width = 640;
		this.elementsContent = [this.m_container_i()];
	}
	var _proto = Setting.prototype;

	_proto.m_container_i = function () {
		var t = new eui.Group();
		this.m_container = t;
		t.bottom = 0;
		t.height = 1136;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		t.touchEnabled = true;
		t.touchThrough = false;
		t.width = 640;
		t.elementsContent = [this.m_bg0_i(),this.btn_close_i(),this._Label1_i(),this.label_gravity_i(),this._Label2_i(),this.label_max_x_i(),this._Label3_i(),this.label_min_y_i(),this._Label4_i(),this.label_impluse_y_i(),this._Label5_i(),this.label_wind_i(),this._Label6_i(),this.label_floor_restitution_i(),this._Label7_i(),this.label_right_restitution_i(),this._Label8_i(),this.label_left_restitution_i(),this._Label9_i(),this.label_board_restitution_i(),this.btn_ok_i(),this.btn_reset_i()];
		return t;
	};
	_proto.m_bg0_i = function () {
		var t = new eui.Image();
		this.m_bg0 = t;
		t.bottom = 0;
		t.fillMode = "scale";
		t.height = 1136;
		t.left = 0;
		t.right = 0;
		t.source = "bg2_jpg";
		t.top = 0;
		t.width = 640;
		return t;
	};
	_proto.btn_close_i = function () {
		var t = new eui.Button();
		this.btn_close = t;
		t.height = 74;
		t.label = "";
		t.width = 74;
		t.x = 566;
		t.y = 0;
		t.skinName = Setting$Skin2;
		return t;
	};
	_proto._Label1_i = function () {
		var t = new eui.Label();
		t.text = "重力：";
		t.textColor = 0x0a0909;
		t.x = 251;
		t.y = 204;
		return t;
	};
	_proto.label_gravity_i = function () {
		var t = new eui.TextInput();
		this.label_gravity = t;
		t.anchorOffsetY = 0;
		t.height = 39.7;
		t.text = "9.8";
		t.width = 200;
		t.x = 366;
		t.y = 196.75;
		return t;
	};
	_proto._Label2_i = function () {
		var t = new eui.Label();
		t.size = 28;
		t.text = "x 最大速度：";
		t.textColor = 0x0A0909;
		t.x = 179;
		t.y = 287.13;
		return t;
	};
	_proto.label_max_x_i = function () {
		var t = new eui.TextInput();
		this.label_max_x = t;
		t.anchorOffsetY = 0;
		t.height = 39.7;
		t.text = "9.8";
		t.width = 200;
		t.x = 366;
		t.y = 277.18;
		return t;
	};
	_proto._Label3_i = function () {
		var t = new eui.Label();
		t.size = 26;
		t.text = "y在负方向最小速度：";
		t.textColor = 0x0A0909;
		t.x = 94;
		t.y = 379.09;
		return t;
	};
	_proto.label_min_y_i = function () {
		var t = new eui.TextInput();
		this.label_min_y = t;
		t.anchorOffsetY = 0;
		t.height = 39.7;
		t.text = "9.8";
		t.width = 200;
		t.x = 366;
		t.y = 365.39;
		return t;
	};
	_proto._Label4_i = function () {
		var t = new eui.Label();
		t.size = 26;
		t.text = "按下 y方向的瞬时加速度：";
		t.textColor = 0x0A0909;
		t.x = 34;
		t.y = 466.23;
		return t;
	};
	_proto.label_impluse_y_i = function () {
		var t = new eui.TextInput();
		this.label_impluse_y = t;
		t.anchorOffsetY = 0;
		t.height = 39.7;
		t.text = "9.8";
		t.width = 200;
		t.x = 366;
		t.y = 457.09;
		return t;
	};
	_proto._Label5_i = function () {
		var t = new eui.Label();
		t.text = "风速：";
		t.textColor = 0x0A0909;
		t.x = 251;
		t.y = 554;
		return t;
	};
	_proto.label_wind_i = function () {
		var t = new eui.TextInput();
		this.label_wind = t;
		t.anchorOffsetY = 0;
		t.height = 39.7;
		t.text = "9.8";
		t.width = 200;
		t.x = 366;
		t.y = 546.54;
		return t;
	};
	_proto._Label6_i = function () {
		var t = new eui.Label();
		t.text = "地面反弹系数：";
		t.textColor = 0x0A0909;
		t.x = 131;
		t.y = 625.33;
		return t;
	};
	_proto.label_floor_restitution_i = function () {
		var t = new eui.TextInput();
		this.label_floor_restitution = t;
		t.anchorOffsetY = 0;
		t.height = 39.7;
		t.text = "9.8";
		t.width = 200;
		t.x = 366;
		t.y = 615.63;
		return t;
	};
	_proto._Label7_i = function () {
		var t = new eui.Label();
		t.text = "篮板前沿反弹系数：";
		t.textColor = 0x0A0909;
		t.x = 71;
		t.y = 691.39;
		return t;
	};
	_proto.label_right_restitution_i = function () {
		var t = new eui.TextInput();
		this.label_right_restitution = t;
		t.anchorOffsetY = 0;
		t.height = 39.7;
		t.text = "9.8";
		t.width = 200;
		t.x = 366;
		t.y = 681.69;
		return t;
	};
	_proto._Label8_i = function () {
		var t = new eui.Label();
		t.text = "篮板后沿反弹系数：";
		t.textColor = 0x0A0909;
		t.x = 71;
		t.y = 750.48;
		return t;
	};
	_proto.label_left_restitution_i = function () {
		var t = new eui.TextInput();
		this.label_left_restitution = t;
		t.anchorOffsetY = 0;
		t.height = 39.7;
		t.text = "9.8";
		t.width = 200;
		t.x = 366;
		t.y = 740.78;
		return t;
	};
	_proto._Label9_i = function () {
		var t = new eui.Label();
		t.text = "篮板挡板反弹系数：";
		t.textColor = 0x0A0909;
		t.x = 71;
		t.y = 821.57;
		return t;
	};
	_proto.label_board_restitution_i = function () {
		var t = new eui.TextInput();
		this.label_board_restitution = t;
		t.anchorOffsetY = 0;
		t.height = 39.7;
		t.text = "9.8";
		t.width = 200;
		t.x = 366;
		t.y = 811.87;
		return t;
	};
	_proto.btn_ok_i = function () {
		var t = new eui.Button();
		this.btn_ok = t;
		t.anchorOffsetX = 0;
		t.height = 74;
		t.label = "确定";
		t.scaleX = 1;
		t.scaleY = 1;
		t.width = 228;
		t.x = 206;
		t.y = 995.97;
		t.skinName = Setting$Skin3;
		return t;
	};
	_proto.btn_reset_i = function () {
		var t = new eui.Button();
		this.btn_reset = t;
		t.anchorOffsetX = 0;
		t.height = 74;
		t.label = "还原初始版本";
		t.scaleX = 1;
		t.scaleY = 1;
		t.width = 228;
		t.x = 192.8;
		t.y = 903.54;
		t.skinName = Setting$Skin4;
		return t;
	};
	return Setting;
})(eui.Skin);generateEUI.paths['resource/eui_skins/TextInputSkin.exml'] = window.skins.TextInputSkin = (function (_super) {
	__extends(TextInputSkin, _super);
	function TextInputSkin() {
		_super.call(this);
		this.skinParts = ["textDisplay","promptDisplay"];
		
		this.minHeight = 40;
		this.minWidth = 300;
		this.elementsContent = [this._Image1_i(),this._Rect1_i(),this.textDisplay_i()];
		this.promptDisplay_i();
		
		this.states = [
			new eui.State ("normal",
				[
				])
			,
			new eui.State ("disabled",
				[
					new eui.SetProperty("textDisplay","textColor",0xff0000)
				])
			,
			new eui.State ("normalWithPrompt",
				[
					new eui.AddItems("promptDisplay","",1,"")
				])
			,
			new eui.State ("disabledWithPrompt",
				[
					new eui.AddItems("promptDisplay","",1,"")
				])
		];
	}
	var _proto = TextInputSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.percentHeight = 100;
		t.scale9Grid = new egret.Rectangle(1,3,8,8);
		t.source = "button_up_png";
		t.percentWidth = 100;
		return t;
	};
	_proto._Rect1_i = function () {
		var t = new eui.Rect();
		t.fillColor = 0xffffff;
		t.percentHeight = 100;
		t.percentWidth = 100;
		return t;
	};
	_proto.textDisplay_i = function () {
		var t = new eui.EditableText();
		this.textDisplay = t;
		t.height = 24;
		t.left = "10";
		t.right = "10";
		t.size = 20;
		t.textColor = 0x000000;
		t.verticalCenter = "0";
		t.percentWidth = 100;
		return t;
	};
	_proto.promptDisplay_i = function () {
		var t = new eui.Label();
		this.promptDisplay = t;
		t.height = 24;
		t.left = 10;
		t.right = 10;
		t.size = 20;
		t.textColor = 0xa9a9a9;
		t.touchEnabled = false;
		t.verticalCenter = 0;
		t.percentWidth = 100;
		return t;
	};
	return TextInputSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/ToggleSwitchSkin.exml'] = window.skins.ToggleSwitchSkin = (function (_super) {
	__extends(ToggleSwitchSkin, _super);
	function ToggleSwitchSkin() {
		_super.call(this);
		this.skinParts = [];
		
		this.elementsContent = [this._Image1_i(),this._Image2_i()];
		this.states = [
			new eui.State ("up",
				[
					new eui.SetProperty("_Image1","source","off_png")
				])
			,
			new eui.State ("down",
				[
					new eui.SetProperty("_Image1","source","off_png")
				])
			,
			new eui.State ("disabled",
				[
					new eui.SetProperty("_Image1","source","off_png")
				])
			,
			new eui.State ("upAndSelected",
				[
					new eui.SetProperty("_Image2","horizontalCenter",18)
				])
			,
			new eui.State ("downAndSelected",
				[
					new eui.SetProperty("_Image2","horizontalCenter",18)
				])
			,
			new eui.State ("disabledAndSelected",
				[
					new eui.SetProperty("_Image2","horizontalCenter",18)
				])
		];
	}
	var _proto = ToggleSwitchSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		this._Image1 = t;
		t.source = "on_png";
		return t;
	};
	_proto._Image2_i = function () {
		var t = new eui.Image();
		this._Image2 = t;
		t.horizontalCenter = -18;
		t.source = "handle_png";
		t.verticalCenter = 0;
		return t;
	};
	return ToggleSwitchSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/VScrollBarSkin.exml'] = window.skins.VScrollBarSkin = (function (_super) {
	__extends(VScrollBarSkin, _super);
	function VScrollBarSkin() {
		_super.call(this);
		this.skinParts = ["thumb"];
		
		this.minHeight = 20;
		this.minWidth = 8;
		this.elementsContent = [this.thumb_i()];
	}
	var _proto = VScrollBarSkin.prototype;

	_proto.thumb_i = function () {
		var t = new eui.Image();
		this.thumb = t;
		t.height = 30;
		t.horizontalCenter = 0;
		t.scale9Grid = new egret.Rectangle(3,3,2,2);
		t.source = "roundthumb_png";
		t.width = 8;
		return t;
	};
	return VScrollBarSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/VSliderSkin.exml'] = window.skins.VSliderSkin = (function (_super) {
	__extends(VSliderSkin, _super);
	function VSliderSkin() {
		_super.call(this);
		this.skinParts = ["track","thumb"];
		
		this.minHeight = 30;
		this.minWidth = 25;
		this.elementsContent = [this.track_i(),this.thumb_i()];
	}
	var _proto = VSliderSkin.prototype;

	_proto.track_i = function () {
		var t = new eui.Image();
		this.track = t;
		t.percentHeight = 100;
		t.horizontalCenter = 0;
		t.scale9Grid = new egret.Rectangle(1,1,4,4);
		t.source = "track_png";
		t.width = 7;
		return t;
	};
	_proto.thumb_i = function () {
		var t = new eui.Image();
		this.thumb = t;
		t.horizontalCenter = 0;
		t.source = "thumb_png";
		return t;
	};
	return VSliderSkin;
})(eui.Skin);