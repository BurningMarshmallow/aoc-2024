import {
	t
} from "./modules/parser.js"

export const useExample = false

export const exampleInput = `1
2
3
2024`

export const parseInput = t.arr(t.int()).parse
const bigIntMax = (...args) => args.reduce((m, e) => e > m ? e : m);

export function part1(input) {
	return solve(input, 2000)
}

export function part2(input) {
	return solve2(input, 2000)
}

function solve(input, maxDepth) {
	const MOD = 16777216n
	let ans = 0n

	for (const num of input) {
		let secretNumber = BigInt(num)
		for (let index = 0; index < maxDepth; index++) {
			secretNumber = (secretNumber ^ (secretNumber * 64n)) % MOD
			secretNumber = (secretNumber ^ (secretNumber / 32n)) % MOD
			secretNumber = (secretNumber ^ (secretNumber * 2048n)) % MOD			
		}

		ans += secretNumber
	}

	return ans
	
}

function solve2(input, maxDepth) {
	const MOD = 16777216n
	let allPrices = []
	for (const num of input) {
		let secretNumber = BigInt(num)
		let buyerPrices = [secretNumber]
		for (let index = 0; index < maxDepth; index++) {
			secretNumber = (secretNumber ^ (secretNumber * 64n)) % MOD
			secretNumber = (secretNumber ^ (secretNumber / 32n)) % MOD
			secretNumber = (secretNumber ^ (secretNumber * 2048n)) % MOD			
			buyerPrices.push(secretNumber % 10n)
		}

		allPrices.push(buyerPrices)
	}

	let bananasForSeq = new Map()
	for (const buyerPrices of allPrices) {
		let bananasForSeqForBuyer = new Map()

		for (let i = 0; i < buyerPrices.length - 4; i++) {
			let key = ""
			for (let j = 0; j < 4; j++) {
				const diff = buyerPrices[i + j + 1] - buyerPrices[i + j];
				key += diff.toString()
			}

			if (!bananasForSeqForBuyer.has(key)) {
				bananasForSeqForBuyer.set(key, buyerPrices[i + 4])
			}
		}

		for (let key of bananasForSeqForBuyer.keys()) {
			if (bananasForSeq.has(key)) {
				bananasForSeq.set(key, bananasForSeq.get(key) + bananasForSeqForBuyer.get(key))
			} else {
				bananasForSeq.set(key, bananasForSeqForBuyer.get(key))
			}
		}
	}

	return bigIntMax(...bananasForSeq.values())
}
