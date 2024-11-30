import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { v4, validate } from 'uuid';
import { validateAsSpaceEntry } from "@/services/shared/DataValidator";
import { marshall } from "@aws-sdk/util-dynamodb";
import { parseJSON } from "@/services/shared/Utils";

export async function postSpaces( event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
    
    const randomId = v4();
    const item = parseJSON(event.body)
    item.id = randomId;
    
    validateAsSpaceEntry( marshall(item) );

    const result = await ddbClient.send( new PutItemCommand( {
        TableName: process.env.TABLE_NAME,
        Item: {
            id: {
                S: randomId
            },
            location: {
                S: item.location
            },
            DataStack: {
                S: 'spaceTable'
            }
        }
    } ) );

    console.log( result );

    return {
        statusCode: 200,
        body: JSON.stringify( { id: randomId } )
    }
}

