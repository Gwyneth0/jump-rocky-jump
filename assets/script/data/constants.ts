import { _decorator, Vec3 } from "cc";
import { Game } from "../game/game";

enum BOARD_TYPE {
   
    NORMAL = 0,
    SPRING = 1,
    DROP = 2,
    GIANT = 3,
    SPRINT = 4
}

enum GAME_STATE {
    READY = 1,
    PLAYING = 2,
    PAUSE = 3,
    OVER = 4,
}

enum GAME_EVENT {
    RESTART = 'restart',
    REVIVE = 'revive',
    ADDSCORE = 'add-score',
    DYING = 'dying', 
    HIDETIPS = 'hide-tips',
}

enum JUMP_STATE {
    JUMPUP = 1,   
    FALLDOWN = 2,
    SPRINT = 3,
}

export class Constants {
    static game: Game;
    static COEFF_POS_BALL = 8 / 360;
    static PLAYER_MAX_DOWN_FRAMES = 40; 
    static MAX_SCORE = 0; 
    // score
    static SCORE_BOARD_CENTER = 2; 
    static SCORE_BOARD_NOT_CENTER = 1; 
    // board
    static BOARD_INIT_POS = new Vec3(0, 10, 0); 
    static BOARD_NUM = 6; 
    static BOARD_NEW_INDEX = 2; 
    static BOARD_HEIGTH = 0.25; 
    static BOARD_RADIUS = 1.5; 
    static BOARD_HEIGTH_SCALE_DROP = 0.5;
    static BOARD_RADIUS_SCALE_GIANT = 2.8; 
    static BOARD_GAP = 4.3; 
    static BOARD_GAP_SPRING = 9; 
    static BOARD_GAP_SPRINT = 192; 
    static BOARD_SCALE_GIANT = 2.8; 
    static SCENE_MAX_OFFSET_X = 3.5; 
    static BOARD_TYPE = BOARD_TYPE;
    static BOARD_DROP_FRAMES = 40;
    static BOARD_DROP_STEP = 0.5; 
    static BOARD_RADIUS_CENTER = 0.35; 
    static BOARD_SPRING_FRAMES = 10;
    static BOARD_WAVE_FRAMES = 16;
    static BOARD_WAVE_INNER_START_FRAMES = 8;
    static BOARD_WAVE_INNER_STEP = 0.12 * 2;
    static BOARD_WAVE_STEP = 0.15 * 15;
    static BOARD_MOVING_STEP = 0.03; 
    static SPRING_HEIGHT = 0.2;
    static SPRING_HELIX_STEP = 0.5;
    static SPRING_HELIX_STEP_SPIRNT = 1.2;
    static SPRING_TOP_STEP = 0.25;
    static SPRING_TOP_STEP_SPRINT = 0.5;
    static WAVE_OFFSET_Y = 0.13 / 2;

    // camera
    static CAMERA_INIT_POS = new Vec3(0, 15, 22); 
    static CAMERA_INIT_ROT = new Vec3(-11, 0, 0); 
    static CAMERA_MOVE_X_FRAMES = 20; 
    static CAMERA_MOVE_Y_FRAMES = 15; 
    static CAMERA_MOVE_Y_FRAMES_SPRING = 23;
    static CAMERA_MOVE_MINI_ERR = 0.02; 
    static CAMERA_OFFSET_Y = 10;
    static CAMERA_OFFSET_Y_SPRINT = 15;
    static BOARD_BUMP_FRAMES = 10;
    static BOARD_BUMP_STEP = [-0.15, -0.1, -0.07, -0.02, -0.003, 0.003, 0.02, 0.07, 0.1, 0.15];

    // game
    static GAME_STATE = GAME_STATE; 
    static GAME_EVENT = GAME_EVENT; 

    // ball
    static BALL_RADIUS = 0.5;
    static BALL_JUMP_STATE = JUMP_STATE; 
    static BALL_JUMP_FRAMES = 20; 
    static BALL_JUMP_FRAMES_SPRING = 27; 
    static BALL_JUMP_FRAMES_SPRINT = 240; 
    static BALL_JUMP_STEP = [0.8, 0.6, 0.5, 0.4, 0.3, 0.2, 0.15, 0.1, 0.05, 0.03]; 
    static BALL_JUMP_STEP_SPRING = [1.2, 0.8, 0.6, 0.4, 0.3, 0.2, 0.15, 0.1, 0.05]; 
    static BALL_JUMP_STEP_SPRINT = 0.8; 
    static BALL_SPRINT_STEP_Y = 10; 
    static normalDt = 1 / 60;

}
