const MAIN_DATA = [
	{ fullName: { surname: 'xxx', firstName: 'yyy', middleName: 'zzz' } },
	{ fullName: { surname: 'XXX', firstName: 'YYY', middleName: 'ZZZ' } },
];
const RULE_DATA = {
	fullName: { surname: true, firstName: true, middleName: false },
};

const LOCAL_DATA = {
	'fullName.surname': 'Прізвище',
	'fullName.middleName': 'По-батькові',
};

function getNewArrayData(mainData, ruleData, localData) {
	return createList(mainData, createPathRules(ruleData), localData);
}

function createList(data, arrayRules, localData) {
	const newArrayData = [];

	for (let rule of arrayRules) {
		const newObjRule = {};
		newObjRule.name = localData[rule] || rule.split('.').pop();

		for (let i = 0; i < data.length; i++) {
			const value = findValueInObj(data[i], rule.split('.'));

			value ? (newObjRule[`value${i + 1}`] = value) : null;
		}
		newArrayData.push(newObjRule);
	}
	return newArrayData;
}

function createPathRules(data) {
	const arrayRules = [];
	function recursive(data, path) {
		for (let key in data) {
			if (typeof data[key] === 'object') {
				recursive(data[key], [path, key].filter(Boolean).join('.'));
			} else {
				data[key]
					? arrayRules.push([path, key].filter(Boolean).join('.'))
					: null;
			}
		}
	}
	recursive(data, '');
	return arrayRules;
}

function findValueInObj(obj, arrayKey, index = 0) {
	const key = arrayKey[index];
	const checkValue = obj[key];

	if (!arrayKey[index]) {
		return;
	} else if (typeof checkValue === 'boolean') {
		return checkValue ? 'Так' : 'Ні';
	} else if (checkValue instanceof Date) {
		return getDate(checkValue.getTime());
	} else if (
		typeof checkValue === 'number' ||
		typeof checkValue === 'string'
	) {
		return checkValue;
	} else if (typeof checkValue === 'object') {
		return findValueInObj(checkValue, arrayKey, ++index);
	}
}

function getDate(dateNumber) {
	const date = new Date(dateNumber);
	function checkNumber(number) {
		if (number < 10) {
			return '0' + number;
		}
		return number;
	}
	return [
		checkNumber(date.getDate()),
		checkNumber(date.getMonth() + 1),
		date.getFullYear(),
	].join('.');
}

const needArray = getNewArrayData(MAIN_DATA, RULE_DATA, LOCAL_DATA);
console.log(needArray);
