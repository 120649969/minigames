var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var HitConst = (function () {
    function HitConst() {
    }
    HitConst.getHitRestitution = function (hitType) {
        if (hitType == HitType.Floor) {
            return HitConst.floor_restitution;
        }
        if (hitType == HitType.Right_Line) {
            return HitConst.basket_right_line_restitution;
        }
        if (hitType == HitType.Left_Line) {
            return HitConst.basket_left_line_restitution;
        }
        if (hitType == HitType.Board) {
            return HitConst.basket_board_restitution;
        }
        if (hitType == HitType.Board_Top) {
            return HitConst.basket_board_top_down_restitution;
        }
        if (hitType == HitType.Board_Left_Right) {
            return HitConst.basket_board_restitution;
        }
        return 1;
    };
    HitConst.getHitFriction = function (hitType) {
        if (hitType == HitType.Floor) {
            return HitConst.floor_friction;
        }
        if (hitType == HitType.Right_Line) {
            return HitConst.basket_right_line_friction;
        }
        if (hitType == HitType.Left_Line) {
            return HitConst.basket_left_line_friction;
        }
        if (hitType == HitType.Board) {
            return HitConst.basket_board_friction;
        }
        if (hitType == HitType.Board_Top) {
            return HitConst.basket_board_friction;
        }
        if (hitType == HitType.Board_Left_Right) {
            return HitConst.basket_board_friction;
        }
        return 1.0;
    };
    HitConst.SwapPoint = function (point1, point2) {
        var temp_point_x = point1.x;
        var temp_point_y = point1.y;
        point1.x = point2.x;
        point1.y = point2.y;
        point2.x = temp_point_x;
        point2.y = temp_point_y;
    };
    HitConst.SwapPointXY = function (left_top_point, right_down) {
        var left_x = right_down.x;
        var left_y = left_top_point.y;
        var right_x = left_top_point.x;
        var right_y = right_down.y;
        left_top_point.x = left_x;
        left_top_point.y = left_y;
        right_down.x = right_x;
        right_down.y = right_y;
    };
    HitConst.floor_restitution = -0.7; //地面反弹系数，反弹会改变方向，所以要改成负数
    HitConst.floor_friction = 1.0; //地面摩擦系数
    HitConst.basket_right_line_restitution = -0.5; //篮筐前沿反弹系数
    HitConst.basket_right_line_friction = 1.0; //篮筐前沿摩擦系数
    HitConst.basket_left_line_restitution = -0.5; //篮筐后沿反弹系数
    HitConst.basket_left_line_friction = 1.0; //篮筐后沿摩擦系数 
    HitConst.basket_board_restitution = -0.26; //篮框后方挡板反弹系数
    HitConst.basket_board_friction = 1.0; //篮框后方挡板摩擦系数 
    HitConst.basket_board_top_down_restitution = -0.7; //篮框顶部挡板反弹系数
    HitConst.Factor = 8; //米和像素的转换单位
    HitConst.Gravity = 9.8; //重力加速度
    HitConst.Max_Speed_X = 6 * HitConst.Factor; //x方向的速度
    HitConst.MIN_SPEED_Y = -20 * HitConst.Factor; //y在负方向最小的速度
    HitConst.PUSH_DOWN_IMPLUSE_Y = -20 * HitConst.Factor; //按下y方向的瞬时加速度
    // public static Frame_Speed_X:number = 4  //每帧影响x方向速度的风速
    HitConst.Frame_Speed_X = 0 * HitConst.Factor; //每帧影响x方向速度的风速
    HitConst.BACK_Gravity = HitConst.Gravity;
    HitConst.BACK_Max_Speed_X = HitConst.Max_Speed_X;
    HitConst.BACK_MIN_SPEED_Y = HitConst.MIN_SPEED_Y;
    HitConst.BACK_PUSH_DOWN_IMPLUSE_Y = HitConst.PUSH_DOWN_IMPLUSE_Y;
    HitConst.BACK_Frame_Speed_X = HitConst.Frame_Speed_X;
    HitConst.BACK_floor_restitution = HitConst.floor_restitution;
    HitConst.BACK_basket_right_line_restitution = HitConst.basket_right_line_restitution;
    HitConst.BACK_basket_left_line_restitution = HitConst.basket_left_line_restitution;
    HitConst.BACK_basket_board_restitution = HitConst.basket_board_restitution;
    return HitConst;
}());
__reflect(HitConst.prototype, "HitConst");
var HitType;
(function (HitType) {
    HitType[HitType["Floor"] = 0] = "Floor";
    HitType[HitType["Right_Line"] = 1] = "Right_Line";
    HitType[HitType["Left_Line"] = 2] = "Left_Line";
    HitType[HitType["Board"] = 3] = "Board";
    HitType[HitType["Board_Left_Right"] = 4] = "Board_Left_Right";
    HitType[HitType["Board_Top"] = 5] = "Board_Top";
    HitType[HitType["None"] = 6] = "None";
})(HitType || (HitType = {}));
//# sourceMappingURL=HitConst.js.map