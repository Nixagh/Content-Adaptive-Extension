class Main {
    Initialize() {
        const prepare = new Prepare();
        prepare.init();
        const option = new OptionContent();
        option.init();
        const autoInsert = new AutoInsert();
    }
}

const main = new Main();
main.Initialize();
