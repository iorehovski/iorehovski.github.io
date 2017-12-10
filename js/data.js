const WIN_WIDTH = window.outerWidth;
const WIN_HEIGHT = window.outerHeight;
const WIN_WIDTH_HALF = window.outerWidth / 2;
const WIN_HEIGHT_HALF = window.outerHeight / 2;

const TEXTSIZE_TECHDATA = 14;
const ENTITY_DIAMETR = 100;

//map
const MAP_SIZE_X = 40;
const MAP_SIZE_Y = 20;

const TILE_W = 100; 
const TILE_H = 100;

const REND_MAP_LEFT = ((WIN_WIDTH_HALF / TILE_W) | 0) + 1;
const REND_MAP_RIGHT = ((WIN_WIDTH_HALF / TILE_W) | 0) + 2;
const REND_MAP_UP = ((WIN_HEIGHT_HALF / TILE_H) | 0) + 1;
const REND_MAP_DOWN = ((WIN_HEIGHT_HALF / TILE_H) | 0) + 1;

//colors
const PLAYER_COLOR = '#8db0e8';
const ENEMY_COLOR = '#f73b3b';
const BGCOLOR = '#686868';
const GRASS_COLOR = '#2e8c27';

const HP_BAR_COLOR = '#c01111';
const HUNGER_BAR_COLOR = '#1fc633';
const COLD_BAR_COLOR = '#1295d8';
const ENDURANCE_BAR_COLOR = '#b3ced6';

const BULLETS_COLOR_YELLOW = '#EFFF00';
