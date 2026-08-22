export interface Option {
  label: string;
  text: string;
}

export interface Question {
  text: string;
  options: Option[];
  correctIndex: number;
  difficulty: "Easy" | "Medium" | "Hard";
}

// 25 Web Questions (8 Easy, 10 Medium, 7 Hard)
const webQuestions: Question[] = [
  // Easy (8)
  {
    text: "What is the purpose of useEffect cleanup function in React?",
    options: [
      { label: "A", text: "To optimize component re-renders" },
      { label: "B", text: "To cancel subscriptions, timers, or clean up side effects before unmounting" },
      { label: "C", text: "To fetch initial data from a server" },
      { label: "D", text: "To update the component state synchronously" }
    ],
    correctIndex: 1,
    difficulty: "Easy"
  },
  {
    text: "Which HTTP status code represents 'Conflict' when a resource creation fails due to duplication?",
    options: [
      { label: "A", text: "400 Bad Request" },
      { label: "B", text: "403 Forbidden" },
      { label: "C", text: "409 Conflict" },
      { label: "D", text: "422 Unprocessable Entity" }
    ],
    correctIndex: 2,
    difficulty: "Easy"
  },
  {
    text: "Which HTML5 element is best suited for wrapping independent, self-contained article content?",
    options: [
      { label: "A", text: "<section>" },
      { label: "B", text: "<div>" },
      { label: "C", text: "<article>" },
      { label: "D", text: "<aside>" }
    ],
    correctIndex: 2,
    difficulty: "Easy"
  },
  {
    text: "In CSS Flexbox, which property controls alignment along the cross axis?",
    options: [
      { label: "A", text: "justify-content" },
      { label: "B", text: "align-items" },
      { label: "C", text: "flex-direction" },
      { label: "D", text: "align-content" }
    ],
    correctIndex: 1,
    difficulty: "Easy"
  },
  {
    text: "What is the primary difference between localStorage and sessionStorage?",
    options: [
      { label: "A", text: "localStorage holds up to 50MB of data while sessionStorage holds 5MB" },
      { label: "B", text: "sessionStorage data persists even after closing the browser tab" },
      { label: "C", text: "localStorage persists indefinitely; sessionStorage data is cleared when the tab session ends" },
      { label: "D", text: "sessionStorage is only accessible via HTTPS" }
    ],
    correctIndex: 2,
    difficulty: "Easy"
  },
  {
    text: "Which JavaScript array method creates a new array with all elements that pass a test?",
    options: [
      { label: "A", text: "map()" },
      { label: "B", text: "forEach()" },
      { label: "C", text: "filter()" },
      { label: "D", text: "reduce()" }
    ],
    correctIndex: 2,
    difficulty: "Easy"
  },
  {
    text: "What is the security risk solved by using HTTP-Only cookies?",
    options: [
      { label: "A", text: "SQL Injection" },
      { label: "B", text: "Cross-Site Scripting (XSS) access to session IDs" },
      { label: "C", text: "Cross-Site Request Forgery (CSRF)" },
      { label: "D", text: "Man-in-the-Middle (MITM) attacks" }
    ],
    correctIndex: 1,
    difficulty: "Easy"
  },
  {
    text: "Which of the following describes a REST API constraint?",
    options: [
      { label: "A", text: "Stateful sessions" },
      { label: "B", text: "GraphQL schema definition" },
      { label: "C", text: "Statelessness client-server communication" },
      { label: "D", text: "Bidirectional WebSockets" }
    ],
    correctIndex: 2,
    difficulty: "Easy"
  },
  // Medium (10)
  {
    text: "Given this code: const promise = new Promise((resolve) => resolve('A')); promise.then(res => console.log(res)); console.log('B'); What is the logged order?",
    options: [
      { label: "A", text: "A, then B" },
      { label: "B", text: "B, then A" },
      { label: "C", text: "Both simultaneously" },
      { label: "D", text: "Undefined behavior" }
    ],
    correctIndex: 1,
    difficulty: "Medium"
  },
  {
    text: "How does React fiber architecture handle rendering updates to maintain 60fps responsiveness?",
    options: [
      { label: "A", text: "By compiling Javascript to WebAssembly for execution" },
      { label: "B", text: "By breaking work into chunks and pausing/resuming updates using cooperative scheduling" },
      { label: "C", text: "By using worker threads to execute virtual DOM diffing" },
      { label: "D", text: "By bypassing state reconciliation and writing directly to the DOM" }
    ],
    correctIndex: 1,
    difficulty: "Medium"
  },
  {
    text: "What is the purpose of HTTP 'preflight' OPTIONS requests in CORS?",
    options: [
      { label: "A", text: "To encrypt the payload for cross-origin transmission" },
      { label: "B", text: "To check server support for caching dynamic resources" },
      { label: "C", text: "To verify cross-origin permissions with the destination server before sending unsafe methods like POST/PUT" },
      { label: "D", text: "To compress large request bodies" }
    ],
    correctIndex: 2,
    difficulty: "Medium"
  },
  {
    text: "In React, what occurs when you pass a new object literal reference as a prop to a child component memoized with React.memo?",
    options: [
      { label: "A", text: "The child component will skip re-rendering because values match" },
      { label: "B", text: "React throws a warning about mutation safety" },
      { label: "C", text: "The child component re-renders anyway due to reference identity change" },
      { label: "D", text: "The prop is automatically shallow merged" }
    ],
    correctIndex: 2,
    difficulty: "Medium"
  },
  {
    text: "What is the advantage of using Server-Side Rendering (SSR) over Client-Side Rendering (CSR)?",
    options: [
      { label: "A", text: "Lower server CPU utilization" },
      { label: "B", text: "Faster time to interactive (TTI) since React loads instantly" },
      { label: "C", text: "Improved SEO visibility and faster First Contentful Paint (FCP)" },
      { label: "D", text: "Zero network latency" }
    ],
    correctIndex: 2,
    difficulty: "Medium"
  },
  {
    text: "Which header is used to implement a cache validation strategy using weak validation tokens?",
    options: [
      { label: "A", text: "Cache-Control: no-cache" },
      { label: "B", text: "ETag and If-None-Match" },
      { label: "C", text: "Expires" },
      { label: "D", text: "Last-Modified" }
    ],
    correctIndex: 1,
    difficulty: "Medium"
  },
  {
    text: "What is the purpose of index signature definitions in TypeScript (e.g. [key: string]: any)?",
    options: [
      { label: "A", text: "To force array styling on objects" },
      { label: "B", text: "To declare types for properties not known in advance of instantiation" },
      { label: "C", text: "To specify index mappings in databases" },
      { label: "D", text: "To define auto-incrementing fields" }
    ],
    correctIndex: 1,
    difficulty: "Medium"
  },
  {
    text: "When implementing JWT-based authentication, where is the most secure place to store access and refresh tokens to prevent XSS and CSRF?",
    options: [
      { label: "A", text: "Both in localStorage to keep them persistent" },
      { label: "B", text: "Access token in memory, refresh token in a HttpOnly, Secure, SameSite cookie" },
      { label: "C", text: "Both in sessionStorage to automatically clear them on tab close" },
      { label: "D", text: "Stored in indexDB for encryption support" }
    ],
    correctIndex: 1,
    difficulty: "Medium"
  },
  {
    text: "In database design, which anomaly is resolved by converting a schema from Second Normal Form (2NF) to Third Normal Form (3NF)?",
    options: [
      { label: "A", text: "Multi-valued dependency anomalies" },
      { label: "B", text: "Partial dependency anomalies" },
      { label: "C", text: "Transitive dependency anomalies" },
      { label: "D", text: "Insert anomalies from flat files" }
    ],
    correctIndex: 2,
    difficulty: "Medium"
  },
  {
    text: "How does Node.js handle concurrent I/O requests when running on a single-threaded runtime?",
    options: [
      { label: "A", text: "By spawning multiple instances of V8 behind a thread pool" },
      { label: "B", text: "By offloading block I/O operations to Libuv's thread pool and utilizing the event loop" },
      { label: "C", text: "By executing asynchronous code synchronously in cycles" },
      { label: "D", text: "By context switching processes quickly" }
    ],
    correctIndex: 1,
    difficulty: "Medium"
  },
  // Hard (7)
  {
    text: "In PostgreSQL, what is the default isolation level and how does it handle 'Phantom Reads'?",
    options: [
      { label: "A", text: "Read Committed; it permits phantom reads because they can only be blocked under Serializable isolation" },
      { label: "B", text: "Repeatable Read; it completely blocks phantom reads internally in Postgres using MVCC snapshots" },
      { label: "C", text: "Serializable; it uses active lock manager constraints to fail transactions" },
      { label: "D", text: "Read Uncommitted; it doesn't prevent phantom reads" }
    ],
    correctIndex: 0,
    difficulty: "Hard"
  },
  {
    text: "What happens when you resolve a CSS layout with 'contain: layout paint' property?",
    options: [
      { label: "A", text: "It prevents text rendering clipping on sub-pixels" },
      { label: "B", text: "It isolates the DOM subtree boundary, preventing browser recalculations of layout and repaints of outer pages" },
      { label: "C", text: "It forces hardware acceleration onto CPU cores" },
      { label: "D", text: "It prevents cross-site rendering injections" }
    ],
    correctIndex: 1,
    difficulty: "Hard"
  },
  {
    text: "What is the critical vulnerability in using a naive Node.js cluster module with a centralized state memory variable?",
    options: [
      { label: "A", text: "Process synchronization locks will block the main V8 garbage collector" },
      { label: "B", text: "Separate workers run in isolated processes and do not share state memory directly, leading to state desynchronization" },
      { label: "C", text: "Cluster Master will exceed socket file descriptor limits instantly" },
      { label: "D", text: "Heap allocation overflows across cluster nodes" }
    ],
    correctIndex: 1,
    difficulty: "Hard"
  },
  {
    text: "When implementing React concurrent rendering features, what is the core architectural purpose of the useTransition hook?",
    options: [
      { label: "A", text: "To animate component mount state changes smoothly" },
      { label: "B", text: "To mark updates as non-blocking transitions, keeping user interactions interactive during heavy component renders" },
      { label: "C", text: "To fetch API data asynchronously before routing actions execute" },
      { label: "D", text: "To switch context threads to Web Workers" }
    ],
    correctIndex: 1,
    difficulty: "Hard"
  },
  {
    text: "Under OAuth 2.1, what is the PKCE (Proof Key for Code Exchange) flow solving for Single Page Applications?",
    options: [
      { label: "A", text: "It encrypts the client ID in CSS styles" },
      { label: "B", text: "It prevents authorization code interception attacks by requiring a dynamic code challenge verification on token exchange" },
      { label: "C", text: "It eliminates redirect URIs altogether" },
      { label: "D", text: "It prevents cross-origin resource sharing leakage" }
    ],
    correctIndex: 1,
    difficulty: "Hard"
  },
  {
    text: "When configuring Redis cluster master/replica replication, what causes split-brain issues, and how is it resolved?",
    options: [
      { label: "A", text: "Network partitions where two masters are accepted; resolved by min-replicas-to-write and client consensus limits" },
      { label: "B", text: "Memory leaks in secondary nodes; resolved by auto-eviction policy configurations" },
      { label: "C", text: "CPU throttling on cluster networks; resolved by increasing socket timeouts" },
      { label: "D", text: "Data serialization mismatches; resolved by JSON validation protocols" }
    ],
    correctIndex: 0,
    difficulty: "Hard"
  },
  {
    text: "In React, what can cause memory leak warnings when unmounting components using RxJS subscriptions or EventListeners?",
    options: [
      { label: "A", text: "Failure to unsubscribe or remove listener references during unmount, leaving active listeners targeting DOM structures" },
      { label: "B", text: "Using closures inside functional states" },
      { label: "C", text: "Declaring refs outside component lifecycles" },
      { label: "D", text: "Using standard fetch inside useEffect hooks without abort controllers" }
    ],
    correctIndex: 0,
    difficulty: "Hard"
  }
];

