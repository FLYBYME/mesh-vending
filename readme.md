While Large Language Models (LLMs) can exhibit impressive proficiency in isolated,
short-term tasks, they often fail to maintain coherent performance over longer time horizons. In
this paper, we present Vending-Bench, a simulated environment designed to specifically test an
LLM-based agent’s ability to manage a straightforward, long-running business scenario: operating a vending machine. Agents must balance inventories, place orders, set prices, and handle
daily fees – tasks that are each simple but collectively, over long horizons (>20M tokens per run)
stress an LLM’s capacity for sustained, coherent decision-making. Our experiments reveal high
variance in performance across multiple LLMs: Claude 3.5 Sonnet and o3-mini manage the
machine well in most runs and turn a profit, but all models have runs that derail, either through
misinterpreting delivery schedules, forgetting orders, or descending into tangential "meltdown"
loops from which they rarely recover. We find no clear correlation between failures and the
point at which the model’s context window becomes full, suggesting that these breakdowns do
not stem from memory limits. Apart from highlighting the high variance in performance over
long time horizons, Vending-Bench also tests models’ ability to acquire capital, a necessity in
many hypothetical dangerous AI scenarios. We hope the benchmark can help in preparing for
the advent of stronger AI systems.
1 Introduction
Large language models (LLMs) have seen remarkable performance improvements in the last couple
of years. They are now on the level of PhDs in many academic domains [4,6], they outperform most
professional coders in competitive programming [7], and they even display impressive emotional
intelligence [5]. In addition to this display of intelligence, they also come with the speed advantages
computers traditionally have had over humans. Yet, they have not had the enormous impact one
might have expected from this level of intelligence "on tap". One could have imagined that we
would have "digital co-workers" – AI agents which do most of the remote work in society. However,
something is clearly missing.
OpenAI co-founder John Schulman has speculated that the missing piece is long-term coherence [8].
This is the ability for the LLMs to do tasks over long time horizons. Similarly, METR, an AI
1
arXiv:2502.15840v1 [cs.AI] 20 Feb 2025
safety organization focused on evaluating LLM, found that LLMs gain far less in performance from
increased time budgets compared to humans [9]. METR’s investigation focused on very complex
tasks (specifically, AI R&D), but it is not clear if this trend holds for more simple tasks.
By formulating tasks that are more simple (but long-running), one could measure the capability of
long-term coherence in a more isolated manner. We therefore propose Vending-Bench, a simulated
environment where LLM agents operate a vending machine. The agent must handle ordering,
inventory management and pricing. Each sub-task is very simple, but we observe that over long
time horizons, the agent’s performance often deteriorates. That being said, some runs with the most
capable LLMs, Claude 3.5 Sonnet and o3-mini, outperform the human baseline, albeit with higher
variance in the results than a human would have. See Figure 1 for an overview of the benchmark.
Figure 1: Overview of Vending-Bench
Operating a vending machine involves acquiring capital and managing resources, capabilities that
have dual-use potential. They are essential for enabling many valuable applications of AI [2], but
are also necessary in many hypothetical scenarios where AI poses risks. Evaluating dangerous
capabilities is an important part of AI safety research, but if capability researchers optimize their
systems to perform well on these benchmarks, they may unintentionally advance the very capabilities
we aim to assess and in order to avoid. We recognize this risk but believe that systematic evaluation
is crucial for implementing timely safety measures. Without reliable evaluation methods, we risk
being unprepared when the capabilities emerge.
In the following sections we will describe Vending-Bench in greater detail, outline results from
running the benchmark, and discuss findings.
2 Method
2.1 Agent implementation
An LLM agent is a computer program that allows an LLM to autonomously take actions to complete
a task. The simplest implementation is a loop where the LLM repeatedly calls tools based on
2
previous iterations and the task objective. More complex implementations can enhance a model’s
capabilities but also add implementation complexity, and potentially introduce biases that favor
certain models. To balance this complexity while ensuring models are not unnecessarily constrained,
the agent in Vending-Bench is a basic loop with the following additional characteristics:
• Context management - In each iteration, the last N (30,000 in most of our experiments) tokens
of the history is given to the agent as input to LLM inference.
• Memory tools - The agent is given read, write and delete access to three types of databases to
compensate for the memory limitations: a scratchpad, key-value store and a vector database,
all without explicit storage constraints. The latter is implemented as a simple dictionary
of texts and embeddings computed using OpenAI’s text-embedding-3-small model and
searched with cosine similarity.
• Task-specific tools: Tools related to the operations of a vending machine business, further
described below.
Our agent is implemented in AISI’s inspect-ai framework [1].
2.2 Task environment
The agent has various task-specific tools at disposal. Tools related to tasks that can be carried out
remotely are available directly to the agent: read and write emails, research products using a search
engine (Perplexity), see the current storage inventory and check the money balance. However, some
parts of operating a vending machine requires actions in the physical world. By giving the main
agent access to a sub-agent, we simulate the interaction that would occur between digital AI agents
and humans (or robots) which operate in the real world. The sub-agent has tools to stock products in
the vending machine from the storage, collect cash, set prices and get the inventory of the vending
machine.
To achieve this technically, we implement and open source an extension to inspect-ai [3]. Our
library extension allows agents to delegate tasks to sub-agents. The main agent interfaces with the
sub-agents using the following tools:
• sub_agent_specs: Return info about the sub-agent, including what tools it has available.
• run_sub_agent: Give instructions to a sub-agent as a string and execute it.
• chat_with_sub_agent: Ask questions to the sub-agent to find what it did during the run.
Each action an agent takes moves time in the simulation forward, but the agent can also choose
to let time pass with the wait_for_next_day tool. Every morning, the agent is notified of what
items were purchased, and if any new email has been received. To be successful, an agent needs to:
• Buy products from suppliers by sending e-mails
• Stock items in the vending machine
• Set competitive prices
• Collect earnings regularly
3
• Manage daily operating costs
The task environment includes simulating human behavior. Specifically, we simulate the agent’s
communication with wholesale suppliers, and customers’ purchasing behavior.
2.2.1 Simulating supplier communication
The process of ordering products typically happens as follows in Vending-Bench, requiring the
simulation of e-mail replies of those the agent contacts:
1. Agent researches popular vending machine products using the search engine.
2. Agent looks for contact information of wholesalers near its address using the search engine.
3. Agent sends emails to the wholesalers inquiring about the products they have.
4. As a new day passes, every wholesaler e-mail that actually exists in the real world creates an
AI-generated reply, where the response depends both on real-world data about the supplier
that we fetch using Perplexity, and what the agent has requested. For example, if the agent is
asking what products the wholesaler offers, we gather this information with Perplexity and
generate a realistic reply with GPT-4o. See Figure 2.
5. To actually buy the products, the agent must in an e-mail specify names and quantities of
items to purchase, the delivery address, and an account number the wholesaler can charge.
The products are then shipped and delivered a few days later. The agent is notified by e-mail
when the products are available in its inventory.
Figure 2: Setup of supplier communication
4
2.2.2 Simulating customer purchases
Our economic model simulates daily customer purchases using price elasticity of demand. When
prices are set too high, sales decrease. The model runs once per day to calculate sales for each item
available for purchase in the vending machine. It follows these steps:
1. GPT-4o generates and caches three values per item: price elasticity, reference price, and base
sales.
2. Sales volume is calculated using percentage difference from reference price and price elasticity
to create a sales impact factor, which multiplies base sales.
3. Base sales are modified by day-of-week and monthly multipliers, plus weather impact factors
(e.g., sunny June weekend vs. rainy February Monday).
4. A choice multiplier rewards optimal product variety but penalizes excess options, capped at
50% reduction.
5. Final prediction adds random noise, rounds, and caps between zero and available inventory.
2.3 Environment configuration
The agent starts with an initial money balance of $500 and is charged a daily fee of $2 to operate
the vending machine. The vending machine has four rows with three slots each. Two of the rows
have room for small items and the other two are for large items (with sizes determined by GPT-4o
upon ordering of products). Using a tool moves time in the environment forward by 5 min, 25 min,
75 min or 5 h, depending on the tool. The agent has a memory of 30,000 tokens.
We run the agent with this config for 2,000 messages per run, but end early if the model goes
bankrupt and can’t pay the daily fee for 10 consecutive days. We also do experiments with GPT-4o
mini with variations of this config. Each experiment (model or config variation) is run 5 times. Most
runs consume around 25 million tokens and take 5-10 real world hours of continuous simulation.
2.4 Scoring
The primary score of the agent is its net worth at the end of the game, i.e. a sum of:
• The cash at hand
• The cash not emptied from the vending machine
• The value of the unsold products purchased and currently in the inventory or in the vending
machine (based on the wholesale purchase price)
We also track the money balance, number of units sold and the agent’s tool use.
2.5 Human baseline
To put the different LLM’s results in perspective to human performance, we had a human complete
the task for five hours. We built a chat-based interface where the human acted as the LLM, writing
5
text and selecting tools. The participant had no prior knowledge of the task and had to understand
its dynamics solely from the instruction prompt and interactions with the environment, just like the
LLMs.