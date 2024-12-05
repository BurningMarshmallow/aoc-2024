import { t } from "./modules/parser.js"

export const useExample = false

export const exampleInput = `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`


export const parseInput = t.arr(t.str()).parse

export function part1(input) {
	const { rules, updates } = parse(input)

	let s = 0
	for (const update of updates) {
		if (isCorrect(update, rules)) {
			s += update[Math.floor(update.length / 2)]
		}
	}

	return s
}

export function part2(input) {
	const { rules, updates } = parse(input)

	let s = 0
	for (const update of updates) {
		if (!isCorrect(update, rules)) {
			update.sort((a, b) => cmpByRules(a, b, rules))
			s += update[Math.floor(update.length / 2)]
		}
	}

	return s
}

function parse(input) {
	const rulesArr = t.arr(t.tpl`${"a|int"}|${"b|int"}`).parse(input[0])
	const rules = new Map()

	for (const {a, b} of rulesArr) {
		if (rules.has(a)) {
			rules.get(a).push(b)
		} else {
			rules.set(a, [b])
		}
	}
	
	const updates = t.arr(t.arr(t.int())).parse(input[1])

	return { rules, updates }
}

function isCorrect(update, rules) {
	for (let i = 0; i < update.length; i++) {
		for (let j = i + 1; j < update.length; j++) {
			let a = update[i]
			let b = update[j]
			if (lessByRules(b, a, rules)) {
				return false
			}
		}
	}

	return true
}

function cmpByRules(a, b, rules) {
	if (lessByRules(a, b, rules)) {
		return -1
	}

	if (lessByRules(b, a, rules)) {
		return 1
	}

	return 0
}

function lessByRules(a, b, rules) {
	return rules.has(a) && rules.get(a).includes(b)
}
