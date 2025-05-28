// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console2} from "forge-std/Test.sol";
import {MyFirstPythContract} from "../src/MyFirstPythContract.sol";
import {MockPyth} from "@pythnetwork/pyth-sdk-solidity/MockPyth.sol";

contract MyFirstPythContractTest is Test {
    MockPyth public pyth;
    bytes32 HBAR_PRICE_FEED_ID = bytes32(uint256(0x1));
    MyFirstPythContract public app;

    uint256 HBAR_TO_WEI = 10 ** 8;

    function setUp() public {
        pyth = new MockPyth(60, 1);
        app = new MyFirstPythContract(address(pyth), HBAR_PRICE_FEED_ID);
    }

    function createEthUpdate(
        int64 hbarPrice
    ) private view returns (bytes[] memory) {
        bytes[] memory updateData = new bytes[](1);
        updateData[0] = pyth.createPriceFeedUpdateData(
            HBAR_PRICE_FEED_ID,
            hbarPrice * 100000,
            10 * 100000,
            - 5,
            hbarPrice * 100000,
            10 * 100000,
            uint64(block.timestamp),
            uint64(block.timestamp)
        );

        return updateData;
    }

    function setHbarPrice(int64 hbarPrice) private {
        bytes[] memory updateData = createEthUpdate(hbarPrice);
        uint value = pyth.getUpdateFee(updateData);
        vm.deal(address(this), value);
        pyth.updatePriceFeeds{value: value}(updateData);
    }

    function testMint() public {
        setHbarPrice(100);

        vm.deal(address(this), HBAR_TO_WEI);
        app.mint{value: HBAR_TO_WEI / 100}();
    }

    function testMintRevert() public {
        setHbarPrice(99);

        vm.deal(address(this), HBAR_TO_WEI);
        vm.expectRevert();
        app.mint{value: HBAR_TO_WEI / 100}();
    }

    function testMintStalePrice() public {
        setHbarPrice(100);

        skip(120);

        vm.deal(address(this), HBAR_TO_WEI);
        // Add this line
        vm.expectRevert();

        app.mint{value: HBAR_TO_WEI / 100}();
    }

    function testUpdateAndMint() public {
        bytes[] memory updateData = createEthUpdate(100);

        vm.deal(address(this), HBAR_TO_WEI);
        app.updateAndMint{value: HBAR_TO_WEI / 100}(updateData);
    }
}
