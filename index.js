const tools = require('os-tools');

const self = module.exports = {

        /**
         * Will create a new chromium browser
         *
         * @param url -> the url to log in to
         * @param slowMo -> how long to wait before each command
         * @param headless -> show/hide browser
         * @param width -> browser width
         * @param height -> browser height
         * @param googleSignIn -> if you gonna log in to any Google service, trigger to true to fix the login problem
         */
        createBrowser: async function (url = "about:blank", slowMo = 5, headless = false, width = 1300, height = 768, googleSignIn = false) {
            const browser = await require('puppeteer').launch({
                headless: headless,
                slowMo: slowMo // slow down by 5
            });

            const page = await browser.newPage();
            if(googleSignIn) {
                await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.10136");
            }
            await page.setViewport({width: width, height: height});
            await self.navigateTo(page, url);
            return [browser, page]
        },

        /**
         * Will create a new firefox browser
         *
         * @param url -> the url to log in to
         * @param slowMo -> how long to wait before each command
         * @param headless -> show/hide browser
         * @param width -> browser width
         * @param height -> browser height
         */
        createFirefoxBrowser: async function (url = "about:blank", slowMo = 5, headless = false, width = 1300, height = 768) {
            const browser = await require('puppeteer-firefox').launch({
                headless: headless,
                slowMo: slowMo // slow down by 5
            });

            const page = await browser.newPage();
            await page.setViewport({width: width, height: height});
            await self.navigateTo(page, url);
            return [browser, page]
        },

        /**
         * Will navigate to a certain url with an option to search for a selector after page load
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
         * Will wait for an element to appear.
         *
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
            await tools.delay(delayAfterFound);
            return ele
        },

        /**
         * Will wait for an element with a text to appear.
         *
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
                                                 checkEach = 1000,
                                                 timeout = null,
                                                 delayAfterFound = 0,
                                                 caseSensitive = false) {

            let initialTime = new Date().getTime();
            let futureTime = null;
            if (timeout !== null) {
                futureTime = initialTime + timeout;
            }
            if (!caseSensitive) {
                text = text.toLowerCase();
            }

            while (true) {
                if (futureTime !== null && new Date().getTime() >= futureTime) {
                    console.log("times up! returning");
                    return undefined
                }

                let found = await self.waitForSelector(page, selector, 1000);
                if (found) {
                    let ele = undefined;
                    console.log('searching for text');
                    ele = await self.getElementByText(page, selector, text, caseSensitive);
                    if (ele !== undefined) {
                        console.log("found it!");
                        await tools.delay(delayAfterFound);
                        return ele
                    }

                    console.log("didn't found yet!");
                    await tools.delay(checkEach);
                }
            }
        },

        /**
         * Will wait for an element to be removed from the dom
         *
         * @param page -> the page
         * @param selector -> the selector to be removed
         * @param checkEach -> search every x millis for the selector
         * @param disappearFor -> the selector should disappear for x millis
         */
        waitForSelectorToBeRemoved: async function (page, selector, checkEach = 2000, disappearFor = 1000) {
            while (true) {
                let found = await self.waitForSelector(page, selector, disappearFor, 0);
                if (!found) {
                    return
                }
                await tools.delay(checkEach);
            }
        },

        /**
         * Will wait for elements to appear
         */
        waitForSelectors: async function (page, timeout = null, delayAfterFound = 1500, ...selectors) {
            await page.waitForSelector(selectors, {timeout: timeout});
            await tools.delay(delayAfterFound)
        },


        /**
         * Will find an element by it's partial attribute value
         */
        getElementByPartialAttributeValue: async function (page, eleTag, eleAttributeName, partialAttributeValue, findMoreThanOneElement = false) {
            if (findMoreThanOneElement) {
                return await self.getElementsBySelector(page, eleTag + '[' + eleAttributeName + "~='" + partialAttributeValue + "']")
            }
            return await self.getElementBySelector(page, eleTag + '[' + eleAttributeName + "~='" + partialAttributeValue + "']")
        },

        /**
         * Will find an element by it's attribute value suffix
         */
        getElementBySuffixAttributeValue: async function (page, eleTag, eleAttributeName, attributeSuffixValue, findMoreThanOneElement = false) {
            if (findMoreThanOneElement) {
                return await self.getElementsBySelector(page, eleTag + '[' + eleAttributeName + "$='" + attributeSuffixValue + "']")
            }
            return await self.getElementBySelector(page, eleTag + '[' + eleAttributeName + "$='" + attributeSuffixValue + "']")
        },


        /**
         * Will find an element by it's attribute value prefix
         */
        getElementByPrefixAttributeValue: async function (page, eleTag, eleAttributeName, attributePrefixValue, findMoreThanOneElement = false) {
            if (findMoreThanOneElement) {
                return await self.getElementsBySelector(page, eleTag + '[' + eleAttributeName + "^='" + attributePrefixValue + "']")
            }
            return await self.getElementBySelector(page, eleTag + '[' + eleAttributeName + "^='" + attributePrefixValue + "']")
        },


        /**
         * Will wait for navigation to change
         */
        waitForNavigation: async function (page, selector, timeout = null) {
            return await page.waitForNavigation(selector, {timeout: timeout});
        },


        /**
         * Will set text to a selector
         *
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
         * Will set text to xpath
         *
         * @param page -> the current page
         * @param element -> optional element you want to write upon
         * @param text -> the text you wish to write
         * @param delayAfter -> the delay after the type
         * @param typeDelay -> the delay between each written letter
         * @param clearTextBefore -> set to true if you want to clear the text box before (manual clear)
         */
        setTextToXpath: async function (page, xpath, text, delayAfter = 0, typeDelay = 20, clearTextBefore = true) {
            let element = await self.getElementByXPath(page, xpath)
            await mSetText(page, element, null, text, delayAfter, typeDelay, clearTextBefore)
        },


        /**
         * Will set text to an element
         *
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
         * Will type alpha/numerical on the keyboard
         *
         * @param page -> the current page
         * @param text -> the text to write
         * @param delay -> the delay between letters
         * @param delayAfter -> the delay after the whole type
         */
        typeOnKeyboard: async function (page, text, delay = 2, delayAfter = 0) {
            await page.keyboard.type(text, {delay: delay});
            await tools.delay(delayAfter)
        },


        /**
         * Will read text from selector
         *
         * @param page -> the current page
         * @param selector -> the selector to read
         * @param innerText -> true for innerText, false for innerHTML
         * @param delayAfter -> the delay after the whole type
         */
        readTextFromSelector: async function (page, selector, innerText = true, delayAfter = 0) {
            var property = innerText
            if (!innerText) {
                property = 'innerHTML'
            }
            const element = await page.$(selector);
            const text = await (await element.getProperty(property)).jsonValue();
            await tools.delay(delayAfter);
            return text
        },

        /**
         * Will click on a selector
         *
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
         * Will click on a XPath selector
         *
         * @param page -> the current page
         * @param xpath -> the xpath to click. For example: /html/body/div[6]/div[1]/div[1]/h1
         * @param delayAfterClick -> optional delay after click
         * @param selectorToFindAfterClick -> optional element to look for after click
         * @param howLongToWaitForSelector -> optional time to look for the element after click
         * @param delayAfterSelectorFound ->  optional delay after element found
         */
        clickOnXPath: async function (page,
                                      xpath,
                                      delayAfterClick = 0,
                                      selectorToFindAfterClick = null,
                                      howLongToWaitForSelector = null,
                                      delayAfterSelectorFound = 1500) {

            let xpathEle = await self.getElementByXPath(page, xpath)
            await mClick(page, null, xpathEle, delayAfterClick, selectorToFindAfterClick, howLongToWaitForSelector, delayAfterSelectorFound)
        },


        /**
         * Will mouse click on an xpath
         *
         * @param page -> the current page
         * @param xpath -> the xpath to click
         * @param selector -> the selector to click. For example: a:nth-of-type(2)
         * @param mouseBtn -> the mouse btn to click ('left'/'right')
         * @param delayAfterClick -> optional delay after click
         */
        mouseClickOnXPath: async function (page,
                                           xpath,
                                           mouseBtn = 'left',
                                           delayAfterClick = 0) {
            const element = await self.getElementByXPath(page, xpath)
            await self.mouseClickOnElement(element, mouseBtn, delayAfterClick)
        },

        /**
         * Will mouse click on a selector
         *
         * @param page -> the current page
         * @param selector -> the selector to click. For example: a:nth-of-type(2)
         * @param mouseBtn -> the mouse btn to click ('left'/'right')
         * @param delayAfterClick -> optional delay after click
         */
        mouseClickOnSelector: async function (page,
                                              selector,
                                              mouseBtn = 'left',
                                              delayAfterClick = 0) {
            const element = await self.getElementBySelector(page, selector)
            await self.mouseClickOnElement(element, mouseBtn, delayAfterClick)
        },

        /**
         * Will mouse click on a selector which contains text
         *
         * @param page -> the puppeteer page
         * @param selector -> the selector to click. For example: 'div'
         * @param text -> the element's innerText
         * @param caseSensitive -> toggle this to find the exact text or to ignore higher/lower cases
         * @param includes -> set to true if to click on an element based on contains() text
         * @param identical -> set to true if to click on an element which has the EXACT text ( === )
         * @param innerHTML -> set to true for innerHTML. False for innerText
         * @param mouseBtn -> the mouse btn to click ('left'/'right')
         * @param delayAfterClick -> optional delay after click
         * @param selectorToFindAfterClick -> optional element to look for after click
         * @param howLongToWaitForSelector -> optional time to look for the element after click
         * @param delayAfterSelectorFound ->  optional delay after element found
         */
        mouseClickOnSelectorContainsText: async function (page,
                                                          selector,
                                                          text,
                                                          caseSensitive = false,
                                                          includes = true,
                                                          identical = false,
                                                          innerHTML = true,
                                                          mouseBtn = 'left',
                                                          delayAfterClick = 0,
                                                          selectorToFindAfterClick = null,
                                                          howLongToWaitForSelector = null,
                                                          delayAfterSelectorFound = 1500) {
            var element = await self.getElementByText(page, selector, text, caseSensitive, includes, identical, innerHTML);
            await self.mouseClickOnElement(element, mouseBtn, delayAfterClick)
        },


        /**
         * Will mouse click on element
         *
         * @param element -> the element to click
         * @param mouseBtn -> the mouse btn to click ('left'/'right')
         * @param delayAfterClick -> optional delay after click
         */
        mouseClickOnElement: async function (element,
                                             mouseBtn = 'left',
                                             delayAfterClick = 0) {
            await element.click({
                button: mouseBtn
            });
            await tools.delay(delayAfterClick)
        }
        ,

        /**
         * Will click an element/selector
         *
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
        }
        ,


        /**
         * Will selectByValue an element based on it's value
         * For more formidable approach, look for CheerioHelper.isSelectHasValue()
         */
        selectByValue: async function (page, selector, value, delayAfter = 0) {
            await page.select(selector, value);
            await tools.delay(delayAfter)
        }
        ,


        /**
         * Will clear text from selector or element
         */
        clearText: async function (page, selector, element = null, delayAfter = 0) {
            // await page.evaluate(function (selector) {
            //     // this code has now has access to foo
            //     document.querySelector(selector).value = "";
            // }, selector);
            let ele = element;
            if (ele === null) {
                ele = await self.getElementBySelector(page, selector)
            }
            await ele.click({clickCount: 3});
            await ele.type("");
            await tools.delay(delayAfter)
        }
        ,

        /**
         * Will create a count down (10 9 8 ...)
         */
        makeCountDown: async function (from) {
            for (let i = from; i > 0; i--) {
                console.log(i);
                await tools.delay(1000)
            }
        }
        ,

        /**
         * Will download a file.
         * NOTICE: if you only want to change the saving location of a file, call setDownloadedFilesLocation(output).
         *
         * @param page -> the puppeteer page
         * @param outputPath -> the path to the downloaded file
         * @param downloadSelector -> the selector to click in order to start the download
         */
        downloadFile: async function (page, outputPath, downloadSelector) {
            self.setDownloadedFilesLocation(page, outputPath);
            await self.clickOnSelector(page, downloadSelector)
        }
        ,

        /**
         * will set the location to which the downloaded files will be saved
         */
        setDownloadedFilesLocation: async function (page, outputPath) {
            await page._client.send('Page.setDownloadBehavior', {
                behavior: 'allow',
                downloadPath: outputPath
            });
        }
        ,

        /**
         * will scroll a selector into view
         */
        scrollSelectorIntoView: async function (page, selector) {
            let element = await self.getElementBySelector(page, selector)
            await self.scrollElementIntoView(page, element)
        }
        ,

        /**
         * will scroll an xpath into view
         */
        scrollXPathIntoView: async function (page, xpath) {
            let element = await self.getElementByXPath(page, xpath)
            await self.scrollElementIntoView(page, element)
        }
        ,

        /**
         * will scroll an element into view
         */
        scrollElementIntoView: async function (page, element) {
            await page.evaluateHandle((element) => {
                element.scrollIntoView()
            }, element);
        }
        ,


        /**
         * Will click on an element which contains text
         * for example("div", "Floki") will click on a div with an innerText of "Floki" (uppercase sensitive)
         *
         * @param page -> the puppeteer page
         * @param selector -> the selector to click. For example: a:nth-of-type(2)
         * @param text -> the element's innerText
         * @param caseSensitive -> toggle this to find the exact text or to ignore higher/lower cases
         * @param includes -> set to true if to click on an element based on contains() text
         * @param identical -> set to true if to click on an element which has the EXACT text ( === )
         * @param innerHTML -> set to true for innerHTML. False for innerText
         * @param delayAfterClick -> optional delay after click
         * @param selectorToFindAfterClick -> optional element to look for after click
         * @param howLongToWaitForSelector -> optional time to look for the element after click
         * @param delayAfterSelectorFound ->  optional delay after element found
         */
        clickOnElementContainsText: async function (page,
                                                    selector,
                                                    text,
                                                    caseSensitive = false,
                                                    includes = true,
                                                    identical = false,
                                                    innerHTML = true,
                                                    delayAfterClick = 0,
                                                    selectorToFindAfterClick = null,
                                                    howLongToWaitForSelector = null,
                                                    delayAfterSelectorFound = 1500) {
            var ele = await self.getElementByText(page, selector, text, caseSensitive, includes, identical, innerHTML);
            await self.clickOnElement(page, ele, delayAfterClick, selectorToFindAfterClick, howLongToWaitForSelector, delayAfterSelectorFound)
        }
        ,


        /**
         * Will return an element contains text
         * for example("div", "Floki") will click on a div with an innerText of "Floki" (uppercase sensitive)
         *
         * @param page -> the puppeteer page
         * @param selector -> the selector to find. For example: a:nth-of-type(2)
         * @param text -> the element's innerText
         * @param caseSensitive -> toggle this to find the exact text or to ignore higher/lower cases
         * @param includes -> set to true if the element contains text
         * @param identical -> set to true if element has the EXACT text ( === )
         * @param innerHTML -> set to true for innerHTML. False for innerText
         */
        getElementByText: async function (page,
                                          selector,
                                          text,
                                          caseSensitive = false,
                                          includes = true,
                                          identical = false,
                                          innerHTML = true) {
            let ele = undefined;
            try {
                ele = await page.evaluateHandle((selector, text, caseSensitive, includes, identical, innerHTML) => {
                    // this code has now has access to foo
                    let allEle = document.querySelectorAll(selector);
                    if (!caseSensitive) {
                        text = text.toLowerCase()
                    }
                    for (let i = 0; i < allEle.length; i++) {
                        let eleText = ''
                        if (innerHTML) {
                            eleText = allEle[i].innerHTML;
                        } else {
                            eleText = allEle[i].innerText;
                        }

                        if (!caseSensitive) {
                            eleText = eleText.toLowerCase()
                        }
                        if (includes) {
                            if (eleText.includes(text)) {
                                return allEle[i]
                            }
                        }

                        if (identical) {
                            if (eleText === text) {
                                return allEle[i]
                            }
                        }
                    }
                    return undefined

                }, selector, text, caseSensitive, includes, identical, innerHTML);
            } catch (e) {
                await self.getElementByText(page, selector, text, caseSensitive, includes, identical);
                return
            }

            return ele.type === undefined ? undefined : ele
        }
        ,


        /**
         * Will return element/s from the dom
         */
        getElementsBySelector: async function (page, selector) {
            return await page.$$(selector);
        }
        ,

        /**
         * Will return element from the dom/other element.
         * If no found, return undefined
         */
        getElementBySelector: async function (pageOrElement, selector) {
            try {
                return await pageOrElement.$(selector);
            } catch (e) {
                return undefined
            }
        }
        ,

        /**
         * Will return element from the dom/other element.
         * If no found, return undefined
         */
        getElementByXPath: async function (pageOrElement, xpath) {
            try {
                return await pageOrElement.$x(xpath);
            } catch (e) {
                return undefined
            }
        }
        ,

        /**
         * Will return the next sibling element from another element
         */
        getNextSibling: async function (page, element) {
            let ele = await page.evaluateHandle(el => el.nextElementSibling, element);
            return ele.type === undefined ? null : ele
        }
        ,

        /**
         * Will return the previous sibling element from another element
         */
        getPreviousSibling: async function (page, element) {
            let ele = await page.evaluateHandle(el => el.previousElementSibling, element);
            return ele.type === undefined ? null : ele
        }
        ,

        /**
         * Will return the parent of an element
         */
        getParent: async function (page, element) {
            let ele = await page.evaluateHandle(el => el.parentElement, element);
            return ele.type === undefined ? null : ele
        }
        ,


        /**
         * Will return the sibling of an element
         */
        getOnlyDirectChildren: async function (page, element) {
            return page.evaluateHandle(el => el.children, element)
        }
        ,


        /**
         * Will return the inner html of an element
         */
        getInnerHTML: async function (page, element) {
            return await page.evaluate(e => e.innerHTML, element);
        }
        ,

        /**
         * Will return the inner text of an element
         */
        getInnerText: async function (page, element) {
            return await page.evaluate(e => e.innerText, element);
        }
        ,

        /**
         * Will set the element attribute value
         */
        setElementAttributeValue: async function (page, elementOrSelector, attribName, attribValue) {
            if (typeof elementOrSelector === 'string') {
                elementOrSelector = await self.getElementBySelector(page, elementOrSelector)
            }
            await page.evaluate((element, attribName, attribValue) => {
                element.setAttribute(attribName, attribValue)
            }, elementOrSelector, attribName, attribValue);
        }
        ,

        /**
         * Will return an attribute value from an element
         */
        getAttributeValueFromElement: async function (page, element, attName) {

            let val = await page.evaluate((element, attName) => {
                return element.getAttribute(attName)
            }, element, attName);


            if (typeof val === 'object') {
                var size = Object.keys(val).length;
                if (size === 0) {
                    return null
                }
            }
            return val
        }
        ,

        /**
         * Will click on a an element which happens to be before or after a label.
         *
         * @param page -> the puppeteer page
         * @param innerHTML -> set to true to look on the label's innerHTML. False for innerText
         * @param labelText -> the label's innerHTML
         * @param caseSensitive -> toggle this to find the exact text or to ignore higher/lower cases
         * @param includes -> set to true if the element contains()
         * @param identical -> set to true if the label has the EXACT text ( === )
         * @param isElementAfterLabel -> set to false if the element is before the label (rtl pages)
         */
        clickOnElementWithAdjacentLabel: async function (page,
                                                         labelText,
                                                         innerHTML = true,
                                                         caseSensitive = true,
                                                         includes = false,
                                                         identical = true,
                                                         isElementAfterLabel = false) {
            let inputLabel = await self.getElementByText(page, 'label', labelText, caseSensitive, includes, identical, innerHTML);
            let inputEle = undefined;
            if (isElementAfterLabel) {
                inputEle = await self.getNextSibling(page, inputLabel)
            } else {
                inputEle = await self.getPreviousSibling(page, inputLabel)
            }
            await self.clickOnElement(page, inputEle)
        }
        ,

        /**
         * Will return the inner html of an element
         */
        getInnerHTMLFromElement: async function (element) {
            return await (await element.getProperty('innerHTML')).jsonValue();
        }
        ,

        /**
         * Will kill the browser
         */
        close: async function (browser) {
            try {
                await browser.close()
            } catch (e) {

            }
        }
        ,


        /**
         * Will select an element from drop down (from <select>)
         * @param page -> the puppetter page
         * @param dropDownSelectorOrElement -> the <select> element, in a form of selector or element
         * @param optionSelectorOrElementToSelect -> the <option> to select from the drop down
         * @param delayAfterClick -> how long to wait after click
         * @param selectorToFindAfterClick -> selector to search afterwards
         * @param howLongToWaitForSelector -> if you chose to wait afterwards, set how long
         * @param delayAfterSelectorFound -> if you chose to wait afterwards, set how long to wait after
         */
        selectFromDropDown: async function (page,
                                            dropDownSelectorOrElement,
                                            optionSelectorOrElementToSelect,
                                            delayAfterClick = 0,
                                            selectorToFindAfterClick = null,
                                            howLongToWaitForSelector = null,
                                            delayAfterSelectorFound = 1500) {

            // if didn't find the element, recall function
            let dropDownEle = dropDownSelectorOrElement;
            if (isSelector(dropDownSelectorOrElement)) {
                dropDownEle = await self.getElementBySelector(page, dropDownSelectorOrElement)
            }


            let optionEle = optionSelectorOrElementToSelect;
            if (isSelector(optionSelectorOrElementToSelect)) {
                optionEle = await self.getElementBySelector(page, optionSelectorOrElementToSelect)
            }

            try {
                await page.evaluate((optionEle, dropDownEle) => {
                    optionEle.selected = true;
                    const event = new Event('change', {bubbles: true});
                    dropDownEle.dispatchEvent(event);
                }, optionEle, dropDownEle);
            } catch (e) {
                let optionSelect = await tools.promptUser("didnt find the option: " + optionSelectorOrElementToSelect + " please write the right selector here. Type 'skip' if you already selected the option yourself");

                if (optionSelect !== undefined && optionSelect.toLowerCase() === 'skip') {
                    console.log("skipping")
                } else if (optionSelect.toLowerCase() !== 'skip') {
                    await self.selectFromDropDown(page, dropDownSelectorOrElement, optionSelect, delayAfterClick, selectorToFindAfterClick, howLongToWaitForSelector, delayAfterSelectorFound);
                    return
                }
            }

            await tools.delay(delayAfterClick);
            if (selectorToFindAfterClick != null) {
                await self.waitForSelector(page, selectorToFindAfterClick, howLongToWaitForSelector, delayAfterSelectorFound)
            }
        }
        ,


        /**
         * Will press ENTER on the keyboard
         **/
        pressEnter: async function (page, delayAfterPress = 0, selectorToFindAfterClick = null, howLongToWaitForSelector = null, delayAfterSelectorFound = 1500) {
            await page.keyboard.press('Enter');
            await tools.delay(delayAfterPress);
            if (selectorToFindAfterClick != null) {
                await self.waitForSelector(page, selectorToFindAfterClick, howLongToWaitForSelector, delayAfterSelectorFound)
            }
        }
        ,

        /**
         * Will type some text
         **/
        type: async function (page, text, typeDelay = 20, delayAfter = 0) {
            await page.keyboard.type(text, {delay: typeDelay});
            await tools.delay(delayAfter)
        }
        ,

        /**
         * Will press the esc key
         */
        pressEsc: async function (page, delayAfterPress = 0, selectorToFindAfterClick = null, howLongToWaitForSelector = null, delayAfterSelectorFound = 1500) {
            await page.keyboard.press('Escape');
            await tools.delay(delayAfterPress);
            if (selectorToFindAfterClick != null) {
                await self.waitForSelector(page, selectorToFindAfterClick, howLongToWaitForSelector, delayAfterSelectorFound)
            }
        }
        ,


        /**
         * Will check if the selector/element is visible
         */
        isElementVisible: async function (page, selector, element = null) {
            if (selector !== null) {
                return await page.waitForSelector(selector, {
                    visible: true
                })
            }

            if (element !== null) {
                let displayVal = await page.evaluateHandle(el => el.getAttribute('style'), element);
                let val = await displayVal.jsonValue();
                return !val.includes('none')
            }
        }
        ,

        /**
         * Will return only visible elements from a list of elements
         */
        getOnlyVisibleElements: async function (page, elesList) {
            let eles = [];
            for (let i = 0; i <= elesList.length; i++) {
                let isEleVisible = await self.isElementVisible(page, null, elesList[i]);
                if (isEleVisible) {
                    eles.push(elesList[i])
                }
            }
            return eles
        }
        ,

        /**
         * Will check if element has attribute
         */
        isElementHasAttribute: async function (page, eleOrSelector, attName) {
            if (typeof eleOrSelector === 'string') {
                eleOrSelector = await self.getElementBySelector(page, eleOrSelector)
            }

            return await page.evaluate((element, att) => {
                return element.getAttribute(att)
            }, eleOrSelector, attName) !== null;
        }
        ,


        /**
         * Will remove elements contains a certain text from a list
         *
         * @param page -> the puppeteer page
         * @param elesList -> the list of elements to search the inner text
         * @param text -> the inner text to look for
         * @param caseSensitive -> ignore capitals etc...
         * @param includes -> true if only included part from element text comprise your text, and not all of it
         * @param identical -> true for exact text match
         */
        removeElementsContainTextFromList: async function (page, elesList, text, caseSensitive = false, includes = true, identical = false) {

            if (!caseSensitive) {
                text = text.toLowerCase()
            }

            let fitEles = [];
            for (let i = 0; i <= elesList.length; i++) {
                let innerTxt = await self.getInnerHTML(page, elesList[i]);
                if (innerTxt !== null && innerTxt !== "") {
                    innerTxt = innerTxt.toLowerCase();
                    if (includes && !innerTxt.includes(text)) {
                        fitEles.push(elesList[i])
                    } else if (identical && innerTxt !== text) {
                        fitEles.push(elesList[i])
                    }
                } else {
                    fitEles.push(elesList[i])
                }
            }
            return fitEles
        }
    }
;

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


// a type check to see if the variable is selector
function isSelector(myVar) {
    return typeof myVar === 'string' || myVar instanceof String
}