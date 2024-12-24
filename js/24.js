import {
	t
} from "./modules/parser.js"

export const useExample = false

export const exampleInput = `x00: 1
x01: 0
x02: 1
x03: 1
x04: 0
y00: 1
y01: 1
y02: 1
y03: 1
y04: 1

ntg XOR fgs -> mjb
y02 OR x01 -> tnw
kwq OR kpj -> z05
x00 OR x03 -> fst
tgd XOR rvg -> z01
vdt OR tnw -> bfw
bfw AND frj -> z10
ffh OR nrd -> bqk
y00 AND y03 -> djm
y03 OR y00 -> psh
bqk OR frj -> z08
tnw OR fst -> frj
gnj AND tgd -> z11
bfw XOR mjb -> z00
x03 OR x00 -> vdt
gnj AND wpb -> z02
x04 AND y00 -> kjc
djm OR pbm -> qhw
nrd AND vdt -> hwm
kjc AND fst -> rvg
y04 OR y02 -> fgs
y01 AND x02 -> pbm
ntg OR kjc -> kwq
psh XOR fgs -> tgd
qhw XOR tgd -> z09
pbm OR djm -> kpj
x03 XOR y03 -> ffh
x00 XOR y04 -> ntg
bfw OR bqk -> z06
nrd XOR fgs -> wpb
frj XOR qhw -> z04
bqk OR frj -> z07
y03 OR x01 -> nrd
hwm AND bqk -> z03
tgd XOR rvg -> z12
tnw OR pbm -> gnj`

export const parseInput = t.arr(t.arr(t.str())).parse

export function part1(input) {
	return solve(input)
}

export function part2(input) {
	return "kcd,pfn,shj,tpk,wkb,z07,z23,z27" // Found manually by vizualizing graph, simulating outputs, finding wrong results and swapping
}

function solve(input) {
	let [inputs, mappings] = input

	let wires = new Map()
	for (const item of inputs) {
		let [wire, value] = item.split(": ")
		wires.set(wire, Number.parseInt(value))
	}

	for (let i = 0; i < mappings.length; i++) {
		for (const item of mappings) {
			let [a, b] = item.split(" -> ")
			let [x1, op, x2] = a.split(" ")

			if (wires.has(b) || !wires.has(x1) || !wires.has(x2)) {
				continue
			}

			switch (op) {
				case "XOR":
					wires.set(b, wires.get(x1) ^ wires.get(x2))
					break;
				case "OR":
					wires.set(b, wires.get(x1) || wires.get(x2))
					break;
				case "AND":
					wires.set(b, wires.get(x1) && wires.get(x2))
					break;
				default:
					break;
			}
		}	
	}

	let N = useExample ? 12 : 45

	let s = ""
	for (let i = 0; i <= N; i++) {
		const num = wires.get("z" + i.toString().padStart(2, '0'));
		s = num + s
	}

	return s
}
