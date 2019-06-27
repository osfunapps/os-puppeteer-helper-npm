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

    await ph.setText(page, selector, text, delayAfter = 0, typeDelay = 20, clearTextBefore = true)
                           
Click and wait for selector:
        
    await ph.click(page, selector, delayAfterClick = 0, selectorToFindAfterClick = null, howLongToWaitForSelector = 240000, delayAfterSelectorFound = 1500) 
      
Wait for selector to be removed from the dom:
    
    await ph.waitForSelectorToBeRemoved(page, selector, checkEach = 2000)
        
Click on element contains certain text:

    await ph.clickOnElementContainsText(page, selector, text, delayAfterClick = 0, selectorToFindAfterClick = null, howLongToWaitForSelector = null, delayAfterSelectorFound = 1500) { 

Download a file:
    
    await ph.downloadFile(page, path, downloadSelector)     

And a lot more!

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

If you're trying to web scrape, consider integrate this module with [os-cheerio-helper](https://www.npmjs.com/package/os-cheerio-helper) for more professional use.  

## Links
[npm os-puppeteer-helper](https://www.npmjs.com/package/os-puppeteer-helper)

## Licence
ISC


# os-puppeteer-helper-npm
