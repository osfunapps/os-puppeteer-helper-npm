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
     * @return ElementHandle -> the element, if found, else, undefined
     */
    waitForSelector: async function (page, selector, timeout = null, delayAfterFound = 1500) {
        let ele = undefined;
        try {
            ele = await page.waitForSelector(selector, {timeout: timeout});
        } catch {

        }
        await tools.delay(delayAfterFound)
        return ele
    },

    /**
     * will wait for an element with a text to appear.
     * @param page -> the puppeteer page
     * @param selector -> the selector to search for
     * @param text -> the text you wait for to appear
     * @param timeout -> optional timeout
     * @param checkEach -> tracker search time
     * @param delayAfterFound -> the delay after found
     * @param caseSensitive -> true for exact text match false, ignore capitals etc...
     * @return elmentHandle -> the element if found, else undefined
     */
    waitForSelectorWithText: async function (page,
                                             selector,
                                             text,
                                             checkEach=2000,
                                             timeout=null,
                                             delayAfterFound=0,
                                             caseSensitive=false) {

        let initialTime = new Date().getTime();
        let futureTime = null;
        if(timeout !== null) {
            futureTime = initialTime + timeout;
        }
        if(!caseSensitive) {
            text = text.toLowerCase();
        }

        while (true) {
            if (futureTime !== null && new Date().getTime() >= futureTime) {
                console.log("times up! returning")
                return undefined
            }

            var ele = await self.getElementByText(page, selector, text, caseSensitive)
            if(ele !== undefined){
                console.log("found it!")
                await tools.delay(delayAfterFound);
                return ele
            }

            console.log("didn't found yet!")
            await tools.delay(checkEach);
        }
    },

    /**
     * will wait for an element to be removed from the dom
     * @param page -> the page
     * @param selector -> the selector to be removed
     * @param checkEach -> search every x millis for the selector
     * @param disappearFor -> the selector should disappear for x millis
     */
    waitForSelectorToBeRemoved: async function (page, selector, checkEach = 2000, disappearFor = 1000) {
        while(true) {
            let found = await self.waitForSelector(page, selector, disappearFor, 0);
            if(!found) {
                return
            }
            await tools.delay(checkEach);
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
     * will set text to an element
     * @param page -> the current page
     * @param selector -> the selector to write upon. For example: input[id="username"]
     * @param text -> the text you wish to write
     * @param delayAfter -> the delay after the type
     * @param typeDelay -> the delay between each written letter
     * @param clearTextBefore -> set to true if you want to clear the text box before (manual clear)
     */
    setTextToSelector: async function (page, selector, text, delayAfter = 0, typeDelay = 20, clearTextBefore = true) {
        await mSetText(page, null, selector, text, delayAfter, typeDelay, clearTextBefore)
    },

    /**
     * will set text to an element
     * @param page -> the current page
     * @param element -> optional element you want to write upon
     * @param text -> the text you wish to write
     * @param delayAfter -> the delay after the type
     * @param typeDelay -> the delay between each written letter
     * @param clearTextBefore -> set to true if you want to clear the text box before (manual clear)
     */
    setTextToElement: async function (page, element, text, delayAfter = 0, typeDelay = 20, clearTextBefore = true) {
        await mSetText(page, element, null, text, delayAfter, typeDelay, clearTextBefore)
    },


    /**
     * will read text from an element
     */
    readText: async function (page, selector, delayAfter = 0) {
        const element = await page.$(selector);
        const text = await (await element.getProperty('innerText')).jsonValue();
        await tools.delay(delayAfter);
        return text
    },

    /**
     * will click an element/selector
     * @param page -> the current page
     * @param selector -> the selector to click. For example: a:nth-of-type(2)
     * @param delayAfterClick -> optional delay after click
     * @param selectorToFindAfterClick -> optional element to look for after click
     * @param howLongToWaitForSelector -> optional time to look for the element after click
     * @param delayAfterSelectorFound ->  optional delay after element found
     */
    clickOnSelector: async function (page,
                                     selector,
                                     delayAfterClick = 0,
                                     selectorToFindAfterClick = null,
                                     howLongToWaitForSelector = null,
                                     delayAfterSelectorFound = 1500) {
        await mClick(page, selector, null, delayAfterClick, selectorToFindAfterClick, howLongToWaitForSelector, delayAfterSelectorFound)
    },

    /**
     * will click an element/selector
     * @param page -> the current page
     * @param element -> the element to click upon
     * @param delayAfterClick -> optional delay after click
     * @param selectorToFindAfterClick -> optional element to look for after click
     * @param howLongToWaitForSelector -> optional time to look for the element after click
     * @param delayAfterSelectorFound ->  optional delay after element found
     */
    clickOnElement: async function (page,
                                    element,
                                    delayAfterClick = 0,
                                    selectorToFindAfterClick = null,
                                    howLongToWaitForSelector = null,
                                    delayAfterSelectorFound = 1500) {
        await mClick(page, null, element, delayAfterClick, selectorToFindAfterClick, howLongToWaitForSelector, delayAfterSelectorFound)
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
     * will clear text from selector or element
     */
    clearText: async function (page, selector, element = null, delayAfter = 0) {
        // await page.evaluate(function (selector) {
        //     // this code has now has access to foo
        //     document.querySelector(selector).value = "";
        // }, selector);
        let ele = element;
        if (ele === null) {
            ele = await self.getElement(page, selector)
        }
        await ele.click({clickCount: 3});
        await ele.type("");
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
        var ele = await self.getElementByText(page, selector, text, caseSensitive);
        await self.clickOnElement(page, ele, delayAfterClick, selectorToFindAfterClick, howLongToWaitForSelector, delayAfterSelectorFound)
    },


    /**
     * will return an element contains text
     * for example("div", "Floki") will click on a div with an innerText of "Floki" (uppercase sensitive)
     * @param page -> the puppeteer page
     * @param selector -> the selector to find. For example: a:nth-of-type(2)
     * @param text -> the element's innerText
     * @param caseSensitive -> toggle this to find the exact text or to ignore higher/lower cases
     */
    getElementByText: async function (page,
                                      selector,
                                      text,
                                      caseSensitive = false) {

        let ele =  await page.evaluateHandle((selector, text, caseSensitive) => {
            // this code has now has access to foo
            let allEle = document.querySelectorAll(selector);
            if (!caseSensitive) {
                text = text.toLowerCase()
            }
            for (let i = 0; i < allEle.length; i++) {
                let eleText = allEle[i].innerText;
                if (!caseSensitive) {
                    eleText = eleText.toLowerCase()
                }
                if (eleText.includes(text)) {
                    return allEle[i]
                }
            }
            return undefined

        }, selector, text, caseSensitive);

        return ele.type === undefined? undefined : ele
    },


    /**
     * will return element/s from the dom
     */
    getElements: async function (page, selector) {
        return await page.$$(selector);
    },

    /**
     * will return element from the dom/other element
     */
    getElement: async function (pageOrElement, selector) {
        return await pageOrElement.$(selector);
    },

    /**
     * will return the next sibling element from another element
     */
    getNextSibling: async function (page, element) {
        return await page.evaluateHandle(el => el.nextElementSibling, element);
    },

    /**
     * will return the previous sibling element from another element
     */
    getPreviousSibling: async function (page, element) {
        return await page.evaluateHandle(el => el.previousElementSibling, element);
    },

    /**
     * will return the parent of an element
     */
    getParent: async function (page, element) {
        return await page.evaluateHandle(el => el.parentElement, element);
    },


    /**
     * will return the sibling of an element
     */
    getOnlyDirectChildren: async function (page, element) {

        var children = page.evaluateHandle(el => el.children, element)
    },


    /**
     * will return the inner html of an element
     */
    getInnerHTML: async function (page, element) {
        return await page.evaluate(e => e.innerHTML, element);
    },

    /**
     * will return the inner text of an element
     */
    getInnerText: async function (page, element) {
        return await page.evaluate(e => e.innerText, element);
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

async function mClick(page,
                      btnSelector = null,
                      btnElement = null,
                      delayAfterClick = 0,
                      selectorToFindAfterClick = null,
                      howLongToWaitForSelector = null,
                      delayAfterSelectorFound = 1500) {

    if (btnElement !== null) {
        await btnElement.click()
    } else {
        await page.click(btnSelector);
    }
    await tools.delay(delayAfterClick);
    if (selectorToFindAfterClick != null) {
        await self.waitForSelector(page, selectorToFindAfterClick, howLongToWaitForSelector, delayAfterSelectorFound)
    }
}

async function mSetText(page, element = null, selector = null, text, delayAfter = 0, typeDelay = 20, clearTextBefore = true) {
    if (clearTextBefore) {
        await self.clearText(page, selector, element, 500)
    }
    if (selector !== null) {
        await page.type(selector, text, {delay: typeDelay});
    } else {
        await element.type(text)
    }
    await tools.delay(delayAfter)
}

function describe(jsHandle) {
    return jsHandle.executionContext().evaluate(obj => {
        // serialize |obj| however you want
        return 'beautiful object of type ' + (typeof obj);
    }, jsHandle);
}