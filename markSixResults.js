// jshint esversion: 6
(() => {
    const AGES = Object.fromEntries([...new Array(49)].map((_, i) => {
        return [`${i + 1}`, 0];
    })), COLORS = {
        red: [1, 2, 7, 8, 12, 13, 18, 19, 23, 24, 29, 30, 34, 35, 40, 45, 46],
        blue: [3, 4, 9, 10, 14, 15, 20, 25, 26, 31, 36, 37, 41, 42, 47, 48],
        green: [5, 6, 11, 16, 17, 21, 22, 27, 28, 32, 33, 38, 39, 43, 44, 49]
    }, COST = 10, FREQUENT_NUMBER_PRICE_RESULT_COUNTS = [
        ["0", 0],
        ["0.5", 0],
        ["1", 0],
        ["1.5", 0],
        ["2", 0],
        ["2.5", 0],
        ["3", 0],
        ["3.5", 0],
        ["4", 0],
        ["4.5", 0],
        ["5", 0],
        ["5.5", 0],
        ["6", 0]
    ], FIRST_DATE = "2010/11/09", FREQUENCIES = {}, IS_COUNT_SPECIAL = false;
    const IS_FORCE_RANDOM_BEST_BIGGER_PRICE_RESULTS = false;
    const IS_FORCE_RANDOM_BEST_GET_GAINS = false;
    const IS_FORCE_RANDOM_BEST_POSITIVE_PRICE_RESULTS = false;
    const IS_SHOW_KEY_INFO_ONLY = true;
    const NET_GAINS = {}, NUMBERS = {}, NUMBER_PRICE_RESULTS = {};
    const NUMBER_PRICE_RESULT_COUNTS = {};
    const PARTITION_AGE_MODULI = Object.fromEntries([
        ...new Array(7)
    ].map((_, i) => [i, 0])), PARTITION_AGE_VALUES = Object.fromEntries([
        ...new Array(7)
    ].map((_, i) => [i, 0]));
    const PARTITION_FREQUENCY_MODULI = {}, PARTITION_FREQUENCY_VALUES = {};
    const PARTITION_MODULI = {
        0: ["7", "14", "21", "28", "35", "42", "49"],
        1: ["1", "8", "15", "22", "29", "36", "43"],
        2: ["2", "9", "16", "23", "30", "37", "44"],
        3: ["3", "10", "17", "24", "31", "38", "45"],
        4: ["4", "11", "18", "25", "32", "39", "46"],
        5: ["5", "12", "19", "26", "33", "40", "47"],
        6: ["6", "13", "20", "27", "34", "41", "48"]
    }, PARTITION_VALUES = {
        0: ["1", "2", "3", "4", "5", "6", "7"],
        1: ["8", "9", "10", "11", "12", "13", "14"],
        2: ["15", "16", "17", "18", "19", "20", "21"],
        3: ["22", "23", "24", "25", "26", "27", "28"],
        4: ["29", "30", "31", "32", "33", "34", "35"],
        5: ["36", "37", "38", "39", "40", "41", "42"],
        6: ["43", "44", "45", "46", "47", "48", "49"]
    }, PRICES = { "4.5": 9600, "4": 640, "3.5": 320, "3": 40 };
    const RESULTS = new Map(OLD_RESULTS.filter(([date]) => {
        return FIRST_DATE && date.split("/").reverse().join("/") >= FIRST_DATE;
    }));
    const frequencyMinusAge = ([number, frequency]) => {
        return [number, frequency - AGES[number]];
    }, frequencyOverAge = ([number, frequency]) => {
        return [number, frequency * 1.0 / AGES[number]];
    }, frequencyPowerOverAge = ([number, frequency]) => {
        return [number, Math.pow(frequency, 1.0 / AGES[number])];
    }, leastFrequentNumberComparator = ([numberA, frequencyA], [numberB, frequencyB]) => frequencyA - frequencyB;
    const mostFrequentNumberComparator = ([numberA, frequencyA], [numberB, frequencyB]) => frequencyB - frequencyA;
    const frequentNumbers = comparator => Object.entries(FREQUENCIES).sort(comparator).slice(0, 6).map(mappedFrequentNumbers);
    const frequentOldestNumbers = (relation, comparator) => Object.entries(FREQUENCIES).map(relation).sort(comparator).slice(0, 6).map(mappedFrequentNumbers);
    const middleNumbers = sortedFrequentNumbers => {
        const sortedFrequentNumbersCount = sortedFrequentNumbers.length;
        if (sortedFrequentNumbersCount <= 6) {
            return sortedFrequentNumbers;
        } else if (sortedFrequentNumbersCount % 2 === 0) {
            const startIndex = (sortedFrequentNumbersCount - 6) / 2;
            return sortedFrequentNumbers.slice(startIndex, startIndex + 6);
        }
        const startIndex = (sortedFrequentNumbersCount - 7) / 2;
        const sortedMiddleFrequentNumbers = sortedFrequentNumbers.slice(startIndex, startIndex + 7);
        sortedMiddleFrequentNumbers.splice(3, 1);
        return sortedMiddleFrequentNumbers;
    }, middleFrequentOldestNumbers = relation => middleNumbers(Object.entries(FREQUENCIES).map(relation).sort(leastFrequentNumberComparator).map(mappedFrequentNumbers));
    const mappedFrequentNumbers = ([number]) => number;
    const mappedNumberFrequencies = (frequencies, number) => {
        return [number, frequencies[number]];
    }, partitionFrequentNumbers = (partitionFrequencies, partitions, comparator) => {
        const numbers = [];
        const entries = Object.entries(partitionFrequencies).sort(comparator);
        let repeatedPartitionCount = 7 - entries.length;
        if (repeatedPartitionCount <= 0) entries.splice(6, 1);
        entries.forEach(([partition, frequency]) => {
            const count = Math.min(frequency, repeatedPartitionCount + 1);
            if (repeatedPartitionCount > 0) repeatedPartitionCount -= count - 1;
            numbers.push(...partitions[partition].map(mappedNumberFrequencies.bind(null, FREQUENCIES)).sort(comparator).map(mappedFrequentNumbers).slice(0, count));
        });
        return numbers;
    }, partitionFrequentOldestNumbers = (partitionFrequencies, partitions, partitionRelation, numberRelation, comparator) => {
        const numbers = [];
        const entries = Object.entries(partitionFrequencies).map(partitionRelation).sort(comparator);
        let repeatedPartitionCount = 7 - entries.length;
        if (repeatedPartitionCount <= 0) entries.splice(6, 1);
        entries.forEach(([partition]) => {
            const count = Math.min(partitionFrequencies[partition], repeatedPartitionCount + 1);
            if (repeatedPartitionCount > 0) repeatedPartitionCount -= count - 1;
            const partitionNumbers = partitions[partition];
            numbers.push(...partitionNumbers.map(numberRelation).sort(comparator).map(mappedFrequentNumbers).slice(0, count));
        });
        return numbers;
    }, partitionFrequentMinusOldestNumbers = (partitionFrequencies, partitionAges, partitions, comparator) => {
        return partitionFrequentOldestNumbers(partitionFrequencies, partitions, ([partition, frequency]) => {
            return [partition, frequency - partitionAges[partition]];
        }, number => [number, FREQUENCIES[number] - AGES[number]], comparator);
    }, partitionFrequentOverOldestNumbers = (partitionFrequencies, partitionAges, partitions, comparator) => {
        return partitionFrequentOldestNumbers(partitionFrequencies, partitions, ([partition, frequency]) => {
            return [partition, frequency * 1.0 / partitionAges[partition]];
        }, number => [number, FREQUENCIES[number] * 1.0 / AGES[number]], comparator);
    }, partitionFrequentPowerOverOldestNumbers = (partitionFrequencies, partitionAges, partitions, comparator) => {
        return partitionFrequentOldestNumbers(partitionFrequencies, partitions, ([partition, frequency]) => {
            return [partition, Math.pow(frequency, 1.0 / partitionAges[partition])];
        }, number => [number, Math.pow(FREQUENCIES[number], 1.0 / AGES[number])], comparator);
    }, partitionMiddleFrequentNumbers = (partitionFrequencies, partitions) => {
        const numbers = [];
        const entries = Object.entries(partitionFrequencies).sort(leastFrequentNumberComparator);
        let repeatedPartitionCount = 7 - entries.length;
        if (repeatedPartitionCount <= 0) entries.splice(3, 1);
        entries.forEach(([partition, frequency]) => {
            const count = Math.min(frequency, repeatedPartitionCount + 1);
            if (repeatedPartitionCount > 0) repeatedPartitionCount -= count - 1;
            const offset = Math.floor(count / 2);
            const middleNumbers = partitions[partition].map(mappedNumberFrequencies.bind(null, FREQUENCIES)).sort(leastFrequentNumberComparator).map(mappedFrequentNumbers).slice(3 - offset, 4 + offset);
            if (middleNumbers.length > 6) {
                middleNumbers.splice(offset, (count + 1) % 2);
            }
            numbers.push(...middleNumbers);
        });
        return numbers;
    }, partitionMiddleFrequentOldestNumbers = (partitionFrequencies, partitions, partitionRelation, numRelation) => {
        const numbers = [];
        const entries = Object.entries(partitionFrequencies).map(partitionRelation).sort(leastFrequentNumberComparator);
        let repeatedPartitionCount = 7 - entries.length;
        if (repeatedPartitionCount <= 0) entries.splice(3, 1);
        entries.forEach(([partition, frequency]) => {
            const count = Math.min(frequency, repeatedPartitionCount + 1);
            if (repeatedPartitionCount > 0) repeatedPartitionCount -= count - 1;
            const offset = Math.floor(count / 2);
            const middleNumbers = partitions[partition].map(numRelation).sort(leastFrequentNumberComparator).map(mappedFrequentNumbers).slice(3 - offset, 4 + offset);
            if (middleNumbers.length > 6) {
                middleNumbers.splice(offset, (count + 1) % 2);
            }
            numbers.push(...middleNumbers);
        });
        return numbers;
    }, partitionMiddleFrequentMinusOldestNumbers = (partitionFrequencies, partitionAges, partitions) => {
        return partitionMiddleFrequentOldestNumbers(partitionFrequencies, partitions, ([partition, frequency]) => {
            return [partition, frequency - partitionAges[partition]];
        }, number => [number, FREQUENCIES[number] - AGES[number]]);
    }, partitionMiddleFrequentOverOldestNumbers = (partitionFrequencies, partitionAges, partitions) => {
        return partitionMiddleFrequentOldestNumbers(partitionFrequencies, partitions, ([partition, frequency]) => {
            return [partition, frequency * 1.0 / partitionAges[partition]];
        }, number => [number, FREQUENCIES[number] * 1.0 / AGES[number]]);
    }, partitionMiddleFrequentPowerOverOldestNumbers = (partitionFrequencies, partitionAges, partitions) => {
        return partitionMiddleFrequentOldestNumbers(partitionFrequencies, partitions, ([partition, frequency]) => {
            return [partition, Math.pow(frequency, 1.0 / partitionAges[partition])];
        }, number => [number, Math.pow(FREQUENCIES[number], 1.0 / AGES[number])]);
    }, partitionOldestNumbers = (partitionAges, partitions) => Object.entries(partitionAges).sort(mostFrequentNumberComparator).slice(0, 6).map(([partition]) => {
        return partitions[partition].map(mappedNumberFrequencies.bind(null, AGES)).sort(mostFrequentNumberComparator).map(mappedFrequentNumbers)[0];
    }), ascendingComparator = (numberA, numberB) => numberA - numberB;
    const isGoodRandom = numbers => {
        const sortedNumbers = numbers.map(number => {
            return +number;
        }).sort(ascendingComparator);
        if (Object.values(COLORS).some(numbers => {
            return sortedNumbers.every(number => numbers.includes(number));
        }) || [[1, 9], [10, 19], [20, 29], [30, 39], [40, 49]].every(range => {
            return sortedNumbers.some(number => {
                return number >= range[0] && number <= range[1];
            });
        }) || [0, 1].some(modulo => {
            return sortedNumbers.every(number => number % 2 === modulo);
        }) || [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].some(modulo => {
            return sortedNumbers.filter(number => {
                return number % 10 === modulo;
            }).length > 2;
        }) || sortedNumbers.filter(number => {
            return number % 10 > 4;
        }).length > 4 || sortedNumbers.filter(number => {
            return number % 10 < 5;
        }).length > 4) return false;
        let consecutiveNumberCount = 0;
        for (i = 1; i < 6; i++) {
            if (sortedNumbers[i] - sortedNumbers[i - 1] === 1) {
                consecutiveNumberCount++;
                if (consecutiveNumberCount > 2) return false;
            } else consecutiveNumberCount = 0;
        }
        const sum = sortedNumbers.reduce((total, number) => total + number, 0);
        if (sum < 91 || sum > 210) return false;
        if (sortedNumbers[0] > 19 || sortedNumbers[5] <= 30) return false;
        return !OLD_RESULTS.some(([_, { numbers }]) => {
            return sortedNumbers.every((number, i) => number === +numbers[i]);
        });
    };
    const STRATEGIES = {
        leastFrequent: frequentNumbers.bind(null, leastFrequentNumberComparator),
        leastFrequentMinusOldest: frequentOldestNumbers.bind(null, frequencyMinusAge, leastFrequentNumberComparator),
        leastFrequentOverOldest: frequentOldestNumbers.bind(null, frequencyOverAge, leastFrequentNumberComparator),
        leastFrequentPowerOverOldest: frequentOldestNumbers.bind(null, frequencyPowerOverAge, leastFrequentNumberComparator),
        middleFrequent: () => middleNumbers(Object.entries(FREQUENCIES).sort(leastFrequentNumberComparator).map(mappedFrequentNumbers)),
        middleFrequentMinusOldest: middleFrequentOldestNumbers.bind(null, frequencyMinusAge),
        middleFrequentOverOldest: middleFrequentOldestNumbers.bind(null, frequencyOverAge),
        middleFrequentPowerOverOldest: middleFrequentOldestNumbers.bind(null, frequencyPowerOverAge),
        mostFrequent: frequentNumbers.bind(null, mostFrequentNumberComparator),
        mostFrequentMinusOldest: frequentOldestNumbers.bind(null, frequencyMinusAge, mostFrequentNumberComparator),
        mostFrequentOverOldest: frequentOldestNumbers.bind(null, frequencyOverAge, mostFrequentNumberComparator),
        mostFrequentPowerOverOldest: frequentOldestNumbers.bind(null, frequencyPowerOverAge, mostFrequentNumberComparator),
        oldest: () => Object.entries(AGES).sort(mostFrequentNumberComparator).slice(0, 6).map(mappedFrequentNumbers),
        partitionModuloLeastFrequent: partitionFrequentNumbers.bind(null, PARTITION_FREQUENCY_MODULI, PARTITION_MODULI, leastFrequentNumberComparator),
        partitionModuloLeastFrequentMinusOldest: partitionFrequentMinusOldestNumbers.bind(null, PARTITION_FREQUENCY_MODULI, PARTITION_AGE_MODULI, PARTITION_MODULI, leastFrequentNumberComparator),
        partitionModuloLeastFrequentOverOldest: partitionFrequentOverOldestNumbers.bind(null, PARTITION_FREQUENCY_MODULI, PARTITION_AGE_MODULI, PARTITION_MODULI, leastFrequentNumberComparator),
        partitionModuloLeastFrequentPowerOverOldest: partitionFrequentPowerOverOldestNumbers.bind(null, PARTITION_FREQUENCY_MODULI, PARTITION_AGE_MODULI, PARTITION_MODULI, leastFrequentNumberComparator),
        partitionModuloMiddleFrequent: partitionMiddleFrequentNumbers.bind(null, PARTITION_FREQUENCY_MODULI, PARTITION_MODULI),
        partitionModuloMiddleFrequentMinusOldest: partitionMiddleFrequentMinusOldestNumbers.bind(null, PARTITION_FREQUENCY_MODULI, PARTITION_AGE_MODULI, PARTITION_MODULI),
        partitionModuloMiddleFrequentOverOldest: partitionMiddleFrequentOverOldestNumbers.bind(null, PARTITION_FREQUENCY_MODULI, PARTITION_AGE_MODULI, PARTITION_MODULI),
        partitionModuloMiddleFrequentPowerOverOldest: partitionMiddleFrequentPowerOverOldestNumbers.bind(null, PARTITION_FREQUENCY_MODULI, PARTITION_AGE_MODULI, PARTITION_MODULI),
        partitionModuloMostFrequent: partitionFrequentNumbers.bind(null, PARTITION_FREQUENCY_MODULI, PARTITION_MODULI, mostFrequentNumberComparator),
        partitionModuloMostFrequentMinusOldest: partitionFrequentMinusOldestNumbers.bind(null, PARTITION_FREQUENCY_MODULI, PARTITION_AGE_MODULI, PARTITION_MODULI, mostFrequentNumberComparator),
        partitionModuloMostFrequentOverOldest: partitionFrequentOverOldestNumbers.bind(null, PARTITION_FREQUENCY_MODULI, PARTITION_AGE_MODULI, PARTITION_MODULI, mostFrequentNumberComparator),
        partitionModuloMostFrequentPowerOverOldest: partitionFrequentPowerOverOldestNumbers.bind(null, PARTITION_FREQUENCY_MODULI, PARTITION_AGE_MODULI, PARTITION_MODULI, mostFrequentNumberComparator),
        partitionModuloOldest: partitionOldestNumbers.bind(null, PARTITION_AGE_MODULI, PARTITION_MODULI),
        partitionValueLeastFrequent: partitionFrequentNumbers.bind(null, PARTITION_FREQUENCY_VALUES, PARTITION_VALUES, leastFrequentNumberComparator),
        partitionValueLeastFrequentMinusOldest: partitionFrequentMinusOldestNumbers.bind(null, PARTITION_FREQUENCY_VALUES, PARTITION_AGE_VALUES, PARTITION_VALUES, leastFrequentNumberComparator),
        partitionValueLeastFrequentOverOldest: partitionFrequentOverOldestNumbers.bind(null, PARTITION_FREQUENCY_VALUES, PARTITION_AGE_VALUES, PARTITION_VALUES, leastFrequentNumberComparator),
        partitionValueLeastFrequentPowerOverOldest: partitionFrequentPowerOverOldestNumbers.bind(null, PARTITION_FREQUENCY_VALUES, PARTITION_AGE_VALUES, PARTITION_VALUES, leastFrequentNumberComparator),
        partitionValueMiddleFrequent: partitionMiddleFrequentNumbers.bind(null, PARTITION_FREQUENCY_VALUES, PARTITION_VALUES),
        partitionValueMiddleFrequentMinusOldest: partitionMiddleFrequentMinusOldestNumbers.bind(null, PARTITION_FREQUENCY_VALUES, PARTITION_AGE_VALUES, PARTITION_VALUES),
        partitionValueMiddleFrequentOverOldest: partitionMiddleFrequentOverOldestNumbers.bind(null, PARTITION_FREQUENCY_VALUES, PARTITION_AGE_VALUES, PARTITION_VALUES),
        partitionValueMiddleFrequentPowerOverOldest: partitionMiddleFrequentPowerOverOldestNumbers.bind(null, PARTITION_FREQUENCY_VALUES, PARTITION_AGE_VALUES, PARTITION_VALUES),
        partitionValueMostFrequent: partitionFrequentNumbers.bind(null, PARTITION_FREQUENCY_VALUES, PARTITION_VALUES, mostFrequentNumberComparator),
        partitionValueMostFrequentMinusOldest: partitionFrequentMinusOldestNumbers.bind(null, PARTITION_FREQUENCY_VALUES, PARTITION_AGE_VALUES, PARTITION_VALUES, mostFrequentNumberComparator),
        partitionValueMostFrequentOverOldest: partitionFrequentOverOldestNumbers.bind(null, PARTITION_FREQUENCY_VALUES, PARTITION_AGE_VALUES, PARTITION_VALUES, mostFrequentNumberComparator),
        partitionValueMostFrequentPowerOverOldest: partitionFrequentPowerOverOldestNumbers.bind(null, PARTITION_FREQUENCY_VALUES, PARTITION_AGE_VALUES, PARTITION_VALUES, mostFrequentNumberComparator),
        partitionValueOldest: partitionOldestNumbers.bind(null, PARTITION_AGE_VALUES, PARTITION_VALUES),
        random: () => {
            while (true) {
                const allNumbers = Object.keys(AGES), resultantNumbers = [];
                for (let i = 1; i <= 6; i++) {
                    resultantNumbers.push(...allNumbers.splice(Math.floor(Math.random() * allNumbers.length), 1));
                }
                if (isGoodRandom(resultantNumbers)) return resultantNumbers;
            }
        }
    }, STRATEGY_NAMES = Object.keys(STRATEGIES);
    const TOTAL_COST = -COST * RESULTS.size;
    STRATEGY_NAMES.forEach(strategy => {
        NET_GAINS[strategy] = TOTAL_COST;
        NUMBERS[strategy] = new Map();
        NUMBER_PRICE_RESULTS[strategy] = new Map();
        NUMBER_PRICE_RESULT_COUNTS[strategy] = new Map(FREQUENT_NUMBER_PRICE_RESULT_COUNTS);
    });
    const collectResults = (result, date) => {
        if (Object.keys(FREQUENCIES).length > 0) {
            collectNumbers(date);
            collectPriceResults(date, result);
        }
        const { numbers } = result;
        collectAges(numbers);
        collectFrequencies(numbers);
    }, collectNumbers = date => STRATEGY_NAMES.forEach(strategy => {
        NUMBERS[strategy].set(date, STRATEGIES[strategy]());
    }), collectNumberPriceResults = (date, result, strategy) => {
        const numberPriceResult = priceResult(date, result, strategy);
        NUMBER_PRICE_RESULTS[strategy].set(date, numberPriceResult);
        const priceResultCount = `${numberPriceResult}`;
        const priceResultCounts = NUMBER_PRICE_RESULT_COUNTS[strategy];
        priceResultCounts.set(priceResultCount, priceResultCounts.get(priceResultCount) + 1);
    }, collectPriceResults = (date, result) => STRATEGY_NAMES.forEach(collectNumberPriceResults.bind(null, date, result));
    const collectAges = numbers => {
        const partitionModuli = {}, partitionValues = {};
        Object.keys(AGES).forEach(number => {
            if (numbers.includes(number) && (IS_COUNT_SPECIAL || numbers.indexOf(number) < 6)) {
                AGES[number] = 0;
                const realNumber = +number;
                partitionModuli[realNumber % 7] = true;
                partitionValues[Math.floor((realNumber - 1) / 7)] = true;
            } else AGES[number]++;
        });
        Object.keys(PARTITION_AGE_MODULI).forEach(partition => {
            if (partitionModuli[partition]) {
                PARTITION_AGE_MODULI[partition] = 0;
            } else {
                PARTITION_AGE_MODULI[partition]++;
            }
        });
        Object.keys(PARTITION_AGE_VALUES).forEach(partition => {
            if (partitionValues[partition]) {
                PARTITION_AGE_VALUES[partition] = 0;
            } else {
                PARTITION_AGE_VALUES[partition]++;
            }
        });
    }, collectFrequencies = numbers => (IS_COUNT_SPECIAL ? numbers : numbers.slice(0, 6)).forEach(number => {
        FREQUENCIES[number] = (FREQUENCIES[number] || 0) + 1;
        const realNumber = +number;
        const partitionModulo = realNumber % 7;
        const partitionValue = Math.floor((realNumber - 1) / 7);
        PARTITION_FREQUENCY_MODULI[partitionModulo] = (PARTITION_FREQUENCY_MODULI[partitionModulo] || 0) + 1;
        PARTITION_FREQUENCY_VALUES[partitionValue] = (PARTITION_FREQUENCY_VALUES[partitionValue] || 0) + 1;
    }), priceResult = (date, result, strategy) => {
        const storedFrequentNumbers = NUMBERS[strategy].get(date);
        const { numbers, prices } = result;
        const normalNumbers = numbers.slice(0, 6);
        const specialNumber = numbers[6];
        const resultCount = normalNumbers.filter(number => {
            return storedFrequentNumbers.includes(number);
        }).length + (storedFrequentNumbers.includes(specialNumber) ? 0.5 : 0);
        NET_GAINS[strategy] += (prices[resultCount] || 0) + (PRICES[resultCount] || 0);
        return resultCount;
    }, numberPriceResultCountSum = strategy => [
        ...NUMBER_PRICE_RESULT_COUNTS[strategy]
    ].reduce((sum, [count, times]) => sum + +count * times, 0);
    const numberPositivePriceResultCountSum = strategy => [
        ...NUMBER_PRICE_RESULT_COUNTS[strategy]
    ].reduce((sum, [count, times]) => {
        const countNumber = +count;
        return countNumber < 3 ? sum : sum + (countNumber - 2.5) * times;
    }, 0), numberBiggerPriceResultCountSum = strategy => [
        ...NUMBER_PRICE_RESULT_COUNTS[strategy]
    ].reduce((sum, [count, times]) => {
        const countNumber = +count;
        return countNumber < 3.5 ? sum : sum + (countNumber - 3) * times;
    }, 0);
    RESULTS.forEach(collectResults);
    if (!IS_SHOW_KEY_INFO_ONLY) {
        console.info("RESULTS", RESULTS);
        console.info("FREQUENCIES", FREQUENCIES);
        console.info("PARTITION_AGE_MODULI", PARTITION_AGE_MODULI);
        console.info("PARTITION_AGE_VALUES", PARTITION_AGE_VALUES);
        console.info("PARTITION_FREQUENCY_MODULI", PARTITION_FREQUENCY_MODULI);
        console.info("PARTITION_FREQUENCY_VALUES", PARTITION_FREQUENCY_VALUES);
        STRATEGY_NAMES.forEach(strategy => {
            console.info(`NUMBERS.${strategy}`, NUMBERS[strategy]);
        });
        STRATEGY_NAMES.forEach(strategy => console.info(`NUMBER_PRICE_RESULTS.${strategy}`, NUMBER_PRICE_RESULTS[strategy]));
        STRATEGY_NAMES.forEach(strategy => console.info(`numberPriceResultCountSum(${strategy})`, numberPriceResultCountSum(strategy)));
    }
    STRATEGY_NAMES.forEach(strategy => console.info(`NUMBER_PRICE_RESULT_COUNTS.${strategy}`, NUMBER_PRICE_RESULT_COUNTS[strategy]));
    STRATEGY_NAMES.forEach(strategy => {
        console.info(strategy, STRATEGIES[strategy]().sort(ascendingComparator));
    });
    const sortedPositivePriceResults = STRATEGY_NAMES.map(strategy => {
        return [strategy, numberPositivePriceResultCountSum(strategy)];
    }).sort(mostFrequentNumberComparator);
    sortedPositivePriceResults.forEach(([strategy, sum]) => {
        console.info(`numberPositivePriceResultCountSum(${strategy})`, sum);
    });
    const sortedBiggerPriceResults = STRATEGY_NAMES.map(strategy => {
        return [strategy, numberBiggerPriceResultCountSum(strategy)];
    }).sort(mostFrequentNumberComparator);
    sortedBiggerPriceResults.forEach(([strategy, sum]) => {
        console.info(`numberBiggerPriceResultCountSum(${strategy})`, sum);
    });
    if (!IS_SHOW_KEY_INFO_ONLY) console.info("TOTAL_COST", TOTAL_COST);
    const sortedNetGains = Object.entries(NET_GAINS).sort(mostFrequentNumberComparator);
    console.info("NET_GAINS", sortedNetGains);
    if (sortedBiggerPriceResults[0][0] === "random" && sortedBiggerPriceResults[0][1] > 0) {
        console.warn("random has the best bigger price result!");
    } else if (IS_FORCE_RANDOM_BEST_BIGGER_PRICE_RESULTS) window.location.reload();
    if (sortedPositivePriceResults[0][0] === "random" && sortedPositivePriceResults[0][1] > 0) {
        console.warn("random has the best positive price result!");
    } else if (IS_FORCE_RANDOM_BEST_POSITIVE_PRICE_RESULTS) window.location.reload();
    if (sortedNetGains[0][0] === "random" && sortedNetGains[0][1] > 0) {
        console.warn("random has the best net gain!");
    } else if (IS_FORCE_RANDOM_BEST_GET_GAINS) window.location.reload();
})();
