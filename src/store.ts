import { writable } from "svelte/store";
import * as utils from "./utils";

let empty: Record<string, string | null> = {
	bob: "is",
	pretty: "cool",
};

export const globalStore = writable(empty);
export const localStore = writable(empty);
