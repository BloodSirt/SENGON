import type { Post, Comment, CreatorPostItem, TrendingTopic, FollowSuggestion } from '../types';

export const initialPost: Post = {
  id: "84912",
  categoryBreadcrumb: "Engineering & Architecture",
  creator: {
    name: "Marcus Chen",
    handle: "@marcus_dev",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    verified: true,
    roleLine: "Principal Architect @ Veloce Labs",
    location: "San Francisco, CA • UTC-7",
    bio: "Principal Architect @ Veloce Labs. Exploring high-frequency collaborative canvases, reactive CRDT networks, and edge WebAssembly engines.",
    followers: "34.8K",
    following: "412",
    views: "1.2M",
    isFollowing: false,
    mutuals: {
      text: "Followed by Elena Rostova, David K., and 18 mutual architects",
      avatars: [
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
      ]
    }
  },
  categoryTag: "Engineering",
  timeAgo: "3h ago",
  title: "Rebuilding our distributed layout canvas with reactive edge nodes ⚡️",
  summary: "After three months of stress testing latency across 24 global edge regions, here is how we cut canvas state synchronization down to 14ms using WASM-accelerated CRDTs and WebGPU rasterization pipelines. Deep dive into lattice topology, vector clock compression, and zero-allocation frame buffers.",
  hashtags: ["#WebPerformance", "#SystemArchitecture", "#FrontendEngineering", "#SengonTech"],
  slides: [
    {
      id: "s1",
      imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=85",
      altText: "Topology Cluster & Edge Ingestion Core Architecture",
      slideLabel: "SLIDE 01 / 04",
      captionTitle: "Topology Cluster & Edge Ingestion Core",
      badgeText: "3 Tags Detected",
      badgeIcon: "sell",
      tagline: "Global edge ingress handles 120k state deltas/sec with peer-to-peer relay",
      tags: ["Ingress Mesh", "QUIC Stream", "Lattice Node"],
      metrics: [
        { label: "P99 Sync", value: "13.8 ms", change: "-62%" },
        { label: "Edge Relay", value: "24 Regions", change: "Active" },
        { label: "Memory Footprint", value: "4.2 MB", change: "-34%" }
      ]
    },
    {
      id: "s2",
      imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=85",
      altText: "Realtime CRDT State Synchronization & Consensus Lattice",
      slideLabel: "SLIDE 02 / 04",
      captionTitle: "Realtime CRDT State Synchronization & Consensus",
      badgeText: "Verified Protocol",
      badgeIcon: "verified",
      tagline: "Conflict-free replicated data types compiled to WebAssembly with zero heap fragmentation",
      tags: ["Loro CRDT", "WASM Core", "Delta-State"],
      metrics: [
        { label: "Conflict Rate", value: "0.001%", change: "Zero Desync" },
        { label: "Throughput", value: "85k ops/s", change: "+140%" },
        { label: "Vector Compression", value: "8.4x", change: "Zstd Stream" }
      ]
    },
    {
      id: "s3",
      imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=85",
      altText: "WebGPU Direct Pipeline & Quad-Tree Layout Engine",
      slideLabel: "SLIDE 03 / 04",
      captionTitle: "WebGPU Direct Pipeline & Quad-Tree Engine",
      badgeText: "60 FPS Benchmark",
      badgeIcon: "bolt",
      tagline: "Hardware accelerated canvas rasterization bypassing the DOM compositing thread",
      tags: ["WGSL Shaders", "B-Tree Canvas", "Zero-Copy"],
      metrics: [
        { label: "Render Frame", value: "1.2 ms", change: "120 FPS capable" },
        { label: "Draw Calls", value: "4 / frame", change: "Instanced" },
        { label: "GPU VRAM", value: "18 MB", change: "Shared Buffer" }
      ]
    },
    {
      id: "s4",
      imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=85",
      altText: "Global Edge Benchmarks vs Legacy WebSocket architecture",
      slideLabel: "SLIDE 04 / 04",
      captionTitle: "Global Edge Benchmarks & Latency Map",
      badgeText: "24 Regions Measured",
      badgeIcon: "public",
      tagline: "Cross-region telemetry demonstrating sub-20ms roundtrip worldwide",
      tags: ["Telemetry", "Multi-Region", "Zero Packet Drop"],
      metrics: [
        { label: "US-East", value: "7.1 ms", change: "Fastest" },
        { label: "EU-Central", value: "12.4 ms", change: "Nominal" },
        { label: "AP-East", value: "16.8 ms", change: "Optimized" }
      ]
    }
  ],
  stats: {
    likes: 2418,
    comments: 382,
    reposts: 195,
    bookmarks: 847,
    views: "48.6K"
  },
  reactedAvatars: ["JD", "EK", "+18"]
};

