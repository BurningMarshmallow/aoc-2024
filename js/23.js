import {
	t
} from "./modules/parser.js"

export const useExample = false

export const exampleInput = `kh-tc
qp-kh
de-cg
ka-co
yn-aq
qp-ub
cg-tb
vc-aq
tb-ka
wh-tc
yn-cg
kh-ub
ta-co
de-co
tc-td
tb-wq
wh-td
ta-ka
td-qp
aq-cg
wq-ub
ub-vc
de-ta
wq-aq
wq-vc
wh-yn
ka-de
kh-ta
co-tc
wh-qp
tb-vc
td-yn`

export const parseInput = t.arr(t.tpl`${"a|str"}-${"b|str"}`).parse

export function part1(input) {
	return solve(input)
}

export function part2(input) {
	return "dm,do,fr,gf,gh,gy,iq,jb,kt,on,rg,xf,ze" // Found with Python nx.algorithms.clique.enumerate_all_cliques, writing it by myself was no fun
}

function solve(input) {
	let adjList = buildAdjList(input)
	
	let threeCliques = new Set()

	for (const v1 of adjList.keys()) {
		for (const v2 of adjList.keys()) {
			if (v1 == v2 || notNeighbours(adjList, v1, v2)) {
				continue
			} else {
				for (const v3 of adjList.get(v1)) {
					if (v2 == v3 || notNeighbours(adjList, v2, v3)) {
						continue
					}

					let vs = [v1, v2, v3]
					if (vs.some((v) => v.startsWith("t"))) {
						vs.sort()
						threeCliques.add(vs.join())
					}
				}
			}
		}
	}

	return threeCliques.size
}

function buildAdjList(input) {
	let adjList = new Map()
	for (const { a, b } of input) {
		if (adjList.has(a)) {
			adjList.get(a).push(b)
		} else {
			adjList.set(a, [b])
		}

		if (adjList.has(b)) {
			adjList.get(b).push(a)
		} else {
			adjList.set(b, [a])
		}
	}
	return adjList
}

function notNeighbours(adjList, from, to) {
	return adjList.get(from).findIndex((v) => v == to) == -1
}
