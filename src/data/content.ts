import type { Chapter } from '../types';

export const chapters: Chapter[] = [
  {
    id: 'genai-llms',
    number: 1,
    title: 'Generative AI & Large Language Models',
    description: 'Core concepts behind modern AI — what you built at TCS',
    icon: '🤖',
    color: '#8b5cf6',
    tag: 'TCS Internship',
    sections: [
      {
        id: 'what-is-genai',
        title: 'What is Generative AI?',
        content: `Generative AI refers to AI systems that create new content — text, images, audio, or code — by learning patterns from training data. Unlike traditional AI that classifies or predicts discrete labels, generative models produce novel, open-ended outputs.

**Main Paradigms:**
- **Autoregressive models (GPT family):** Generate text token-by-token, each conditioned on previous tokens. This is what powers ChatGPT and the APIs you used at TCS.
- **Diffusion models (DALL-E, Stable Diffusion):** Learn to reverse a noise process to generate images.
- **VAEs (Variational Autoencoders):** Encode data into a compressed latent space, then decode to generate variations.
- **GANs (Generative Adversarial Networks):** Two competing networks — a generator and discriminator — improve each other.

**Why it matters in enterprise:**
At TCS, you built GenAI solutions for enterprise use cases. This means taking foundation models (pre-trained on massive data) and integrating them into business workflows — automating document processing, customer service, internal search, and recommendation systems.

The core challenge in enterprise GenAI is not the model itself (you use APIs for that) but: reliability, accuracy, cost management, integration with existing systems, and governance.`,
        keyPoints: [
          'Generative AI creates new content; discriminative AI classifies existing data',
          'LLMs are autoregressive — predict next token given all previous tokens',
          'Enterprise focus: reliability, cost, hallucination control, system integration',
          'Foundation models are pre-trained on massive data, then adapted via fine-tuning or prompting',
          'Key risk: hallucination — models produce plausible but factually wrong outputs',
          'You used GPT-style LLM APIs at TCS, not trained models from scratch',
        ],
        interviewQs: [
          {
            q: 'What is the difference between generative and discriminative AI?',
            a: 'Discriminative models learn the boundary between classes and output labels or probabilities (e.g., spam classifier). Generative models learn the underlying data distribution and can produce new samples from it. LLMs are generative — trained to predict the next token, which enables open-ended text generation. In practice, the same generative model can be prompted to do classification (discriminative task) by framing the output as a label.',
          },
          {
            q: 'What is hallucination in LLMs and how did you handle it at TCS?',
            a: 'Hallucination is when an LLM generates fluent, confident text that is factually incorrect. It happens because LLMs optimize for statistical plausibility, not factual accuracy. At TCS, mitigation strategies included: (1) RAG — grounding responses in retrieved source documents, (2) prompt engineering — instructing the model to say "I don\'t know" when uncertain, (3) output validation pipelines that check responses against known facts, (4) reducing temperature for more deterministic outputs, (5) documenting model limitations for stakeholders.',
          },
          {
            q: 'What is a foundation model?',
            a: 'A foundation model is a large model pre-trained on broad, diverse data at massive scale, designed to be adapted for many downstream tasks. Examples: GPT-4, Claude, LLaMA. Pre-training learns general language understanding and world knowledge. The model is then adapted via fine-tuning, RLHF, or prompting for specific tasks. Foundation models democratize AI: companies use APIs rather than training from scratch.',
          },
        ],
      },
      {
        id: 'transformer-arch',
        title: 'Transformer Architecture',
        content: `All modern LLMs are built on the Transformer architecture (Vaswani et al., "Attention Is All You Need", 2017). Understanding the components helps you reason about model behavior in interviews.

**Key Components:**

**1. Tokenization**
Text is split into tokens (subword units) using Byte-Pair Encoding (BPE). "programming" → ["program", "ming"]. Each token maps to an integer ID. Rule of thumb: 1 token ≈ 4 characters ≈ 0.75 words.

**2. Embeddings**
Each token ID maps to a dense vector (e.g., 768 or 4096 dimensions) that captures semantic meaning. Similar words have similar vectors.

**3. Positional Encoding**
Transformers process all tokens in parallel, so position info is injected by adding positional vectors to embeddings.

**4. Self-Attention**
The core mechanism. For each token, compute how much attention to pay to every other token:
Attention(Q, K, V) = softmax(QK^T / √d_k) × V
Q = query, K = key, V = value matrices learned during training.

**5. Multi-Head Attention**
Run attention multiple times in parallel with different learned projections, capturing different relationships (syntax, coreference, semantics).

**6. Feed-Forward Layer**
After attention, each position passes through a 2-layer MLP independently.

**Context Window:** Maximum tokens the model can process at once. GPT-4: 128K tokens. Exceeding this truncates older context.`,
        keyPoints: [
          'Tokenization: BPE splits text into subwords; 1 token ≈ 4 characters',
          'Self-attention lets every token attend to every other token simultaneously',
          'Attention formula: softmax(QK^T / √d_k) × V',
          'Multi-head attention captures multiple types of relationships in parallel',
          'Context window = max tokens; exceeding it drops earlier context',
          'Transformers process all positions in parallel (unlike sequential RNNs)',
        ],
        codeExample: {
          language: 'python',
          label: 'Tokenization in practice',
          code: `import tiktoken  # OpenAI's tokenizer

enc = tiktoken.encoding_for_model("gpt-4")

text = "Generative AI is transforming enterprise workflows."
tokens = enc.encode(text)
print(f"Token IDs: {tokens}")
print(f"Token count: {len(tokens)}")
print(f"Tokens: {[enc.decode([t]) for t in tokens]}")

# Estimate tokens before API call
def estimate_cost(text: str, price_per_1k: float = 0.01) -> float:
    n_tokens = len(enc.encode(text))
    return (n_tokens / 1000) * price_per_1k`,
        },
        interviewQs: [
          {
            q: 'Explain the attention mechanism in simple terms.',
            a: 'Attention allows each token to "look at" all other tokens to understand context. For the sentence "The bank can guarantee deposits", the word "bank" needs to attend to "deposits" to understand it means a financial institution, not a river bank. Mathematically: each token creates a Query (what I\'m looking for), and all tokens create Keys (what I offer) and Values (my content). The dot product of Q and K gives relevance scores; softmax normalizes them into weights; the weighted sum of Values is the output. Multi-head runs this multiple times to capture different relationship types.',
          },
          {
            q: 'What happens when input exceeds the context window?',
            a: 'The model can only process up to its context window limit. Common strategies: (1) truncation — drop oldest tokens, risking loss of important context; (2) chunking — split document into overlapping chunks, process separately; (3) summarization — summarize older context to compress; (4) RAG — don\'t put the full document in context, retrieve only relevant chunks. For long documents in your Q&A project, RAG was the right approach precisely because documents exceeded context limits.',
          },
        ],
      },
      {
        id: 'llm-training',
        title: 'Training Process: Pre-training, SFT & RLHF',
        content: `**Stage 1: Pre-training**
Train on hundreds of billions of tokens from the web, books, and code. Objective: predict next token. This gives the model language understanding and world knowledge but produces a "text completer", not an assistant.

**Stage 2: Supervised Fine-tuning (SFT)**
Fine-tune on curated instruction-following pairs: (prompt, ideal response). Teaches the model to follow instructions, answer questions helpfully, and adopt an assistant persona.

**Stage 3: RLHF (Reinforcement Learning from Human Feedback)**
1. Collect pairwise human preferences: given two responses, which is better?
2. Train a Reward Model (RM) to predict human preference scores
3. Use PPO (Proximal Policy Optimization) to update the LLM to maximize predicted reward
4. Result: model aligned with human values — helpful, harmless, honest

**Parameter-Efficient Fine-tuning (LoRA):**
Fine-tuning all 175B+ parameters is expensive. LoRA (Low-Rank Adaptation) inserts small trainable matrices alongside frozen original weights. Only 0.1–1% of parameters are trained, with 10–100× memory savings. Used when adapting a base model to a specific domain.

**Quantization:**
Reduce numerical precision: FP32 → FP16 → INT8 → INT4. Reduces memory and speeds up inference with minor accuracy loss. INT8 is common for production deployments.`,
        keyPoints: [
          'Pre-training: next-token prediction on massive data; gives world knowledge',
          'SFT: fine-tune on instruction-response pairs; makes model an assistant',
          'RLHF: human preferences → reward model → RL optimization for alignment',
          'LoRA: efficient fine-tuning via low-rank weight updates (0.1–1% params)',
          'Quantization: FP32 → INT8 reduces memory, speeds inference',
          'You don\'t train LLMs from scratch — you use APIs or fine-tune existing models',
        ],
        interviewQs: [
          {
            q: 'What is RLHF and why is it important?',
            a: 'RLHF aligns LLM behavior with human preferences. A pre-trained model is a text predictor, not a helpful assistant. Process: (1) generate multiple responses to prompts, (2) humans rank which responses are better, (3) train a reward model on these rankings, (4) use reinforcement learning (PPO) to update the LLM to maximize predicted reward. Result: ChatGPT-style assistant behavior. Without RLHF, models produce plausible but potentially harmful, biased, or unhelpful outputs.',
          },
        ],
      },
    ],
  },

  {
    id: 'prompt-engineering',
    number: 2,
    title: 'Prompt Engineering',
    description: 'Techniques to control LLM output — core TCS skill',
    icon: '✍️',
    color: '#3b82f6',
    tag: 'TCS Internship',
    sections: [
      {
        id: 'prompting-basics',
        title: 'Prompting Fundamentals',
        content: `Prompt engineering is the practice of designing inputs to LLMs to elicit desired outputs. Since you can't modify model weights via an API, the prompt is your primary lever for controlling behavior.

**Anatomy of a Prompt:**
- **System prompt:** Sets persona, rules, and context (e.g., "You are a helpful customer service agent for Acme Corp. Never discuss competitors.")
- **Few-shot examples:** Demonstrations of desired input-output format
- **User message:** The actual query
- **Context:** Retrieved documents, conversation history

**Zero-shot Prompting:**
Ask the model directly without examples. Works for common tasks the model already understands well.
"Summarize the following email in 3 bullet points: [email]"

**Few-shot Prompting:**
Provide 2–5 examples of the desired behavior. Essential when the task has specific formatting, domain jargon, or non-obvious expectations.

**Key Parameters:**
- **Temperature (0–2):** Controls randomness. 0 = deterministic (same input → same output). 1 = balanced. 2 = very creative/random. Use low temps for factual tasks, higher for creative.
- **Top-p (nucleus sampling):** Sample from the smallest set of tokens whose probabilities sum to p. Top-p=0.9 means only consider tokens comprising 90% of probability mass.
- **Max tokens:** Limit response length to control cost and latency.`,
        keyPoints: [
          'System prompt sets persona and rules; user message is the query',
          'Zero-shot: no examples; few-shot: 2–5 demonstrations in the prompt',
          'Temperature 0 = deterministic; higher = more creative/random',
          'Top-p controls vocabulary diversity during sampling',
          'Prompts are the API user\'s only lever — no access to model weights',
          'At TCS, you tuned prompts to improve output relevance and consistency',
        ],
        codeExample: {
          language: 'python',
          label: 'System + few-shot prompt pattern',
          code: `import openai

client = openai.OpenAI(api_key="your-key")

response = client.chat.completions.create(
    model="gpt-4",
    temperature=0.2,  # low temp for consistent outputs
    messages=[
        {
            "role": "system",
            "content": (
                "You are a product categorization assistant. "
                "Classify products into exactly one category. "
                "Output only the category name, nothing else."
            )
        },
        # Few-shot examples
        {"role": "user", "content": "Blue cotton t-shirt size M"},
        {"role": "assistant", "content": "Clothing"},
        {"role": "user", "content": "Wireless noise-cancelling headphones"},
        {"role": "assistant", "content": "Electronics"},
        # Actual query
        {"role": "user", "content": "Leather sofa with wooden legs"},
    ]
)
print(response.choices[0].message.content)  # "Furniture"`,
        },
        interviewQs: [
          {
            q: 'How did you use prompt engineering at TCS to improve output accuracy?',
            a: 'Key techniques: (1) Clear, specific instructions in system prompts — vague prompts produce vague results, (2) few-shot examples to demonstrate exact output format, (3) constraining output format ("respond in JSON with keys X, Y, Z"), (4) chain-of-thought for complex reasoning tasks, (5) temperature tuning — low for factual tasks, (6) iterative testing with a set of representative inputs. We tracked improvement using metrics like relevance score and format compliance rate.',
          },
          {
            q: 'What is the difference between temperature and top-p?',
            a: 'Both control output randomness but via different mechanisms. Temperature scales the logits (raw scores) before softmax — low temp makes the distribution sharp/peaky (likely tokens dominate), high temp flattens it. Top-p (nucleus sampling) sets a probability mass cutoff — only the smallest set of tokens summing to probability p are sampled from. In practice: use temperature for overall creativity level; top-p for vocabulary diversity. OpenAI recommends changing one or the other, not both simultaneously.',
          },
        ],
      },
      {
        id: 'advanced-prompting',
        title: 'Chain-of-Thought & Advanced Techniques',
        content: `**Chain-of-Thought (CoT) Prompting:**
Instead of asking for a direct answer, instruct the model to reason step-by-step. Dramatically improves performance on math, logic, and multi-step reasoning.

Regular: "Is 9371 prime?" → might get wrong answer.
CoT: "Is 9371 prime? Think step by step." → model works through divisibility checks, reaches correct answer.

**Self-Consistency:**
Sample multiple CoT reasoning paths, take the majority answer. More reliable than single-pass CoT.

**Role Prompting:**
"You are an expert Python developer reviewing code for security vulnerabilities." The persona primes the model to produce domain-expert-level outputs.

**Output Formatting:**
Force structured output by specifying exact format:
"Respond in JSON: { 'sentiment': 'positive|negative|neutral', 'confidence': 0.0-1.0, 'reason': '...' }"
This enables reliable downstream parsing.

**Prompt Injection (Security Risk):**
Malicious users may embed instructions in input to override your system prompt. Defense: input sanitization, clear delimiters, and model-level defenses.

**ReAct Pattern:**
Reason + Act. Model interleaves reasoning ("I need to look up the weather") with actions (calling a weather tool). Foundation of LangChain agents.`,
        keyPoints: [
          'Chain-of-thought: ask model to reason step-by-step before answering',
          'Self-consistency: sample multiple CoT paths, majority vote',
          'Role prompting: establish expert persona for better domain responses',
          'Structured output: specify JSON format for reliable parsing',
          'Prompt injection: security risk where user input overrides system prompt',
          'ReAct = Reason + Act; basis for LangChain agent behavior',
        ],
        codeExample: {
          language: 'python',
          label: 'Chain-of-thought + structured output',
          code: `# Chain-of-thought with structured JSON output
prompt = """
You are a sentiment analysis expert.
Analyze the customer review step by step, then output JSON.

Review: "The product arrived late but the quality exceeded my expectations.
Would buy again despite the shipping issue."

Step 1: Identify positive signals
Step 2: Identify negative signals
Step 3: Weigh overall sentiment
Step 4: Output JSON in this exact format:
{"sentiment": "positive|negative|neutral|mixed",
 "confidence": <0.0-1.0>,
 "key_points": ["...", "..."],
 "recommendation": "buy|avoid|consider"}
"""

response = client.chat.completions.create(
    model="gpt-4",
    temperature=0,  # deterministic for structured tasks
    messages=[{"role": "user", "content": prompt}]
)`,
        },
        interviewQs: [
          {
            q: 'When would you use chain-of-thought prompting?',
            a: 'CoT is valuable when the task requires multi-step reasoning: math problems, logical deduction, code debugging, complex classification with nuanced criteria. It works because forcing intermediate reasoning steps reduces the probability of "shortcut" wrong answers. Empirically, CoT dramatically improves LLM performance on benchmarks like GSM8K (grade school math). Downside: increases token usage and latency. For simple factual queries, direct prompting is faster and cheaper.',
          },
        ],
      },
    ],
  },

  {
    id: 'langchain-agents',
    number: 3,
    title: 'LangChain & Agents (MRKL)',
    description: 'The framework behind your two main projects',
    icon: '⛓️',
    color: '#10b981',
    tag: 'Projects',
    sections: [
      {
        id: 'langchain-basics',
        title: 'LangChain Core Concepts',
        content: `LangChain is an open-source framework for building LLM-powered applications. It provides abstractions that make it easier to chain LLM calls, integrate tools, manage memory, and build agents.

**Core Abstractions:**

**LLMs / Chat Models**
Wrappers around model APIs (OpenAI, Anthropic, etc.) that standardize the interface. You swap models without changing application logic.

**Prompts / PromptTemplates**
Parameterized prompt templates with variable substitution:
"Summarize this {document_type}: {content}" — fill in at runtime.

**Chains**
The core composable unit. A chain takes inputs, processes them (often via an LLM call), and returns outputs. Chains can be composed: output of one becomes input of the next.

**LLMChain:** PromptTemplate + LLM = basic chain
**Sequential Chain:** Chain A → Chain B → Chain C
**Router Chain:** Route input to different chains based on content

**Memory**
Stores conversation history so the LLM can reference previous turns:
- ConversationBufferMemory: stores all messages (grows unbounded)
- ConversationSummaryMemory: summarizes history to compress tokens
- VectorStoreRetrieverMemory: retrieve relevant past messages via embeddings

**Document Loaders & Text Splitters**
Load docs from PDFs, URLs, databases, etc. Split into chunks for embedding.`,
        keyPoints: [
          'LangChain abstracts LLM API calls, prompts, memory, tools, and agents',
          'PromptTemplate: parameterized prompts filled at runtime',
          'LLMChain = PromptTemplate + LLM; composable into Sequential/Router chains',
          'Memory stores conversation history; SummaryMemory compresses old context',
          'Document loaders read PDFs, URLs, databases; text splitters chunk them',
          'Standardized interface allows swapping LLM backends without code changes',
        ],
        codeExample: {
          language: 'python',
          label: 'Basic LangChain chain',
          code: `from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.memory import ConversationSummaryMemory

llm = OpenAI(temperature=0.7)

# Parameterized prompt
template = PromptTemplate(
    input_variables=["product", "tone"],
    template="Write a {tone} product description for: {product}"
)

chain = LLMChain(llm=llm, prompt=template)
result = chain.run(product="wireless earbuds", tone="professional")

# Chain with memory
memory = ConversationSummaryMemory(llm=llm)
# Memory auto-summarizes old messages to stay within context limits`,
        },
        interviewQs: [
          {
            q: 'Why use LangChain instead of calling the OpenAI API directly?',
            a: 'For simple single-call apps, direct API calls are fine. LangChain adds value when: (1) you need multi-step pipelines (chain outputs), (2) you want to swap LLM providers without rewriting code, (3) you need agents that use tools autonomously, (4) you need document processing pipelines (load → chunk → embed → retrieve), (5) you need conversation memory management. LangChain handles the boilerplate — you focus on application logic. Trade-off: adds complexity and a dependency; for production, some teams prefer lower-level control.',
          },
        ],
      },
      {
        id: 'agents-mrkl',
        title: 'Agents & the MRKL Framework',
        content: `**What is an Agent?**
An agent uses an LLM as a reasoning engine to decide which actions to take. Given a goal and a set of tools, the agent iteratively: reasons about what to do → calls a tool → observes the result → reasons again → until it reaches a final answer.

**MRKL (Modular Reasoning, Knowledge and Language):**
Pronounced "miracle". Framework from AI21 Labs that combines an LLM router with discrete expert modules (tools). The LLM decides which expert to call; experts handle specialized tasks (calculators, search, databases). This is exactly what you used in your product recommendations project — the LLM routes between fashion trend data, user history lookup, and recommendation logic.

**ReAct Agent (Reason + Act):**
Most common LangChain agent type. The LLM interleaves reasoning traces and actions:
- Thought: "I need to find the user's purchase history"
- Action: search_database[user_id=123]
- Observation: ["sneakers", "hoodies", "caps"]
- Thought: "User likes streetwear. I'll query fashion trends for this style."
- Action: fashion_trends_tool["streetwear 2024"]
- Final Answer: "Based on your history, I recommend..."

**Tools:**
Tools are functions the agent can call. Define them with name, description (the LLM reads this to decide when to use it), and implementation. Examples: web search, calculator, database query, API call.`,
        keyPoints: [
          'Agent = LLM reasoning engine + tools + iterative action loop',
          'MRKL: LLM routes to specialized expert modules (tools) based on task',
          'ReAct: interleaves Thought → Action → Observation cycles until answer',
          'Tool description is critical — LLM reads it to decide when to invoke the tool',
          'Agents are non-deterministic — the reasoning path may vary each run',
          'Your recommendations project used MRKL: LLM routed between fashion data, user history, and recommendation tools',
        ],
        codeExample: {
          language: 'python',
          label: 'MRKL-style agent with custom tools',
          code: `from langchain.agents import initialize_agent, Tool, AgentType
from langchain.llms import OpenAI

# Define expert tools (MRKL modules)
def get_user_history(user_id: str) -> str:
    """Retrieves past purchases for a user"""
    # DB query in real implementation
    return "past purchases: sneakers, hoodies, caps"

def get_fashion_trends(style: str) -> str:
    """Gets current fashion trends for a given style"""
    return f"trending in {style}: oversized fits, earth tones, cargo pants"

def get_product_catalog(query: str) -> str:
    """Searches product catalog by description"""
    return "matching products: Cargo Pants $59, Oversized Hoodie $79"

tools = [
    Tool(name="UserHistory", func=get_user_history,
         description="Get a user's purchase history. Input: user_id"),
    Tool(name="FashionTrends", func=get_fashion_trends,
         description="Get current trends for a clothing style. Input: style name"),
    Tool(name="ProductSearch", func=get_product_catalog,
         description="Search products by description. Input: search query"),
]

agent = initialize_agent(
    tools=tools,
    llm=OpenAI(temperature=0),
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True  # shows Thought/Action/Observation loop
)

result = agent.run("Recommend products for user 123 based on their taste")`,
        },
        interviewQs: [
          {
            q: 'Explain the MRKL system and how you applied it.',
            a: 'MRKL stands for Modular Reasoning, Knowledge and Language. The idea is to combine an LLM\'s language reasoning ability with discrete expert modules that are better at specific tasks (math, database lookup, search). The LLM acts as a router/planner: given a goal, it decides which module to call and how to interpret results. In the fashion recommendation project: the LLM received a user\'s natural language request, reasoned about what information was needed, called tools to get user purchase history and fashion trends, synthesized the results into a personalized recommendation. This is more robust than a single LLM call because each component does what it\'s best at.',
          },
          {
            q: 'What are the failure modes of LangChain agents?',
            a: 'Key failure modes: (1) Infinite loops — agent keeps calling tools without reaching a final answer; solved with max_iterations limit. (2) Tool misuse — agent calls wrong tool or passes malformed input due to unclear tool descriptions. (3) Context overflow — long reasoning chains exhaust context window. (4) Hallucinated tool calls — agent invents tool outputs instead of calling them. (5) Non-determinism — same query yields different reasoning paths; hard to debug. Mitigation: clear tool descriptions, output parsing validation, explicit stopping criteria, verbose logging for debugging.',
          },
        ],
      },
    ],
  },

  {
    id: 'rag',
    number: 4,
    title: 'RAG — Retrieval Augmented Generation',
    description: 'Architecture behind your Document Q&A project',
    icon: '🔍',
    color: '#f59e0b',
    tag: 'Projects',
    sections: [
      {
        id: 'rag-why',
        title: 'Why RAG Exists',
        content: `LLMs have two fundamental limitations that RAG solves:

**1. Knowledge Cutoff**
LLMs are trained on data up to a cutoff date. They don't know about recent events, your company's private documents, or proprietary data. RAG lets you inject current, private knowledge at query time.

**2. Context Window Limits**
You can't put an entire document corpus (hundreds of PDFs) into one prompt — it's too large and too expensive. RAG retrieves only the most relevant chunks, keeping the prompt small.

**RAG Pipeline:**
1. **Indexing (offline):** Load documents → split into chunks → generate embeddings for each chunk → store embeddings + text in a vector database.
2. **Querying (online):** Receive user question → generate embedding for the question → find most similar chunks via vector search → inject top-K chunks into LLM prompt → generate answer grounded in retrieved context.

**Key Insight:**
RAG reduces hallucinations because the LLM is explicitly given the source material. Instead of relying on memorized parameters, it synthesizes the answer from retrieved facts. You can also cite sources by including the chunk's document reference.

This is exactly what your "Intelligent Document Q&A" project implements — users query large document collections, RAG retrieves relevant passages, the LLM generates answers grounded in those passages.`,
        keyPoints: [
          'RAG solves: knowledge cutoff + context window limits of LLMs',
          'Two phases: offline indexing (embed + store) and online retrieval (search + generate)',
          'Reduces hallucinations by grounding answers in retrieved source documents',
          'Enable citations by tracking which chunks were retrieved',
          'Chunking strategy matters — too small loses context, too large reduces precision',
          'Top-K retrieval: typically retrieve 3–10 most similar chunks',
        ],
        interviewQs: [
          {
            q: 'Explain RAG architecture end to end.',
            a: 'RAG has two phases. Indexing: (1) load documents (PDFs, URLs, databases), (2) split into overlapping chunks (e.g., 500 tokens, 50-token overlap), (3) generate embeddings for each chunk via embedding model (e.g., text-embedding-ada-002), (4) store chunk text + embeddings in a vector database (Chroma, Pinecone, FAISS). Querying: (1) user submits question, (2) generate embedding for the question using the same model, (3) vector search finds top-K most similar chunks by cosine similarity, (4) inject retrieved chunks into LLM prompt as context, (5) LLM generates answer grounded in context. Optional: re-ranking, HyDE (hypothetical document embeddings), query expansion.',
          },
          {
            q: 'How did you reduce hallucinations in your Document Q&A system?',
            a: 'Key strategies: (1) RAG itself — grounding answers in retrieved documents rather than model memory, (2) instructing the model to answer "based only on the provided context, do not use prior knowledge", (3) including "I don\'t know" as a valid answer when context is insufficient, (4) chunk overlap — ensures context isn\'t lost at boundaries, (5) evaluation — tested with question sets where ground truth was known, measured answer grounding using metrics like faithfulness score, (6) displaying source citations so users can verify.',
          },
        ],
      },
      {
        id: 'embeddings',
        title: 'Embeddings & Vector Search',
        content: `**What are Embeddings?**
Embeddings are dense vector representations of text that capture semantic meaning. Similar meanings → similar vectors (close in high-dimensional space). "King" − "Man" + "Woman" ≈ "Queen" is the classic example.

**How They're Generated:**
Embedding models (like OpenAI's text-embedding-ada-002 or open-source BAAI/bge-large) process text and output a fixed-size vector (e.g., 1536 dimensions for ada-002). The same model must be used for both indexing and querying.

**Similarity Metrics:**
- **Cosine similarity:** Angle between vectors. Range −1 to 1. Most common for text. Score of 1 = identical direction (semantically similar).
- **Euclidean distance:** Straight-line distance. Lower = more similar.
- **Dot product:** Cosine × magnitude. Used when magnitude carries meaning.

**Vector Search (Approximate Nearest Neighbor):**
Comparing a query vector to millions of stored vectors naively is O(n). ANN algorithms (HNSW, IVF, LSH) make this sublinear by building index structures. This is what vector databases like Pinecone, Chroma, FAISS implement.

**Chunking Strategy:**
- Chunk size: 256–1024 tokens is typical. Small = precise retrieval, less context. Large = more context per chunk, less precise.
- Overlap: 10–20% overlap prevents context loss at boundaries.
- Semantic chunking: split on paragraph/section boundaries rather than fixed token count.`,
        keyPoints: [
          'Embeddings: dense vectors where similar meanings have similar vectors',
          'Must use same embedding model for indexing and querying',
          'Cosine similarity: angle between vectors; most common for text (range −1 to 1)',
          'ANN algorithms (HNSW, IVF) make vector search fast at scale',
          'Chunk size trade-off: small = precise, large = more context per result',
          'text-embedding-ada-002: 1536 dimensions, common OpenAI embedding model',
        ],
        codeExample: {
          language: 'python',
          label: 'Full RAG pipeline with LangChain + Chroma',
          code: `from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain.chat_models import ChatOpenAI

# --- INDEXING PHASE (run once) ---
loader = PyPDFLoader("documents/report.pdf")
documents = loader.load()

splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50,
    separators=["\n\n", "\n", ".", " "]
)
chunks = splitter.split_documents(documents)

embeddings = OpenAIEmbeddings(model="text-embedding-ada-002")
vectorstore = Chroma.from_documents(
    documents=chunks,
    embedding=embeddings,
    persist_directory="./chroma_db"
)

# --- QUERYING PHASE ---
retriever = vectorstore.as_retriever(search_kwargs={"k": 5})

qa_chain = RetrievalQA.from_chain_type(
    llm=ChatOpenAI(model="gpt-4", temperature=0),
    chain_type="stuff",  # stuff = concatenate all chunks into prompt
    retriever=retriever,
    return_source_documents=True
)

result = qa_chain({"query": "What were the Q3 revenue figures?"})
print(result["result"])
print("Sources:", [d.metadata for d in result["source_documents"]])`,
        },
        interviewQs: [
          {
            q: 'What chunking strategy did you use and why?',
            a: 'Used RecursiveCharacterTextSplitter with 500-token chunks and 50-token overlap. Reasoning: (1) 500 tokens provides enough context for the LLM to generate a coherent answer from a single chunk, (2) overlap ensures that sentences straddling chunk boundaries aren\'t split across retrievals, (3) recursive splitting respects natural boundaries — tries "\n\n" (paragraphs) first, then "\n", then sentences. Alternative strategies: fixed-size (simpler but ignores structure), semantic chunking (more accurate but complex). For structured documents (reports, manuals), hierarchical chunking that preserves section context is superior.',
          },
        ],
      },
    ],
  },

  {
    id: 'vector-databases',
    number: 5,
    title: 'Vector Databases',
    description: 'Storage layer for embeddings in RAG systems',
    icon: '🗄️',
    color: '#ec4899',
    tag: 'Projects',
    sections: [
      {
        id: 'vectordb-overview',
        title: 'Vector Database Overview',
        content: `A vector database is purpose-built for storing and searching high-dimensional vectors efficiently. Unlike SQL databases that query by value equality, vector DBs query by similarity — "find the 10 vectors most similar to this query vector."

**Why Not Just Use PostgreSQL?**
Traditional databases can store vectors (pgvector extension) but aren't optimized for ANN search at scale. Vector databases implement specialized index structures (HNSW, IVF) that provide fast approximate nearest neighbor search with O(log n) or sublinear complexity.

**Popular Vector Databases:**

**FAISS (Facebook AI Similarity Search):**
- In-memory, open-source C++ library with Python bindings
- Not a server — runs in-process with your application
- Best for: prototyping, small-to-medium datasets, no network overhead
- Used in your LangChain projects for local development

**Chroma:**
- Open-source, embeddable (in-process) or server mode
- Tight LangChain integration
- Best for: prototyping, local development, smaller deployments

**Pinecone:**
- Fully managed cloud vector database (SaaS)
- Handles infrastructure, scaling, backups automatically
- Best for: production deployments, large datasets, teams without ML infra

**Weaviate:**
- Open-source, can be self-hosted or cloud
- Supports GraphQL and hybrid search (keyword + semantic)

**Key Operations:**
- upsert: insert or update vectors
- query: find top-K similar vectors
- delete: remove by ID
- fetch: retrieve by ID`,
        keyPoints: [
          'Vector DBs query by similarity, not equality — optimized for ANN search',
          'FAISS: in-process library, great for local dev and prototyping',
          'Chroma: embeddable DB with LangChain integration',
          'Pinecone: managed cloud, best for production scale',
          'ANN (Approximate Nearest Neighbor) trades tiny accuracy loss for huge speed gain',
          'HNSW (Hierarchical Navigable Small World) is the most common ANN index',
        ],
        interviewQs: [
          {
            q: 'Compare FAISS, Chroma, and Pinecone. When would you use each?',
            a: 'FAISS: in-memory C++ library, fastest locally, no persistence by default, ideal for prototyping or research where you control the environment. Chroma: embeddable Python DB that persists to disk, excellent LangChain integration, good for local dev and small-scale production. Pinecone: fully managed SaaS, handles replication, scaling, and infrastructure; best for production with large datasets or teams without ML infra. Practical path: prototype with FAISS/Chroma → production with Pinecone or self-hosted Weaviate.',
          },
          {
            q: 'What is HNSW and why is it used?',
            a: 'HNSW (Hierarchical Navigable Small World) is a graph-based ANN algorithm. It builds a multi-layer graph where higher layers are sparse (for fast global navigation) and lower layers are dense (for precise local search). At query time, search starts at the top layer and greedily navigates toward the query vector, descending to finer layers. Complexity: O(log n) for search. Trade-offs: high recall (typically 95-99%+ of exact nearest neighbors), fast search, but high memory usage and slow index build time vs. flat indexes. Used by default in Chroma, Pinecone, and Weaviate.',
          },
        ],
      },
    ],
  },

  {
    id: 'python-ai',
    number: 6,
    title: 'Python for AI Development',
    description: 'Your primary language — know it cold',
    icon: '🐍',
    color: '#06b6d4',
    tag: 'Technical Skills',
    sections: [
      {
        id: 'python-essentials',
        title: 'Python Essentials for AI Engineers',
        content: `Python is the lingua franca of AI. In interviews, you'll be tested on both language fundamentals and AI-specific usage patterns.

**Key Concepts:**

**List/Dict Comprehensions:**
\`\`\`[x*2 for x in range(10) if x % 2 == 0]\`\`\`
These are idiomatic Python — know them cold.

**Generators:**
Memory-efficient iteration. yield produces values lazily. Critical for processing large datasets that don't fit in memory.

**Decorators:**
Functions that modify other functions. Common in AI code: @retry, @cache, @timer. The LangChain framework uses decorators extensively.

**Type Hints (Python 3.5+):**
def embed(text: str) -> list[float]: ...
Not enforced at runtime but critical for IDE support and code clarity. Use in all professional code.

**Context Managers:**
with statement ensures cleanup. \`with open(file) as f:\` guarantees file closure. Can implement custom ones with __enter__/__exit__.

**Async/Await:**
LLM API calls are I/O bound — async enables concurrent requests without threads. asyncio.gather() runs multiple API calls concurrently, drastically reducing latency for batch operations.

**Key AI Libraries:**
- **requests/httpx:** HTTP calls to REST APIs
- **pydantic:** Data validation and settings management; used heavily in LangChain
- **tenacity:** Retry logic with exponential backoff for flaky API calls
- **dotenv:** Load API keys from .env files`,
        keyPoints: [
          'Comprehensions, generators, decorators, type hints — know these fluently',
          'async/await: concurrent API calls without threads; essential for LLM batch processing',
          'pydantic: data validation and typed models; core dependency of LangChain',
          'tenacity: retry with exponential backoff for API rate limits',
          'dotenv: never hardcode API keys; load from environment variables',
          'generators: process large document sets lazily without loading all into memory',
        ],
        codeExample: {
          language: 'python',
          label: 'Async batch LLM calls with retry',
          code: `import asyncio
import openai
from tenacity import retry, stop_after_attempt, wait_exponential
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()  # loads OPENAI_API_KEY from .env

client = openai.AsyncOpenAI()

class EmbeddingResult(BaseModel):
    text: str
    embedding: list[float]
    token_count: int

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=4, max=60)
)
async def embed_text(text: str) -> EmbeddingResult:
    response = await client.embeddings.create(
        model="text-embedding-ada-002",
        input=text
    )
    return EmbeddingResult(
        text=text,
        embedding=response.data[0].embedding,
        token_count=response.usage.total_tokens
    )

async def batch_embed(texts: list[str]) -> list[EmbeddingResult]:
    # Concurrent API calls — much faster than sequential
    tasks = [embed_text(t) for t in texts]
    return await asyncio.gather(*tasks)

# Process large document set with generator
def chunk_generator(documents: list[str], chunk_size: int = 100):
    for i in range(0, len(documents), chunk_size):
        yield documents[i:i + chunk_size]`,
        },
        interviewQs: [
          {
            q: 'How do you handle API rate limits when making many LLM calls?',
            a: 'Three strategies: (1) Retry with exponential backoff — catch RateLimitError, wait 2^n seconds before retrying (tenacity library handles this cleanly), (2) Request batching — OpenAI embeddings API accepts arrays of texts in one call, reducing the number of API calls, (3) Async concurrency — use asyncio.gather() to run requests concurrently up to the rate limit. For production: track token usage per minute, implement a token bucket or sliding window rate limiter. Also: cache embeddings — if the same text is processed multiple times, cache the result in Redis or a local dict.',
          },
        ],
      },
    ],
  },

  {
    id: 'react',
    number: 7,
    title: 'React.js & Frontend',
    description: 'Frontend layer of your recommendation project',
    icon: '⚛️',
    color: '#0ea5e9',
    tag: 'Technical Skills',
    sections: [
      {
        id: 'react-fundamentals',
        title: 'React Fundamentals',
        content: `React is a JavaScript library for building UIs through composable components. Your recommendation project used React as the frontend layer where users interact with the LLM-powered recommendation engine.

**Components:**
Everything in React is a component — a function that takes props and returns JSX (HTML-like syntax). Components are composable: build complex UIs from small, reusable pieces.

**JSX:**
Syntactic sugar that compiles to React.createElement() calls. Write HTML-like syntax in JavaScript/TypeScript files. Expressions go in {curly braces}.

**Props:**
Read-only data passed from parent to child. Never modify props directly.

**State (useState):**
Mutable data local to a component. When state changes, React re-renders the component and its children. Rule: never mutate state directly — always call the setter function.

**Effects (useEffect):**
Run side effects (API calls, subscriptions, DOM manipulation) after render. The dependency array controls when the effect re-runs.

**Key Rules:**
1. Don't mutate state directly
2. Hooks can only be called at the top level (not inside loops/conditions)
3. Each list item needs a unique key prop
4. Derived data should be computed from state, not stored in separate state

**React's Rendering Model:**
Virtual DOM — React maintains an in-memory representation of the DOM. On state change, it computes the minimal diff and applies only those changes to the real DOM. This makes UI updates efficient.`,
        keyPoints: [
          'Component: function that takes props and returns JSX',
          'useState: local mutable state; setter triggers re-render',
          'useEffect: side effects after render; dependency array controls when it runs',
          'Props flow down; events (callbacks) flow up',
          'Virtual DOM: React diffs and applies minimal DOM updates',
          'Key rule: never mutate state directly — always use the setter',
        ],
        codeExample: {
          language: 'tsx',
          label: 'React component with API call pattern',
          code: `import { useState, useEffect, useCallback } from 'react';

interface Recommendation {
  id: string;
  name: string;
  reason: string;
  price: number;
}

interface Props {
  userId: string;
}

export function RecommendationPanel({ userId }: Props) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');

  const fetchRecommendations = useCallback(async (q: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, query: q }),
      });
      const data = await res.json();
      setRecommendations(data.recommendations);
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Fetch on mount
  useEffect(() => {
    fetchRecommendations('');
  }, [fetchRecommendations]);

  return (
    <div className="panel">
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="What are you looking for?"
        onKeyDown={e => e.key === 'Enter' && fetchRecommendations(query)}
      />
      {loading ? <Spinner /> : (
        <ul>
          {recommendations.map(rec => (
            <li key={rec.id}>
              <strong>{rec.name}</strong> — {rec.reason}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}`,
        },
        interviewQs: [
          {
            q: 'What is the difference between useState and useEffect?',
            a: 'useState manages local component state — data that can change over time and triggers re-renders when updated. useEffect handles side effects that happen after a render — API calls, subscriptions, DOM manipulation, timers. The dependency array in useEffect tells React when to re-run: [] = once on mount, [dep] = re-run when dep changes, no array = after every render. Common mistake: triggering an API call in useEffect with no dependency array causes it to run on every render — always specify deps. For data fetching, useCallback to memoize the fetch function and include it in useEffect deps.',
          },
          {
            q: 'How did React integrate with your LangChain backend?',
            a: 'React frontend made HTTP POST requests to a backend API (FastAPI or Express). The API endpoint received the user\'s natural language query and userId, passed them to the LangChain agent, and returned recommendations as JSON. React used useState to manage loading/error/data states and rendered results. For streaming LLM responses, the backend used Server-Sent Events or WebSockets; React consumed the stream and updated state incrementally to show typing effect. The frontend was kept thin — just user input, display, and state management. All AI logic lived in the backend.',
          },
        ],
      },
    ],
  },

  {
    id: 'cybersecurity',
    number: 8,
    title: 'Cybersecurity & Cryptography',
    description: 'Core concepts from your Edunet internship',
    icon: '🔐',
    color: '#ef4444',
    tag: 'Edunet Internship',
    sections: [
      {
        id: 'security-basics',
        title: 'Cybersecurity Fundamentals',
        content: `**CIA Triad — Foundation of All Security:**
- **Confidentiality:** Only authorized parties can access data (encryption, access control)
- **Integrity:** Data hasn't been modified without authorization (hashing, digital signatures)
- **Availability:** Systems are accessible when needed (redundancy, DDoS mitigation)

**Common Attack Types:**
- **Phishing:** Social engineering to steal credentials via fake emails/sites
- **SQL Injection:** Inserting malicious SQL into inputs that aren't properly sanitized: ' OR '1'='1
- **XSS (Cross-Site Scripting):** Injecting malicious JavaScript into web pages viewed by other users
- **MITM (Man-in-the-Middle):** Attacker intercepts communication between two parties
- **DoS/DDoS:** Overwhelming a service with requests to make it unavailable
- **Brute Force / Credential Stuffing:** Trying many passwords or reusing leaked credentials

**Authentication vs Authorization:**
- Authentication: proving identity (who you are) — username/password, MFA, OAuth
- Authorization: determining permissions (what you can do) — RBAC, ACL

**OWASP Top 10:**
Industry-standard list of most critical web security risks. Key ones: Broken Access Control, Cryptographic Failures, Injection, Insecure Design, Security Misconfiguration. Every developer should know this list.

**Data Privacy:**
GDPR (EU): requires explicit consent for data collection, right to erasure, breach notification within 72 hours. PII (Personally Identifiable Information) requires extra protection: names, emails, IP addresses, biometrics.`,
        keyPoints: [
          'CIA Triad: Confidentiality, Integrity, Availability — all security decisions map to these',
          'SQL injection: sanitize ALL user inputs; use parameterized queries, never string concat',
          'Authentication = who you are; Authorization = what you can do',
          'MFA (Multi-Factor Authentication) drastically reduces account compromise risk',
          'OWASP Top 10: know this list — Broken Access Control is #1 since 2021',
          'GDPR: data minimization, explicit consent, right to erasure, 72hr breach notification',
        ],
        interviewQs: [
          {
            q: 'Explain the CIA Triad with examples.',
            a: 'CIA Triad is the core model for evaluating security: Confidentiality — preventing unauthorized data access. Example: encrypting a database so that even if it\'s stolen, data is unreadable. Integrity — ensuring data hasn\'t been tampered with. Example: hashing a file before transmission and verifying the hash after; digital signatures on code to prevent supply chain attacks. Availability — ensuring systems function when needed. Example: load balancers, backups, and CDNs ensure the service remains up even if one server fails. A ransomware attack violates all three: encrypts data (confidentiality loss for owner), corrupts/locks it (integrity), and makes it inaccessible (availability).',
          },
          {
            q: 'What cryptography concepts did you learn at Edunet?',
            a: 'Key concepts: (1) Symmetric encryption (AES): same key for encrypt and decrypt; fast, used for bulk data. Key distribution is the challenge. (2) Asymmetric encryption (RSA): public key encrypts, private key decrypts; used for key exchange and digital signatures. (3) Hashing (SHA-256, bcrypt): one-way function; same input always produces same output; used for password storage (never store plaintext passwords). (4) TLS/SSL: combines asymmetric key exchange with symmetric encryption for secure HTTPS. (5) Digital signatures: hash the message, encrypt hash with private key; anyone can verify with public key.',
          },
        ],
      },
    ],
  },

  {
    id: 'data-analytics',
    number: 9,
    title: 'Data Analytics',
    description: 'End-to-end analytics pipeline from Edunet',
    icon: '📊',
    color: '#22c55e',
    tag: 'Edunet Internship',
    sections: [
      {
        id: 'data-pipeline',
        title: 'Data Pipeline & Analysis',
        content: `**Data Pipeline Stages:**
1. **Ingestion:** Collect raw data from sources (CSVs, databases, APIs, streams)
2. **Cleaning:** Handle missing values, duplicates, outliers, inconsistent formats
3. **Transformation:** Feature engineering, normalization, encoding, aggregations
4. **Analysis/EDA:** Explore distributions, correlations, patterns
5. **Visualization:** Dashboards and charts that communicate findings
6. **Reporting:** Actionable insights for stakeholders

**Data Cleaning (Pandas):**
- Missing values: df.isnull().sum() to audit; df.fillna() or df.dropna() to handle
- Duplicates: df.duplicated(), df.drop_duplicates()
- Outliers: IQR method (filter values outside 1.5×IQR from quartiles) or Z-score
- Type casting: df['col'].astype(int), pd.to_datetime()

**Exploratory Data Analysis:**
- Shape: df.shape, df.describe(), df.info()
- Distributions: histograms, box plots
- Correlations: df.corr(), heatmaps
- Categorical counts: df['col'].value_counts()

**Visualization Tools:**
- Matplotlib/Seaborn: Python charting
- Plotly: Interactive charts for dashboards
- Tableau / Power BI: Business intelligence dashboards (drag-and-drop)
- Grafana: Real-time metrics dashboards

**Key Insight for Interviews:**
At Edunet, you built an end-to-end analytics capstone: raw CSV → cleaned data → EDA → dashboard. Be ready to describe the data source, what cleaning was needed, what insights you found, and how you communicated them.`,
        keyPoints: [
          'Pipeline: ingest → clean → transform → analyze → visualize → report',
          'Pandas is the core library: DataFrames for tabular data manipulation',
          'Missing values: audit with isnull().sum(), handle with fillna/dropna based on context',
          'Outlier detection: IQR method or Z-score; always investigate before removing',
          'EDA goal: understand distributions, find correlations, identify data quality issues',
          'Dashboard = communication tool; focus on insights relevant to the stakeholder',
        ],
        codeExample: {
          language: 'python',
          label: 'Pandas data cleaning pipeline',
          code: `import pandas as pd
import numpy as np

df = pd.read_csv("customer_data.csv")

# Audit
print(df.shape)           # (rows, cols)
print(df.info())          # dtypes and null counts
print(df.describe())      # statistical summary
print(df.isnull().sum())  # missing per column

# Clean missing values
df['age'].fillna(df['age'].median(), inplace=True)  # impute with median
df.dropna(subset=['email'], inplace=True)           # drop rows where email is null

# Remove duplicates
df.drop_duplicates(subset=['email'], keep='first', inplace=True)

# Fix types
df['signup_date'] = pd.to_datetime(df['signup_date'])
df['age'] = df['age'].astype(int)

# Remove outliers (IQR method)
Q1 = df['purchase_amount'].quantile(0.25)
Q3 = df['purchase_amount'].quantile(0.75)
IQR = Q3 - Q1
df = df[df['purchase_amount'].between(Q1 - 1.5*IQR, Q3 + 1.5*IQR)]

# Feature engineering
df['days_since_signup'] = (pd.Timestamp.now() - df['signup_date']).dt.days
df['high_value'] = df['purchase_amount'] > df['purchase_amount'].quantile(0.75)

print(f"Clean dataset: {df.shape}")`,
        },
        interviewQs: [
          {
            q: 'Walk me through your data analytics capstone at Edunet.',
            a: 'The project went through the full pipeline: (1) Ingestion — loaded real-world CSV datasets from [source]. (2) Cleaning — found ~15% missing values in key columns; imputed numerical fields with median, dropped rows missing categorical identifiers. Identified and removed outliers using IQR. Standardized date formats. (3) EDA — analyzed distributions, found positive correlation between [X] and [Y]. Created correlation heatmap. (4) Feature engineering — created derived features relevant to the analysis. (5) Visualization — built interactive dashboard using [tool] showing KPIs, trends, and segment breakdowns. (6) Reporting — documented findings and recommendations for stakeholders.',
          },
        ],
      },
    ],
  },

  {
    id: 'databases',
    number: 10,
    title: 'SQL & Databases (MySQL)',
    description: 'Core database knowledge — always tested in interviews',
    icon: '💾',
    color: '#f97316',
    tag: 'Technical Skills',
    sections: [
      {
        id: 'sql-fundamentals',
        title: 'SQL Fundamentals',
        content: `SQL (Structured Query Language) is the standard language for relational databases. MySQL is one of the most popular implementations. SQL knowledge is tested in virtually every tech interview.

**Core Query Structure:**
SELECT → FROM → JOIN → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT

**JOINs (critical to know):**
- **INNER JOIN:** Returns rows where there's a match in BOTH tables
- **LEFT JOIN:** All rows from left table, matched rows from right (NULL if no match)
- **RIGHT JOIN:** All rows from right table, matched from left
- **FULL OUTER JOIN:** All rows from both (MySQL doesn't support this natively — use UNION)

**Aggregations:**
COUNT(), SUM(), AVG(), MAX(), MIN() with GROUP BY. HAVING filters aggregate results (like WHERE but after aggregation).

**Subqueries vs JOINs:**
Subqueries are readable but often slower. JOINs are usually faster because the optimizer can plan them better.

**Window Functions (important!):**
ROW_NUMBER(), RANK(), DENSE_RANK(), LAG(), LEAD(), SUM() OVER (PARTITION BY...). Perform calculations across rows without collapsing them like GROUP BY.

**Indexes:**
Dramatically speed up queries on large tables. B-tree index = default; great for range queries and equality. Hash index = only equality. Composite index: column order matters — leftmost prefix rule. Downside: indexes slow down writes (INSERT/UPDATE/DELETE must maintain the index).

**Transactions & ACID:**
Atomicity (all or nothing), Consistency (valid state), Isolation (concurrent transactions don't interfere), Durability (committed data persists). Use transactions for multi-step operations.`,
        keyPoints: [
          'SELECT → FROM → JOIN → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT',
          'INNER JOIN: both match; LEFT JOIN: all left + matching right (NULLs for no match)',
          'HAVING filters aggregates; WHERE filters rows before aggregation',
          'Window functions (ROW_NUMBER, LAG, SUM OVER) compute across rows without collapsing',
          'Indexes speed reads but slow writes; choose based on query patterns',
          'ACID: Atomicity, Consistency, Isolation, Durability — what makes relational DBs reliable',
        ],
        codeExample: {
          language: 'sql',
          label: 'Common SQL patterns for interviews',
          code: `-- JOINs: get users with their orders (LEFT keeps users with no orders)
SELECT u.name, COUNT(o.id) AS order_count, SUM(o.amount) AS total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name
HAVING total_spent > 100
ORDER BY total_spent DESC;

-- Subquery: users who spent more than average
SELECT name, total_spent FROM (
  SELECT u.name, SUM(o.amount) AS total_spent
  FROM users u JOIN orders o ON u.id = o.user_id
  GROUP BY u.id, u.name
) AS user_totals
WHERE total_spent > (SELECT AVG(amount) FROM orders);

-- Window function: rank users by spend within each country
SELECT name, country, total_spent,
  RANK() OVER (PARTITION BY country ORDER BY total_spent DESC) AS country_rank
FROM user_totals;

-- Find Nth highest salary (classic interview question)
SELECT DISTINCT salary
FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET N-1;  -- Replace N with desired rank

-- Index creation
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at);`,
        },
        interviewQs: [
          {
            q: 'What is the difference between WHERE and HAVING?',
            a: 'WHERE filters individual rows BEFORE grouping/aggregation. HAVING filters groups AFTER aggregation. Example: WHERE amount > 100 removes orders under $100 before any grouping. HAVING SUM(amount) > 1000 keeps only groups where the total exceeds $1000. You can\'t use aggregate functions in WHERE. HAVING without GROUP BY applies to the entire result set as one group. Performance note: WHERE is applied earlier in query execution, so filtering with WHERE before GROUP BY is generally more efficient.',
          },
          {
            q: 'Explain database indexes — when to use and when not to.',
            a: 'An index is a separate data structure (usually B-tree) that the DB maintains to speed up lookups. Without index: full table scan O(n). With index: O(log n). Use indexes on: columns in WHERE clauses, JOIN ON conditions, ORDER BY columns, foreign keys. Avoid over-indexing: each index takes storage space and must be updated on every write (INSERT/UPDATE/DELETE). Rule of thumb: index columns with high cardinality (many distinct values) — indexing a boolean column is rarely worth it. Composite indexes follow leftmost prefix rule: index (a,b,c) helps queries filtering on a, a+b, or a+b+c, but not b alone.',
          },
        ],
      },
    ],
  },

  {
    id: 'mongodb',
    number: 11,
    title: 'MongoDB & NoSQL',
    description: 'Document database used in your projects',
    icon: '🍃',
    color: '#84cc16',
    tag: 'Technical Skills',
    sections: [
      {
        id: 'mongodb-basics',
        title: 'MongoDB Fundamentals',
        content: `MongoDB is a document-oriented NoSQL database. Instead of tables and rows, data is stored as BSON documents (Binary JSON) organized into collections.

**Core Concepts:**
- **Database** > **Collection** (≈ table) > **Document** (≈ row, but schema-flexible)
- Documents are JSON-like objects: {"_id": ObjectId, "name": "Dixit", "skills": ["Python", "LangChain"]}
- Schema is flexible — different documents in the same collection can have different fields
- _id is the primary key (auto-generated ObjectId if not provided)

**When to Use MongoDB vs SQL:**
**Use MongoDB when:**
- Schema changes frequently (startup phase, evolving data models)
- Data is hierarchical/nested (documents, arrays within documents)
- Horizontal scaling is needed (sharding across many servers)
- Read-heavy workloads with document-centric access patterns

**Use SQL (MySQL) when:**
- Data has clear relationships (many-to-many, complex joins)
- ACID transactions are critical (financial systems, inventory)
- Schema is stable and well-defined
- Complex reporting queries across many tables

**CRUD Operations:**
- insertOne, insertMany
- find (with query operators: $eq, $gt, $in, $or, $and, $regex)
- updateOne, updateMany (with $set, $push, $pull, $inc)
- deleteOne, deleteMany

**Aggregation Pipeline:**
MongoDB's equivalent of SQL GROUP BY + JOINs. Chain stages: $match → $group → $sort → $project → $lookup (join). Powerful for analytics on document data.`,
        keyPoints: [
          'MongoDB stores documents (BSON/JSON) in collections; no fixed schema',
          'Flexible schema = easy to evolve; downside = no enforced data integrity',
          'Use MongoDB for hierarchical, frequently-changing data; SQL for relational, stable schemas',
          '$match (filter), $group (aggregate), $lookup (join), $project (reshape) are core pipeline stages',
          'ObjectId is the default _id — includes timestamp, making it roughly sortable by creation time',
          'Indexes work similarly to SQL but support array, text, and geospatial indexes too',
        ],
        codeExample: {
          language: 'javascript',
          label: 'MongoDB aggregation pipeline',
          code: `// Using PyMongo (Python driver)
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")
db = client["ecommerce"]

# Insert user document with nested data
db.users.insert_one({
    "name": "Dixit Solanki",
    "email": "dixitsolanki08@gmail.com",
    "purchases": [
        {"product": "sneakers", "amount": 89.99, "date": "2024-01-15"},
        {"product": "hoodie", "amount": 45.00, "date": "2024-02-01"}
    ],
    "tags": ["streetwear", "sports"]
})

# Query with operators
users = db.users.find({
    "purchases.amount": {"$gt": 50},  # purchases over $50
    "tags": {"$in": ["streetwear"]}   # has streetwear tag
})

# Aggregation pipeline: total spend per user, top 10
pipeline = [
    {"$unwind": "$purchases"},           # flatten purchases array
    {"$group": {
        "_id": "$email",
        "total_spent": {"$sum": "$purchases.amount"},
        "order_count": {"$sum": 1}
    }},
    {"$sort": {"total_spent": -1}},      # descending
    {"$limit": 10},
    {"$project": {                       # reshape output
        "email": "$_id",
        "total_spent": 1,
        "order_count": 1,
        "_id": 0
    }}
]
top_customers = list(db.users.aggregate(pipeline))`,
        },
        interviewQs: [
          {
            q: 'When would you choose MongoDB over MySQL?',
            a: 'Choose MongoDB when: (1) the data model is document-centric and hierarchical — e.g., a user document containing embedded arrays of orders avoids complex JOINs, (2) schema evolves frequently — adding fields to documents doesn\'t require ALTER TABLE migrations, (3) horizontal scaling is needed — MongoDB natively supports sharding across many servers, (4) you need to store unstructured or semi-structured data (JSON from APIs, logs, events). Choose MySQL when: (1) strong transactional consistency is needed (banking, inventory), (2) data has complex many-to-many relationships requiring JOINs, (3) you need SQL\'s mature ecosystem for reporting. In your recommendation project, MongoDB was appropriate for storing user profiles with embedded purchase history.',
          },
        ],
      },
    ],
  },

  {
    id: 'cloud',
    number: 12,
    title: 'Cloud Platforms (AWS & Azure)',
    description: 'Cloud services used for deploying AI workloads',
    icon: '☁️',
    color: '#6366f1',
    tag: 'Technical Skills',
    sections: [
      {
        id: 'cloud-basics',
        title: 'Cloud Fundamentals & Key Services',
        content: `Cloud platforms provide on-demand infrastructure and managed services. For AI workloads, key services span compute, storage, AI APIs, and deployment.

**Core Cloud Concepts:**
- **IaaS (Infrastructure as a Service):** Raw compute/storage (EC2, Azure VMs). You manage OS upward.
- **PaaS (Platform as a Service):** Managed runtime (Elastic Beanstalk, Azure App Service). You manage app code.
- **SaaS (Software as a Service):** Fully managed software (OpenAI API, Azure OpenAI Service).
- **Serverless:** No server management; pay per invocation (AWS Lambda, Azure Functions).

**AWS Key Services (know for interviews):**
- **EC2:** Virtual machines. Choose instance type based on CPU/GPU/memory needs.
- **S3:** Object storage. Store documents, model artifacts, datasets. Highly durable (11 9s).
- **Lambda:** Serverless functions. Great for event-driven backends (API endpoints, document processing triggers).
- **SageMaker:** Managed ML platform. Train, deploy, and serve ML models without managing infrastructure.
- **API Gateway:** Front-door for Lambda; creates RESTful endpoints.
- **RDS:** Managed relational databases (MySQL, PostgreSQL).

**Azure OpenAI Service:**
Deploy GPT-4, GPT-3.5, DALL-E within Azure's private cloud. Key benefit: enterprise compliance — data doesn't leave Azure. Used at TCS for enterprise GenAI solutions where data sovereignty is required.

**Serverless Architecture:**
No always-on servers. Lambda functions run on-demand, scale automatically to 0 when idle, billed per 100ms of execution. Ideal for unpredictable traffic patterns (document processing, webhook handlers).`,
        keyPoints: [
          'IaaS: manage your own VMs; PaaS: managed runtime; SaaS: fully managed software',
          'S3: durable object storage for documents, model artifacts, datasets',
          'Lambda + API Gateway: serverless REST API; scales to 0, pay per use',
          'SageMaker: managed ML training and inference; no infrastructure management',
          'Azure OpenAI: GPT-4 in Azure private cloud; enterprise data compliance',
          'At TCS: likely used Azure OpenAI for LLM APIs within enterprise compliance boundary',
        ],
        interviewQs: [
          {
            q: 'How did you use cloud platforms at TCS for GenAI solutions?',
            a: 'Used cloud platforms for three main purposes: (1) LLM API access — Azure OpenAI Service provided GPT-4 access within the enterprise network, meeting data sovereignty requirements (enterprise data doesn\'t leave Azure). (2) Backend deployment — API services deployed on Azure App Service or AWS Lambda for serverless document processing endpoints. (3) Storage — S3/Azure Blob for storing document corpora that the RAG system indexes. Key advantage of cloud for AI: managed services handle infrastructure scaling automatically; team focused on application logic not server management.',
          },
          {
            q: 'What is serverless and when is it appropriate?',
            a: 'Serverless means you don\'t provision or manage servers — your code runs in ephemeral containers provisioned on-demand. AWS Lambda: max 15 minute execution, 10GB memory, scales to thousands of concurrent executions automatically. Appropriate for: event-driven processing (new document uploaded → trigger embedding pipeline), infrequent or unpredictable traffic, microservice-style backends where each endpoint is a separate function. Not appropriate for: long-running processes (>15 min), always-warm latency-sensitive endpoints (cold starts add ~100-500ms), stateful workloads. For ML: Lambda for lightweight inference or pre/post processing; SageMaker for heavy model serving.',
          },
        ],
      },
    ],
  },

  {
    id: 'nlp',
    number: 13,
    title: 'NLP Fundamentals',
    description: 'Text processing concepts underlying LLMs',
    icon: '📝',
    color: '#a855f7',
    tag: 'Technical Skills',
    sections: [
      {
        id: 'nlp-basics',
        title: 'NLP Core Concepts',
        content: `Natural Language Processing (NLP) is the field of AI focused on enabling computers to understand and generate human language. Modern LLMs build on decades of NLP research.

**Text Preprocessing Pipeline:**
1. **Tokenization:** Split text into units (words, subwords, characters)
2. **Lowercasing / Normalization:** Standardize text
3. **Stop word removal:** Remove "the", "is", "at" (less important for neural models)
4. **Stemming / Lemmatization:** Reduce words to root form (running → run)
5. **Encoding:** Convert tokens to numbers (token IDs, one-hot, embeddings)

**Word Embeddings (pre-Transformer era):**
- **Word2Vec (2013):** Neural model trained to predict context words. Similar words cluster together in vector space. Captures analogies: king − man + woman ≈ queen.
- **GloVe:** Global Vectors; uses word co-occurrence statistics from corpus.
- **Limitation:** Static embeddings — "bank" has same vector regardless of context ("river bank" vs "bank account").

**Contextual Embeddings (Transformer era):**
- **BERT:** Bidirectional encoder, pre-trained with masked language modeling. Produces context-dependent embeddings — "bank" has different vectors in different sentences.
- **Sentence-BERT:** Fine-tuned BERT for sentence-level similarity. Produces single vectors for sentences, used in RAG systems.

**Key NLP Tasks:**
- Text Classification: sentiment analysis, spam detection, topic classification
- Named Entity Recognition (NER): extract people, places, organizations from text
- Summarization: abstractive (generate) vs extractive (select sentences)
- Translation, Q&A, Text Generation — all handled by modern LLMs`,
        keyPoints: [
          'Tokenization → normalization → encoding is the standard NLP preprocessing pipeline',
          'Word2Vec/GloVe: static embeddings; can\'t capture polysemy (context-dependent meanings)',
          'BERT: contextual embeddings; "bank" has different vectors in different contexts',
          'Sentence-BERT: sentence-level embeddings; used in RAG for semantic search',
          'BPE tokenization (used in GPT): handles unseen words by splitting into subwords',
          'LLMs subsume most NLP tasks — sentiment, NER, summarization, translation — with prompting',
        ],
        interviewQs: [
          {
            q: 'What is the difference between Word2Vec and BERT embeddings?',
            a: 'Word2Vec produces static embeddings — each word has one fixed vector regardless of context. "Bank" has the same vector in "river bank" and "bank account". BERT produces contextual embeddings — each token\'s vector changes based on the surrounding sentence. BERT processes the entire input sequence bidirectionally (looks at both left and right context). This makes BERT embeddings much more useful for downstream tasks because they capture meaning in context. For RAG, Sentence-BERT (which fine-tunes BERT for sentence-level similarity) is commonly used to generate document and query embeddings.',
          },
        ],
      },
    ],
  },

  {
    id: 'model-evaluation',
    number: 14,
    title: 'Model Evaluation Metrics',
    description: 'How you measured AI system quality at TCS',
    icon: '📏',
    color: '#14b8a6',
    tag: 'Technical Skills',
    sections: [
      {
        id: 'eval-metrics',
        title: 'Classification & NLP Metrics',
        content: `Model evaluation is how you know if your AI system actually works. At TCS, you documented model behavior and evaluation results — this means you used these metrics.

**Classification Metrics:**

**Accuracy:** (TP + TN) / Total. Misleading for imbalanced datasets (99% "not fraud" classifier has 99% accuracy but is useless).

**Precision:** TP / (TP + FP). Of all predicted positives, how many were correct? High precision = few false alarms.

**Recall (Sensitivity):** TP / (TP + FN). Of all actual positives, how many did we find? High recall = catch everything, even at cost of false alarms.

**F1 Score:** 2 × (Precision × Recall) / (Precision + Recall). Harmonic mean — balanced metric for imbalanced classes.

**Trade-off:** Raising the classification threshold increases precision, decreases recall. Lowering it does the opposite.

**NLP / LLM Metrics:**

**BLEU Score:** Measures n-gram overlap between generated and reference text. Used for machine translation and summarization. Range 0–1. Limitation: doesn't capture semantic similarity.

**ROUGE:** Recall-Oriented Understudy for Gisting Evaluation. ROUGE-N measures n-gram recall. Used for summarization.

**Perplexity:** How well a language model predicts a sample. Lower = better. 2^(cross-entropy loss).

**LLM-Specific Evaluation:**
- **Faithfulness:** Is the answer grounded in the retrieved context? (RAG evaluation)
- **Answer Relevancy:** Does the answer address the question?
- **Context Recall:** Did retrieval find all necessary information?
- **Human Evaluation:** Gold standard but expensive; use for final validation`,
        keyPoints: [
          'Accuracy is misleading for imbalanced datasets; use F1, precision, recall',
          'Precision = few false positives; Recall = catch all true positives',
          'F1 = harmonic mean of precision/recall; use when both matter equally',
          'BLEU measures n-gram overlap; used for translation and summarization',
          'RAG evaluation: faithfulness (answer grounded in context?) + answer relevancy',
          'At TCS: documented evaluation results meant tracking these metrics per use case',
        ],
        codeExample: {
          language: 'python',
          label: 'Computing evaluation metrics',
          code: `from sklearn.metrics import (
    accuracy_score, precision_score,
    recall_score, f1_score, classification_report
)

y_true = [1, 0, 1, 1, 0, 1, 0, 0, 1, 0]
y_pred = [1, 0, 1, 0, 0, 1, 1, 0, 1, 0]

print(f"Accuracy:  {accuracy_score(y_true, y_pred):.3f}")
print(f"Precision: {precision_score(y_true, y_pred):.3f}")
print(f"Recall:    {recall_score(y_true, y_pred):.3f}")
print(f"F1:        {f1_score(y_true, y_pred):.3f}")
print(classification_report(y_true, y_pred))

# RAG-specific evaluation (using ragas library)
# from ragas import evaluate
# from ragas.metrics import faithfulness, answer_relevancy, context_recall
# results = evaluate(dataset, metrics=[faithfulness, answer_relevancy])`,
        },
        interviewQs: [
          {
            q: 'When would you use precision vs recall as the primary metric?',
            a: 'Depends on the cost of each error type. High-recall scenario: medical diagnosis — you want to catch all cancer cases even if it means some false positives (unnecessary biopsies). Missing a true positive (cancer) is much worse than a false alarm. High-precision scenario: email spam filter — you don\'t want legitimate emails going to spam. A false positive (blocking good email) is worse than a false negative (letting some spam through). For most AI tasks, F1 (balanced) is a reasonable starting metric, then tune based on business requirements. At TCS, for recommendation relevance, a combination of precision@K (of recommended items, how many were relevant) and recall@K was used.',
          },
          {
            q: 'How do you evaluate a RAG system\'s quality?',
            a: 'RAG evaluation has three components: (1) Retrieval quality — Context Precision (are retrieved chunks relevant?) and Context Recall (were all necessary chunks retrieved?). (2) Generation quality — Faithfulness (is the answer supported by the retrieved context, not hallucinated?) and Answer Relevancy (does it address the question?). (3) End-to-end — compare against ground truth Q&A pairs. Tools: RAGAS framework automates many of these using an LLM judge. At TCS, we created a test set of 50 representative queries with known answers, measured faithfulness and relevancy, and iterated on chunking and retrieval parameters to improve scores.',
          },
        ],
      },
    ],
  },
];
