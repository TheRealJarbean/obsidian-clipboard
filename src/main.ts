import { ItemView, TFile, Plugin, WorkspaceLeaf } from "obsidian";
import Component from "./ui/Component.svelte";

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

	async onload() {
		console.log('loading plugin');

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
