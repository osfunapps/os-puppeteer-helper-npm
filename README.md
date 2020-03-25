Introduction
------------

This project meant to provide intuitive functions to use Google's Puppeteer, without wasting time.

You can scroll down for a cool ebay example!

## Installation and use

Install via npm:
    
    npm i os-puppeteer-helper
        
Require ph:
        
    var ph = require("os-puppeteer-helper")
                
Create a browser:     
    
    let bt = await ph.createBrowser(url, slowMo = 5, headless = false, width = 1300, height = 768)
        
    // save the page and the browser
    let browser = bt[0];
    let page = bt[1];
        
Navigate to a page:     
    
    await ph.navigateTo(page, url, givenTimeout = null, waitForSelector = null, timeoutSelectorSearch = 24000,
                                                                                delayAfterSelector = 1500,
                                                                                delayAfterNavigated = 0) {
Insert text by selectors:

    await ph.setTextToSelector(page, selector, text, delayAfter = 0, typeDelay = 20, clearTextBefore = true)
                           
Click and wait for selector:
        
    await ph.clickOnSelector(page, selector, delayAfterClick = 0, selectorToFindAfterClick = null, howLongToWaitForSelector = 240000, delayAfterSelectorFound = 1500) 
      
Wait for selector to be removed from the dom:
    
    await ph.waitForSelectorToBeRemoved(page, selector, checkEach = 2000)
        
Click on element contains certain text:

    await ph.clickOnElementContainsText(page, selector, text, delayAfterClick = 0, selectorToFindAfterClick = null, howLongToWaitForSelector = null, delayAfterSelectorFound = 1500) { 

Download a file:
    
    await ph.downloadFile(page, path, downloadSelector)     

And a lot more!

## Methods and signatures

    
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
        
        /**
         * Will create a new firefox browser
         *
         * @param url -> the url to log in to
         * @param slowMo -> how long to wait before each command
         * @param headless -> show/hide browser
         * @param width -> browser width
         * @param height -> browser height
         */
        createFirefoxBrowser: async function (url = "about:blank", slowMo = 5, headless = false, width = 1300, height = 768)

        /**
         * Will navigate to a certain url with an option to search for a selector after page load
         */
        navigateTo: async function (page,
                                    url,
                                    givenTimeout = null,
                                    waitForSelector = null,
                                    timeoutSelectorSearch = null,
                                    delayAfterSelector = 1500,
                                    delayAfterNavigated = 0)

        /**
         * Will wait for an element to appear.
         *
         * @param page -> the puppeteer page
         * @param selector -> the selector to search for
         * @param timeout -> 0 to disable timeout
         * @param delayAfterFound -> how long to wait after found
         * @return ElementHandle -> the element, if found, else, undefined
         */
        waitForSelector: async function (page, selector, timeout = null, delayAfterFound = 1500)

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
                                                 caseSensitive = false)

        /**
         * Will wait for an element to be removed from the dom
         *
         * @param page -> the page
         * @param selector -> the selector to be removed
         * @param checkEach -> search every x millis for the selector
         * @param disappearFor -> the selector should disappear for x millis
         */
        waitForSelectorToBeRemoved: async function (page, selector, checkEach = 2000, disappearFor = 1000)

        /**
         * Will wait for elements to appear
         */
        waitForSelectors: async function (page, timeout = null, delayAfterFound = 1500, ...selectors)


        /**
         * Will find an element by it's partial attribute value
         */
        getElementByPartialAttributeValue: async function (page, eleTag, eleAttributeName, partialAttributeValue, findMoreThanOneElement = false)

        /**
         * Will find an element by it's attribute value suffix
         */
        getElementBySuffixAttributeValue: async function (page, eleTag, eleAttributeName, attributeSuffixValue, findMoreThanOneElement = false)


        /**
         * Will find an element by it's attribute value prefix
         */
        getElementByPrefixAttributeValue: async function (page, eleTag, eleAttributeName, attributePrefixValue, findMoreThanOneElement = false)

        /**
         * Will wait for navigation to change
         */
        waitForNavigation: async function (page, selector, timeout = null)


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
        setTextToSelector: async function (page, selector, text, delayAfter = 0, typeDelay = 20, clearTextBefore = true)

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
        setTextToXpath: async function (page, xpath, text, delayAfter = 0, typeDelay = 20, clearTextBefore = true)

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
        setTextToElement: async function (page, element, text, delayAfter = 0, typeDelay = 20, clearTextBefore = true)


        /**
         * Will type alpha/numerical on the keyboard
         *
         * @param page -> the current page
         * @param text -> the text to write
         * @param delay -> the delay between letters
         * @param delayAfter -> the delay after the whole type
         */
        typeOnKeyboard: async function (page, text, delay = 2, delayAfter = 0)


        /**
         * Will read text from selector
         *
         * @param page -> the current page
         * @param selector -> the selector to read
         * @param innerText -> true for innerText, false for innerHTML
         * @param delayAfter -> the delay after the whole type
         */
        readTextFromSelector: async function (page, selector, innerText = true, delayAfter = 0)

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
                                         delayAfterSelectorFound = 1500)

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
                                      delayAfterSelectorFound = 1500)


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
                                           delayAfterClick = 0)
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
                                              delayAfterClick = 0)

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
                                                          delayAfterSelectorFound = 1500)

        /**
         * Will mouse click on element
         *
         * @param element -> the element to click
         * @param mouseBtn -> the mouse btn to click ('left'/'right')
         * @param delayAfterClick -> optional delay after click
         */
        mouseClickOnElement: async function (element,
                                             mouseBtn = 'left',
                                             delayAfterClick = 0)
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
                                        delayAfterSelectorFound = 1500)
        


        /**
         * Will selectByValue an element based on it's value
         * For more formidable approach, look for CheerioHelper.isSelectHasValue()
         */
        selectByValue: async function (page, selector, value, delayAfter = 0)


        /**
         * Will clear text from selector or element
         */
        clearText: async function (page, selector, element = null, delayAfter = 0)

        /**
         * Will create a count down (10 9 8 ...)
         */
        makeCountDown: async function (from)

        /**
         * Will download a file.
         * NOTICE: if you only want to change the saving location of a file, call setDownloadedFilesLocation(output).
         *
         * @param page -> the puppeteer page
         * @param outputPath -> the path to the downloaded file
         * @param downloadSelector -> the selector to click in order to start the download
         */
        downloadFile: async function (page, outputPath, downloadSelector)

        /**
         * will set the location to which the downloaded files will be saved
         */
        setDownloadedFilesLocation: async function (page, outputPath)
        

        /**
         * will scroll a selector into view
         */
        scrollSelectorIntoView: async function (page, selector)
        ,

        /**
         * will scroll an xpath into view
         */
        scrollXPathIntoView: async function (page, xpath)

        /**
         * will scroll an element into view
         */
        scrollElementIntoView: async function (page, element)

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
                                                    delayAfterSelectorFound = 1500)


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
                                          innerHTML = true)

        /**
         * Will return element/s from the dom
         */
        getElementsBySelector: async function (page, selector)

        /**
         * Will return element from the dom/other element.
         * If no found, return undefined
         */
        getElementBySelector: async function (pageOrElement, selector)

        /**
         * Will return element from the dom/other element.
         * If no found, return undefined
         */
        getElementByXPath: async function (pageOrElement, xpath)

        /**
         * Will return the next sibling element from another element
         */
        getNextSibling: async function (page, element)

        /**
         * Will return the previous sibling element from another element
         */
        getPreviousSibling: async function (page, element)

        /**
         * Will return the parent of an element
         */
        getParent: async function (page, element)

        /**
         * Will return the sibling of an element
         */
        getOnlyDirectChildren: async function (page, element)


        /**
         * Will return the inner html of an element
         */
        getInnerHTML: async function (page, element)

        /**
         * Will return the inner text of an element
         */
        getInnerText: async function (page, element)
        
        /**
         * Will set the element attribute value
         */
        setElementAttributeValue: async function (page, elementOrSelector, attribName, attribValue)

        /**
         * Will return an attribute value from an element
         */
        getAttributeValueFromElement: async function (page, element, attName)

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
                                                         isElementAfterLabel = false)

        /**
         * Will return the inner html of an element
         */
        getInnerHTMLFromElement: async function (element)
        
        /**
         * Will kill the browser
         */
        close: async function (browser)

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
                                            delayAfterSelectorFound = 1500)

        /**
         * Will press ENTER on the keyboard
         **/
        pressEnter: async function (page, delayAfterPress = 0, selectorToFindAfterClick = null, howLongToWaitForSelector = null, delayAfterSelectorFound = 1500) {
            await page.keyboard.press('Enter');
            await tools.delay(delayAfterPress);
            if (selectorToFindAfterClick != null)

        /**
         * Will type some text
         **/
        type: async function (page, text, typeDelay = 20, delayAfter = 0)

        /**
         * Will press the esc key
         */
        pressEsc: async function (page, delayAfterPress = 0, selectorToFindAfterClick = null, howLongToWaitForSelector = null, delayAfterSelectorFound = 1500)

        /**
         * Will check if the selector/element is visible
         */
        isElementVisible: async function (page, selector, element = null)

        /**
         * Will return only visible elements from a list of elements
         */
        getOnlyVisibleElements: async function (page, elesList) 

        /**
         * Will check if element has attribute
         */
        isElementHasAttribute: async function (page, eleOrSelector, attName)

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
        removeElementsContainTextFromList: async function (page, elesList, text, caseSensitive = false, includes = true, identical = false)
    

## Example

a short example of initiating a purchase from ebay:   

    // create the browser
    let tuplee = await ph.createBrowser("about:blank");
    let browser = tuplee[0];
    let page = tuplee[1];
            
    // navigate to eBay
    await ph.navigateTo(page, 'https://www.ebay.com/signin/');

    // insert username and pass
    await ph.setText(page, "#userid", ebayUsername);
    await ph.setText(page, "#pass", ebayPas);
    
    // click ok and wait
    await ph.click(page, "#sgnBt");
    console.log("waiting for selector...
    await ph.waitForSelector(page, "form[id = 'gh-f'");
    console.log("done waiting!");


    // navigate to a shopping page and wait
    await ph.navigateTo(page, EBAY_LINK, null, "label[for = 'qtyTextBox']", null);
    
    // clear the quantity box and set it with your receipt obj quantity 
    await ph.clearText(page, "input[id = 'qtyTextBox']");
    await ph.setText(page, "input[id = 'qtyTextBox']", receipt.quantity);

    // click on buy
    await ph.click(page, "#binBtn_btn");    
    
    // at the make a purchase page, wait for the quantity, at the bottom, to appear
    await ph.waitForSelector(page, "div.item-image");            

    //...
    

## Additional notes

If you're trying to web scrape, consider integrate this module with [os-cheerio-helper](https://github.com/osfunapps/os-cheerio-helper-npm) for more professional use.  

## Links -> see more tools
* [os-tools-npm](https://github.com/osfunapps/os-tools-npm) -> This module contains fundamental functions to implement in an npm project
* [os-file-handler-npm](https://github.com/osfunapps/os-file-handler-npm) -> This module contains fundamental files manipulation functions to implement in an npm project
* [os-file-stream-handler-npm](https://github.com/osfunapps/os-file-stream-handler-npm) -> This module contains read/write and more advanced operations on files
* [os-xml-handler-npm](https://github.com/osfunapps/os-xml-handler-npm) -> This module will build, read and manipulate an xml file. Other handy stuff is also available, like search for specific nodes

[GitHub - osapps](https://github.com/osfunapps)


## Licence
ISC


# os-puppeteer-helper-npm