// 25 AI/ML Questions
const aiQuestions: Question[] = [
  // Easy (8)
  {
    text: "What does temperature control in generative LLM sampling?",
    options: [
      { label: "A", text: "The processing speed of GPU tensors" },
      { label: "B", text: "The degree of randomness/creativity in token selection during inference" },
      { label: "C", text: "The size of the context window" },
      { label: "D", text: "The learning rate of network weights" }
    ],
    correctIndex: 1,
    difficulty: "Easy"
  },
  {
    text: "In supervised learning, what represents the underfitting condition?",
    options: [
      { label: "A", text: "High training accuracy, low test accuracy" },
      { label: "B", text: "Low training accuracy and low test accuracy" },
      { label: "C", text: "Zero loss on both training and test data" },
      { label: "D", text: "High variance in model predictions" }
    ],
    correctIndex: 1,
    difficulty: "Easy"
  },
  {
    text: "What metric is most suitable for evaluating class-imbalanced classification tasks?",
    options: [
      { label: "A", text: "Accuracy" },
      { label: "B", text: "F1-Score / Precision-Recall AUC" },
      { label: "C", text: "Mean Squared Error (MSE)" },
      { label: "D", text: "R-squared value" }
    ],
    correctIndex: 1,
    difficulty: "Easy"
  },
  {
    text: "What is the role of the embedding model in a Retrieval-Augmented Generation (RAG) pipeline?",
    options: [
      { label: "A", text: "To synthesize final response summaries" },
      { label: "B", text: "To convert text queries and documents into dense vector representations for similarity calculations" },
      { label: "C", text: "To parse PDF documents into markdown chunks" },
      { label: "D", text: "To fine-tune LLM layer parameters" }
    ],
    correctIndex: 1,
    difficulty: "Easy"
  },
  {
    text: "What does the activation function 'ReLU' return for negative inputs?",
    options: [
      { label: "A", text: "-1" },
      { label: "B", text: "0" },
      { label: "C", text: "The input value itself" },
      { label: "D", text: "0.5" }
    ],
    correctIndex: 1,
    difficulty: "Easy"
  },
  {
    text: "Which similarity metric is most commonly used to query vector databases in RAG?",
    options: [
      { label: "A", text: "Euclidean distance" },
      { label: "B", text: "Cosine similarity" },
      { label: "C", text: "Manhattan distance" },
      { label: "D", text: "Jaccard similarity" }
    ],
    correctIndex: 1,
    difficulty: "Easy"
  },
  {
    text: "What does 'Overfitting' mean in ML model training?",
    options: [
      { label: "A", text: "The model is too simple to capture patterns" },
      { label: "B", text: "The model memorizes training noise and fails to generalize to unseen test data" },
      { label: "C", text: "The weights become completely zero" },
      { label: "D", text: "The data size is too large for the GPU memory" }
    ],
    correctIndex: 1,
    difficulty: "Easy"
  },
  {
    text: "What is the primary purpose of data normalization?",
    options: [
      { label: "A", text: "To increase dataset sample counts" },
      { label: "B", text: "To scale numerical feature values into a common range to stabilize gradient descent" },
      { label: "C", text: "To remove null values" },
      { label: "D", text: "To apply PCA transformations" }
    ],
    correctIndex: 1,
    difficulty: "Easy"
  },
  // Medium (10)
  {
    text: "In RAG pipelines, how does 'Naive Chunking' differ from 'Semantic Chunking'?",
    options: [
      { label: "A", text: "Naive chunking uses fixed character counts; semantic chunking groups sections by context boundary similarity" },
      { label: "B", text: "Semantic chunking translates text into multiple languages before vectorization" },
      { label: "C", text: "Naive chunking ignores token thresholds completely" },
      { label: "D", text: "Semantic chunking bypasses vector stores altogether" }
    ],
    correctIndex: 0,
    difficulty: "Medium"
  },
  {
    text: "What problem does the Self-Attention mechanism solve in the Transformer architecture?",
    options: [
      { label: "A", text: "It decreases memory consumption during gradient descent" },
      { label: "B", text: "It dynamically calculates dependencies between all tokens in a sequence, resolving bottleneck limitations of RNNs" },
      { label: "C", text: "It compiles dense weights into sparse weights" },
      { label: "D", text: "It acts as a classification activation boundary" }
    ],
    correctIndex: 1,
    difficulty: "Medium"
  },
  {
    text: "What is the primary purpose of validation datasets during deep neural network training?",
    options: [
      { label: "A", text: "To directly update weight and bias parameters during backpropagation" },
      { label: "B", text: "To tune hyperparameters and check for overfitting during training without leaking test data" },
      { label: "C", text: "To augment training samples with synthetic noise" },
      { label: "D", text: "To run production inference queries" }
    ],
    correctIndex: 1,
    difficulty: "Medium"
  },
  {
    text: "In neural network optimization, what is the role of Adam optimization over vanilla Stochastic Gradient Descent (SGD)?",
    options: [
      { label: "A", text: "It computes exact second-order derivatives" },
      { label: "B", text: "It adaptively scales the learning rate per parameter based on past gradient moments" },
      { label: "C", text: "It eliminates the need for any backpropagation" },
      { label: "D", text: "It increases GPU parallelization factor" }
    ],
    correctIndex: 1,
    difficulty: "Medium"
  },
  {
    text: "How does the ROC-AUC score evaluate classifier model performance?",
    options: [
      { label: "A", text: "By measuring accuracy values across multiple layers" },
      { label: "B", text: "By summarizing model precision-recall trade-offs at positive boundaries" },
      { label: "C", text: "By calculating the area under the True Positive Rate vs False Positive Rate curve across all thresholds" },
      { label: "D", text: "By evaluating regression residuals" }
    ],
    correctIndex: 2,
    difficulty: "Medium"
  },
  {
    text: "What is the vanishing gradient problem in deep recurrent neural networks?",
    options: [
      { label: "A", text: "Gradients grow exponentially, causing numerical overflows" },
      { label: "B", text: "As gradients backpropagate through deep layers, they shrink exponentially towards zero, preventing earlier weights from updating" },
      { label: "C", text: "The activation function output limits parameters to infinity" },
      { label: "D", text: "GPU hardware registers clear variables automatically" }
    ],
    correctIndex: 1,
    difficulty: "Medium"
  },
  {
    text: "What does the cross-entropy loss function measure in multi-class classification?",
    options: [
      { label: "A", text: "The distance between regression boundaries" },
      { label: "B", text: "The difference between probability distributions output by softmax and the actual target one-hot vectors" },
      { label: "C", text: "The variance of parameter weight clusters" },
      { label: "D", text: "The accuracy of predicted class counts" }
    ],
    correctIndex: 1,
    difficulty: "Medium"
  },
  {
    text: "How does L1 regularization (Lasso) differ from L2 regularization (Ridge) in linear regression optimization?",
    options: [
      { label: "A", text: "L1 only operates on non-linear datasets" },
      { label: "B", text: "L1 adds squared absolute weight penalties; L2 adds direct absolute weights" },
      { label: "C", text: "L1 adds absolute value penalties of coefficients, encouraging weights to become zero (sparsity); L2 adds squared values" },
      { label: "D", text: "L2 generates sparse parameters, whereas L1 keeps all features active" }
    ],
    correctIndex: 2,
    difficulty: "Medium"
  },
  {
    text: "What is the function of Tokenizers (e.g. Byte-Pair Encoding) in LLM input preprocessing?",
    options: [
      { label: "A", text: "To calculate vector embeddings directly" },
      { label: "B", text: "To split string text into sub-word tokens and map them to their corresponding numerical IDs in a vocabulary" },
      { label: "C", text: "To verify security strings in prompts" },
      { label: "D", text: "To compress final network outputs" }
    ],
    correctIndex: 1,
    difficulty: "Medium"
  },
  {
    text: "What is the primary advantage of using LoRA (Low-Rank Adaptation) for fine-tuning LLMs?",
    options: [
      { label: "A", text: "It guarantees zero loss during training" },
      { label: "B", text: "It freezes base weights and trains a small set of low-rank parameter update matrices, reducing GPU memory demands" },
      { label: "C", text: "It doubles the speed of model token generation" },
      { label: "D", text: "It converts LLM logic into neural rules" }
    ],
    correctIndex: 1,
    difficulty: "Medium"
  },
  // Hard (7)
  {
    text: "What does the Attention mechanism matrix calculation 'softmax(QK^T / sqrt(d_k))V' represent in mathematical terms?",
    options: [
      { label: "A", text: "The covariance check of neural layers" },
      { label: "B", text: "Computing similarity scores between Query and Key vectors, scaling by dimension factor, and applying softmax weights to Values" },
      { label: "C", text: "An activation boundary normalization logic" },
      { label: "D", text: "Dimension compression transform" }
    ],
    correctIndex: 1,
    difficulty: "Hard"
  },
  {
    text: "What is the primary mechanism of RLHF (Reinforcement Learning from Human Feedback) in alignment tuning?",
    options: [
      { label: "A", text: "Using automated web scraping to find corrected labels" },
      { label: "B", text: "Training a Reward Model based on human comparisons, then updating the policy LLM via PPO (Proximal Policy Optimization)" },
      { label: "C", text: "Fine-tuning base models using supervised instruction datasets solely" },
      { label: "D", text: "Injecting logic constraints into prompt prefixes" }
    ],
    correctIndex: 1,
    difficulty: "Hard"
  },
  {
    text: "When implementing semantic search, what is the 'Curse of Dimensionality' in vector similarity calculation?",
    options: [
      { label: "A", text: "Loss of float precision in dense arrays" },
      { label: "B", text: "As dimensions increase, distance metrics (e.g. Euclidean) become less discriminative as distances converge close together" },
      { label: "C", text: "GPU execution blocks due to memory constraints" },
      { label: "D", text: "Embedding indices become negative numbers" }
    ],
    correctIndex: 1,
    difficulty: "Hard"
  },
  {
    text: "How does the DPO (Direct Preference Optimization) algorithm bypass the traditional RLHF training process?",
    options: [
      { label: "A", text: "By using hardcoded rule patterns instead of neural networks" },
      { label: "B", text: "By formulating the reinforcement learning step as a binary classification loss directly on preference pairs, avoiding Reward Model training" },
      { label: "C", text: "By bypassing base training stages completely" },
      { label: "D", text: "By utilizing supervised learning on target text summaries" }
    ],
    correctIndex: 1,
    difficulty: "Hard"
  },
  {
    text: "What is the architectural distinction between Decoder-only (e.g. GPT-4) and Encoder-Decoder (e.g. T5) models?",
    options: [
      { label: "A", text: "Decoder-only models use bi-directional attention boundaries; Encoder-Decoder uses causal masked attention" },
      { label: "B", text: "Decoder-only models utilize causal masking to prevent attending to future tokens, predicting next tokens; Encoder-Decoder splits tasks" },
      { label: "C", text: "Encoder-Decoder models cannot perform text generation tasks" },
      { label: "D", text: "Decoder-only models lack projection weights" }
    ],
    correctIndex: 1,
    difficulty: "Hard"
  },
  {
    text: "What is the role of Hierarchical Navigable Small World (HNSW) graphs in modern vector databases?",
    options: [
      { label: "A", text: "To encrypt vector payloads" },
      { label: "B", text: "To implement Approximate Nearest Neighbor (ANN) index searches quickly over millions of high-dimensional vector spaces" },
      { label: "C", text: "To compute exact cosine values between all database tokens" },
      { label: "D", text: "To run distributed SQL joints across metadata" }
    ],
    correctIndex: 1,
    difficulty: "Hard"
  },
  {
    text: "What is the primary cause of hallucination in Large Language Models under training paradigms?",
    options: [
      { label: "A", text: "Too high learning rates in base training stages" },
      { label: "B", text: "Causal next-token prediction objectives optimizing for likelihood rather than logical truth, exacerbated by stale/incorrect training data" },
      { label: "C", text: "Small dimension weight matrices" },
      { label: "D", text: "Lack of fine-tuning constraints" }
    ],
    correctIndex: 1,
    difficulty: "Hard"
  }
];

