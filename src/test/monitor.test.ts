import { handler } from "@/services/monitor/handler";
import { SNSEvent } from "aws-lambda";

const snsEvent: SNSEvent = {
    Records: [ {
        Sns: {
            Message: "Hello World"
        }
    } ]
} as any;

handler( snsEvent, {} );