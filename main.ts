import puppeteer from 'puppeteer';
import {
    FIRST_RECORD_TR_START,
    RANKER_RECORD_TR_START,
    SPREAD_SHEET_URL,
    TR_INCREMENT,
    TRACK_EN_TD_END,
    TRACK_EN_TD_INCREMENT,
    TRACK_EN_TD_START,
    TRACK_EN_TR_END,
    TRACK_EN_TR_START,
    TRACK_JP_TR_START,
    TRACK_JP_TD_INCREMENT,
    TRACK_JP_TD_START,
    FIRST_RECORD_TD_START,
    RANKER_RECORD_TD_START,
    TRACK_JP_TR_END,
    TRACK_JP_TD_END,
    FIRST_RECORD_TR_END,
    FIRST_RECORD_TD_END,
    FIRST_RECORD_TD_INCREMENT, RANKER_RECORD_TD_END, RANKER_RECORD_TD_INCREMENT, RANKER_RECORD_TR_END,
} from './ww-nita-sheet';
import { Record } from './record';
import * as fs from 'fs';
import { getText, getTableDataSelector, getTextAndLink } from './page';

/**
 * ワルイージ花ちゃんNITAのスプレッドシートからコース名と1, 10位のタイムを取得する
 * スプレッドシートのためクラスが指定できないため
 */
(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    console.log('抽出開始');

    await page.goto(SPREAD_SHEET_URL);

    // 英語版コース名の開始行、開始ポジション
    let trackEnList: string[] = [];
    for (let trackEnTrPos = TRACK_EN_TR_START; trackEnTrPos <= TRACK_EN_TR_END; trackEnTrPos += TR_INCREMENT) {
        for (let trackEnTdPos = TRACK_EN_TD_START; trackEnTdPos <= TRACK_EN_TD_END; trackEnTdPos += TRACK_EN_TD_INCREMENT) {
            const selector = getTableDataSelector(trackEnTrPos, trackEnTdPos);
            const [track] = await getText(page, selector);
            trackEnList.push(track);
        }
    }

    // 日本語版コース名の開始行、開始ポジション
    let trackJpList: string[] = [];
    for (let trackJpTrPos = TRACK_JP_TR_START; trackJpTrPos <= TRACK_JP_TR_END; trackJpTrPos += TR_INCREMENT) {
        for (let trackJpTdPos = TRACK_JP_TD_START; trackJpTdPos <= TRACK_JP_TD_END; trackJpTdPos += TRACK_JP_TD_INCREMENT) {
            const selector = getTableDataSelector(trackJpTrPos, trackJpTdPos);
            const [track] = await getText(page, selector);
            trackJpList.push(track);
        }
    }

    // 1stのレコードがある開始行、開始ポジション
    let firstRecords: { record: string, link: string }[] = [];
    for (let firstTrPos = FIRST_RECORD_TR_START; firstTrPos <= FIRST_RECORD_TR_END; firstTrPos += TR_INCREMENT) {
        for (let firstTdPos = FIRST_RECORD_TD_START; firstTdPos <= FIRST_RECORD_TD_END; firstTdPos += FIRST_RECORD_TD_INCREMENT) {
            const selector = getTableDataSelector(firstTrPos, firstTdPos);
            const [data] = await getTextAndLink(page, `${selector} > a`);
            firstRecords.push(data);
        }
    }

    // 10thのレコードがある開始行、開始ポジション
    let rankerRecords: { record: string, link: string }[] = [];
    for (let rankerTrPos = RANKER_RECORD_TR_START; rankerTrPos <= RANKER_RECORD_TR_END; rankerTrPos += TR_INCREMENT) {
        for (let rankerTdPos = RANKER_RECORD_TD_START; rankerTdPos <= RANKER_RECORD_TD_END; rankerTdPos += RANKER_RECORD_TD_INCREMENT) {
            const selector = getTableDataSelector(rankerTrPos, rankerTdPos);
            const [data] = await getTextAndLink(page, `${selector} > a`);
            rankerRecords.push(data);
        }
    }

    const undefinedRankerRecords = [];

    const records: Record[] = trackEnList.map((trackEn, i) => {
        // コースによっては15の記録が無いコースがあるため、その場合は確認する
        if (!rankerRecords[i]?.record) {
            undefinedRankerRecords.push(trackJpList[i]);
        }
        return {
            trackEn,
            trackJp: trackJpList[i],
            firstRecord: firstRecords[i].record,
            firstRecordUrl: firstRecords[i].link,
            rankerRecord: rankerRecords[i]?.record ?? ''
        };
    });

    console.log('抽出終了');

    console.log('書き込み開始');
    fs.writeFileSync('./data/wr.json', JSON.stringify(records));
    console.log('書き込み終了');

    await browser.close();
})();