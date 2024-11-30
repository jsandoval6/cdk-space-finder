import { SpaceEntry } from "@/services/model/Model";

export class MissingFieldError extends Error {
    constructor ( missingField: string ) {
        super( `Missing field ${ missingField } expected` );
    }
}

export class JSONError extends Error {}

export function validateAsSpaceEntry ( args: any ) {
    if ( ( args as SpaceEntry ).location === undefined ) {
        throw new MissingFieldError( 'location' );
    }

    if ( ( args as SpaceEntry ).DataStack === undefined ) {
        throw new MissingFieldError( 'location' );
    }

    if ( ( args as SpaceEntry ).id === undefined ) {
        throw new MissingFieldError( 'location' );
    }
}