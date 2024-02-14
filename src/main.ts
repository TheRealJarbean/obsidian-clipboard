import { error } from "console";
import { TFile, Plugin, ItemView } from "obsidian";
import { text } from "stream/consumers";

const GLOBAL_TAGS: Record<string, string> = {
	"firstName": "Tyler",
};

export default class ExamplePlugin extends Plugin {

	async onload() {
		console.log('loading plugin');

		this.addRibbonIcon("clipboard-copy", "Copy Note To Clipboard", async () => {
			const currentFile: TFile | null = this.app.workspace.getActiveFile();

			if (currentFile) {
				console.log(currentFile);
				const fileContents = await this.app.vault.cachedRead(currentFile);
				console.log(fileContents);
				navigator.clipboard.writeText(fileContents);
			}
		});

		this.registerMarkdownPostProcessor((element, context) => {
			const codeblocks = element.findAll("code");

			for (const codeblock of codeblocks) {
				const text = codeblock.innerText.trim();
				console.log("text: " + text);
				if (text[0] === "+" && text[text.length - 1] === "+") {
					const tag = text.substring(1, text.length - 1); // Trim identifiers
					const tagFound: boolean = GLOBAL_TAGS[tag] !== undefined;
					const replaceEl = codeblock.createSpan({
						text: tagFound ? GLOBAL_TAGS[tag] : text,
						cls: tagFound ? "tag__success" : "tag__error",
					});
					console.log(replaceEl);
					codeblock.replaceWith(replaceEl);
				}
			}
		})
	}

	async onunload() {
		console.log('unloading plugin')
	}
}
