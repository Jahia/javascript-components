const filterTree = (tree: TreeData[], predicate: (d: TreeData) => boolean): TreeData[] => tree
    .filter(predicate)
    .map(item => ({...item, children: filterTree(item.children, predicate)}));

const mapTree = (tree: TreeData[], mapFunction: (o: TreeData) => TreeData): TreeData[] => tree
    .map(item => ({...mapFunction(item), children: mapTree(item.children, mapFunction)}));

export type TreeData = {
    [key: string]: unknown,
    children?: TreeData[]
}

export class Tree {
    data: TreeData[];

    constructor(data: TreeData[]) {
        this.data = data;
    }

    filter(predicate: (d: TreeData) => boolean) {
        return new Tree(filterTree(this.data, predicate));
    }

    map(mapFunction: (d: TreeData) => TreeData) {
        return new Tree(mapTree(this.data, mapFunction));
    }

    getData() {
        return this.data;
    }
}
