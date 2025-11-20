import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    protected constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.delimiter = delimiter;
    }

    public abstract clone(): Name;


    public asString(delimiter: string = this.delimiter): string {
        const n = this.getNoComponents();
        const parts: string[] = [];
        for (let i = 0; i < n; i++) {
            parts.push(this.getComponent(i));
        }
        return parts.join(delimiter);
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        const n = this.getNoComponents();
        const parts: string[] = [];
        for (let i = 0; i < n; i++) {
            const raw = this.getComponent(i);
            parts.push(this.escapeComponent(raw, DEFAULT_DELIMITER));
        }
        return parts.join(DEFAULT_DELIMITER);
    }

    protected escapeComponent(component: string, delimiter: string): string {
        let result = "";
        for (const ch of component) {
            if (ch === ESCAPE_CHARACTER || ch === delimiter) {
                result += ESCAPE_CHARACTER;
            }
            result += ch;
        }
        return result;
    }


    public isEqual(other: Name): boolean {
        return this.getHashCode() === other.getHashCode();
    }

    public getHashCode(): number {
        const s = this.asDataString();
        let hash = 0;

        for (let i = 0; i < s.length; i++) {
            const ch = s.charCodeAt(i);
            hash = ((hash << 5) - hash) + ch;
            hash |= 0;
        }

        return hash;
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        const n = other.getNoComponents();
        for (let i = 0; i < n; i++) {
            this.append(other.getComponent(i));
        }
    }

}