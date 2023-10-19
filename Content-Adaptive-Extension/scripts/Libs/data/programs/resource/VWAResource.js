const VWAResource = {
	"Definitions": {value: "Definitions", new: () => new DefinitionProcess("Definitions", 1, [1, 0, 1, 0])},
	"Visuals": {value: "Visuals", new: () => new VisualProcess("Visuals", 1, [1, 0, 1, 0])},
	"WS": {value: "Word Study", new: () => new WSProcess("WS", 1, [1, 0, 1, 0])},
	"CRW-GT": {value: "Choosing the Right Word - Guided Tour", new: () => new CRWGTProcess("CRW-GT", 1, [1, 0, 1, 1])},
	"VC-OLV": {value: "Vocabulary in Context (On-level)", new: () => new VCOLVProcess("VC-OLV", 1, [1, 1, 1, 1])},
	"VC-D": {value: "Vocabulary in Context (Differentiated)", new: () => new VCDProcess("VC-D", 1, [1, 1, 1, 1])},
	"WT": {value: "Word Ties", new: () => new WordTieProcess("WT", 1, [1, 0, 1, 0])},
	"E/N": {value: "Example/Nonexample", new: () => new ENProcess("E/N", 1, [1, 0, 1, 1])},
	"AP": {value: "Adaptive Practice", new: () => new AdaptivePracticeProcess("AP", 1, [1, 0, 1, 1])},
	"CRW-OYO": {value: "Choosing the Right Word - On Your Own", new: () => new CRWOYOProcess("CRW-OYO", 1, [1, 0, 1, 0])},
	// "OLV-P1": {value: "On-level Passage 1", insert: () => GProcess.insert(), process: () => new OLVP1Process()},
	// "OLV-P2": {value: "On-level Passage 2", insert: () => GProcess.insert(), process: () => new OLVP2Process()},
	// "DP1": {value: "Differentiated Passage 1", insert: () => GProcess.insert(), process: () => new DP1Process()},
	// "DP2": {value: "Differentiated Passage 2", new: () => new DP2Process()},
	"CS": {value: "Completing the Sentence", new: () => new CSProcess("CS", 1, [1, 0, 1, 0])},
	"EOY": {value: "End of Year Test", new: () => new EOYTestProcess("EOY", 1, [1, 0, 1, 0])},
	"BOY": {value: "Begin of Year Test", new: () => new BOYTestProcess("BOY", 1, [1, 0, 1, 0])},
	"PreTest": {value: "Pre Test", new: () => new PreTestProcess("PreTest", 1, [1, 0, 1, 0])},
	"PostTest": {value: "Post Test", new: () => new PostTestProcess("PostTest", 1, [1, 0, 1, 0])},
	"CumTest": {value: "Cumulative Test", new: () => new CumulativeTestProcess("CumTest", 1, [1, 0, 1, 0])},
}

const getProcess = () => {
	if(localStorage.getItem("GProcess")) {
		const parse = JSON.parse(localStorage.getItem("GProcess"));
		const process = VWAResource[parse.type].new();
		process.allSheets = parse.allSheets;
		process.fileName = parse.fileName;
		process.data = parse.data;
		process.type = parse.type;
		return process;
	}
	return null;
}
