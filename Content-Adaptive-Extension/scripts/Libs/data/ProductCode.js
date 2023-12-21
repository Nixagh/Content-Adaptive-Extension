const productCode = {
    DA: {
        "Level A": {code: "802916", grade: "6",},
        "Level B": {code: "802917", grade: "7",},
        "Level D": {code: "802919", grade: "9",},
        "Level E": {code: "802920", grade: "10",},
    },
    DR: {
        "Level A": {code: "802926", grade: "6",},
        "Level B": {code: "802927", grade: "7",},
        "Level D": {code: "802929", grade: "9",},
        "Level E": {code: "802930", grade: "10",},
    },
    IP: {
        "Level A": {code: "802906", grade: "6",},
        "Level B": {code: "802907", grade: "7",},
        "Level D": {code: "802909", grade: "9",},
        "Level E": {code: "802910", grade: "10"},
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
        resourceType: ["Definitions", "Visuals", "WS", "CRW-GT", "VC-OLV", "VC-D", "WT", "E/N", "AP", "CRW-OYO", "OLV-P1", "OLV-P2", "DP1", "DP2", "CS"],
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