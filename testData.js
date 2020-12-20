//   Test Objects Template
// const MAIN_DATA = [
// 	{ fullName: { surname: 'xxx', firstName: 'yyy', middleName: 'zzz' } },
// 	{ fullName: { surname: 'XXX', firstName: 'YYY', middleName: 'ZZZ' } },
// ];
// const RULE_DATA = {
// 	fullName: { surname: true, firstName: true, middleName: false },
// };

//  My Objects Template
const MAIN_DATA = [
	{ fullName: { surname: 'xxx', firstName: 'yyy', middleName: 'zzz' } },
	{
		fullName: {
			surname: 'XXX',
			firstName: 'YYY',
			middleName: 'ZZZ',
			parents: {
				date: new Date(),
				mother: { name: 'Anna', age: '45' },
				father: { name: 'Igor', age: 42 },
			},
		},
	},
];

const RULE_DATA = {
	fullName: {
		surname: true,
		firstName: true,
		middleName: false,
		parents: {
			date: true,
			mother: { name: true, age: false },
			father: { name: false, age: true },
		},
		dateStart: true,
	},
};

const LOCAL_DATA = {
	'fullName.surname': 'Прізвище',
	'fullName.middleName': 'По-батькові',
};

function getNewArrayData(mainData, ruleData, LocalData) {
	const arrayRules = createPathRules(ruleData);
	let newArray = createList(mainData, arrayRules, LocalData);
	return newArray;
}

function createList(data, arrayRules, localData) {
	const arrayRule = arrayRules.map((el) => el.replace('.', ''));
	const newArrayData = [];

	for (rule of arrayRule) {
		const newObjRule = {};

		newObjRule.name = createValueName(rule, localData);

		function createValueName(rule, location) {
			const value = Object.keys(location).find((el) => el === rule);
			if (value) {
				return location[value];
			} else {
				const array = rule.split('.');
				return array[array.length - 1];
			}
		}

		for (let i = 0; i < data.length; i++) {
			const obj = data[i];
			let path = rule.split('.');

			function findValueInObj(obj, arrayKey, index = 0) {
				const key = arrayKey[index];
				const checkValue = obj[key];

				if (!arrayKey[index]) {
					return;
				} else if (checkValue instanceof Date) {
					newObjRule[`value${i + 1}`] = getDate(checkValue.getTime());
					return;
				} else if (typeof checkValue === 'object') {
					return findValueInObj(checkValue, arrayKey, ++index);
				} else if (checkValue) {
					newObjRule[`value${i + 1}`] = checkValue;
					return;
				}
			}
			findValueInObj(obj, path);
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
				return recursive(data[key], (path += `.${key}`));
			}
			data[key] ? arrayRules.push(path + '.' + key) : null;
		}
	}
	recursive(data, '');
	return arrayRules;
}

function getDate(dateNumber) {
	const date = new Date(dateNumber);

	const day = checkNumber(date.getDate());
	const month = checkNumber(date.getMonth(date) + 1);
	const year = date.getFullYear(date);

	function checkNumber(number) {
		if (number < 10) {
			return '0' + number;
		}
		return number;
	}
	return `${day}.${month}.${year}`;
}

const needArray = getNewArrayData(MAIN_DATA, RULE_DATA, LOCAL_DATA);
console.log(needArray);