export const initialComments: Comment[] = [
  {
    id: "c1",
    author: {
      name: "Elena Rostova",
      handle: "@elena_systems",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      verified: true,
      verifiedLabel: "Author Network"
    },
    timeAgo: "1h ago",
    content: "The memory layout optimization in Slide 02 is phenomenal. Curious how you prevent tombstone accumulation in long-lived collaborative canvas sessions without triggering periodic garbage-collection latency spikes?",
    likes: 142,
    isLiked: false,
    isStaffPick: true,
    timestamp: Date.now() - 3600000,
    replies: [
      {
        id: "r1",
        author: {
          name: "Marcus Chen",
          handle: "@marcus_dev",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          verified: true,
          verifiedLabel: "Author"
        },
        timeAgo: "45m ago",
        content: "Great observation Elena! We implemented sliding ephemeral epoch windows. Inactive deleted branch nodes are rolled into a compact Merkle root snapshot whenever all connected peer clocks surpass the compaction horizon. No stop-the-world pauses at all.",
        likes: 64,
        isLiked: false
      },
      {
        id: "r2",
        author: {
          name: "David Kim",
          handle: "@dkim_infra",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
          verified: false,
          verifiedLabel: "Edge Engineer"
        },
        timeAgo: "30m ago",
        content: "Can confirm this pattern works wonders. We ran a similar epoch-boundary sweep in our streaming telemetry engine. Sub-15ms sync across transatlantic peers is truly state of the art.",
        likes: 19,
        isLiked: false
      }
    ]
  },
  {
    id: "c2",
    author: {
      name: "Sophia Vance",
      handle: "@svance_gpu",
      avatar: "https://images.unsplash.com/photo-1534751516642-a1714f5a5b5a?w=150&auto=format&fit=crop&q=80",
      verified: true,
      verifiedLabel: "WebGPU WG"
    },
    timeAgo: "2h ago",
    content: "Bypassing the standard DOM rendering stack for a WGSL instanced quad-tree is a bold move, but the 1.2ms frame times speak for themselves. Are you compiling shader variants dynamically or pre-bundling unified compute kernels?",
    likes: 88,
    isLiked: false,
    isStaffPick: false,
    timestamp: Date.now() - 7200000,
    replies: []
  },
  {
    id: "c3",
    author: {
      name: "Tariq Al-Mansoor",
      handle: "@tariq_wasm",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      verified: true,
      verifiedLabel: "Rust Core"
    },
    timeAgo: "2h ago",
    content: "The zero-allocation frame buffer approach is textbook systems engineering applied to web browsers. Bookmarked this for our Q3 architectural review.",
    likes: 53,
    isLiked: false,
    isStaffPick: true,
    timestamp: Date.now() - 7800000,
    replies: []
  }
];

export const creatorMorePosts: CreatorPostItem[] = [
  {
    id: "p-01",
    title: "Benchmarking WebGPU vs WebGL2 on 10,000 vector node trees",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80",
    timeAgo: "4d ago",
    likes: "1.8K",
    comments: "214"
  },
  {
    id: "p-02",
    title: "Zero-copy binary protocols over WebTransport in Node 24",
    thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=200&auto=format&fit=crop&q=80",
    timeAgo: "2w ago",
    likes: "3.2K",
    comments: "438"
  },
  {
    id: "p-03",
    title: "Why we killed our Redis caching layer for SQLite on edge NVMe",
    thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&auto=format&fit=crop&q=80",
    timeAgo: "1m ago",
    likes: "5.1K",
    comments: "691"
  }
];

export const trendingTopics: TrendingTopic[] = [
  {
    id: "t1",
    category: "Architecture • Trending",
    topic: "WebAssembly 2.0 Spec",
    postsCount: "48.2K posts",
    isHot: true
  },
  {
    id: "t2",
    category: "Distributed Systems",
    topic: "CRDT State Sync",
    postsCount: "29.4K posts",
    isHot: true
  },
  {
    id: "t3",
    category: "Graphics & UI",
    topic: "WebGPU Rasterization",
    postsCount: "16.8K posts"
  },
  {
    id: "t4",
    category: "Edge Computing",
    topic: "QUIC + WebTransport",
    postsCount: "12.1K posts"
  },
  {
    id: "t5",
    category: "Systems Programming",
    topic: "Rust in Browser Engines",
    postsCount: "34.5K posts"
  }
];

export const whoToFollow: FollowSuggestion[] = [
  {
    id: "f1",
    name: "Dr. Aris Thorne",
    handle: "@aris_distributed",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    role: "Research Fellow @ Stanford Distributed Lab",
    verified: true,
    isFollowing: false
  },
  {
    id: "f2",
    name: "Klara Lindqvist",
    handle: "@klara_rust",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    role: "Core Contributor @ Tokio & Hyper",
    verified: true,
    isFollowing: false
  },
  {
    id: "f3",
    name: "Kenji Sato",
    handle: "@kenji_graphics",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
    role: "Compiler Engineer @ Khronos Group",
    verified: false,
    isFollowing: false
  }
];

export const relatedCircles: string[] = [
  "#DistributedSystems",
  "#EdgeComputing",
  "#WebPerf",
  "#RustLang",
  "#WebGPU",
  "#CRDT",
  "#WASM",
  "#HighThroughput"
];
