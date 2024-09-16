const productCode = {
    DA: {
        "Level A": {code: "803486", grade: "6",},
        "Level B": {code: "802917", grade: "7",},
        "Level C": {code: "802918", grade: "8",},
        "Level D": {code: "802919", grade: "9",},
        "Level E": {code: "802920", grade: "10",},
        "Level F": {code: "802921", grade: "11",},
        "Level G": {code: "802922", grade: "12",},
    },
    DR: {
        "Level A": {code: "803496", grade: "6",},
        "Level B": {code: "802927", grade: "7",},
        "Level C": {code: "802928", grade: "8",},
        "Level D": {code: "802929", grade: "9",},
        "Level E": {code: "802930", grade: "10",},
        "Level F": {code: "802931", grade: "11",},
        "Level G": {code: "802932", grade: "12",},
    },
    IP: {
        "Level A": {code: "803476", grade: "6",},
        "Level B": {code: "802907", grade: "7",},
        "Level C": {code: "802908", grade: "8",},
        "Level D": {code: "802909", grade: "9",},
        "Level E": {code: "802910", grade: "10"},
        "Level F": {code: "802911", grade: "11",},
        "Level G": {code: "802912", grade: "12",},
    },
}

const productType = {
    DA: {
        resourceType: ["EOY", "BOY", "PreTest", "PostTest", "CumTest"],
        productCode: productCode.DA
    },
    DR: {
        resourceType: ["WWiAC"],
        productCode: productCode.DR
    },
    IP: {
        resourceType: ["Definitions", "Visuals","DefinitionsAndVideo" , "WS", "CRW-GT", "VC-OLV", "VC-D", "WT", "E/N", "E/N-VWSEL", "AP", "CRW-OYO", "OLV-P1", "OLV-P2", "DP1", "DP2", "CS"],
        productCode: productCode.IP
    },
}

const getProductType = (_resourceType, level) => {
    const product =  Object.entries(productType).find((product) => {
        const _product = product[1];
        const resourceType = _product.resourceType;
        if (resourceType.includes(_resourceType)) return true;
    });

    if (!product) return null;
    const productCode = product[1].productCode;
    return productCode[level];
}