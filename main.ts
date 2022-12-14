import puppeteer from 'puppeteer';
import {
    FIRST_RECORD_TABLE_DATA_CLASS,
    FIRST_RECORD_TABLE_ROW_START,
    RANKER_RECORD_TABLE_DATA_CLASS,
    RANKER_RECORD_TABLE_ROW_START,
    SPREAD_SHEET_URL,
    TABLE_DATA_CLASS_PREFIX,
    TABLE_ROW_INCREMENT,
    TRACK_TABLE_DATA_CLASS_2ND,
    TRACK_TABLE_DATA_CLASS_END,
    TRACK_TABLE_DATA_CLASS_INCREMENT,
    TRACK_TABLE_DATA_CLASS_START,
    TRACK_TABLE_ROW_END,
    TRACK_TABLE_ROW_START,
} from './ww-nita-sheet';
import { Record } from './record';
import * as fs from 'fs';
import { getATagSelector, getText, getTableDataSelector, getTextAndLink } from './page';

/**
 * ワルイージ花ちゃんNITAのスプレッドシートからコース名と1, 10位のタイムを取得する
 * スプレッドシートのためクラスが指定できないため
 */
(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(SPREAD_SHEET_URL);

    const records: Record[] = [];

    let trackTrPosition = TRACK_TABLE_ROW_START;
    let trackTdPosition = TRACK_TABLE_DATA_CLASS_START;
    let firstRecordTrPosition = FIRST_RECORD_TABLE_ROW_START;
    let rankerRecordTrPosition = RANKER_RECORD_TABLE_ROW_START;
    console.log('抽出開始');
    for (
        trackTrPosition;
        trackTrPosition <= TRACK_TABLE_ROW_END;
        trackTrPosition += TABLE_ROW_INCREMENT
    ) {
        const trackTd = `${TABLE_DATA_CLASS_PREFIX}${trackTdPosition}`;
        const trackSelector = getTableDataSelector(trackTrPosition, trackTd);
        console.log(trackSelector);
        const tracks = await getText(page, trackSelector);
        console.log(tracks);

        const firstRecordSelector = getATagSelector(firstRecordTrPosition, FIRST_RECORD_TABLE_DATA_CLASS);
        const firstRecords = await getTextAndLink(page, firstRecordSelector);
        console.log(firstRecords);

        const rankerRecordSelector = getATagSelector(rankerRecordTrPosition, RANKER_RECORD_TABLE_DATA_CLASS);
        const rankerRecords = await getText(page, rankerRecordSelector);
        console.log(rankerRecords);

        const record: Record[] = tracks.map((track, i) => {
            const { record, link } = firstRecords[i];
            return {
                track,
                firstRecord: record,
                firstRecordUrl: link,
                rankerRecord: rankerRecords[i],
            };
        });
        console.log(record);

        records.push(...record);

        trackTdPosition += TRACK_TABLE_DATA_CLASS_INCREMENT;
        console.log(`trackTdPosition(after increment): ${trackTdPosition}`);
        // コースのtdタグのクラスは24のときだけ次が39になる
        if (trackTdPosition > TRACK_TABLE_DATA_CLASS_START && trackTdPosition < TRACK_TABLE_DATA_CLASS_2ND) {
            console.log('24の次なので39');
            trackTdPosition = TRACK_TABLE_DATA_CLASS_2ND;
        }
        // コースのtdタグのクラスはs49に達するとs24になりそこからもう1周する
        else if (trackTdPosition > TRACK_TABLE_DATA_CLASS_END) {
            console.log('49の次は24');
            trackTdPosition = TRACK_TABLE_DATA_CLASS_START;
        }
        firstRecordTrPosition += TABLE_ROW_INCREMENT;
        rankerRecordTrPosition += TABLE_ROW_INCREMENT;
    }
    console.log('抽出終了');

    console.log('書き込み開始');
    fs.writeFileSync('./data/wr.json', JSON.stringify(records));
    console.log('書き込み終了');

    await browser.close();
})();