import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    protected constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.delimiter = delimiter;
    }

    protected assertPrecondition(condition: boolean, message: string): void {
        if (!condition) {
            throw new Error(`Precondition violated: ${message}`);
        }
    }

    /**
     * Index für get/set/remove: 0 <= i < getNoComponents()
     */
    protected assertValidComponentIndexPrecondition(i: number): void {
        const n = this.getNoComponents();
        this.assertPrecondition(
            Number.isInteger(i) && i >= 0 && i < n,
            `index ${i} out of range [0, ${n - 1}]`
        );
    }

    /**
     * Index für insert: 0 <= i <= getNoComponents()
     */
    protected assertValidInsertIndexPrecondition(i: number): void {
        const n = this.getNoComponents();
        this.assertPrecondition(
            Number.isInteger(i) && i >= 0 && i <= n,
            `insert index ${i} out of range [0, ${n}]`
        );
    }

    /**
     * Komponente muss korrekt maskiert sein:
     * - kein unmaskierter Delimiter
     * - ESCAPE_CHARACTER darf nicht am Ende stehen
     */
    protected assertMaskedComponentPrecondition(component: string): void {
        this.assertPrecondition(
            component !== null && component !== undefined,
            "component must not be null or undefined"
        );

        const ok = this.isProperlyMasked(component);
        this.assertPrecondition(
            ok,
            `component "${component}" is not properly masked`
        );
    }

    /**
     * Prüft die Maskierungs-Regeln:
     * - Delimiter darf nur nach ESCAPE_CHARACTER vorkommen
     * - ESCAPE_CHARACTER darf nicht das letzte Zeichen sein
     */
    protected isProperlyMasked(component: string): boolean {
        const d = this.delimiter;
        const esc = ESCAPE_CHARACTER;

        let i = 0;
        while (i < component.length) {
            const ch = component[i];

            if (ch === esc) {
                // esc muss ein nächstes Zeichen haben
                if (i === component.length - 1) {
                    return false; // ESCAPE am Ende -> ungültig
                }
                // Das nächste Zeichen ist „escaped“, egal welches
                i += 2;
                continue;
            }

            if (ch === d) {
                // unmaskierter Delimiter -> ungültig
                return false;
            }

            i += 1;
        }

        return true;
    }

    protected assertClassInvariant(): void {
        // 1. Delimiter muss genau ein Zeichen lang sein
        if (this.delimiter.length !== 1) {
            throw new Error("InvalidState: delimiter must be a single character");
        }

        // 2. Delimiter darf nicht das Escape-Zeichen sein
        if (this.delimiter === ESCAPE_CHARACTER) {
            throw new Error("InvalidState: delimiter must not be the escape character");
        }

        // 3. Anzahl der Komponenten muss >= 0 sein
        const n = this.getNoComponents();
        if (n < 0) {
            throw new Error("InvalidState: getNoComponents() returned a negative value");
        }

        // 4. Alle Komponenten müssen definiert sein
        for (let i = 0; i < n; i++) {
            const c = this.getComponent(i);
            if (c === undefined || c === null) {
                throw new Error(`InvalidState: component at index ${i} is undefined or null`);
            }
        }
    }

    protected assertValidDelimiterPrecondition(delimiter: string): void {
        this.assertPrecondition(
            delimiter !== null && delimiter !== undefined,
            "delimiter must not be null or undefined"
        );
        this.assertPrecondition(
            delimiter.length === 1,
            "delimiter must be a single character"
        );
        this.assertPrecondition(
            delimiter !== ESCAPE_CHARACTER,
            "delimiter must not be the escape character"
        );
    }

    protected assertPostcondition(condition: boolean, message: string): void {
        if (!condition) {
            throw new Error(`Postcondition violated: ${message}`);
        }
    }

    protected assertAppendPost(oldN: number, c: string): void {
        const n = this.getNoComponents();
        this.assertPostcondition(
            n === oldN + 1,
            `append: number of components should increase by 1 (was ${oldN}, now ${n})`
        );
        this.assertPostcondition(
            this.getComponent(n - 1) === c,
            `append: last component should be "${c}"`
        );
    }

    protected assertInsertPost(oldN: number, i: number, c: string): void {
        const n = this.getNoComponents();
        this.assertPostcondition(
            n === oldN + 1,
            `insert: number of components should increase by 1 (was ${oldN}, now ${n})`
        );
        this.assertPostcondition(
            this.getComponent(i) === c,
            `insert: component at index ${i} should be "${c}"`
        );
    }

    protected assertSetComponentPost(oldN: number, i: number, c: string): void {
        const n = this.getNoComponents();
        this.assertPostcondition(
            n === oldN,
            `setComponent: number of components must stay ${oldN} (is ${n})`
        );
        this.assertPostcondition(
            this.getComponent(i) === c,
            `setComponent: component at index ${i} should be "${c}"`
        );
    }

    protected assertRemovePost(oldN: number): void {
        const n = this.getNoComponents();
        this.assertPostcondition(
            n === oldN - 1,
            `remove: number of components should decrease by 1 (was ${oldN}, now ${n})`
        );
    }

    protected assertConcatPost(oldN: number, otherN: number): void {
        const n = this.getNoComponents();
        this.assertPostcondition(
            n === oldN + otherN,
            `concat: number of components should increase by ${otherN} (was ${oldN}, now ${n})`
        );
    }

    public abstract clone(): Name;

    public asString(delimiter: string = this.delimiter): string {
        this.assertValidDelimiterPrecondition(delimiter);
        const n = this.getNoComponents();
        const parts: string[] = [];
        for (let i = 0; i < n; i++) {
            parts.push(this.getComponent(i));
        }
        return parts.join(delimiter);
        this.assertClassInvariant();
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        this.assertValidDelimiterPrecondition(this.delimiter);
        const n = this.getNoComponents();
        const parts: string[] = [];
        for (let i = 0; i < n; i++) {
            const raw = this.getComponent(i);
            parts.push(this.escapeComponent(raw, DEFAULT_DELIMITER));
        }
        return parts.join(DEFAULT_DELIMITER);
        this.assertClassInvariant();
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
        this.assertPrecondition(
            other !== null && other !== undefined,
            "other name must not be null or undefined"
        );
        const oldN = this.getNoComponents();
        const otherN = other.getNoComponents();
        const n = other.getNoComponents();
        for (let i = 0; i < n; i++) {
            this.append(other.getComponent(i));
        }
        this.assertConcatPost(oldN, otherN);
        this.assertClassInvariant();
    }

}