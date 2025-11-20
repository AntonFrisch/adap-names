import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringArrayName extends AbstractName {

    protected components: string[];

    constructor(components: string[], delimiter: string = DEFAULT_DELIMITER) {
        super(delimiter);
        this.components = components;
    }

    getNoComponents(): number {
        return this.components.length;
    }

    getComponent(i: number): string {
        return this.components[i];
    }

    setComponent(i: number, c: string): void {
        this.components[i] = c;
    }

    insert(i: number, c: string): void {
        this.components.splice(i, 0, c);
    }

    append(c: string): void {
        this.components.push(c);
    }

    remove(i: number): void {
        this.components.splice(i, 1);
    }

    clone(): Name {
        return new StringArrayName([...this.components], this.delimiter);
    }
}