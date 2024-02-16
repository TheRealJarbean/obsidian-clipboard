import ExamplePlugin from "./main";
import * as constants from "./constants";
import { App, PluginSettingTab, Setting } from "obsidian";

export class SettingsTab extends PluginSettingTab {
	plugin: ExamplePlugin;

	constructor(app: App, plugin: ExamplePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl("h1", { text: constants.appName });

		new Setting(containerEl)
			.setName("Save on Close")
			.setDesc(
				"When enabled, saves all tag values when Obsidian is closed or the plugin is unloaded.\
        WARNING: Disabling this setting will clear all tag values on next unload.",
			)
			.addToggle((bool) =>
				bool
					.setValue(this.plugin.settings.saveOnClose)
					.onChange(async (value) => {
						this.plugin.settings.saveOnClose = value;
						await this.plugin.saveSettings();
					}),
			);
	}
}
