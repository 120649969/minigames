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
})(eui.Skin);generateEUI.paths['resource/eui_skins/KnifeSkin.exml'] = window.KnifeSkin = (function (_super) {
	__extends(KnifeSkin, _super);
	function KnifeSkin() {
		_super.call(this);
		this.skinParts = ["behit_rect","m_img_1","m_img_2","m_img_3","hit_rect","testLabel","hit_ball_rect"];
		
		this.height = 211.4;
		this.width = 52;
		this.elementsContent = [this.behit_rect_i(),this.m_img_1_i(),this.m_img_2_i(),this.m_img_3_i(),this.hit_rect_i(),this.testLabel_i(),this.hit_ball_rect_i()];
	}
	var _proto = KnifeSkin.prototype;

	_proto.behit_rect_i = function () {
		var t = new eui.Rect();
		this.behit_rect = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.fillAlpha = 0.6;
		t.fillColor = 0x0f0d0d;
		t.height = 86;
		t.strokeAlpha = 0.3;
		t.visible = false;
		t.width = 51.4;
		t.x = 0.8;
		t.y = 127;
		return t;
	};
	_proto.m_img_1_i = function () {
		var t = new eui.Image();
		this.m_img_1 = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.rotation = 0;
		t.source = "knifeicon1_png";
		t.x = 0;
		t.y = 0;
		return t;
	};
	_proto.m_img_2_i = function () {
		var t = new eui.Image();
		this.m_img_2 = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.rotation = 0;
		t.source = "knifeicon2_png";
		t.x = 0;
		t.y = 0;
		return t;
	};
	_proto.m_img_3_i = function () {
		var t = new eui.Image();
		this.m_img_3 = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.rotation = 0;
		t.source = "knifeicon3_png";
		t.x = 0;
		t.y = 0;
		return t;
	};
	_proto.hit_rect_i = function () {
		var t = new eui.Rect();
		this.hit_rect = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.fillAlpha = 0.6;
		t.fillColor = 0xea1919;
		t.height = 123;
		t.strokeAlpha = 0.3;
		t.visible = false;
		t.width = 42;
		t.x = 10.2;
		t.y = 0;
		return t;
	};
	_proto.testLabel_i = function () {
		var t = new eui.Label();
		this.testLabel = t;
		t.horizontalCenter = 0;
		t.text = "";
		t.textColor = 0xdb1515;
		t.verticalCenter = 71.5;
		t.visible = false;
		return t;
	};
	_proto.hit_ball_rect_i = function () {
		var t = new eui.Rect();
		this.hit_ball_rect = t;
		t.height = 5;
		t.visible = false;
		t.width = 5;
		t.x = 24;
		t.y = 103;
		return t;
	};
	return KnifeSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/MainSceneSkin.exml'] = window.MainSceneSkin = (function (_super) {
	__extends(MainSceneSkin, _super);
	var MainSceneSkin$Skin1 = 	(function (_super) {
		__extends(MainSceneSkin$Skin1, _super);
		function MainSceneSkin$Skin1() {
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
						new eui.SetProperty("_Image1","source","prop_png")
					])
				,
				new eui.State ("disabled",
					[
						new eui.SetProperty("_Image1","source","prop_png")
					])
			];
		}
		var _proto = MainSceneSkin$Skin1.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			this._Image1 = t;
			t.percentHeight = 100;
			t.source = "prop_png";
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
		return MainSceneSkin$Skin1;
	})(eui.Skin);

	function MainSceneSkin() {
		_super.call(this);
		this.skinParts = ["fly_up","m_example_knife","m_container_layer","m_broken_plate_container","m_plate_image","m_plate_container","m_copy_plat_container","m_place_feng","m_offline_tips","label_tips_round","m_round_change","m_touch_layer","btn_debug","btn_prop_knife","label_left_time","img_other_icon_bg","img_other_icon","label_other_round","label_other_name","img_me_icon_bg","img_me_icon","label_me_round","label_me_name","img_help","prop_effect_other_1","prop_effect_other_2","prop_my_effect_1","prop_my_effect_2","prop_my_effect_3","m_top_ui","img_knife_1","img_knife_2","img_knife_3","img_knife_4","img_knife_5","img_knife_6","img_knife_7","img_knife_8","img_knife_9","img_knife_10","btn_help"];
		
		this.height = 1280;
		this.width = 720;
		this.fly_up_i();
		this.elementsContent = [this._Image1_i(),this.m_container_layer_i(),this._Group1_i(),this._Group2_i(),this.m_touch_layer_i(),this.btn_debug_i(),this.m_top_ui_i(),this._Group5_i()];
		
		eui.Binding.$bindProperties(this, ["hostComponent.labelResult"],[0],this._TweenItem1,"target");
		eui.Binding.$bindProperties(this, [0],[],this._Object1,"scaleX");
		eui.Binding.$bindProperties(this, [0],[],this._Object1,"scaleY");
		eui.Binding.$bindProperties(this, [1.2],[],this._Object2,"scaleX");
		eui.Binding.$bindProperties(this, [1.2],[],this._Object2,"scaleY");
		eui.Binding.$bindProperties(this, [1],[],this._Object3,"scaleX");
		eui.Binding.$bindProperties(this, [1],[],this._Object3,"scaleY");
		eui.Binding.$bindProperties(this, [0],[],this._Object4,"alpha");
		eui.Binding.$bindProperties(this, [292.67],[],this._Object4,"y");
	}
	var _proto = MainSceneSkin.prototype;

	_proto.fly_up_i = function () {
		var t = new egret.tween.TweenGroup();
		this.fly_up = t;
		t.items = [this._TweenItem1_i()];
		return t;
	};
	_proto._TweenItem1_i = function () {
		var t = new egret.tween.TweenItem();
		this._TweenItem1 = t;
		t.paths = [this._Set1_i(),this._To1_i(),this._To2_i(),this._Wait1_i(),this._Set2_i(),this._To3_i()];
		return t;
	};
	_proto._Set1_i = function () {
		var t = new egret.tween.Set();
		t.props = this._Object1_i();
		return t;
	};
	_proto._Object1_i = function () {
		var t = {};
		this._Object1 = t;
		return t;
	};
	_proto._To1_i = function () {
		var t = new egret.tween.To();
		t.duration = 250;
		t.props = this._Object2_i();
		return t;
	};
	_proto._Object2_i = function () {
		var t = {};
		this._Object2 = t;
		return t;
	};
	_proto._To2_i = function () {
		var t = new egret.tween.To();
		t.duration = 100;
		t.props = this._Object3_i();
		return t;
	};
	_proto._Object3_i = function () {
		var t = {};
		this._Object3 = t;
		return t;
	};
	_proto._Wait1_i = function () {
		var t = new egret.tween.Wait();
		t.duration = 550;
		return t;
	};
	_proto._Set2_i = function () {
		var t = new egret.tween.Set();
		return t;
	};
	_proto._To3_i = function () {
		var t = new egret.tween.To();
		t.duration = 400;
		t.props = this._Object4_i();
		return t;
	};
	_proto._Object4_i = function () {
		var t = {};
		this._Object4 = t;
		return t;
	};
	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.source = "bg_jpg";
		t.top = 0;
		return t;
	};
	_proto.m_container_layer_i = function () {
		var t = new eui.Group();
		this.m_container_layer = t;
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		t.touchEnabled = false;
		t.elementsContent = [this.m_example_knife_i()];
		return t;
	};
	_proto.m_example_knife_i = function () {
		var t = new eui.Image();
		this.m_example_knife = t;
		t.anchorOffsetX = 0;
		t.horizontalCenter = 0;
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "knifeicon1_png";
		t.visible = false;
		t.x = 334;
		t.y = 920.0000000000001;
		return t;
	};
	_proto._Group1_i = function () {
		var t = new eui.Group();
		t.anchorOffsetY = 0;
		t.bottom = 608;
		t.left = 0;
		t.right = 0;
		t.top = 328;
		t.touchEnabled = false;
		t.elementsContent = [this.m_broken_plate_container_i(),this.m_plate_container_i(),this.m_copy_plat_container_i(),this.m_place_feng_i()];
		return t;
	};
	_proto.m_broken_plate_container_i = function () {
		var t = new eui.Group();
		this.m_broken_plate_container = t;
		t.anchorOffsetX = 173;
		t.anchorOffsetY = 173;
		t.height = 347;
		t.rotation = 0;
		t.scaleX = 1;
		t.scaleY = 1;
		t.touchEnabled = false;
		t.width = 347;
		t.x = 360;
		t.y = 175;
		return t;
	};
	_proto.m_plate_container_i = function () {
		var t = new eui.Group();
		this.m_plate_container = t;
		t.anchorOffsetX = 173;
		t.anchorOffsetY = 173;
		t.height = 347;
		t.rotation = 0;
		t.scaleX = 1;
		t.scaleY = 1;
		t.touchEnabled = false;
		t.width = 347;
		t.x = 360;
		t.y = 175;
		t.elementsContent = [this.m_plate_image_i()];
		return t;
	};
	_proto.m_plate_image_i = function () {
		var t = new eui.Image();
		this.m_plate_image = t;
		t.anchorOffsetX = 173;
		t.anchorOffsetY = 173;
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.rotation = 0;
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "ball1_png";
		t.top = 0;
		return t;
	};
	_proto.m_copy_plat_container_i = function () {
		var t = new eui.Group();
		this.m_copy_plat_container = t;
		t.anchorOffsetX = 173;
		t.anchorOffsetY = 173;
		t.height = 347;
		t.rotation = 0;
		t.scaleX = 1;
		t.scaleY = 1;
		t.touchEnabled = false;
		t.width = 347;
		t.x = 360;
		t.y = 175;
		return t;
	};
	_proto.m_place_feng_i = function () {
		var t = new eui.Group();
		this.m_place_feng = t;
		t.anchorOffsetX = 100;
		t.anchorOffsetY = 100;
		t.height = 200;
		t.scaleX = 1;
		t.scaleY = 1;
		t.width = 200;
		t.x = 360;
		t.y = 314;
		return t;
	};
	_proto._Group2_i = function () {
		var t = new eui.Group();
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		t.touchEnabled = false;
		t.elementsContent = [this.m_offline_tips_i(),this.m_round_change_i()];
		return t;
	};
	_proto.m_offline_tips_i = function () {
		var t = new eui.Group();
		this.m_offline_tips = t;
		t.height = 50;
		t.visible = false;
		t.width = 505;
		t.x = 95;
		t.y = 429;
		t.elementsContent = [this._Rect1_i(),this._Label1_i()];
		return t;
	};
	_proto._Rect1_i = function () {
		var t = new eui.Rect();
		t.bottom = 0;
		t.fillAlpha = 0.5;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		return t;
	};
	_proto._Label1_i = function () {
		var t = new eui.Label();
		t.scaleX = 1;
		t.scaleY = 1;
		t.text = "توردىن ئازراق مەسىلە چىقتى ، سەل ساقلاڭ ";
		t.x = 31;
		t.y = 10;
		return t;
	};
	_proto.m_round_change_i = function () {
		var t = new eui.Group();
		this.m_round_change = t;
		t.anchorOffsetY = 0;
		t.height = 60;
		t.horizontalCenter = -10;
		t.verticalCenter = 58;
		t.visible = false;
		t.width = 200;
		t.elementsContent = [this._Label2_i(),this.label_tips_round_i()];
		return t;
	};
	_proto._Label2_i = function () {
		var t = new eui.Label();
		t.scaleX = 1;
		t.scaleY = 1;
		t.size = 40;
		t.text = "ئۆتكەل - ";
		t.x = 18.5;
		t.y = 10;
		return t;
	};
	_proto.label_tips_round_i = function () {
		var t = new eui.Label();
		this.label_tips_round = t;
		t.scaleX = 1;
		t.scaleY = 1;
		t.size = 40;
		t.text = "10";
		t.x = 145.25;
		t.y = 10;
		return t;
	};
	_proto.m_touch_layer_i = function () {
		var t = new eui.Group();
		this.m_touch_layer = t;
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		return t;
	};
	_proto.btn_debug_i = function () {
		var t = new eui.Button();
		this.btn_debug = t;
		t.label = "调试按钮";
		t.right = 1;
		t.scaleX = 1;
		t.scaleY = 1;
		t.verticalCenter = -343;
		t.visible = false;
		return t;
	};
	_proto.m_top_ui_i = function () {
		var t = new eui.Group();
		this.m_top_ui = t;
		t.anchorOffsetY = 0;
		t.height = 272.55;
		t.left = 0;
		t.right = 0;
		t.touchEnabled = false;
		t.y = 50;
		t.elementsContent = [this.btn_prop_knife_i(),this._Image2_i(),this.label_left_time_i(),this._Group3_i(),this._Group4_i(),this.img_help_i(),this.prop_effect_other_1_i(),this.prop_effect_other_2_i(),this.prop_my_effect_1_i(),this.prop_my_effect_2_i(),this.prop_my_effect_3_i()];
		return t;
	};
	_proto.btn_prop_knife_i = function () {
		var t = new eui.Button();
		this.btn_prop_knife = t;
		t.label = "别人插入刀";
		t.left = 0;
		t.scaleX = 1;
		t.scaleY = 1;
		t.verticalCenter = 0;
		t.visible = false;
		return t;
	};
	_proto._Image2_i = function () {
		var t = new eui.Image();
		t.source = "pk_bg_png";
		t.x = 307.27;
		t.y = 85.67;
		return t;
	};
	_proto.label_left_time_i = function () {
		var t = new eui.BitmapLabel();
		this.label_left_time = t;
		t.anchorOffsetX = 76.5;
		t.anchorOffsetY = 38;
		t.font = "knife_font_fnt";
		t.height = 76;
		t.horizontalCenter = 13.5;
		t.scaleX = 1;
		t.scaleY = 1;
		t.text = "80";
		t.textAlign = "center";
		t.width = 153;
		t.y = 137.83;
		return t;
	};
	_proto._Group3_i = function () {
		var t = new eui.Group();
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 199.67;
		t.left = 0;
		t.scaleX = 1;
		t.scaleY = 1;
		t.top = 0;
		t.touchEnabled = false;
		t.width = 315;
		t.elementsContent = [this._Image3_i(),this.img_other_icon_bg_i(),this.img_other_icon_i(),this._Image4_i(),this._Label3_i(),this.label_other_round_i(),this.label_other_name_i()];
		return t;
	};
	_proto._Image3_i = function () {
		var t = new eui.Image();
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "title_bg_png";
		t.x = 119.79;
		t.y = 40.24;
		return t;
	};
	_proto.img_other_icon_bg_i = function () {
		var t = new eui.Image();
		this.img_other_icon_bg = t;
		t.height = 96;
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "frame1_png";
		t.x = 34;
		t.y = 7;
		return t;
	};
	_proto.img_other_icon_i = function () {
		var t = new eui.Image();
		this.img_other_icon = t;
		t.anchorOffsetX = 47;
		t.anchorOffsetY = 47;
		t.height = 94;
		t.source = "";
		t.width = 94;
		t.x = 82;
		t.y = 53.5;
		return t;
	};
	_proto._Image4_i = function () {
		var t = new eui.Image();
		t.source = "title_bg1_png";
		t.x = 0.67;
		t.y = 111.67;
		return t;
	};
	_proto._Label3_i = function () {
		var t = new eui.Label();
		t.size = 34;
		t.text = "ئۆتكەل - ";
		t.x = 94.73;
		t.y = 124.17;
		return t;
	};
	_proto.label_other_round_i = function () {
		var t = new eui.Label();
		this.label_other_round = t;
		t.anchorOffsetY = 17;
		t.size = 34;
		t.text = "12";
		t.textAlign = "left";
		t.x = 194.78;
		t.y = 142.17;
		return t;
	};
	_proto.label_other_name_i = function () {
		var t = new eui.Label();
		this.label_other_name = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 13;
		t.height = 26;
		t.size = 22;
		t.text = "你的名字名字";
		t.textAlign = "left";
		t.verticalAlign = "middle";
		t.width = 138.53;
		t.x = 132;
		t.y = 58.74;
		return t;
	};
	_proto._Group4_i = function () {
		var t = new eui.Group();
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 199.67;
		t.right = 0;
		t.scaleX = 1;
		t.scaleY = 1;
		t.top = 0;
		t.touchEnabled = false;
		t.width = 315;
		t.elementsContent = [this._Image5_i(),this.img_me_icon_bg_i(),this.img_me_icon_i(),this._Image6_i(),this._Label4_i(),this.label_me_round_i(),this.label_me_name_i()];
		return t;
	};
	_proto._Image5_i = function () {
		var t = new eui.Image();
		t.scaleX = -1;
		t.scaleY = 1;
		t.source = "title_bg_png";
		t.x = 207.4;
		t.y = 43;
		return t;
	};
	_proto.img_me_icon_bg_i = function () {
		var t = new eui.Image();
		this.img_me_icon_bg = t;
		t.height = 96;
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "frame1_png";
		t.x = 196;
		t.y = 10;
		return t;
	};
	_proto.img_me_icon_i = function () {
		var t = new eui.Image();
		this.img_me_icon = t;
		t.anchorOffsetX = 47;
		t.anchorOffsetY = 47;
		t.height = 94;
		t.source = "";
		t.width = 94;
		t.x = 244;
		t.y = 55.5;
		return t;
	};
	_proto._Image6_i = function () {
		var t = new eui.Image();
		t.anchorOffsetX = 287;
		t.right = 0;
		t.source = "title_bg2_png";
		t.y = 111.67;
		return t;
	};
	_proto._Label4_i = function () {
		var t = new eui.Label();
		t.size = 34;
		t.text = "ئۆتكەل - ";
		t.x = 80.66;
		t.y = 123.5;
		return t;
	};
	_proto.label_me_round_i = function () {
		var t = new eui.Label();
		this.label_me_round = t;
		t.anchorOffsetY = 17;
		t.scaleX = 1;
		t.scaleY = 1;
		t.size = 34;
		t.text = "10";
		t.textAlign = "left";
		t.x = 183.19;
		t.y = 142;
		return t;
	};
	_proto.label_me_name_i = function () {
		var t = new eui.Label();
		this.label_me_name = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 12.75;
		t.height = 25.5;
		t.scaleX = 1;
		t.scaleY = 1;
		t.size = 22;
		t.text = "我的名字名字";
		t.textAlign = "right";
		t.verticalAlign = "middle";
		t.width = 137.9;
		t.x = 59;
		t.y = 63.14;
		return t;
	};
	_proto.img_help_i = function () {
		var t = new eui.Image();
		this.img_help = t;
		t.anchorOffsetY = 400;
		t.scaleX = 0.9000000000000001;
		t.scaleY = 0.9000000000000001;
		t.source = "help_png";
		t.visible = false;
		t.x = 100;
		t.y = 469;
		return t;
	};
	_proto.prop_effect_other_1_i = function () {
		var t = new eui.Image();
		this.prop_effect_other_1 = t;
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "word1_png";
		t.visible = false;
		t.x = 0;
		t.y = 168;
		return t;
	};
	_proto.prop_effect_other_2_i = function () {
		var t = new eui.Image();
		this.prop_effect_other_2 = t;
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "word2_png";
		t.visible = false;
		t.x = 0;
		t.y = 168;
		return t;
	};
	_proto.prop_my_effect_1_i = function () {
		var t = new eui.Image();
		this.prop_my_effect_1 = t;
		t.anchorOffsetX = 280;
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "word3_png";
		t.visible = false;
		t.x = 439;
		t.y = 168;
		return t;
	};
	_proto.prop_my_effect_2_i = function () {
		var t = new eui.Image();
		this.prop_my_effect_2 = t;
		t.anchorOffsetX = 355;
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "word4_png";
		t.visible = false;
		t.x = 10;
		t.y = 168;
		return t;
	};
	_proto.prop_my_effect_3_i = function () {
		var t = new eui.Image();
		this.prop_my_effect_3 = t;
		t.anchorOffsetX = 298;
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "word5_png";
		t.visible = false;
		t.x = 123;
		t.y = 168;
		return t;
	};
	_proto._Group5_i = function () {
		var t = new eui.Group();
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 283.5;
		t.height = 567;
		t.verticalCenter = 223.5;
		t.width = 86;
		t.x = 15.87;
		t.elementsContent = [this.img_knife_1_i(),this.img_knife_2_i(),this.img_knife_3_i(),this.img_knife_4_i(),this.img_knife_5_i(),this.img_knife_6_i(),this.img_knife_7_i(),this.img_knife_8_i(),this.img_knife_9_i(),this.img_knife_10_i(),this.btn_help_i()];
		return t;
	};
	_proto.img_knife_1_i = function () {
		var t = new eui.Image();
		this.img_knife_1 = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 74.45;
		t.rotation = 0;
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "knifeicon11_png";
		t.visible = false;
		t.width = 32.11;
		t.x = 25;
		t.y = 2;
		return t;
	};
	_proto.img_knife_2_i = function () {
		var t = new eui.Image();
		this.img_knife_2 = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 74.45;
		t.rotation = 0;
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "knifeicon11_png";
		t.visible = false;
		t.width = 32.11;
		t.x = 25;
		t.y = 56.22;
		return t;
	};
	_proto.img_knife_3_i = function () {
		var t = new eui.Image();
		this.img_knife_3 = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 74.45;
		t.rotation = 0;
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "knifeicon11_png";
		t.visible = false;
		t.width = 32.11;
		t.x = 25;
		t.y = 110.44;
		return t;
	};
	_proto.img_knife_4_i = function () {
		var t = new eui.Image();
		this.img_knife_4 = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 74.45;
		t.rotation = 0;
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "knifeicon11_png";
		t.visible = false;
		t.width = 32.11;
		t.x = 25;
		t.y = 164.67;
		return t;
	};
	_proto.img_knife_5_i = function () {
		var t = new eui.Image();
		this.img_knife_5 = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 74.45;
		t.rotation = 0;
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "knifeicon11_png";
		t.visible = false;
		t.width = 32.11;
		t.x = 25;
		t.y = 218.89;
		return t;
	};
	_proto.img_knife_6_i = function () {
		var t = new eui.Image();
		this.img_knife_6 = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 74.45;
		t.rotation = 0;
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "knifeicon11_png";
		t.visible = false;
		t.width = 32.11;
		t.x = 25;
		t.y = 272.11;
		return t;
	};
	_proto.img_knife_7_i = function () {
		var t = new eui.Image();
		this.img_knife_7 = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 74.45;
		t.rotation = 0;
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "knifeicon11_png";
		t.visible = false;
		t.width = 32.11;
		t.x = 25;
		t.y = 326.33;
		return t;
	};
	_proto.img_knife_8_i = function () {
		var t = new eui.Image();
		this.img_knife_8 = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 74.45;
		t.rotation = 0;
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "knifeicon11_png";
		t.visible = false;
		t.width = 32.11;
		t.x = 25;
		t.y = 380.56;
		return t;
	};
	_proto.img_knife_9_i = function () {
		var t = new eui.Image();
		this.img_knife_9 = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 74.45;
		t.rotation = 0;
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "knifeicon11_png";
		t.visible = false;
		t.width = 32.11;
		t.x = 25;
		t.y = 434.78;
		return t;
	};
	_proto.img_knife_10_i = function () {
		var t = new eui.Image();
		this.img_knife_10 = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 74.45;
		t.rotation = 0;
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "knifeicon11_png";
		t.visible = false;
		t.width = 32.11;
		t.x = 25;
		t.y = 489.33;
		return t;
	};
	_proto.btn_help_i = function () {
		var t = new eui.Button();
		this.btn_help = t;
		t.height = 56;
		t.label = "";
		t.scaleX = 1;
		t.scaleY = 1;
		t.visible = false;
		t.width = 56;
		t.x = 13.050000000000002;
		t.y = -80.63999999999999;
		t.skinName = MainSceneSkin$Skin1;
		return t;
	};
	return MainSceneSkin;
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
})(eui.Skin);generateEUI.paths['resource/eui_skins/PropSkin.exml'] = window.PropSkin = (function (_super) {
	__extends(PropSkin, _super);
	function PropSkin() {
		_super.call(this);
		this.skinParts = ["behit_rect","img"];
		
		this.height = 56;
		this.width = 98;
		this.elementsContent = [this.behit_rect_i(),this.img_i()];
	}
	var _proto = PropSkin.prototype;

	_proto.behit_rect_i = function () {
		var t = new eui.Rect();
		this.behit_rect = t;
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		t.visible = false;
		return t;
	};
	_proto.img_i = function () {
		var t = new eui.Image();
		this.img = t;
		t.height = 56;
		t.scaleY = -1;
		t.source = "prop2_png";
		t.width = 98;
		t.x = 0;
		t.y = 56;
		return t;
	};
	return PropSkin;
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
})(eui.Skin);generateEUI.paths['resource/eui_skins/SettingItemSkin.exml'] = window.SettingItemSkin = (function (_super) {
	__extends(SettingItemSkin, _super);
	function SettingItemSkin() {
		_super.call(this);
		this.skinParts = ["edit_duration","edit_fadetime","edit_speed","btn_delete"];
		
		this.height = 122;
		this.width = 405;
		this.elementsContent = [this._Rect1_i(),this.edit_duration_i(),this._Label1_i(),this.edit_fadetime_i(),this._Label2_i(),this.edit_speed_i(),this._Label3_i(),this.btn_delete_i()];
	}
	var _proto = SettingItemSkin.prototype;

	_proto._Rect1_i = function () {
		var t = new eui.Rect();
		t.bottom = 0;
		t.fillColor = 0x563838;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		return t;
	};
	_proto.edit_duration_i = function () {
		var t = new eui.EditableText();
		this.edit_duration = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 17;
		t.height = 34;
		t.size = 20;
		t.text = "10";
		t.verticalAlign = "middle";
		t.width = 100;
		t.x = 103;
		t.y = 26;
		return t;
	};
	_proto._Label1_i = function () {
		var t = new eui.Label();
		t.size = 20;
		t.text = "持续时间：";
		t.x = 3;
		t.y = 16;
		return t;
	};
	_proto.edit_fadetime_i = function () {
		var t = new eui.EditableText();
		this.edit_fadetime = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 17;
		t.height = 34;
		t.size = 20;
		t.text = "10";
		t.verticalAlign = "middle";
		t.width = 100;
		t.x = 103;
		t.y = 60;
		return t;
	};
	_proto._Label2_i = function () {
		var t = new eui.Label();
		t.size = 20;
		t.text = "渐变时间：";
		t.x = 3;
		t.y = 50;
		return t;
	};
	_proto.edit_speed_i = function () {
		var t = new eui.EditableText();
		this.edit_speed = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 17;
		t.height = 34;
		t.size = 20;
		t.text = "10";
		t.verticalAlign = "middle";
		t.width = 100;
		t.x = 103;
		t.y = 95;
		return t;
	};
	_proto._Label3_i = function () {
		var t = new eui.Label();
		t.size = 20;
		t.text = "旋转速度：";
		t.x = 3;
		t.y = 85;
		return t;
	};
	_proto.btn_delete_i = function () {
		var t = new eui.Button();
		this.btn_delete = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 41;
		t.label = "删除配置";
		t.width = 97;
		t.x = 250;
		t.y = 40.5;
		return t;
	};
	return SettingItemSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/SettingSkin.exml'] = window.SettingSkin = (function (_super) {
	__extends(SettingSkin, _super);
	function SettingSkin() {
		_super.call(this);
		this.skinParts = ["btn_close","m_list","m_scroller","btn_add","btn_yes"];
		
		this.height = 1280;
		this.width = 720;
		this.elementsContent = [this._Group1_i(),this._Rect1_i(),this.btn_close_i(),this.m_scroller_i(),this.btn_add_i(),this.btn_yes_i()];
	}
	var _proto = SettingSkin.prototype;

	_proto._Group1_i = function () {
		var t = new eui.Group();
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		t.touchChildren = true;
		t.touchEnabled = true;
		t.touchThrough = false;
		return t;
	};
	_proto._Rect1_i = function () {
		var t = new eui.Rect();
		t.bottom = 0;
		t.fillColor = 0xafa3a3;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		return t;
	};
	_proto.btn_close_i = function () {
		var t = new eui.Button();
		this.btn_close = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 76;
		t.label = "关闭";
		t.width = 238;
		t.x = 479;
		t.y = 0;
		return t;
	};
	_proto.m_scroller_i = function () {
		var t = new eui.Scroller();
		this.m_scroller = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 930;
		t.scrollPolicyH = "off";
		t.scrollPolicyV = "on";
		t.width = 546;
		t.x = 91;
		t.y = 192;
		t.viewport = this.m_list_i();
		return t;
	};
	_proto.m_list_i = function () {
		var t = new eui.List();
		this.m_list = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.itemRendererSkinName = SettingItemSkin;
		t.scaleX = 1;
		t.scaleY = 1;
		t.x = 86;
		t.y = 192;
		return t;
	};
	_proto.btn_add_i = function () {
		var t = new eui.Button();
		this.btn_add = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 76;
		t.label = "添加配置";
		t.width = 238;
		t.x = 225;
		t.y = 98;
		return t;
	};
	_proto.btn_yes_i = function () {
		var t = new eui.Button();
		this.btn_yes = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 76;
		t.label = "确定";
		t.width = 238;
		t.x = 0;
		t.y = 0;
		return t;
	};
	return SettingSkin;
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
})(eui.Skin);