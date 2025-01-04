import { JSONError } from "@/services/shared/DataValidator"

export function parseJSON ( args: any ) {
    try {
        return JSON.parse(args)
    } catch(error) {
        throw new JSONError('Invalid JSON')
    }
}