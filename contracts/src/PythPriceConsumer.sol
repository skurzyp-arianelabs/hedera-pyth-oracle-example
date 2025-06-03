// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "@pythnetwork/pyth-sdk-solidity/IPyth.sol";
import "@pythnetwork/pyth-sdk-solidity/PythStructs.sol";

contract PythPriceConsumer {
    IPyth public pyth;
    bytes32 public priceId;
    int64 public lastPrice;
    int32 public lastExpo;
    uint public lastUpdated;

    constructor(address _pyth, bytes32 _priceId) {
        pyth = IPyth(_pyth);
        priceId = _priceId;
    }

    function updatePrice(bytes[] calldata updateData) external payable {
        uint fee = pyth.getUpdateFee(updateData);
        pyth.updatePriceFeeds{ value: fee }(updateData);

        PythStructs.Price memory priceData = pyth.getPriceNoOlderThan(priceId, 60);
        lastPrice = priceData.price;
        lastExpo = priceData.expo;
        lastUpdated = block.timestamp;
    }

    function getLatestPrice() external view returns (int64, int32, uint) {
        return (lastPrice, lastExpo, lastUpdated);
    }
}
