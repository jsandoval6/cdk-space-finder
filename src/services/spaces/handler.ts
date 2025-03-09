import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import { S3Client } from '@aws-sdk/client-s3';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { postSpaces } from "./PostSpaces";
import { getSpaces } from "./GetSpaces";
import { updateSpace } from "./UpdateSpace";
import { deleteSpace } from "./DeleteSpace";
import { captureAWSv3Client } from "aws-xray-sdk-core";
import { addCORSHeader } from "../shared/Utils";

const s3Client = new S3Client( {} );
const ddbClient = captureAWSv3Client(new DynamoDBClient({}))

async function handler ( event: APIGatewayProxyEvent, context: Context ): Promise<APIGatewayProxyResult> {
    let message: string = '';
    
    // const subSeg = getSegment()?.addNewSubsegment('MyLongCall');
    // await new Promise( ( resolve ) => setTimeout( resolve, 3000 ) );
    // subSeg?.close()

    // const subSeg2 = getSegment()?.addNewSubsegment('MyLongCall');
    // await new Promise( ( resolve ) => setTimeout( resolve, 500 ) );
    // subSeg2?.close()
    try {
        switch ( event.httpMethod ) {
        case 'GET':
            const getResponse = await getSpaces(event, ddbClient);
            addCORSHeader( getResponse );
            return getResponse;
        case 'POST':
            const postResponse = await postSpaces( event, ddbClient );
            addCORSHeader( postResponse );
            return postResponse        
        case 'PUT':
            const updateResponse = await updateSpace( event, ddbClient );
            addCORSHeader( updateResponse );
            return updateResponse
        case 'DELETE':
            const deleteResponse = await deleteSpace( event, ddbClient );
            addCORSHeader( deleteResponse );
            return deleteResponse;
        default:
            break
        }
    } catch ( err ) {
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