// 25 DevOps Questions
const devopsQuestions: Question[] = [
  // Easy (8)
  {
    text: "What is the primary purpose of a Dockerfile?",
    options: [
      { label: "A", text: "To write infrastructure code for cloud servers" },
      { label: "B", text: "To define instructions for building a reproducible container image" },
      { label: "C", text: "To execute continuous deployment actions on servers" },
      { label: "D", text: "To configure load balancer settings" }
    ],
    correctIndex: 1,
    difficulty: "Easy"
  },
  {
    text: "What does the CI in CI/CD stand for?",
    options: [
      { label: "A", text: "Continuous Infrastructure" },
      { label: "B", text: "Continuous Integration" },
      { label: "C", text: "Cloud Integration" },
      { label: "D", text: "Continuous Inspection" }
    ],
    correctIndex: 1,
    difficulty: "Easy"
  },
  {
    text: "What is the role of an Ingress Controller in Kubernetes?",
    options: [
      { label: "A", text: "To manage cluster storage allocations" },
      { label: "B", text: "To manage external HTTP/S access to services inside the cluster, typically acting as a reverse proxy" },
      { label: "C", text: "To secure container root credentials" },
      { label: "D", text: "To monitor server CPU nodes" }
    ],
    correctIndex: 1,
    difficulty: "Easy"
  },
  {
    text: "What is the purpose of Terraform?",
    options: [
      { label: "A", text: "To write application unit tests" },
      { label: "B", text: "To provision and manage infrastructure using declarative code configurations (IaC)" },
      { label: "C", text: "To monitor server memory usage" },
      { label: "D", text: "To build Javascript bundles" }
    ],
    correctIndex: 1,
    difficulty: "Easy"
  },
  {
    text: "What is the difference between virtualization and containerization?",
    options: [
      { label: "A", text: "Virtual machines share the host OS kernel; containers isolate full guest OS layers" },
      { label: "B", text: "Containers share the host OS kernel, making them lightweight; Virtual machines run full guest OS instances on hypervisors" },
      { label: "C", text: "Virtualization has no network isolation support" },
      { label: "D", text: "Containers require specialized GPU hardware" }
    ],
    correctIndex: 1,
    difficulty: "Easy"
  },
  {
    text: "What is a Kubernetes Pod?",
    options: [
      { label: "A", text: "A physical virtual machine" },
      { label: "B", text: "The smallest deployable unit in Kubernetes, representing a single instance of a running process (one or more containers)" },
      { label: "C", text: "A networking router inside a cluster" },
      { label: "D", text: "A storage volume partition" }
    ],
    correctIndex: 1,
    difficulty: "Easy"
  },
  {
    text: "What is the primary benefit of GitOps?",
    options: [
      { label: "A", text: "To compile code faster" },
      { label: "B", text: "Using Git repositories as the single source of truth for declarative infrastructure and application deployments" },
      { label: "C", text: "To bypass automated security validation" },
      { label: "D", text: "To encrypt production credentials" }
    ],
    correctIndex: 1,
    difficulty: "Easy"
  },
  {
    text: "What does the command 'docker-compose up' accomplish?",
    options: [
      { label: "A", text: "Uploads an image to Docker Hub" },
      { label: "B", text: "Builds, creates, and starts container services defined in a docker-compose.yaml file" },
      { label: "C", text: "Updates the Docker daemon" },
      { label: "D", text: "Restarts the host server OS" }
    ],
    correctIndex: 1,
    difficulty: "Easy"
  },
  // Medium (10)
  {
    text: "In Docker, what is the advantage of using Multi-stage builds?",
    options: [
      { label: "A", text: "It allows containers to run multiple OS kernels concurrently" },
      { label: "B", text: "It optimizes final image sizes by using separate temporary stages for compiling and copying build artifacts to a lean runtime image" },
      { label: "C", text: "It automatically scales container replicas" },
      { label: "D", text: "It speeds up network file transfers" }
    ],
    correctIndex: 1,
    difficulty: "Medium"
  },
  {
    text: "How does a rolling update deployment strategy differ from a blue-green deployment strategy?",
    options: [
      { label: "A", text: "Rolling updates require twice the infrastructure capacity of blue-green deployments" },
      { label: "B", text: "Rolling updates incrementally replace old version pods with new ones; Blue-green provisions a full duplicate environment and switches traffic" },
      { label: "C", text: "Blue-green deployment carries risk of service downtime during updates" },
      { label: "D", text: "Rolling updates cannot be rolled back" }
    ],
    correctIndex: 1,
    difficulty: "Medium"
  },
  {
    text: "What is the purpose of state files in Terraform (terraform.tfstate)?",
    options: [
      { label: "A", text: "To store credentials securely in git" },
      { label: "B", text: "To map declarative configuration files to real-world cloud resources, tracking state metadata for plan and apply actions" },
      { label: "C", text: "To log infrastructure error traces" },
      { label: "D", text: "To run post-deployment testing scripts" }
    ],
    correctIndex: 1,
    difficulty: "Medium"
  },
  {
    text: "What is the role of Prometheus in a DevOps observability stack?",
    options: [
      { label: "A", text: "To execute continuous integration build steps" },
      { label: "B", text: "To collect and store time-series metric data from monitored systems via a pull model, supporting alert configurations" },
      { label: "C", text: "To act as a gateway load balancer" },
      { label: "D", text: "To store system audit logs in databases" }
    ],
    correctIndex: 1,
    difficulty: "Medium"
  },
  {
    text: "In Kubernetes, what is the role of a Service object of type ClusterIP?",
    options: [
      { label: "A", text: "To expose the service externally to internet traffic" },
      { label: "B", text: "To expose the service on an internal IP within the cluster, limiting access to traffic inside the cluster network" },
      { label: "C", text: "To configure pod storage disks" },
      { label: "D", text: "To manage cluster DNS policies" }
    ],
    correctIndex: 1,
    difficulty: "Medium"
  },
  {
    text: "In a GitHub Actions workflow, what is the purpose of using Actions Secrets?",
    options: [
      { label: "A", text: "To obfuscate source code" },
      { label: "B", text: "To securely inject sensitive variables (like API keys, passwords, and tokens) into workflow runs without committing them to git" },
      { label: "C", text: "To restrict access to the repository settings page" },
      { label: "D", text: "To encrypt the final build logs" }
    ],
    correctIndex: 1,
    difficulty: "Medium"
  },
  {
    text: "What is the purpose of Kubernetes ConfigMaps and Secrets?",
    options: [
      { label: "A", text: "To compile Dockerfiles within pods" },
      { label: "B", text: "To separate configuration settings and sensitive data from container images, injecting them as env variables or mount volumes" },
      { label: "C", text: "To define cluster firewall access lists" },
      { label: "D", text: "To configure node scaling limits" }
    ],
    correctIndex: 1,
    difficulty: "Medium"
  },
  {
    text: "What is the core distinction between Ansible (procedural) and Terraform (declarative)?",
    options: [
      { label: "A", text: "Terraform is configuration management; Ansible is infrastructure provisioning" },
      { label: "B", text: "Ansible executes step-by-step commands to reach states; Terraform declares the desired end-state and calculates differences" },
      { label: "C", text: "Ansible requires agent installations on target servers; Terraform does not" },
      { label: "D", text: "Terraform only supports AWS provisioning" }
    ],
    correctIndex: 1,
    difficulty: "Medium"
  },
  {
    text: "How does Canary deployment strategy function?",
    options: [
      { label: "A", text: "It deploys code updates randomly across global edge locations" },
      { label: "B", text: "It routes a small fraction of production traffic to a new version of the app to monitor health before full rollout" },
      { label: "C", text: "It isolates database reads during deployments" },
      { label: "D", text: "It requires running multiple containers in the same pod" }
    ],
    correctIndex: 1,
    difficulty: "Medium"
  },
  {
    text: "What is the purpose of a reverse proxy like NGINX in web application delivery?",
    options: [
      { label: "A", text: "To compile CSS assets on requests" },
      { label: "B", text: "To receive client requests, forward them to backend servers, and manage SSL termination, load balancing, and caching" },
      { label: "C", text: "To manage database master/replica connections" },
      { label: "D", text: "To manage Supabase credentials" }
    ],
    correctIndex: 1,
    difficulty: "Medium"
  },
  // Hard (7)
  {
    text: "What occurs during a split-brain condition in a highly available (HA) cluster, and how is consensus achieved?",
    options: [
      { label: "A", text: "Memory parity failures; resolved by restarting node systems" },
      { label: "B", text: "Network partitions lead to multiple nodes claiming control/master status; resolved by quorum rules (e.g. Raft, Paxos)" },
      { label: "C", text: "CPU scheduling locks; resolved by watchdog timers" },
      { label: "D", text: "Invalid database joins; resolved by transaction rollbacks" }
    ],
    correctIndex: 1,
    difficulty: "Hard"
  },
  {
    text: "How does Kubernetes implement Pod Network isolation via NetworkPolicies?",
    options: [
      { label: "A", text: "By modifying root host server IP tables directly" },
      { label: "B", text: "Using label selectors to define ingress and egress traffic rules, enforced by the Container Network Interface (CNI) plugin" },
      { label: "C", text: "By allocating distinct ports to pods" },
      { label: "D", text: "By routing all traffic through the API server" }
    ],
    correctIndex: 1,
    difficulty: "Hard"
  },
  {
    text: "What is the purpose of 'state locking' when managing Terraform in a multi-developer team setup?",
    options: [
      { label: "A", text: "To restrict editing of local variables" },
      { label: "B", text: "To prevent concurrent execution of terraform apply actions from overwriting or corrupting the shared remote state file" },
      { label: "C", text: "To encrypt the state contents in git commits" },
      { label: "D", text: "To restrict infrastructure changes to master branches" }
    ],
    correctIndex: 1,
    difficulty: "Hard"
  },
  {
    text: "Under Kubernetes scheduling, what is the difference between Taints/Tolerations and NodeAffinity?",
    options: [
      { label: "A", text: "Taints force scheduling on nodes; Tolerations avoid them" },
      { label: "B", text: "Taints repel pods unless they tolerate them; NodeAffinity attracts pods based on labels" },
      { label: "C", text: "NodeAffinity is only evaluated after pods are launched" },
      { label: "D", text: "Taints are configuration maps; NodeAffinity is a network protocol" }
    ],
    correctIndex: 1,
    difficulty: "Hard"
  },
  {
    text: "In GitOps (e.g. ArgoCD), what is the difference between 'Self-Healing' and 'Prune' configuration options?",
    options: [
      { label: "A", text: "Self-healing checks pod CPU limits; Prune clears old logs" },
      { label: "B", text: "Self-healing automatically corrects drift towards git state; Prune deletes resources in cluster that are removed from git" },
      { label: "C", text: "Prune is only triggered manually during cluster outages" },
      { label: "D", text: "Self-healing restarts the ingress load balancer" }
    ],
    correctIndex: 1,
    difficulty: "Hard"
  },
  {
    text: "What is the purpose of mutual TLS (mTLS) in service mesh environments (like Istio)?",
    options: [
      { label: "A", text: "To encrypt data stored on persistent disks" },
      { label: "B", text: "To authenticate and encrypt all service-to-service communications using dual-sided certificate verification" },
      { label: "C", text: "To double the network throughput of ingress controllers" },
      { label: "D", text: "To enforce password constraints on database users" }
    ],
    correctIndex: 1,
    difficulty: "Hard"
  },
  {
    text: "What metric is most critical when tuning autoscaling behavior (HPA) for highly volatile queue-consumer microservices?",
    options: [
      { label: "A", text: "Pod CPU utilization limits" },
      { label: "B", text: "Queue length / lag metrics (e.g. RabbitMQ queue depth) via custom metrics API (Prometheus Adapter)" },
      { label: "C", text: "Server disk operations per second (IOPS)" },
      { label: "D", text: "Client network latency responses" }
    ],
    correctIndex: 1,
    difficulty: "Hard"
  }
];

// Helper to get questions for domain
export const getCuratedQuestions = (domain: string): Question[] => {
  switch (domain) {
    case "web":
      return webQuestions;
    case "ai":
      return aiQuestions;
    case "devops":
    case "cloud":
      return devopsQuestions;
    default:
      // Return a general software engineering bank
      return webQuestions;
  }
};
