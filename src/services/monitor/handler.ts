import { Context, SNSEvent } from "aws-lambda";

const webHookUrl: string = process.env.WEBHOOK_URL || '';

async function handler(event: SNSEvent, context: any ) {
    for (const record of event.Records) {
        await fetch(webHookUrl, {
            method: 'POST',
            body: JSON.stringify({
                text: `Houston we have problem ${record.Sns.Message}`
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}

export { handler }