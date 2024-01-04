// jshint esversion: 6
(() => {
    const DATE_CLASS = "resultDetailsCell2", DATE_REGEX = /[^0-9\/]+/gmi;
    const JSON_PATH = "oldMarkSixResults.json";
    const NUMBER_CLASS = "resultDetailsInner";
    const NUMBER_INDICES = [0, 1, 2, 3, 4, 5, 7], NUMBER_SRC_POSTS = [
        ".gif?CV=L4.02R1",
        ".gif?CV=L4.02R1_CRQ129532",
        ".gif?CV=L4.03R2",
        "a_AppD_fix_CRQ130467",
        "b",
        "_CRQ000000131716",
        ".gif?CV=L4.04R1a",
        ".gif?CV=L4.04R2",
        ".gif?CV=L4.05R2d",
        "_CRQ000000136252",
        ".gif?CV=L4.05R3",
        ".gif?CV=L4.06R0a",
        "_CRQ000000136757",
        ".gif?CV=CO137482",
        ".gif?CV=L4.06R0",
        "c"
    ], NUMBER_SRC_PRE = "file:///F:/marksix/info/images/icon/no_";
    const RESULT_6_CLASS = "orangeNum2", RESULT_OTHER_CLASS = "orangeNum1";
    const RESULT_REGEX = /\D+/gmi;
    const parsedResult = innerHTML => {
        const div = document.createElement("div");
        div.innerHTML = innerHTML;
        return [
            parsedDate(div),
            { numbers: parsedNumbers(div), prices: parsedPrices(div) }
        ];
    }, parsedDate = div => {
        const rawDate = div.getElementsByClassName(DATE_CLASS);
        return removeInnerHTML(rawDate.item(0), DATE_REGEX);
    }, parsedNumbers = div => {
        const spans = div.getElementsByClassName(NUMBER_CLASS);
        return NUMBER_INDICES.map(index => {
            const src = spans.item(index).children.item(0).src;
            const srcNoPrePost = NUMBER_SRC_POSTS.reduce((srcNoPre, noPost) => {
                return remove(srcNoPre, noPost);
            }, remove(src, NUMBER_SRC_PRE));
            const number = +srcNoPrePost;
            if (isNaN(number)) console.warn(srcNoPrePost);
            return `${number}`;
        });
    }, parsedPrices = div => {
        const prices = {};
        const span6_ = div.getElementsByClassName(RESULT_6_CLASS).item(0);
        if (span6_) {
            const price = +removeInnerHTML(span6_, RESULT_REGEX);
            if (price) prices["6"] = price;
        }
        const spanOthers = div.getElementsByClassName(RESULT_OTHER_CLASS);
        [...new Array(spanOthers.length - 4)].forEach((_, i) => {
            const price = +removeInnerHTML(spanOthers.item(i), RESULT_REGEX);
            if (price) prices[`${5.5 - i * 0.5}`] = price;
        });
        return prices;
    }, removeInnerHTML = ({ innerHTML }, regex) => remove(innerHTML, regex);
    const remove = (string, regex) => string.replace(regex, "");
    const exportJSON = a => a.dispatchEvent(exportJSONEvent());
    const exportJSONEvent = () => {
        const event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0,
                false, false, false, false, 0, null);
        return event;
    }, exportJSONDom = date => {
        var a = document.createElement('a');
        a.download = `${date}${JSON_PATH}`;
        a.href = window.URL.createObjectURL(new Blob([
            `OLD_RESULTS = ${JSON.stringify(OLD_RESULTS, null, "\t")}`
        ], { type: 'text/json' }));
        a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
        return a;
    }, result = parsedResult(CONTAINER_INNER_HTML);
    console.info("result", result);
    const date = result[0];
    if (new Map(OLD_RESULTS).has(date)) {
        console.warn(`OLD_RESULTS already has ${date}!`);
    }
    const { numbers, prices } = result[1];
    if (numbers.some(number => isNaN(number))) console.warn("numbers", numbers);
    if (Object.entries(prices).some(([number, price]) => {
        return isNaN(number) || isNaN(price);
    })) console.warn("prices", prices);
    OLD_RESULTS.push(result);
    const dates = OLD_RESULTS.map(oldResult => {
        return oldResult[0].split("/").reverse().join("/");
    }), dateCount = dates.length;
    for (let i = 1; i < dateCount; i++) {
        const ithDateString = dates[i], iMinus1thDateString = dates[i - 1];
        const ithDate = new Date(ithDateString);
        const iMinus1thDate = new Date(iMinus1thDateString);
        const timeDifference = ithDate.getTime() - iMinus1thDate.getTime();
        const dateDifference = timeDifference / 86400000;
        if (dateDifference > 3) {
            const methodName = OLD_RESULTS[i] === result ? "warn" : "info";
            console[methodName](`Date of index ${i}: ${ithDateString}`,
                    `Date of index ${i - 1}: ${iMinus1thDateString}`,
                    `Difference is ${dateDifference} but should be <= 3!`);
        }
        if (dateDifference > 1) continue;
        console.warn(`Date of index ${i}: ${ithDateString}`);
        console.warn(`Date of index ${i - 1}: ${iMinus1thDateString}`);
        console.warn(`Difference is ${dateDifference} but should be > 1!`);
    }
    console.info("OLD_RESULTS", OLD_RESULTS);
    exportJSON(exportJSONDom(date));
})();
