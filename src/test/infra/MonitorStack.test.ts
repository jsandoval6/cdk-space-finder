import { MonitorStack } from "@/infra/stacks/MonitorStack";
import { App } from "aws-cdk-lib";
import { Capture, Match, Template } from "aws-cdk-lib/assertions";

describe( 'initial test suite', () => {
    let monitorStackTemplate: Template
    beforeAll( () => {
        const testApp = new App( {
            outdir: 'cdk.out'
        } );
        
        const monitorStack = new MonitorStack( testApp, 'MonitorStack' );
        monitorStackTemplate = Template.fromStack( monitorStack );
    })

    it( 'Lambda test properties', () => {
        
        monitorStackTemplate.hasResourceProperties( 'AWS::Lambda::Function', {
            Handler: 'index.handler',
            Runtime: 'nodejs20.x'
        } );
    } )
    
     it( 'SNS topic properties', () => {
        monitorStackTemplate.hasResourceProperties( 'AWS::SNS::Topic', {
            DisplayName: "AlarmTopic",
            TopicName: "AlarmTopic"
        } );
     } )
    
     it( 'SNS subscription properties - with matchers', () => {
         monitorStackTemplate.hasResourceProperties( 'AWS::SNS::Subscription',
            Match.objectEquals(
            {
                Protocol: 'lambda',
                TopicArn: {
                    Ref: Match.stringLikeRegexp('AlarmTopic')    
                },
                Endpoint: {
                    'Fn::GetAtt': [
                        Match.stringLikeRegexp('webHookLambda'),
                        'Arn'
                    ]
                }
            }
        ))
     } )
    
    it( 'SNS subscription properties - with exact values', () => {
        const snsTopic = monitorStackTemplate.findResources( 'AWS::SNS::Topic' );
        const snsTopicName = Object.keys( snsTopic )[ 0 ];
        
        const lambda = monitorStackTemplate.findResources( 'AWS::Lambda::Function' );
        const lambdaName = Object.keys( lambda )[ 0 ];
        
        monitorStackTemplate.hasResourceProperties( 'AWS::SNS::Subscription',
            Match.objectEquals(
                {
                    Protocol: 'lambda',
                    TopicArn: {
                        Ref: snsTopicName
                    },
                    Endpoint: {
                        'Fn::GetAtt': [
                            lambdaName,
                            'Arn'
                        ]
                    }
                }
            ) )
    } );

    it( 'Alarm Actions - captures', () =>
    {
        const alarmActionCapture = new Capture()

        monitorStackTemplate.hasResourceProperties( 'AWS::CloudWatch::Alarm', {
            AlarmActions: alarmActionCapture
        } );

        expect( alarmActionCapture.asArray() ).toEqual( [ {
            Ref: expect.stringMatching( /^AlarmTopic/ )
        } ])
    } )
    
    test( 'Monitor stack snapshot', () => {
        expect(monitorStackTemplate.toJSON()).toMatchSnapshot()
    } )
    
    test( 'Lambda stack snapshot', () =>
    {
        const lambda = monitorStackTemplate.findResources( 'AWS::Lambda::Function' )

        expect(lambda).toMatchSnapshot()
    } )
    
     test( 'Sns stack snapshot', () =>
    {
        const snsTopic = monitorStackTemplate.findResources( 'AWS::SNS::Topic' )

        expect(snsTopic).toMatchSnapshot()
    })
})