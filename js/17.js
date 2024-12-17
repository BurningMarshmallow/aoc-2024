import { bigintRange } from "./modules/itertools.js";
import { t } from "./modules/parser.js"

export const useExample = false

export const exampleInput = `Register A: 729
Register B: 0
Register C: 0

Program: 0,3,5,4,3,0`

export const parseInput = t.arr(t.str()).parse

const combo = (number, registers) => {
	if (number > 3) {
		return registers[number - 4]
	}

	return number
}

export function part1(input) {
	let registers = t.arr(t.str()).parse(input[0]).map((r) => t.tpl`Register ${"name|str"}: ${"value|int"}`.parse(r)).map((r) => r.value)
	let programValues = t.tpl`Program: ${"values|str"}`.parse(input[1])
	let program = t.arr(t.int()).parse(programValues.values)

	return run(registers, program).slice(0, -1)
}

export function part2(input) {
	let programValues = t.tpl`Program: ${"values|str"}`.parse(input[1])
	let program = t.arr(t.int()).parse(programValues.values)

	return findQuine(0, 0n, program) >> 3n
}

function run(registers, program) {
	let result = ""

	for (let i = 0; i < program.length; i += 2) {
		let opcode = program[i]
		let operand = program[i + 1]
		let comboOperand = combo(operand, registers)
		if (opcode == 0) {
			registers[0] = Math.trunc(registers[0] / Math.pow(2, comboOperand))
		}
		if (opcode == 1) {
			registers[1] = registers[1] ^ operand
		}
		if (opcode == 2) {
			registers[1] = comboOperand % 8
		}
		if (opcode == 3) {
			if (registers[0] != 0) {
				i = Math.floor(operand / 2) - 2
			}
		}
		if (opcode == 4) {
			registers[1] = registers[1] ^ registers[2]
		}
		if (opcode == 5) {
			let value = (comboOperand % 8).toString() + ","
			result += value
		}
		if (opcode == 6) {
			registers[1] = Math.trunc(registers[0] / Math.pow(2, comboOperand))
		}
		if (opcode == 7) {
			registers[2] = Math.trunc(registers[0] / Math.pow(2, comboOperand))
		}
	}

	return result
}

function findQuine(i, a, program) {
	if (i == program.length) {
		return a
	}

	for (let aPart of bigintRange(0n, 8n)) {
		let b = aPart ^ 7n
		let c = ((a + aPart) >> b) % 8n
		b = (b ^ 7n ^ c) % 8n
		if (b == program[program.length - 1 - i]) {
			let solved = findQuine(i + 1, (a + aPart) << 3n, program)
			if (solved) {
				return solved
			}
		}
	}

	return undefined
}
