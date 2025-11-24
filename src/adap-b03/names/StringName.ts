import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";

    constructor(components: string[], delimiter: string = DEFAULT_DELIMITER) {
        super(delimiter);
        this.name = this.buildNameFromComponents(components);
    }

    private buildNameFromComponents(components: string[]): string {
        const parts = components.map(c => this.escapeComponent(c, DEFAULT_DELIMITER));
        return parts.join(DEFAULT_DELIMITER);
    }

    private parseComponentsFromName(): string[] {
        if (this.name === "") {
            return [];
        }

        const result: string[] = [];
        let current = "";
        let escaped = false;

        for (const ch of this.name) {
            if (escaped) {
                current += ch;
                escaped = false;
            } else if (ch === ESCAPE_CHARACTER) {
                escaped = true;
            } else if (ch === DEFAULT_DELIMITER) {
                result.push(current);
                current = "";
            } else {
                current += ch;
            }
        }
        result.push(current);
        return result;
    }

    getNoComponents(): number {
        return this.parseComponentsFromName().length;
    }

    getComponent(i: number): string {
        return this.parseComponentsFromName()[i];
    }

    setComponent(i: number, c: string): void {
        const components = this.parseComponentsFromName();
        components[i] = c;
        this.name = this.buildNameFromComponents(components);
    }

    insert(i: number, c: string): void {
        const components = this.parseComponentsFromName();
        components.splice(i, 0, c.toString());
        this.name = this.buildNameFromComponents(components);
    }

    append(c: string): void {
        const components = this.parseComponentsFromName();
        components.push(c.toString());
        this.name = this.buildNameFromComponents(components);
    }

    remove(i: number): void {
        const components = this.parseComponentsFromName();
        components.splice(i, 1);
        this.name = this.buildNameFromComponents(components);
    }

    clone(): Name {
        const components = this.parseComponentsFromName();
        return new StringName(components, this.delimiter);
    }
}