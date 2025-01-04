import { handler } from "@/services/monitor/handler"

describe( 'Monitor Lambda Tests', () => {
    
    const fetchSpy = jest.spyOn( global, 'fetch' );
    fetchSpy.mockImplementation( () => Promise.resolve( {} as any ) );

    afterEach( () => {
        jest.clearAllMocks()
    })

    it( 'makes request for records in sns events', async() =>{
        await handler( {
            Records: [ {
                Sns: {
                    Message: 'Test Message'
                }
            }]
        } as any, {} )
        
        expect( fetchSpy ).toHaveBeenCalledTimes( 1 );
        expect( fetchSpy ).toHaveBeenCalledWith( expect.any( String ), {
            method: 'POST',
            body: JSON.stringify({
                text: `Houston we have problem Test Message`
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    } )
    
     it( 'No sns records', async() =>{
        await handler( {
            Records: [ ]
        } as any, {} )
        
        expect( fetchSpy ).not.toHaveBeenCalled( );
    })
})