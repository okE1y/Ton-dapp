import { useEffect, useState } from 'react';
import { HelloWorld } from '../contracts/HelloWorld';
import { useTonClient } from '../hooks/useTonClient';
import { useAsyncInitialize } from './useAsyncInitialize';
import { Address, OpenedContract } from '@ton/core';
import { useTonConnect } from './useTonConnect';

export function useHelloWorldContract()
{
    const client = useTonClient();
    const [val, setVal] = useState<null | number>();
    const { sender } = useTonConnect();

    const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

    const HelloWorldContract = useAsyncInitialize(async () => 
        {
            if (!client) return;

            const HelloWorldInstance = HelloWorld.createFromAddress(Address.parse("EQBStZxQytbQDnoB7dfWuNlqp1IAxomj_SccXMewZviIBXpT"))
            return client.open(HelloWorldInstance) as OpenedContract<HelloWorld>;
        }, [client]);

    useEffect(() => 
        {
            async function getValue() {
                if (!HelloWorldContract)
                    return;

                setVal(null);
                const val = await HelloWorldContract.getCounter();
                setVal(Number(val));
                await sleep(5000);
                getValue();
            }

            getValue();
        }, [HelloWorldContract]);
    
    return {
        value: val,
        address: HelloWorldContract?.address.toString(),
        sendIncrement: () => HelloWorldContract?.sendIncrement(sender)
    };
}