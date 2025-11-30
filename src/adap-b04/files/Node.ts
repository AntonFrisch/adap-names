import { Name } from "../names/Name";
import { Directory } from "./Directory";

export class Node {

    protected baseName: string = "";
    protected parentNode: Directory;

    constructor(bn: string, pn: Directory) {
        this.assertValidBaseNamePrecondition(bn);
        this.doSetBaseName(bn);
        this.parentNode = pn; // why oh why do I have to set this
        this.initialize(pn);
    }

    protected assertPrecondition(condition: boolean, message: string): void {
        if (!condition) {
            // hier später IllegalArgumentException o.Ä. verwenden
            throw new Error(`Precondition violated: ${message}`);
        }
    }

    protected assertValidBaseNamePrecondition(bn: string): void {
        this.assertPrecondition(
            bn !== null && bn !== undefined && bn.length > 0,
            "base name must not be empty"
        );
        this.assertPrecondition(
            !bn.includes("/"),
            "base name must not contain '/'"
        );
    }

    protected initialize(pn: Directory): void {
        this.parentNode = pn;
        this.parentNode.addChildNode(this);
    }

    public move(to: Directory): void {
        this.parentNode.removeChildNode(this);
        to.addChildNode(this);
        this.parentNode = to;
    }

    public getFullName(): Name {
        const result: Name = this.parentNode.getFullName();
        result.append(this.getBaseName());
        return result;
    }

    public getBaseName(): string {
        return this.doGetBaseName();
    }

    protected doGetBaseName(): string {
        return this.baseName;
    }

    public rename(bn: string): void {
        this.doSetBaseName(bn);
    }

    protected doSetBaseName(bn: string): void {
        this.assertValidBaseNamePrecondition(bn);
        this.baseName = bn;
    }

    public getParentNode(): Directory {
        return this.parentNode;
    }

}
