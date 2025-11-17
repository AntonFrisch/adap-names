import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringArrayName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        this.components = source;
        if (delimiter != null) {
            this.delimiter = delimiter;
        }
    }

    public asString(delimiter: string = this.delimiter): string {
        return this.components.join(delimiter);
    }

    public asDataString(): string {
        const escaped = this.components.map(component =>
            component.split(DEFAULT_DELIMITER).join(ESCAPE_CHARACTER + DEFAULT_DELIMITER)
        );
        return escaped.join(DEFAULT_DELIMITER);
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        if(this.components.length === 0) {
            return true;
        } else {
            return false;
        }
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        this.assertIsNotOutOfBounds(i);
        this.components[i] = c;
    }

    public insert(i: number, c: string): void {
        this.assertIsNotOutOfBounds(i);
        this.components.splice(i, 0, c);
    }

    public append(c: string): void {
        this.components.push(c.toString());
    }

    public remove(i: number): void {
        this.assertIsNotOutOfBounds(i);
        this.components.splice(i, 1);
    }

    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.components.push(other.getComponent(i));
        }
    }

    // @methodtype assertion-method
    public assertIsNotOutOfBounds(i: number): void {
        if (i < 0 || i >= this.getNoComponents()) {
            throw new RangeError(`Index ${i} is out of bounds for Name with ${this.getNoComponents()} components.`);
        }
    }
}