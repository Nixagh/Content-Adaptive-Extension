class CumulativeTestProcess extends VWAProcess {
    getDescription() {
        return `cml${this.getUnit()}`;
    }

    getUnit() {
        const value = 1;
        return `${value % 4}`;
    }
}