import { EventEmitter } from "events";

export const mockEvent = {
    "logIndex": 1,
    "transactionIndex": 0,
    "transactionHash": "0x673434b526c54c6d92f5705925045fe9db5f61494483ece6ad5fcbed2586cdc6",
    "blockHash": "0x8f6ad85fdcee3af75f15b4a3a8c27bbbf629581cc379fb947447ab2db3d77a65",
    "blockNumber": 9,
    "address": "0x96eAF28B6E59DEfC8F736faA1681D41382d3AA32",
    "type": "mined",
    "id": "log_12e7a3bc",
    "returnValues": {
        "0": "0xACDA24d92a3E59495546cE8c16D27E9984Fa8240",
        "1": "50000000000000000000",
        "2": "334",
        "3": "149700598802395209",
        "_requester": "0xACDA24d92a3E59495546cE8c16D27E9984Fa8240",
        "_ocn": "50000000000000000000",
        "_drops": "334",
        "_price": "149700598802395209"
    },
    "event": "TokenBuyDrops",
    "signature": "0x04b6655d1eed78cc9a68dbe5650a9f4e8feb2803c74da054d3f502eff69c3a9f",
    "raw": {
        "data": "0x000000000000000000000000000000000000000000000002b5e3af16b1880000000000000000000000000000000000000000000000000000000000000000014e0000000000000000000000000000000000000000000000000213d7e6c647b049",
        "topics": ["0x04b6655d1eed78cc9a68dbe5650a9f4e8feb2803c74da054d3f502eff69c3a9f", "0x000000000000000000000000acda24d92a3e59495546ce8c16d27e9984fa8240"]
    }
};

export const mockEvents = new EventEmitter();

export const mockWeb3 = {
    eth: {
        getBlock: jest.fn().mockReturnValue({
            timestamp: 1540072
        })
    }
}

export const bondingCurveContract = {
    methods: {
        scale: jest.fn().mockReturnValue({
            call: jest.fn()
        })
    },
    events: {
        allEvents: jest.fn().mockReturnValue(mockEvents)
    }
}