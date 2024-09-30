import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender} from '@ton/core';

export type HelloWorldConfig = 
{
    value:number;
};

export function helloWorldConfigToCell(config: HelloWorldConfig): Cell {
    return beginCell()
        .storeUint(config.value, 32)
        .endCell();
}

export class HelloWorld implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new HelloWorld(address);
    }

    static createFromConfig(config: HelloWorldConfig, code: Cell, workchain = 0) {
        const data = helloWorldConfigToCell(config);
        const init = { code, data };
        return new HelloWorld(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender) {
        await provider.internal(via, {
            value: "0.01",
            bounce: false
        });
    }

    async sendIncrement(provider : ContractProvider, via : Sender)
    {
        const messageBody = beginCell()
            .storeUint(1, 32) // команда прибавления одного;
            .storeUint(0, 64) // номер очереди (хз)
            .endCell();
        
        await provider.internal(via, {
            value : "0.002", // 1 рубль за операцию
            body : messageBody
        })
    }

    async getCounter(provider : ContractProvider)
    {
        const {stack} = await provider.get("get_counter", []);

        return stack.readBigNumber();
    }
}
