import { error } from "console";
import { ItemView, TFile, TFolder, Plugin, WorkspaceLeaf, TAbstractFile } from "obsidian";
import { text } from "stream/consumers";
import * as constants from "./constants";
import * as utils from "./utils";
import { SettingsTab } from "./settings";
import Component from "./ui/Component.svelte";

interface ExamplePluginSettings {
	saveOnClose: boolean;
}
  
const DEFAULT_SETTINGS: Partial<ExamplePluginSettings> = {
	saveOnClose: true,
};

let global_tags: Record<string, string | null> = {
	"global1": "globaltag",
	"global2": "otherglobaltag",
};
let note_tags: Record<string, string | null> = {
	"firstName": "Tyler",
	"secondName": "Jaron",
};

const VIEW_TYPE = "sve-view";
var TAG_COUNT = 0;

class SVEView extends ItemView {
	component: Component;

    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
    }

    getViewType() {
        return VIEW_TYPE;
    }

    getDisplayText() {
        return "Clipboard";
    }

	getIcon() {
		return "clipboard";
	}

    async onOpen() {
		this.component = new Component({
			target: this.contentEl, props: {globalTags: {}, localTags: {}}
		});
    }

    async onClose() {
    }
}



export default class ExamplePlugin extends Plugin {
	settings: ExamplePluginSettings;

	async onload() {
		console.log('loading plugin');

		await this.loadSettings();
		this.addSettingTab(new SettingsTab(this.app, this));

		this.registerEvent(this.app.workspace.on('file-open', async (file) => {
			const leafList = this.app.workspace.getLeavesOfType(VIEW_TYPE);
			if (leafList.length > 0) {
				this.activateView();
			}
		}));

		this.registerView(VIEW_TYPE, (leaf) => new SVEView(leaf));
		this.addRibbonIcon("replace", "Open Snippet Variable Editor", () => {
			this.activateView();
		});

		this.addRibbonIcon("clipboard-copy", "Copy Note To Clipboard", async () => {
			const currentFile: TFile | null = this.app.workspace.getActiveFile();

			if (currentFile) {
				const fileContents: string = await this.app.vault.cachedRead(currentFile);
				const currentTags = utils.find_all_unique_tags(fileContents, "`" + constants.openDelimiter, constants.closeDelimiter + "`");
				this.loadTags();
				this.loadTags(currentFile);
				console.log(global_tags);
				console.log(note_tags);
				const clipboardText: string = utils.find_and_replace_all_tags(fileContents, "`" + constants.openDelimiter, constants.closeDelimiter + "`", global_tags);
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

					// Check for tag in global and note tags.
					// Global takes precedence over note tags;
					// if global value is null, it is treated as null.
					let value: string | null = null;
					if (global_tags[tag]) {
						value = global_tags[tag];
					}
					else if (note_tags[tag]) {
						value = note_tags[tag];
					}

					const tagFound: boolean = value !== null;
					const replaceEl = codeblock.createSpan({
						text: tagFound ? value! : text,
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

	/**
	 * Saves global tags by default.
	 * Specify a file to save that file's tags.
	 */
	async saveTags(file?: TFile) {
		const { vault } = this.app;

		let key: string;
		if (file) {
			key = file.stat.ctime.toString();
		}
		else {
			key = "global";
		}

		let tagFile = await utils.getTagDataFile(vault);
		if (tagFile === null) {
			tagFile = await utils.createTagDataFile(vault);
		}

		vault.process(tagFile, (data) => {
			const tagData = JSON.parse(data);
			tagData[key] = (file) ? note_tags : global_tags;
			return JSON.stringify(tagData);
		})
	}

	/**
	 * Loads global tags by default.
	 * Specify a file to load that file's tags.
	 */
	async loadTags(file?: TFile) {
		const { vault } = this.app;

		let key: string;
		if (file) {
			key = file.stat.ctime.toString();
		}
		else {
			key = "global";
		}

		const tagFile = await utils.getTagDataFile(vault);
		if (tagFile === null) {
			console.error("Failed to load tags: Tag data file not found.");
			return;
		}

		const data = JSON.parse(await vault.cachedRead(tagFile));
		if (data[key]) {
			if (file) {
				note_tags = data[key];
			}
			else {
				global_tags = data[key];
			}
		}
	}

	async activateView() {
		const { workspace } = this.app;
		workspace.getActiveFile
		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(VIEW_TYPE);

		if (leaves.length > 0) {
			workspace.detachLeavesOfType(VIEW_TYPE);
			leaf = workspace.getLeftLeaf(false);
			await leaf.setViewState({ type: VIEW_TYPE, active: false});
		}
		else {
			leaf = workspace.getLeftLeaf(false);
			await leaf.setViewState({ type: VIEW_TYPE, active: true});
			workspace.revealLeaf(leaf);
		}
	}
}
