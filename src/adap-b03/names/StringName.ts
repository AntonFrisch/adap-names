import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(components: string[], delimiter: string = DEFAULT_DELIMITER) {
        super(delimiter);
        this.name = components.join(this.delimiter);
        this.noComponents = components.length;
    }

    getNoComponents(): number {
        return this.noComponents;
    }

    getComponent(i: number): string {
        return this.name.split(this.delimiter)[i];
    }

    setComponent(i: number, c: string): void {
        const components = this.name === "" ? [] : this.name.split(this.delimiter);
        components[i] = c;
        this.name = components.join(this.delimiter);
        this.noComponents = components.length;
    }

    insert(i: number, c: string): void {
        const components = this.name === "" ? [] : this.name.split(this.delimiter);
        components.splice(i, 0, c.toString());
        this.name = components.join(this.delimiter);
        this.noComponents = components.length;
    }

    append(c: string): void {
        if (this.name === "") {
            this.name = c.toString();
            this.noComponents = 1;
        } else {
            this.name = this.name + this.delimiter + c.toString();
            this.noComponents += 1;
        }
    }

    remove(i: number): void {
        const components = this.name === "" ? [] : this.name.split(this.delimiter);
        components.splice(i, 1);
        this.name = components.join(this.delimiter);
        this.noComponents = components.length;
    }

    clone(): Name {
        const components = this.name === "" ? [] : this.name.split(this.delimiter);
        return new StringName(components, this.delimiter);
    }
}