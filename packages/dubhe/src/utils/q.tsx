import { Option } from "../types";

// Quick Functions
export namespace QUtil {
    export function findOptLabel(value: string, options: Option[]) {
        return options.find((o) => o.value === value)?.label ?? ""
    }
}