const { HttpAgent, Actor } = require('@dfinity/agent');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// 从环境变量获取canister ID
const CANISTER_ID = process.env.CANISTER_ID_USDC_MONITOR_BACKEND;
const IDL_PATH = path.join(__dirname, './src/declarations/usdc_monitor_backend/usdc_monitor_backend.did.js');

// 定义监控阈值
const TRANSFER_THRESHOLD = 1_000_000;

// 1. 初始化ICP代理
const agent = new HttpAgent({ 
    host: process.env.DFX_NETWORK === 'local' ? 'http://localhost:4943' : 'https://ic0.app' 
});

// 2. 导入合约的接口描述文件
let idlFactory;
try {
    idlFactory = require(IDL_PATH).idlFactory;
} catch (error) {
    console.error('Could not load canister interface description:', error);
    process.exit(1); // 如果无法加载接口描述文件，则退出程序
}

// 创建Actor实例
const usdcMonitor = Actor.createActor(idlFactory, {
    agent,
    canisterId: CANISTER_ID,
});

// 3. 监控函数
async function monitorUSDCTransfers() {
    try {
        // TODO: 替换为实际的USDC转账API端点
        const response = await axios.get('https://ic-api-url-to-fetch-usdc-transfers');
        const transfers = response.data; // 假设API返回的JSON包含交易列表

        for (const transfer of transfers) {
            const { from, to, amount, timestamp } = transfer;

            // 检查转账金额是否超过阈值
            if (amount > TRANSFER_THRESHOLD) {
                console.log(`Detected large transfer from ${from} to ${to} of amount ${amount} at ${timestamp}`);

                try {
                    // 调用Motoko合约的logTransfer函数记录转账
                    const result = await usdcMonitor.logTransfer(from, to, BigInt(amount), BigInt(timestamp));
                    console.log('Transfer logged:', result);
                } catch (error) {
                    console.error('Error logging transfer to canister:', error);
                }
            }
        }
    } catch (error) {
        console.error('Error fetching or processing transfers:', error);
    }
}

// 4. 定时监控（每分钟执行一次）
setInterval(monitorUSDCTransfers, 60000);

// 立即执行一次监控
monitorUSDCTransfers();
