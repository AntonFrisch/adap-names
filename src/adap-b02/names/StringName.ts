import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        this.name = source;
        if (delimiter != null) {
            this.delimiter = delimiter;
        }
        if (source === "") {
            this.noComponents = 0;
        } else {
            this.noComponents = source.split(this.delimiter).length;
        }
    }

    public asString(delimiter: string = this.delimiter): string {
        return this.name;
    }

    public asDataString(): string {
        if (this.name === "") {
            return "";
        }
        const components = this.name.split(this.delimiter);
        const escaped = components.map(component =>
            component.split(DEFAULT_DELIMITER).join(ESCAPE_CHARACTER + DEFAULT_DELIMITER)
        );
        return escaped.join(DEFAULT_DELIMITER);
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        if(this.noComponents === 0) {
            return true;
        } else {
            return false;
        }
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(x: number): string {
        this.assertIsNotOutOfBounds(x);
        return this.name.split(this.delimiter)[x];
    }

    public setComponent(n: number, c: string): void {
        this.assertIsNotOutOfBounds(n);
        const components = this.name === "" ? [] : this.name.split(this.delimiter);
        components[n] = c;
        this.name = components.join(this.delimiter);
        this.noComponents = components.length;
    }


    public insert(n: number, c: string): void {
        this.assertIsNotOutOfBounds(n);
        const components = this.name === "" ? [] : this.name.split(this.delimiter);
        components.splice(n, 0, c.toString());
        this.name = components.join(this.delimiter);
        this.noComponents = components.length;
    }

    public append(c: string): void {
        if (this.name === "") {
            this.name = c.toString();
            this.noComponents = 1;
        } else {
            this.name = this.name + this.delimiter + c.toString();
            this.noComponents += 1;
        }
    }

    public remove(n: number): void {
        this.assertIsNotOutOfBounds(n);
        const components = this.name === "" ? [] : this.name.split(this.delimiter);
        components.splice(n, 1);
        this.name = components.join(this.delimiter);
        this.noComponents = components.length;
    }

    public concat(other: Name): void {
        this.name = this.name + this.delimiter + other.asString(this.delimiter);
        this.noComponents += other.getNoComponents();
    }

    public assertIsNotOutOfBounds(i: number): void {
        if (i < 0 || i >= this.getNoComponents()) {
            throw new RangeError(`Index ${i} is out of bounds for Name with ${this.getNoComponents()} components.`);
        }
    }
}