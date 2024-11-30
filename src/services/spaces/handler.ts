import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import { v4 } from 'uuid';
import { S3Client } from '@aws-sdk/client-s3';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { postSpaces } from "./PostSpaces";
import { getSpaces } from "./GetSpaces";
import { updateSpace } from "./UpdateSpace";
import { deleteSpace } from "./DeleteSpace";

const s3Client = new S3Client( {} );
const ddbClient = new DynamoDBClient( {} );

async function handler ( event: APIGatewayProxyEvent, context: Context ): Promise<APIGatewayProxyResult> {
    let message: string = '';
    console.log( event );
    try {
        switch ( event.httpMethod ) {
        case 'GET':
            const getResponse = getSpaces(event, ddbClient);
            return getResponse;
        case 'POST':
            const postResponse  = await postSpaces( event, ddbClient );
              return postResponse        
        case 'PUT':
            const updateResponse  = await updateSpace( event, ddbClient );
                return updateResponse
        case 'DELETE':
           return deleteSpace(event, ddbClient)
        default:
            break
        }
    } catch ( err ) {
        console.log(err)
        const response = {
            statusCode: 500,
            body: JSON.stringify( err )
        }

        return response
    }
    
	const response: APIGatewayProxyResult = {
		statusCode: 200,
		body: JSON.stringify({
			message
		})
	}
	
	return response;
}

export { handler }
