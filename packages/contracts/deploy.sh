#!/bin/bash

# POAP Smart Contract Deployment Script
# This script helps you deploy your contracts to Stacks testnet

echo "🚀 POAP Smart Contract Deployment Helper"
echo "========================================"
echo ""

# Check if in correct directory
if [ ! -f "Clarinet.toml" ]; then
    echo "❌ Error: Please run this script from the packages/contracts directory"
    exit 1
fi

# Check Clarinet installation
if ! command -v clarinet &> /dev/null; then
    echo "❌ Clarinet is not installed"
    echo "📥 Install with: brew install clarinet"
    echo "📚 Or visit: https://github.com/hirosystems/clarinet"
    exit 1
fi

echo "✅ Clarinet found: $(clarinet --version)"
echo ""

# Check if mnemonic is set
if grep -q "YOUR PRIVATE TESTNET MNEMONIC HERE" settings/Testnet.toml; then
    echo "⚠️  Testnet mnemonic not configured"
    echo ""
    echo "📋 You have two options:"
    echo ""
    echo "Option 1: Use Hiro Platform (Recommended - No CLI setup needed)"
    echo "  1. Visit https://platform.hiro.so"
    echo "  2. Connect your wallet"
    echo "  3. Deploy contracts with UI"
    echo ""
    echo "Option 2: Configure CLI deployment"
    echo "  1. Get your wallet seed phrase (12-24 words)"
    echo "  2. Edit settings/Testnet.toml"
    echo "  3. Replace placeholder with your mnemonic"
    echo "  4. Get testnet STX from: https://explorer.hiro.so/sandbox/faucet?chain=testnet"
    echo "  5. Run: clarinet deployments generate --testnet"
    echo "  6. Run: clarinet deployments apply -p deployments/default.testnet-plan.yaml"
    echo ""
    echo "⚠️  WARNING: Never commit your mnemonic to git!"
    echo "Add settings/Testnet.toml to .gitignore"
    exit 1
fi

echo "✅ Testnet configuration found"
echo ""
echo "📝 Generating deployment plan..."
clarinet deployments generate --testnet

if [ $? -ne 0 ]; then
    echo "❌ Failed to generate deployment plan"
    exit 1
fi

echo ""
echo "✅ Deployment plan generated!"
echo ""
echo "📋 Review the plan in: deployments/default.testnet-plan.yaml"
echo ""
echo "🚀 To deploy, run:"
echo "   clarinet deployments apply -p deployments/default.testnet-plan.yaml"
echo ""
echo "💡 Make sure you have testnet STX in your wallet!"
echo "   Get some from: https://explorer.hiro.so/sandbox/faucet?chain=testnet"
