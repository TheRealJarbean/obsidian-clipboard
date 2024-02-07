import { TFile, Plugin, ItemView } from "obsidian";

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
	}

	async onunload() {
		console.log('unloading plugin')
	}
}
