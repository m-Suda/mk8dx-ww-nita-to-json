import { Page } from 'puppeteer';

/**
 * 特定のtdタグを示すセレクターを取得する
 * @param trNthChildPos
 * @param tdNthChildPos
 */
export function getTableDataSelector(trNthChildPos: number, tdNthChildPos: number): string {
    return `table > tbody > tr:nth-child(${trNthChildPos}) > td:nth-child(${tdNthChildPos})`;
}

/**
 * 指定されたセレクターのInnerHtmlリストを取得する
 * @param page
 * @param selector
 */
export async function getText(page: Page, selector: string): Promise<string[]> {
    return await page.$$eval(selector, elements => {
        return elements.map(({ innerHTML }) => innerHTML);
    });
}

/**
 * 指定されたセレクターのInnerHtmlとlinkを取得する
 * @param page
 * @param selector
 */
export async function getTextAndLink(page: Page, selector: string): Promise<{ record: string, link: string }[]> {
    return await page.$$eval(selector, elements => {
        return elements.map(element => {
            const { innerHTML: record, href: link } = element as HTMLAnchorElement;
            return { record, link };
        });
    });
}