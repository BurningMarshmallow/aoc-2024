import { t } from "./modules/parser.js"

export const useExample = false

export const exampleInput = `Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279`

export const parseInput = t.arr(t.arr(t.str())).parse

export function part1(input) {
	return solve(input, 0)
}

export function part2(input) {
	return solve(input, 10000000000000)
}

function solve(input, add) {
	let total = 0

	for (const machine of input) {
		const buttonA = t.tpl`Button A: X+${"x|int"}, Y+${"y|int"}`.parse(machine[0])
		const buttonB = t.tpl`Button B: X+${"x|int"}, Y+${"y|int"}`.parse(machine[1])
		const prize = t.tpl`Prize: X=${"x|int"}, Y=${"y|int"}`.parse(machine[2])

		prize.x += add
		prize.y += add

		const matrix = [[buttonA.x, buttonB.x], [buttonA.y, buttonB.y]]

		const det = determinant(matrix)
		if (determinant(matrix) == 0 && !(isDivisible(prize.x, buttonA.x) && isDivisible(prize.y, buttonA.y))) {
			continue
		}

		const invertedMatrix = invertMatrix(matrix)
		let [a, b] = invertedMatrix.map(row => row[0] * prize.x + row[1] * prize.y)
		if (!isDivisible(a, det) || !isDivisible(b, det)) {
			continue
		}

		a = a / det
		b = b / det

		if (a >= 0 && b >= 0) {
			total += a * 3 + b
		} else {
			continue
		}
	}

	return total
}

const isDivisible = (a, b) => {
	if (a < 0) {
		return isDivisible(-a, -b)
	}

	if (a > b) {
		return a % b == 0
	}
	return b % a == 0
}

const determinant = (matrix) => {
	return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]
}

const invertMatrix = (matrix) => {
	return [
		[matrix[1][1], -matrix[0][1]],
		[-matrix[1][0], matrix[0][0]]
	]
}