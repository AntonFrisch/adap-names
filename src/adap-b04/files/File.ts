import { Node } from "./Node";
import { Directory } from "./Directory";
import { MethodFailedException } from "../common/MethodFailedException";

enum FileState {
    OPEN,
    CLOSED,
    DELETED        
};

export class File extends Node {

    protected state: FileState = FileState.CLOSED;

    constructor(baseName: string, parent: Directory) {
        super(baseName, parent);
    }

    public open(): void {
        this.assertFileNotDeleted();
        this.assertFileIsClosed();
        this.state = FileState.OPEN;
    }

    public read(noBytes: number): Int8Array {
        this.assertFileNotDeleted();
        this.assertFileIsOpen();
        this.assertPrecondition(
            Number.isInteger(noBytes) && noBytes > 0,
            "number of bytes to read must be positive"
        );

        // eigentliche Operation
        // (in deinem Skeleton sowieso nur Dummy-Implementierung)
        return new Int8Array();
    }

    public close(): void {
        this.assertFileNotDeleted();
        this.assertFileIsOpen();
        this.state = FileState.CLOSED;    }

    protected doGetFileState(): FileState {
        return this.state;
    }

    protected assertPrecondition(condition: boolean, message: string): void {
        if (!condition) {
            // hier später IllegalArgumentException o.Ä. verwenden
            throw new Error(`Precondition violated: ${message}`);
        }
    }

    protected assertFileNotDeleted(): void {
        this.assertPrecondition(
            this.state !== FileState.DELETED,
            "file must not be deleted"
        );
    }

    protected assertFileIsClosed(): void {
        this.assertPrecondition(
            this.state === FileState.CLOSED,
            "file must be closed"
        );
    }

    protected assertFileIsOpen(): void {
        this.assertPrecondition(
            this.state === FileState.OPEN,
            "file must be open"
        );
    }


}