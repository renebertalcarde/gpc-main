import React from "react";
import { v4 } from "uuid";

export class LayoutElement {
	key: string = "";
	item: JSX.Element = (<></>);

	constructor(item: JSX.Element, key?: string) {
		this.key = key ?? v4();
		this.item = item;
	}
}

export class Layout {
	elements: LayoutElement[] = [];

	get Empty() {
		return this.elements.length == 0;
	}

	get Show() {
		return this.elements.length > 0;
	}

	Render() {
		return this.elements.map((x) => x.item);
	}

	HasKey(key: string) {
		return this.elements.find((x) => x.key == key) != null;
	}

	Add(element: LayoutElement, index?: number) {
		const i: number = index ?? this.elements.length;
		this.elements.splice(i, 0, element);
		return i;
	}

	Remove(key: string) {
		this.elements = this.elements.filter((x) => x.key != key);
	}
}

class LayoutObject {
	rightSidePanel = new Layout();
	pageCommands = new Layout();
}

const LayoutContext = React.createContext(new LayoutObject());

export default LayoutContext;
