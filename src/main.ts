import { error } from "console";
import { TFile, Plugin, ItemView } from "obsidian";
import { text } from "stream/consumers";
import * as constants from "./constants";
import * as utils from "./utils";
import { SettingsTab } from "./settings";

interface ExamplePluginSettings {
	saveOnClose: boolean;
}
  
const DEFAULT_SETTINGS: Partial<ExamplePluginSettings> = {
	saveOnClose: true,
};

let global_tags: Record<string, string>
let note_tags: Record<string, string>;

export default class ExamplePlugin extends Plugin {
	settings: ExamplePluginSettings;

	async onload() {
		console.log('loading plugin');

		await this.loadSettings();
		this.addSettingTab(new SettingsTab(this.app, this));

		this.addRibbonIcon("clipboard-copy", "Copy Note To Clipboard", async () => {
			const currentFile: TFile | null = this.app.workspace.getActiveFile();

			if (currentFile) {
				const fileContents: string = await this.app.vault.cachedRead(currentFile);
				const currentTags = utils.find_all_unique_tags(fileContents, "`" + constants.openDelimiter, constants.closeDelimiter + "`");
				console.log(currentTags);
				const clipboardText: string = utils.find_and_replace_all_tags(fileContents, "`" + constants.openDelimiter, constants.closeDelimiter + "`", global_tags);
				console.log(clipboardText);
				navigator.clipboard.writeText(clipboardText);
			}
		});

		this.registerMarkdownPostProcessor((element, context) => {
			const codeblocks = element.findAll("code");

			for (const codeblock of codeblocks) {
				const text = codeblock.innerText.trim();
				console.log("text: " + text);
				if (text[0] === constants.openDelimiter && text[text.length - 1] === constants.closeDelimiter) {
					const tag = text.substring(1, text.length - 1); // Trim identifiers
					const tagFound: boolean = global_tags[tag] !== undefined;
					const replaceEl = codeblock.createSpan({
						text: tagFound ? global_tags[tag] : text,
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

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}
	
	async saveSettings() {
		await this.saveData(this.settings);
	}
}
