import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringArrayName extends AbstractName {

    protected components: string[];

    constructor(components: string[], delimiter: string = DEFAULT_DELIMITER) {
        super(delimiter);
        this.components = components;
        this.assertClassInvariant();
    }

    getNoComponents(): number {
        return this.components.length;
    }

    getComponent(i: number): string {
        this.assertValidComponentIndexPrecondition(i);
        return this.components[i];
    }

    setComponent(i: number, c: string): void {
        this.assertValidComponentIndexPrecondition(i);
        this.assertMaskedComponentPrecondition(c);
        const oldN = this.getNoComponents();
        this.components[i] = c;
        this.assertSetComponentPost(oldN, i, c);
        this.assertClassInvariant();
    }

    insert(i: number, c: string): void {
        this.assertValidInsertIndexPrecondition(i);
        this.assertMaskedComponentPrecondition(c);
        const oldN = this.getNoComponents();
        this.components.splice(i, 0, c);
        this.assertInsertPost(oldN, i, c);
        this.assertClassInvariant();
    }

    append(c: string): void {
        this.assertMaskedComponentPrecondition(c);
        const oldN = this.getNoComponents();
        this.components.push(c);
        this.assertAppendPost(oldN, c);
        this.assertClassInvariant();
    }

    remove(i: number): void {
        this.assertValidComponentIndexPrecondition(i);
        const oldN = this.getNoComponents();
        this.components.splice(i, 1);
        this.assertRemovePost(oldN);
        this.assertClassInvariant();
    }

    clone(): Name {
        return new StringArrayName([...this.components], this.delimiter);
    }
}