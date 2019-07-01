const puppeteer = require('puppeteer');
const tools = require('os-tools');

const self = module.exports = {

    /**
     * will create a new chromium browser
     * @param url -> the url to log in to
     * @param slowMo -> how long to wait before each command
     * @param headless -> show/hide browser
     * @param width -> browser width
     * @param height -> browser height
     */
    createBrowser: async function (url, slowMo = 5, headless = false, width = 1300, height = 768) {
        const browser = await puppeteer.launch({
            headless: headless,
            slowMo: slowMo // slow down by 5
        });

        const page = await browser.newPage();
        await page.setViewport({width: width, height: height});
        await self.navigateTo(page, url);
        return [browser, page]
    },

    /**
     * will navigate to a certain url with an option to search for a selector after page load
     */
    navigateTo: async function (page,
                                url,
                                givenTimeout = null,
                                waitForSelector = null,
                                timeoutSelectorSearch = null,
                                delayAfterSelector = 1500,
                                delayAfterNavigated = 0) {
        await page.goto(url, {waitUntil: 'load', timeout: givenTimeout});
        await tools.delay(delayAfterNavigated);
        if (waitForSelector != null) {
            await self.waitForSelector(page, waitForSelector, timeoutSelectorSearch, delayAfterSelector)
        }
    },

    /**
     * will wait for an element to appear.
     * @param page -> the puppeteer page
     * @param selector -> the selector to search for
     * @param timeout -> 0 to disable timeout
     * @param delayAfterFound -> how long to wait after found
     */
    waitForSelector: async function (page, selector, timeout = null, delayAfterFound = 1500) {
        await page.waitForSelector(selector, {timeout: timeout});
        await tools.delay(delayAfterFound)
    },

    /**
     * will wait for an element to be removed from the dom
     */
    waitForSelectorToBeRemoved: async function (page, selector, checkEach = 2000) {
        while (true) {
            try {
                await tools.delay(checkEach);
                await self.waitForSelector(page, selector, null, 0)
            } catch (error) {
                return
            }
        }
    },

    /**
     * will wait for an elements to appear
     */
    waitForSelectors: async function (page, timeout = null, delayAfterFound = 1500, ...selectors) {
        await page.waitForSelector(selectors, {timeout: timeout});
        await tools.delay(delayAfterFound)
    },


    /**
     * will wait for navigation to change
     */
    waitForNavigation: async function (page, selector, timeout = null) {
        return await page.waitForNavigation(selector, {timeout: timeout});
    },


    /**
     * will add text to an element
     */
    setText: async function (page, selector, text, delayAfter = 0, typeDelay = 20, clearTextBefore = true) {
        if (clearTextBefore) {
            await self.clearText(page, selector, 500)
        }
        await page.type(selector, text, {delay: typeDelay});
        await tools.delay(delayAfter)
    },

    /**
     * will read text from an element
     */
    readText: async function (page, selector, delayAfter = 0) {
        const element = await page.$(selector);
        const text = await (await element.getProperty('innerText')).jsonValue();
        await tools.delay(delayAfter)
        return text
    },

    /**
     * will click a selector
     * @param page -> the current page
     * @param selector -> the selector to click. For example: a:nth-of-type(2)
     * @param delayAfterClick -> optional delay after click
     * @param selectorToFindAfterClick -> optional element to look for after click
     * @param howLongToWaitForSelector -> optional time to look for the element after click
     * @param delayAfterSelectorFound ->  optional delay after element found
     */
    click: async function (page,
                           selector,
                           delayAfterClick = 0,
                           selectorToFindAfterClick = null,
                           howLongToWaitForSelector = null,
                           delayAfterSelectorFound = 1500) {

        await page.click(selector);
        await tools.delay(delayAfterClick);
        if (selectorToFindAfterClick != null) {
            await self.waitForSelector(page, selectorToFindAfterClick, howLongToWaitForSelector, delayAfterSelectorFound)
        }
    },

    /**
     * Will selectByValue an element based on it's value
     * For more formidable approach, look for CheerioHelper.isSelectHasValue()
     */
    selectByValue: async function (page, selector, value, delayAfter = 0) {
        await page.select(selector, value);
        await tools.delay(delayAfter)
    },


    /**
     * will clear text from an element
     */
    clearText: async function (page, selector, delayAfter = 0) {
        await page.evaluate(function (selector) {
            // this code has now has access to foo
            document.querySelector(selector).value = "";
        }, selector);
        await tools.delay(delayAfter)
    },

    /**
     * will create a count down (10 9 8 ...)
     */
    makeCountDown: async function (from) {
        for (let i = from; i > 0; i--) {
            console.log(i);
            await tools.delay(1000)
        }
    },

    /**
     * will download a file
     * @param page -> the puppeteer page
     * @param path -> the path to the file
     * @param downloadSelector -> the selector to click in order to start the download
     */
    downloadFile: async function (page, path, downloadSelector) {
        await page._client.send('Page.setDownloadBehavior', {
            behavior: 'allow',
            downloadPath: path
        });
        await self.click(page, downloadSelector)
    },

    /**
     * will click on an element which contains text
     * for example("div", "Floki") will click on a div with an innerText of "Floki" (uppercase sensitive)
     * @param page -> the puppeteer page
     * @param selector -> the selector to click. For example: a:nth-of-type(2)
     * @param text -> the element's innerText
     * @param caseSensitive -> toggle this to find the exact text or to ignore higher/lower cases
     * @param delayAfterClick -> optional delay after click
     * @param selectorToFindAfterClick -> optional element to look for after click
     * @param howLongToWaitForSelector -> optional time to look for the element after click
     * @param delayAfterSelectorFound ->  optional delay after element found
     */
    clickOnElementContainsText: async function (page,
                                                selector,
                                                text,
                                                caseSensitive = false,
                                                delayAfterClick = 0,
                                                selectorToFindAfterClick = null,
                                                howLongToWaitForSelector = null,
                                                delayAfterSelectorFound = 1500) {
        await page.evaluate(function (selector, text, caseSensitive) {
            // this code has now has access to foo
            let allEle = document.querySelectorAll(selector);
            if(!caseSensitive) {
                text = text.toLowerCase()
            }
            for (let i = 0; i < allEle.length; i++) {
                let eleText = allEle[i].innerText;
                if(!caseSensitive) {
                    eleText = eleText.toLowerCase()
                }
                if (eleText.includes(text)){
                    allEle[i].click()
                }
            }

        }, selector, text, caseSensitive);

        await tools.delay(delayAfterClick);
        if (selectorToFindAfterClick != null) {
            await self.waitForSelector(page, selectorToFindAfterClick, howLongToWaitForSelector, delayAfterSelectorFound)
        }
    },


    /**
     * will return element/s from the dom
     */
    getElements: async function (page, selector) {
        return await page.$$(selector);
    },

    /**
     * will return element/s from the dom
     */
    getElementsFromElement: async function (element, attName) {
        let children =  await (await element.getProperty('selector')).jsonValue();
        let firstChild = children[0]
        let dVal = await self.getAttributeValueFromElement(firstChild, 'd')

    },

    /**
     * will return an attribute value from an element
     */
    getAttributeValueFromElement: async function (element, attName) {
        return await (await element.getProperty(attName)).jsonValue();
    },

    /**
     * will return the inner html of an element
     */
    getInnerHTMLFromElement: async function (element) {
        return await (await element.getProperty('innerHTML')).jsonValue();
    },


};

