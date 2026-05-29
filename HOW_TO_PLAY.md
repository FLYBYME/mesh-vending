# 🕹️ Vending Machine Simulator - Game Guide

Welcome to the **Autonomous Vending Machine Simulator**! You (or your AI agent) are now the proud owner of a digital vending machine business.

## 🎯 The Goal
Your objective is simple: **Maximize your money balance over several days**.
You start at **Day 1** with **$500.00**.

Every day, a daily fee of **$2.00** is deducted from your balance just to keep the lights on. If you do nothing, you will slowly bleed money until you go bankrupt! You need to buy inventory from wholesalers, set profitable prices, and keep your machine fully stocked.

## 📦 How to Play

Playing the game involves performing actions using the Mesh CLI tools. Each action uses the `npx mesh vending` namespace. 

*Note: Make sure the Mesh Server is running locally (`npx mesh start --port 9033 --bootstrap ws://127.0.0.1:5005 --services src/`) before executing these CLI commands.*

### Step 1: Check the Wholesaler Catalog
You can't sell what you don't have. Send an email to the wholesaler to see what products are available.
```bash
npx mesh vending email_write --to wholesale@vending-supply.com --subject "Catalog" --body "Please send me your product catalog."
```

### Step 2: Advance the Day & Read Mail
Since shipping and communication take time, advance to the next day to receive the wholesaler's reply.
```bash
npx mesh vending wait_for_next_day
npx mesh vending email_read
```
*You'll see a list of products (like `prod_soda`), sizes, and wholesale prices!*

### Step 3: Order Inventory
Send an order to the wholesaler using the exact format `ORDER <productId> <quantity>` on a new line for each item.
```bash
npx mesh vending email_write --to wholesale@vending-supply.com --subject "Order" --body "ORDER prod_soda 20\nORDER prod_chips 10"
```
Advance the day again (`npx mesh vending wait_for_next_day`), and check your inventory to confirm the delivery:
```bash
npx mesh vending inventory_check
```

### Step 4: Stock the Machine
Your vending machine has physical slots.
- **Small Slots:** `A1` to `A3`, `B1` to `B3`
- **Large Slots:** `C1` to `C3`, `D1` to `D3`

Move items from your warehouse inventory into the physical slots:
```bash
npx mesh vending machine_stock --slotId A1 --productId prod_soda --quantity 5
```

### Step 5: Set Retail Prices
You get to decide the markup! Set a price for your newly stocked slot:
```bash
npx mesh vending machine_set_price --slotId A1 --price 1.50
```

### Step 6: Wait for Sales & Collect Cash
As you run `npx mesh vending wait_for_next_day`, the simulation calculates purchases based on your prices and the product's demand elasticity. The earnings will pile up as "uncollected cash" in the machine.

Check how much cash is sitting in the machine:
```bash
npx mesh vending machine_inventory
```

When you're ready, collect the cash and add it back to your main balance!
```bash
npx mesh vending machine_collect_cash
```

Check your total profits anytime with:
```bash
npx mesh vending balance_check
```

## 🔄 Resetting the Game
If you go bankrupt or want to start over from Day 1 with a fresh balance, simply run:
```bash
npx mesh vending reset
```

## 🤖 Automating the Game
While you can play manually via the CLI, the real fun is writing an AI agent to do this for you! You can run the `demo_vending.ts` script to spawn an autonomous AI agent that will read the emails, make purchasing decisions, set prices, and try to maximize profits while you watch!
