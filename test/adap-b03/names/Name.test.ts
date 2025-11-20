// Name.test.ts
import { describe, it, expect } from "vitest";
import { Name } from "../../../src/adap-b03/names/Name";
import { StringName } from "../../../src/adap-b03/names/StringName";
import { StringArrayName } from "../../../src/adap-b03/names/StringArrayName";
import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../../../src/adap-b03/common/Printable";

// Test-Interface: erweitert Name um die Methoden aus AbstractName
interface ExtendedName extends Name {
    clone(): Name;
    getHashCode(): number;
}

// Fabriktyp für generische Tests
type NameFactory = (components: string[], delimiter?: string) => ExtendedName;

const implementations: Array<[string, NameFactory]> = [
    ["StringArrayName", (components, delimiter) => new StringArrayName(components, delimiter) as ExtendedName],
    ["StringName", (components, delimiter) => new StringName(components, delimiter) as ExtendedName],
];

describe.each(implementations)("%s – Basisverhalten über Name-Schnittstelle", (implName, createName) => {

    it("kann erstellt werden und Komponenten/Größe korrekt liefern", () => {
        const name: Name = createName(["a", "b", "c"]);
        expect(name.getNoComponents()).toBe(3);
        expect(name.getComponent(0)).toBe("a");
        expect(name.getComponent(1)).toBe("b");
        expect(name.getComponent(2)).toBe("c");
        expect(name.isEmpty()).toBe(false);
        expect(name.getDelimiterCharacter()).toBe(DEFAULT_DELIMITER);
    });

    it("nutzt den Delimiter in asString korrekt und unterstützt anderen Delimiter", () => {
        const name: Name = createName(["x", "y", "z"], ".");
        expect(name.asString()).toBe("x.y.z");
        expect(name.asString("/")).toBe("x/y/z");
    });

    it("asDataString gibt eine maschinenlesbare Repräsentation (Escaping)", () => {
        const comp1 = `a${DEFAULT_DELIMITER}b`;
        const comp2 = `c${ESCAPE_CHARACTER}d`;
        const name: Name = createName([comp1, comp2]);

        const expected1 = "a" + ESCAPE_CHARACTER + DEFAULT_DELIMITER + "b";
        const expected2 = "c" + ESCAPE_CHARACTER + ESCAPE_CHARACTER + "d";
        const expected = `${expected1}${DEFAULT_DELIMITER}${expected2}`;

        expect(name.asDataString()).toBe(expected);
    });

    it("setComponent / insert / remove arbeiten korrekt auf den Komponenten", () => {
        const name: Name = createName(["a", "b", "c"]);
        // setComponent
        name.setComponent(1, "X");
        expect(name.getComponent(1)).toBe("X");

        // insert
        name.insert(1, "Y"); // a, Y, X, c
        expect(name.getNoComponents()).toBe(4);
        expect(name.getComponent(0)).toBe("a");
        expect(name.getComponent(1)).toBe("Y");
        expect(name.getComponent(2)).toBe("X");
        expect(name.getComponent(3)).toBe("c");

        // remove
        name.remove(2); // a, Y, c
        expect(name.getNoComponents()).toBe(3);
        expect(name.getComponent(0)).toBe("a");
        expect(name.getComponent(1)).toBe("Y");
        expect(name.getComponent(2)).toBe("c");
    });

    it("clone erzeugt eine unabhängige Kopie (über ExtendedName-Sicht)", () => {
        const original: ExtendedName = createName(["one", "two"]);
        const clone: ExtendedName = original.clone() as ExtendedName;

        expect(clone.isEqual(original)).toBe(true);

        clone.setComponent(0, "CHANGED");
        expect(clone.getComponent(0)).toBe("CHANGED");
        expect(original.getComponent(0)).toBe("one");
    });

    it("getHashCode ist für logische Gleichheit stabil", () => {
        const n1: ExtendedName = createName(["foo", "bar"]);
        const n2: ExtendedName = createName(["foo", "bar"]);

        expect(n1.isEqual(n2)).toBe(true);
        expect(n1.getHashCode()).toBe(n2.getHashCode());
    });
});

// Interchangeability-Tests mit den konkreten Klassen

describe("Interchangeability zwischen StringArrayName und StringName", () => {

    it("isEqual funktioniert zwischen beiden Implementierungen", () => {
        const arrName = new StringArrayName(["hello", "world"]);
        const strName = new StringName(["hello", "world"]);

        expect(arrName.isEqual(strName)).toBe(true);
        expect(strName.isEqual(arrName)).toBe(true);
    });

    it("getHashCode ist für logisch gleiche Namen identisch", () => {
        const arrName = new StringArrayName(["foo", "bar"]);
        const strName = new StringName(["foo", "bar"]);

        expect(arrName.getHashCode()).toBe(strName.getHashCode());
    });

    it("concat funktioniert über Implementierungsgrenzen hinweg (Array += String)", () => {
        const left = new StringArrayName(["a"]);
        const right = new StringName(["b", "c"]);

        left.concat(right);

        expect(left.getNoComponents()).toBe(3);
        expect(left.getComponent(0)).toBe("a");
        expect(left.getComponent(1)).toBe("b");
        expect(left.getComponent(2)).toBe("c");
    });

    it("concat funktioniert über Implementierungsgrenzen hinweg (String += Array)", () => {
        const left = new StringName(["a"]);
        const right = new StringArrayName(["b", "c"]);

        left.concat(right);

        expect(left.getNoComponents()).toBe(3);
        expect(left.getComponent(0)).toBe("a");
        expect(left.getComponent(1)).toBe("b");
        expect(left.getComponent(2)).toBe("c");
    });

    it("clone liefert für beide Implementierungen austauschbare Objekte", () => {
        const arrOriginal = new StringArrayName(["x", "y", "z"]);
        const arrClone = arrOriginal.clone();

        const strOriginal = new StringName(["x", "y", "z"]);
        const strClone = strOriginal.clone();

        expect(arrClone.isEqual(strClone)).toBe(true);
        expect(strClone.isEqual(arrClone)).toBe(true);
    });

    it("asString und asDataString sind für beide Implementierungen konsistent (ohne Sonderzeichen)", () => {
        const components = ["part1", "part2", "part3"];
        const arrName = new StringArrayName(components);
        const strName = new StringName(components);

        expect(arrName.asString()).toBe(strName.asString());
        expect(arrName.asDataString()).toBe(strName.asDataString());
    });
});