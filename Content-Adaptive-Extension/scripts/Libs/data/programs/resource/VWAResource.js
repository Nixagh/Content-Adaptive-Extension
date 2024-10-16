const InstructionNPractice = {
	"Definitions": {value: "Definitions", new: () => new DefinitionProcess("Definitions", 1, [1, 0, 1, 0])},
	"Visuals": {value: "Visuals", new: () => new VisualProcess("Visuals", 1, [1, 0, 1, 0])},
	"DefinitionsAndVideo": {value: "Definitions & Video", new: () => new DefinitionAndVideoProcess("DefinitionsAndVideo", 1, [1, 0, 1, 0])},
	"WS": {value: "Word Study", new: () => new WSProcess("WS", 1, [1, 0, 1, 0])},
	"CRW-GT": {value: "Choosing the Right Word - Guided Tour", new: () => new CRWGTProcess("CRW-GT", 1, [1, 1, 1, 1])},
	"VC-OLV": {value: "Vocabulary in Context (On-level)", new: () => new VCOLVProcess("VC-OLV", 1, [1, 1, 1, 1])},
	"VC-D": {value: "Vocabulary in Context (Differentiated)", new: () => new VCDProcess("VC-D", 1, [1, 1, 1, 1])},
	"WT": {value: "Word Ties", new: () => new WordTieProcess("WT", 1, [1, 1, 1, 1])},
	"E/N": {value: "Example/Nonexample", new: () => new ENProcess("E/N", 1, [1, 1, 1, 1])},
	"E/N-VWSEL": {value: "Example/Non Example VWSEL", new: () => new EN_VWSELProcess("E/N-VWSEL", 1, [1, 1, 1, 1])},
	"AP": {value: "Adaptive Practice", new: () => new AdaptivePracticeProcess("AP", 1, [1, 1, 1, 1])},
	"CRW-OYO": {value: "Choosing the Right Word - On Your Own", new: () => new CRWOYOProcess("CRW-OYO", 1, [1, 1, 1, 0])},
	"OLV-P1": {value: "On-level Passage 1", new: () => new OLVP1Process("OLV-P1", 1, [1, 1, 1, 1])},
	"OLV-P2": {value: "On-level Passage 2", new: () => new OLVP2Process("OLV-P2", 1, [1, 1, 1, 1])},
	"DP1": {value: "Differentiated Passage 1", new: () => new DP1Process("DP1", 1, [1, 1, 1, 1])},
	"DP2": {value: "Differentiated Passage 2", new: () => new DP2Process("DP2", 1, [1, 1, 1, 1])},
	"CS": {value: "Completing the Sentence", new: () => new CSProcess("CS", 1, [1, 1, 1, 0])},
}

const DigitalAssignmentResource = {
	"BOY": {value: "Begin of Year Test", new: () => new BOYTestProcess("BOY", 1, [1, 1, 1, 0])},
	"EOY": {value: "End of Year Test", new: () => new EOYTestProcess("EOY", 1, [1, 1, 1, 0])},
	"CumTest": {value: "Cumulative Test", new: () => new CumulativeTestProcess("CumTest", 1, [1, 0, 1, 0])},
	"PreTest": {value: "Pre Test", new: () => new PreTestProcess("PreTest", 1, [1, 1, 1, 0])},
	"PostTest": {value: "Post Test", new: () => new PostTestProcess("PostTest", 1, [1, 1, 1, 0])},
}

const DigitalResourcesResource = {
	"WWiAC": {value: "Writing Words in Action" , new : () => new WWiAProcess("WWiAC" , 1 , [1, 1, 1, 0])}
}

const ProgramTocResource = {
	"WordList": {value: "Word List", new: () => new WordListProcess()},
	"WordContinuum": {value: "Word Continuum", new: () => new WordContinuumProcess()},
	"Json": {value: "Json (WIP)", new: () => new ProgramTocProcess("Json")}
}

const Resource = {
	"PT": {
		name: "ProgramToc",
		resource: ProgramTocResource,
		insertButton: {
			show: [Ids.insertWordList, Ids.insertWordContinuum, Ids.insertJson],
			hide: [Ids.insertButton, Ids.insertAndSave]
		},
	},
	"IP": {
		name: "Instruction & Practice",
		resource: InstructionNPractice,
		insertButton: {
			show: [Ids.insertButton, Ids.insertAndSave],
			hide: [Ids.insertWordList, Ids.insertWordContinuum, Ids.insertJson]
		}
	},
	"DA": {
		name: "Digital Assignments",
		resource: DigitalAssignmentResource,
		insertButton: {
			show: [Ids.insertButton, Ids.insertAndSave],
			hide: [Ids.insertWordList, Ids.insertWordContinuum, Ids.insertJson]
		}
	},
	"DR": {
		name: "Digital Resources",
		resource: DigitalResourcesResource,
		insertButton: {
			show: [Ids.insertButton, Ids.insertAndSave],
			hide: [Ids.insertWordList, Ids.insertWordContinuum, Ids.insertJson]
		}
	}
}

const getProcess = () => {
	const program = Storage.Get("CurrentProgram");

	if(localStorage.getItem("GProcess")) {
		const parse = JSON.parse(localStorage.getItem("GProcess"));
		const process = Resource[program].resource[parse.type].new();
		process.allSheets = parse.allSheets;
		process.fileName = parse.fileName;
		process.data = parse.data;
		process.type = parse.type;
		process.unit = parse.unit;
		process.grade = parse.grade;
		process.productCode = parse.productCode;
		if (process.type === "WordList") {
			process.themeDataWithWordId = parse.themeDataWithWordId;
		}
		return process;
	}
	return null;
}
