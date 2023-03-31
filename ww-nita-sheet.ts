/**
 * スプレッドシートのURL
 */
export const SPREAD_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTOT3PJwMcMrOE--rBPV3Vz1SUegmpmpCtP8NzMQoxHljks2JDaYQ8H1pj4Pi0i5xOmnnS3eDAxc4zY/pubhtml?gid=0&single=true';
/**
 * trタグの増減値
 */
export const TABLE_ROW_INCREMENT = 13;
/**
 * コースのセルがあるtrタグの開始、終了位置
 */
export const TRACK_TABLE_ROW_START = 8;
export const TRACK_TABLE_ROW_END = 255;
/**
 * 1stの記録があるtrタグの開始、終了位置
 */
export const FIRST_RECORD_TABLE_ROW_START = 10;
export const FIRST_RECORD_TABLE_ROW_END = 231;
/**
 * ランカー(10th)の記録があるtrタグの開始、終了位置
 */
export const RANKER_RECORD_TABLE_ROW_START = 19;
export const RANKER_RECORD_TABLE_ROW_END = 240;

/**
 * tdタグのPrefix
 */
export const TABLE_DATA_CLASS_PREFIX = 's';
/**
 * コースのセルがあるtdタグの増減値
 */
export const TRACK_TABLE_DATA_CLASS_INCREMENT = 1;
/**
 * コースのセルがあるtdタグの開始、終了位置
 * ※増加値1なのは39から。
 */
export const TRACK_TABLE_DATA_CLASS_START = 24;
export const TRACK_TABLE_DATA_CLASS_2ND = 39;
export const TRACK_TABLE_DATA_CLASS_END = 49;
/**
 * コースのセルがあるtdタグはENDに達してからもう1周する。
 * その2周目の終わりの位置
 */
export const TRACK_TABLE_DATA_CLASS_FINISH = 41;
/**
 * 1stの記録があるtdタグの位置
 */
export const FIRST_RECORD_POSITION = 30;
/**
 * 1stの記録があるtdタグのクラス
 */
export const FIRST_RECORD_TABLE_DATA_CLASS = `${TABLE_DATA_CLASS_PREFIX}${FIRST_RECORD_POSITION}`;
/**
 * ランカー(10th)の記録があるtdタグの位置
 */
export const RANKER_RECORD_POSITION = 38;
/**
 * ランカー(10th)の記録があるtdタグのクラス
 */
export const RANKER_RECORD_TABLE_DATA_CLASS = `${TABLE_DATA_CLASS_PREFIX}${RANKER_RECORD_POSITION}`;