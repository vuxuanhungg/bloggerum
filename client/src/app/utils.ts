export const compareArrays = (a: Array<any>, b: Array<any>) =>
    a.length === b.length && a.every((value, index) => value === b[index])
