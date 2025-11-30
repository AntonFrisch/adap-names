// Name.test.ts
import { describe, it, expect } from "vitest";
import { Name } from "../../../src/adap-b04/names/Name";
import { StringName } from "../../../src/adap-b04/names/StringName";
import { StringArrayName } from "../../../src/adap-b04/names/StringArrayName";
import {
    DEFAULT_DELIMITER,
    ESCAPE_CHARACTER,
} from "../../../src/adap-b03/common/Printable";

/**
 * Factory-Typ für Name-Implementierungen
 */
type NameFactory = (components: string[], delimiter?: string) => Name;

/**
 * Gemeinsame Contract-Tests für alle Name-Implementierungen.
 * Wird unten für StringName und StringArrayName aufgerufen.
 */
function nameContractTests(implName: string, factory: NameFactory) {
    describe(implName, () => {
        // Hilfsfunktion mit Defaultwerten
        const create = (components: string[] = ["a", "b"], delimiter = DEFAULT_DELIMITER) =>
            factory(components, delimiter);

        // -----------------------------------------------------
        // Basale Konsistenz: Konstruktor, getNoComponents, getComponent
        // -----------------------------------------------------
        it("getNoComponents und getComponent sind konsistent", () => {
            const comps = ["a", "b", "c"];
            const name = create(comps);

            expect(name.getNoComponents()).toBe(comps.length);

            for (let i = 0; i < comps.length; i++) {
                expect(name.getComponent(i)).toBe(comps[i]);
            }
        });

        // -----------------------------------------------------
        // Preconditions: Indizes für getComponent
        // -----------------------------------------------------
        it("getComponent wirft bei negativem Index eine Exception", () => {
            const name = create(["a", "b"]);
            expect(() => name.getComponent(-1)).toThrow();
        });

        it("getComponent wirft bei Index == getNoComponents eine Exception", () => {
            const name = create(["a", "b"]);
            const n = name.getNoComponents();
            expect(() => name.getComponent(n)).toThrow();
        });

        it("getComponent wirft bei Index > getNoComponents eine Exception", () => {
            const name = create(["a", "b"]);
            const n = name.getNoComponents();
            expect(() => name.getComponent(n + 1)).toThrow();
        });

        // -----------------------------------------------------
        // Preconditions + Postconditions: setComponent
        // -----------------------------------------------------
        it("setComponent überschreibt Komponente und ändert Anzahl nicht", () => {
            const name = create(["a", "b", "c"]);
            const nOld = name.getNoComponents();

            name.setComponent(1, "x"); // gültiger Index, gültige Komponente

            expect(name.getNoComponents()).toBe(nOld);
            expect(name.getComponent(1)).toBe("x");
            // andere Komponenten unverändert
            expect(name.getComponent(0)).toBe("a");
            expect(name.getComponent(2)).toBe("c");
        });

        it("setComponent wirft bei ungültigem Index eine Exception", () => {
            const name = create(["a", "b"]);
            expect(() => name.setComponent(-1, "x")).toThrow();
            expect(() => name.setComponent(2, "x")).toThrow();
        });

        it("setComponent wirft bei nicht korrekt maskierter Komponente eine Exception", () => {
            const delimiter = ".";
            const name = create(["a", "b"], delimiter);

            // unmaskierter Delimiter im String -> sollte Precondition verletzen
            const invalidComponent = `a${delimiter}b`;
            expect(() => name.setComponent(0, invalidComponent)).toThrow();
        });

        // -----------------------------------------------------
        // Preconditions + Postconditions: insert
        // -----------------------------------------------------
        it("insert fügt Komponente an gegebener Position ein", () => {
            const name = create(["a", "c"]);
            const nOld = name.getNoComponents();

            name.insert(1, "b");

            expect(name.getNoComponents()).toBe(nOld + 1);
            expect(name.getComponent(0)).toBe("a");
            expect(name.getComponent(1)).toBe("b");
            expect(name.getComponent(2)).toBe("c");
        });

        it("insert erlaubt Index == getNoComponents (Einfügen am Ende)", () => {
            const name = create(["a", "b"]);
            const nOld = name.getNoComponents();

            name.insert(nOld, "c");

            expect(name.getNoComponents()).toBe(nOld + 1);
            expect(name.getComponent(nOld)).toBe("c");
        });

        it("insert wirft bei negativem oder zu großem Index eine Exception", () => {
            const name = create(["a", "b"]);
            const n = name.getNoComponents();
            expect(() => name.insert(-1, "x")).toThrow();
            expect(() => name.insert(n + 1, "x")).toThrow();
        });

        it("insert wirft bei nicht korrekt maskierter Komponente eine Exception", () => {
            const delimiter = ".";
            const name = create(["a", "b"], delimiter);
            const invalidComponent = `a${delimiter}b`;
            expect(() => name.insert(1, invalidComponent)).toThrow();
        });

        // -----------------------------------------------------
        // Preconditions + Postconditions: append
        // -----------------------------------------------------
        it("append erhöht Anzahl um 1 und fügt am Ende hinzu", () => {
            const name = create(["a"]);
            const nOld = name.getNoComponents();

            name.append("b");

            expect(name.getNoComponents()).toBe(nOld + 1);
            expect(name.getComponent(nOld)).toBe("b");
        });

        it("append wirft bei nicht korrekt maskierter Komponente eine Exception", () => {
            const delimiter = ".";
            const name = create(["a"], delimiter);
            const invalidComponent = `a${delimiter}b`;
            expect(() => name.append(invalidComponent)).toThrow();
        });

        // -----------------------------------------------------
        // Preconditions + Postconditions: remove
        // -----------------------------------------------------
        it("remove entfernt Komponente und verringert Anzahl um 1", () => {
            const name = create(["a", "b", "c"]);
            const nOld = name.getNoComponents();

            name.remove(1);

            expect(name.getNoComponents()).toBe(nOld - 1);
            expect(name.getComponent(0)).toBe("a");
            expect(name.getComponent(1)).toBe("c");
        });

        it("remove wirft bei ungültigem Index eine Exception", () => {
            const name = create(["a", "b"]);
            const n = name.getNoComponents();
            expect(() => name.remove(-1)).toThrow();
            expect(() => name.remove(n)).toThrow();
        });

        // -----------------------------------------------------
        // asString: Precondition auf delimiter + Postcondition auf Ergebnis
        // -----------------------------------------------------
        it("asString mit Standard-Delimiter erzeugt korrekt zusammengesetzten String", () => {
            const delimiter = ".";
            const name = create(["a", "b", "c"], delimiter);

            const s = name.asString(); // nutzt default delimiter

            expect(s).toBe("a.b.c");
        });

        it("asString mit Custom-Delimiter erzeugt korrekt zusammengesetzten String", () => {
            const name = create(["a", "b", "c"]);

            const s = name.asString("-");

            expect(s).toBe("a-b-c");
        });

        it("asString wirft bei ungültigem Delimiter (leer) eine Exception", () => {
            const name = create(["a", "b"]);
            // leerer String als Delimiter verletzt die Delimiter-Precondition
            expect(() => name.asString("")).toThrow();
        });

        it("asString wirft bei ESCAPE_CHARACTER als Delimiter eine Exception", () => {
            const name = create(["a", "b"]);
            expect(() => name.asString(ESCAPE_CHARACTER)).toThrow();
        });

        // -----------------------------------------------------
        // concat: Precondition other != null und Postcondition auf Anzahl/Komponenten
        // -----------------------------------------------------
        it("concat hängt alle Komponenten des anderen Namens an (Postcondition Anzahl + Inhalt)", () => {
            const name1 = create(["a"], ".");
            const name2 = create(["b", "c"], ".");

            const n1 = name1.getNoComponents();
            const n2 = name2.getNoComponents();

            name1.concat(name2);

            expect(name1.getNoComponents()).toBe(n1 + n2);
            expect(name1.getComponent(0)).toBe("a");
            expect(name1.getComponent(1)).toBe("b");
            expect(name1.getComponent(2)).toBe("c");
        });

        it("concat wirft bei null als other-Argument eine Exception", () => {
            const name1 = create(["a"]);
            const other = null as unknown as Name;

            expect(() => name1.concat(other)).toThrow();
        });

        // -----------------------------------------------------
        // clone: Postcondition – Klon hat gleichen Inhalt, ist aber unabhängig
        // -----------------------------------------------------
        it("clone erzeugt unabhängige Kopie mit gleichen Komponenten", () => {
            const original = create(["a", "b", "c"]);
            // clone() ist im Interface wahrscheinlich als Object typisiert → casten
            const clone = original.clone() as unknown as Name;

            // gleicher Inhalt
            expect(clone.getNoComponents()).toBe(original.getNoComponents());
            for (let i = 0; i < original.getNoComponents(); i++) {
                expect(clone.getComponent(i)).toBe(original.getComponent(i));
            }

            // Unabhängigkeit: Änderung am Original ändert Klon nicht
            original.setComponent(1, "x");
            expect(clone.getComponent(1)).toBe("b");
        });
    });
}

// ------------------------------------------------------------------
// Die Contract-Tests für beide Implementierungen ausführen
// ------------------------------------------------------------------

nameContractTests("StringArrayName", (components, delimiter = DEFAULT_DELIMITER) => {
    return new StringArrayName(components, delimiter);
});

nameContractTests("StringName", (components, delimiter = DEFAULT_DELIMITER) => {
    return new StringName(components, delimiter);
});
