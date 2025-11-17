import { describe, it, expect } from "vitest";

import { Name } from "../../../src/adap-b02/names/Name";
import { StringName } from "../../../src/adap-b02/names/StringName";
import { StringArrayName } from "../../../src/adap-b02/names/StringArrayName";

/**
 * Hilfsfunktion, die ein Name-Objekt generisch in einen "normalen"
 * Punkt-getrennten String konvertiert – ausschließlich über das Name-Interface.
 */
function buildDotSeparatedName(name: Name): string {
    let result = "";
    for (let i = 0; i < name.getNoComponents(); i++) {
        if (i > 0) {
            result += ".";
        }
        result += name.getComponent(i);
    }
    return result;
}

describe("Name implementations are interchangeable", () => {
    it("StringArrayName und StringName liefern identische Komponenten", () => {
        const arrayName: Name = new StringArrayName(["oss", "cs", "fau", "de"], ".");
        const stringName: Name = new StringName("oss.cs.fau.de", ".");

        expect(arrayName.getNoComponents()).toBe(stringName.getNoComponents());

        for (let i = 0; i < arrayName.getNoComponents(); i++) {
            expect(arrayName.getComponent(i)).toBe(stringName.getComponent(i));
        }

        expect(buildDotSeparatedName(arrayName)).toBe("oss.cs.fau.de");
        expect(buildDotSeparatedName(stringName)).toBe("oss.cs.fau.de");
    });

    it("concat funktioniert mit beliebigen Name-Implementierungen (Array + String)", () => {
        const left: Name = new StringArrayName(["oss", "cs"], ".");
        const right: Name = new StringName("fau.de", ".");

        left.concat(right);

        expect(left.getNoComponents()).toBe(4);
        expect(buildDotSeparatedName(left)).toBe("oss.cs.fau.de");
    });

    it("concat funktioniert mit beliebigen Name-Implementierungen (String + Array)", () => {
        const left: Name = new StringName("oss.cs", ".");
        const right: Name = new StringArrayName(["fau", "de"], ".");

        left.concat(right);

        expect(left.getNoComponents()).toBe(4);
        expect(buildDotSeparatedName(left)).toBe("oss.cs.fau.de");
    });

    it("generische Funktion über Name.setComponent funktioniert für beide Implementierungen", () => {
        function upperCaseAllComponents(name: Name): void {
            for (let i = 0; i < name.getNoComponents(); i++) {
                const current = name.getComponent(i);
                name.setComponent(i, current.toUpperCase());
            }
        }

        const arrayName: Name = new StringArrayName(["oss", "cs"], ".");
        const stringName: Name = new StringName("oss.cs", ".");

        upperCaseAllComponents(arrayName);
        upperCaseAllComponents(stringName);

        expect(buildDotSeparatedName(arrayName)).toBe("OSS.CS");
        // Dieser Expect schlägt mit der aktuellen StringName.setComponent-Implementierung fehl
        expect(buildDotSeparatedName(stringName)).toBe("OSS.CS");
    });

    it("Name[] kann beide Implementierungen enthalten und generisch verarbeitet werden", () => {
        const names: Name[] = [
            new StringArrayName(["a", "b"], "."),
            new StringName("c.d", "."),
        ];

        const asStrings = names.map(buildDotSeparatedName);

        expect(asStrings).toEqual(["a.b", "c.d"]);
    });

    it("insert/append/remove verhalten sich konsistent über das Interface", () => {
        function buildNameViaOperations(create: () => Name): string {
            const name = create();
            name.append("oss");
            name.append("cs");
            name.insert(1, "fau");   // oss.fau.cs
            name.remove(2);          // oss.fau
            return buildDotSeparatedName(name);
        }

        const arrayResult = buildNameViaOperations(
            () => new StringArrayName([], "."),
        );
        const stringResult = buildNameViaOperations(
            () => new StringName("", "."),
        );

        expect(arrayResult).toBe("oss.fau");
        expect(stringResult).toBe("oss.fau");
    });
});
