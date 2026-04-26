import { useState, useEffect, useRef } from "react";
import {
  Home, Compass, Heart, BookOpen, User,
  MapPin, ChevronDown, ChevronRight, ChevronLeft, Search, ArrowRight,
  SlidersHorizontal, Star, Clock, Calendar, X, Check, Plus, Minus,
  LayoutGrid, Map as MapIcon, List as ListIcon, BarChart3, Settings,
  Users, ShieldCheck, Tag, MoreHorizontal, ArrowUpRight, Eye, EyeOff,
  Pause, Trash2, Circle, CheckCircle2, AlertCircle, Sparkles,
  ChevronUp, Copy, Share2, Info, TrendingUp, DollarSign, Percent
} from "lucide-react";

/* ============================================================
   FONTS + GLOBAL STYLES
   ============================================================ */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700;800&family=DM+Sans:wght@300;400;500;600;700;800&family=Fraunces:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');

    * { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; box-sizing: border-box; }

    html, body, #root { margin: 0; padding: 0; min-height: 100%; }
    body {
      font-family: 'DM Sans', system-ui, sans-serif;
      color: #1E1E24;
      background: #F8F4EE;
    }

    /* ---- Base gradient: visible vertical shift, applied to the shell ---- */
    .miel-app-shell {
      position: relative;
      z-index: 2;
      background: linear-gradient(175deg, #FAF7F2 0%, #F2EAE0 55%, #EDE3D6 100%);
      min-height: 100vh;
    }

    /* ---- Background layer 2: ambient gradient ---- */
    .miel-bg-ambient {
      position: fixed; inset: 0; z-index: 0; pointer-events: none;
      background:
        radial-gradient(ellipse 90% 60% at 5% 0%, rgba(210,130,90,0.12) 0%, transparent 55%),
        radial-gradient(ellipse 70% 55% at 95% 5%, rgba(180,100,140,0.08) 0%, transparent 52%),
        radial-gradient(ellipse 55% 45% at 50% 100%, rgba(200,110,70,0.08) 0%, transparent 55%),
        linear-gradient(160deg, rgba(210,130,90,0.04) 0%, rgba(200,160,180,0.04) 100%);
      animation: miel-bg-drift 28s ease-in-out infinite alternate;
    }

    @keyframes miel-bg-drift {
      0%   { opacity: 0.70; transform: scale(1)    translateY(0px); }
      50%  { opacity: 0.95; transform: scale(1.04) translateY(-10px); }
      100% { opacity: 0.80; transform: scale(1.02) translateY(-5px); }
    }

    /* ---- Background layer 3: grain ---- */
    .miel-bg-grain {
      position: fixed; inset: 0; z-index: 1; pointer-events: none;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
      background-size: 180px 180px;
      opacity: 0.038;
      mix-blend-mode: multiply;
    }

    /* ---- Center spotlight ---- */
    .miel-bg-spotlight {
      position: fixed;
      inset: 0;
      z-index: 50;
      pointer-events: none;
      background:
        radial-gradient(ellipse 65% 50% at 50% 42%,
          rgba(240, 210, 190, 0.28) 0%,
          rgba(240, 210, 190, 0.10) 30%,
          transparent 60%),
        radial-gradient(ellipse 95% 80% at 50% 45%,
          transparent 55%,
          rgba(20, 10, 4, 0.05) 80%,
          rgba(20, 10, 4, 0.10) 100%);
      mix-blend-mode: soft-light;
    }

    /* ---- Primary button: warm sand — matches reference screenshots ---- */
    @keyframes miel-btn-drift {
      0%   { background-position: 0% 50%; }
      50%  { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    .btn-honey {
      position: relative;
      border-radius: 9999px;
      background: linear-gradient(160deg, #EED9A8 0%, #E8CE96 50%, #DFC07E 100%);
      background-size: 200% 200%;
      animation: miel-btn-drift 9s ease-in-out infinite;
      border: none;
      box-shadow: 0 2px 10px rgba(180, 140, 60, 0.18);
      color: #2a1e08;
      font-weight: 700;
      letter-spacing: -0.01em;
      transition: filter 160ms ease, box-shadow 160ms ease, transform 160ms ease;
    }
    .btn-honey:hover:not(:disabled) {
      filter: brightness(0.96);
      box-shadow: 0 3px 14px rgba(180, 140, 60, 0.24);
    }
    .btn-honey:active:not(:disabled) {
      filter: brightness(0.90);
      transform: scale(0.97);
      background: linear-gradient(160deg, #D4B882 0%, #C9A96C 50%, #BD9A58 100%);
    }
    .btn-honey:disabled { opacity: 0.40; cursor: not-allowed; }

    /* ---- Deal card ---- */
    .miel-card {
      background: #fffefb;
      border-radius: 15px;
      box-shadow:
        0 1px 2px rgba(40, 24, 6, 0.04),
        0 4px 16px rgba(40, 24, 6, 0.06);
      transition: box-shadow 220ms ease, transform 220ms ease;
      overflow: hidden;
    }
    .miel-card:hover { transform: translateY(-1px); }
    .miel-card:active { transform: translateY(0); }

    /* ---- Category pill ---- */
    .miel-pill { transition: all 200ms ease; }

    /* ---- Heart glow saved ---- */
    .heart-saved { filter: drop-shadow(0 0 4px rgba(202, 160, 0, 0.70)); }

    /* ---- Hide scrollbar on horizontal rails ---- */
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

    /* Carousel scroll behavior for horizontal rails */
    .miel-rail {
      scroll-snap-type: x mandatory;
      scroll-padding-left: 20px;
      -webkit-overflow-scrolling: touch;
    }
    .miel-rail > * {
      scroll-snap-align: start;
    }

    /* ---- Fade-up entry ---- */
    @keyframes miel-fade-up {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .miel-enter { animation: miel-fade-up 420ms cubic-bezier(0.2, 0.8, 0.2, 1) both; }

    /* ---- Spinner ---- */
    @keyframes miel-spin { to { transform: rotate(360deg); } }

    /* ---- Typography utils ---- */
    .font-logo { font-family: 'Space Grotesk', sans-serif; letter-spacing: -0.01em; }
    .font-display { font-family: 'Fraunces', serif; }
  `}</style>
);

/* ============================================================
   MOCK DATA
   ============================================================ */

const NEIGHBORHOODS = ["Williamsburg", "Greenpoint", "Bushwick"];

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "food", label: "Food & Drink" },
  { id: "fitness", label: "Fitness" },
  { id: "beauty", label: "Beauty" },
  { id: "experience", label: "Experiences" },
];

// Known evergreen Unsplash photo IDs
/* Real photos via picsum.photos (works in artifact sandbox).
   Seeded so each deal gets a consistent image. Not category-matched but real photography. */
const IMG = {
  rooftop: "https://picsum.photos/seed/miel-rooftop/800/600",
  cocktail: "https://picsum.photos/seed/miel-cocktail/800/600",
  coffee: "https://picsum.photos/seed/miel-coffee/800/600",
  latte: "https://picsum.photos/seed/miel-latte/800/600",
  wine: "https://picsum.photos/seed/miel-wine/800/600",
  natwine: "https://picsum.photos/seed/miel-natwine/800/600",
  pilates: "https://picsum.photos/seed/miel-pilates/800/600",
  yoga: "https://picsum.photos/seed/miel-yoga/800/600",
  sauna: "https://picsum.photos/seed/miel-sauna/800/600",
  spa: "https://picsum.photos/seed/miel-spa/800/600",
  facial: "https://picsum.photos/seed/miel-facial/800/600",
  pottery: "https://picsum.photos/seed/miel-pottery/800/600",
  ceramics: "https://picsum.photos/seed/miel-ceramics/800/600",
  ramen: "https://picsum.photos/seed/miel-ramen/800/600",
  kaiseki: "https://picsum.photos/seed/miel-kaiseki/800/600",
  brunch: "https://picsum.photos/seed/miel-brunch/800/600",
  woodfire: "https://picsum.photos/seed/miel-woodfire/800/600",
  tea: "https://picsum.photos/seed/miel-tea/800/600",
  vinyl: "https://picsum.photos/seed/miel-vinyl/800/600",
  pourover: "https://picsum.photos/seed/miel-pourover/800/600",
  barre: "https://picsum.photos/seed/miel-barre/800/600",
  brow: "https://picsum.photos/seed/miel-brow/800/600",
};

const DEALS = [
  {
    id: "kinfolk",
    name: "Kinfolk Rooftop",
    descriptor: "Rooftop cocktails at sunset",
    category: "food",
    subcategory: "Cocktail Bar",
    neighborhood: "Williamsburg",
    address: "78 Berry St, Brooklyn",
    image: IMG.rooftop,
    price: 30, originalPrice: 60,
    rating: 4.8, reviews: 73,
    spotsLeft: 2, totalSpots: 12,
    when: "Tonight · 6:30pm – 9:00pm",
    depositApplied: true,
    note: "Reserve a table on the top deck. Deposit counts toward your bar tab. Includes one curated welcome cocktail from our sundown menu.",
    collections: ["curated", "ending", "trending"],
    lat: 40.7181, lng: -73.9581
  },
  {
    id: "noir",
    name: "Noir Coffee Lab",
    descriptor: "Latte art masterclass from the best coffee you can drink",
    category: "food",
    subcategory: "Coffee",
    neighborhood: "Williamsburg",
    address: "164 N 11th St, Brooklyn",
    image: IMG.latte,
    price: 25, originalPrice: 50,
    rating: 4.8, reviews: 73,
    spotsLeft: 2, totalSpots: 6,
    when: "Sat · 10:00am – 11:30am",
    depositApplied: true,
    note: "A 90 minute hands on session with our head roaster. Pull your own shots, pour your own rosetta. Drinks included.",
    collections: ["curated", "trending"],
    lat: 40.7211, lng: -73.9573
  },
  {
    id: "velvet",
    name: "Velvet Room",
    descriptor: "Natural wine flight with the owner",
    category: "food",
    subcategory: "Wine Bar",
    neighborhood: "Williamsburg",
    address: "232 Metropolitan Ave, Brooklyn",
    image: IMG.natwine,
    price: 28, originalPrice: 55,
    rating: 4.9, reviews: 142,
    spotsLeft: 6, totalSpots: 10,
    when: "Fri · 7:00pm – 9:00pm",
    depositApplied: true,
    note: "Five pours guided by our sommelier. Small bites from the kitchen. Low intervention, high intention.",
    collections: ["curated", "trending"],
    lat: 40.7154, lng: -73.9578
  },
  {
    id: "halftone",
    name: "Halftone Records Bar",
    descriptor: "Vinyl listening bar, cocktail included",
    category: "food",
    subcategory: "Bar",
    neighborhood: "Williamsburg",
    address: "102 Havemeyer St, Brooklyn",
    image: IMG.vinyl,
    price: 22, originalPrice: 40,
    rating: 4.7, reviews: 58,
    spotsLeft: 3, totalSpots: 8,
    when: "Thu · 8:00pm – 11:00pm",
    depositApplied: true,
    note: "Request a side. Our resident DJ will queue it on the Klipsch rig. Includes one seasonal cocktail.",
    collections: ["ending", "trending"],
    lat: 40.7143, lng: -73.9589
  },
  {
    id: "moss",
    name: "Moss & Marble",
    descriptor: "Signature glow facial with cold stone finish",
    category: "beauty",
    subcategory: "Facial",
    neighborhood: "Williamsburg",
    address: "47 Grand St, Brooklyn",
    image: IMG.facial,
    price: 85, originalPrice: 140,
    rating: 4.9, reviews: 211,
    spotsLeft: 4, totalSpots: 6,
    when: "Sun · 2:00pm – 3:15pm",
    depositApplied: true,
    note: "A 75 minute facial tuned to your skin. Gua sha, LED, and a cold stone finish. Walk out with a lit from within glow.",
    collections: ["curated"],
    lat: 40.7138, lng: -73.9631
  },
  {
    id: "prism",
    name: "Prism Pilates",
    descriptor: "Reformer class for all levels",
    category: "fitness",
    subcategory: "Pilates",
    neighborhood: "Williamsburg",
    address: "350 Bedford Ave, Brooklyn",
    image: IMG.pilates,
    price: 18, originalPrice: 35,
    rating: 4.8, reviews: 189,
    spotsLeft: 5, totalSpots: 10,
    when: "Wed · 7:00am – 7:50am",
    depositApplied: false,
    note: "50 minute reformer session. Open to all levels. Mats, grippy socks, and cold towels provided.",
    collections: ["trending"],
    lat: 40.7145, lng: -73.9610
  },
  {
    id: "figment",
    name: "Figment Natural",
    descriptor: "Brow shaping and tint",
    category: "beauty",
    subcategory: "Brows",
    neighborhood: "Williamsburg",
    address: "211 N 4th St, Brooklyn",
    image: IMG.brow,
    price: 30, originalPrice: 55,
    rating: 4.7, reviews: 94,
    spotsLeft: 2, totalSpots: 4,
    when: "Sat · 1:00pm – 1:45pm",
    depositApplied: true,
    note: "A precise, no fuss shape tuned to your face. Includes tint and brush up kit to take home.",
    collections: ["ending"],
    lat: 40.7189, lng: -73.9562
  },
  {
    id: "salt",
    name: "Salt House",
    descriptor: "Ceramics workshop with dinner",
    category: "experience",
    subcategory: "Workshop",
    neighborhood: "Williamsburg",
    address: "88 Wythe Ave, Brooklyn",
    image: IMG.ceramics,
    price: 45, originalPrice: 90,
    rating: 4.9, reviews: 63,
    spotsLeft: 3, totalSpots: 8,
    when: "Sun · 5:00pm – 8:00pm",
    depositApplied: true,
    note: "Throw a vessel, share a meal. Three hours of clay, snacks, and quiet music. Pieces fired and delivered later.",
    collections: ["curated", "ending"],
    lat: 40.7213, lng: -73.9586
  },
  // GREENPOINT
  {
    id: "sundial",
    name: "Sundial Botanical",
    descriptor: "Apothecary brunch with herbal flight",
    category: "food",
    subcategory: "Brunch",
    neighborhood: "Greenpoint",
    address: "124 Franklin St, Brooklyn",
    image: IMG.brunch,
    price: 32, originalPrice: 60,
    rating: 4.8, reviews: 117,
    spotsLeft: 4, totalSpots: 10,
    when: "Sat · 11:00am – 1:00pm",
    depositApplied: true,
    note: "A seasonal brunch course paired with three herbal tonics from the apothecary shelf.",
    collections: ["curated", "trending"],
    lat: 40.7269, lng: -73.9531
  },
  {
    id: "northstar",
    name: "North Star Sauna",
    descriptor: "Sauna and cold plunge circuit",
    category: "experience",
    subcategory: "Wellness",
    neighborhood: "Greenpoint",
    address: "67 West St, Brooklyn",
    image: IMG.sauna,
    price: 40, originalPrice: 75,
    rating: 4.9, reviews: 204,
    spotsLeft: 2, totalSpots: 12,
    when: "Daily · 10:00am – 8:00pm",
    depositApplied: true,
    note: "90 minute circuit. Infrared, steam, cold plunge. Tea room included. Bring your own swimwear.",
    collections: ["curated", "trending", "ending"],
    lat: 40.7288, lng: -73.9591
  },
  {
    id: "paper",
    name: "Paper Crane Tea",
    descriptor: "Single origin tea tasting",
    category: "food",
    subcategory: "Tea",
    neighborhood: "Greenpoint",
    address: "191 Franklin St, Brooklyn",
    image: IMG.tea,
    price: 18, originalPrice: 35,
    rating: 4.7, reviews: 48,
    spotsLeft: 6, totalSpots: 8,
    when: "Sun · 3:00pm – 4:00pm",
    depositApplied: false,
    note: "Five teas across oolong, pu erh, and green. Paired with wagashi from our pastry case.",
    collections: ["curated"],
    lat: 40.7250, lng: -73.9538
  },
  {
    id: "lantern",
    name: "Lantern Yard",
    descriptor: "Chef's counter kaiseki tasting",
    category: "food",
    subcategory: "Tasting Menu",
    neighborhood: "Greenpoint",
    address: "54 Meserole Ave, Brooklyn",
    image: IMG.kaiseki,
    price: 65, originalPrice: 120,
    rating: 4.9, reviews: 88,
    spotsLeft: 2, totalSpots: 8,
    when: "Fri · 7:30pm – 9:30pm",
    depositApplied: true,
    note: "Eight course tasting at the counter. Seasonal. A quiet, long dinner. BYO is welcome.",
    collections: ["trending", "ending"],
    lat: 40.7293, lng: -73.9549
  },
  {
    id: "reverb",
    name: "Reverb Yoga",
    descriptor: "Sound bath with live analog synth",
    category: "fitness",
    subcategory: "Yoga",
    neighborhood: "Greenpoint",
    address: "209 Calyer St, Brooklyn",
    image: IMG.yoga,
    price: 25, originalPrice: 45,
    rating: 4.8, reviews: 132,
    spotsLeft: 8, totalSpots: 16,
    when: "Wed · 8:00pm – 9:00pm",
    depositApplied: false,
    note: "60 minutes of restorative yoga with live analog synth and bowls. Mats and bolsters provided.",
    collections: ["trending"],
    lat: 40.7262, lng: -73.9551
  },
  // BUSHWICK
  {
    id: "ember",
    name: "Ember House",
    descriptor: "Wood fired tasting with the chef",
    category: "food",
    subcategory: "Tasting Menu",
    neighborhood: "Bushwick",
    address: "412 Troutman St, Brooklyn",
    image: IMG.woodfire,
    price: 42, originalPrice: 80,
    rating: 4.8, reviews: 156,
    spotsLeft: 4, totalSpots: 10,
    when: "Sat · 8:00pm – 10:00pm",
    depositApplied: true,
    note: "A six course fire driven tasting. Chef cooks at the hearth. Natural wine pairings extra.",
    collections: ["curated", "trending"],
    lat: 40.7053, lng: -73.9251
  },
  {
    id: "dust",
    name: "Dust & Dew",
    descriptor: "Jade roller facial",
    category: "beauty",
    subcategory: "Facial",
    neighborhood: "Bushwick",
    address: "25 Irving Ave, Brooklyn",
    image: IMG.spa,
    price: 55, originalPrice: 100,
    rating: 4.9, reviews: 98,
    spotsLeft: 3, totalSpots: 5,
    when: "Sun · 12:00pm – 1:15pm",
    depositApplied: true,
    note: "75 minute facial with jade roller and gua sha. Calm room, long massage, slow finish.",
    collections: ["curated"],
    lat: 40.7007, lng: -73.9221
  },
  {
    id: "clay",
    name: "Clay & Coal",
    descriptor: "Pottery night with wine",
    category: "experience",
    subcategory: "Workshop",
    neighborhood: "Bushwick",
    address: "161 Bogart St, Brooklyn",
    image: IMG.pottery,
    price: 38, originalPrice: 70,
    rating: 4.7, reviews: 72,
    spotsLeft: 5, totalSpots: 12,
    when: "Fri · 6:30pm – 9:00pm",
    depositApplied: true,
    note: "Hand build a bowl or mug with a glass of natural wine. Everything fired and delivered in two weeks.",
    collections: ["ending", "trending"],
    lat: 40.7051, lng: -73.9328
  },
  {
    id: "aster",
    name: "Aster Studio",
    descriptor: "Barre class with live music",
    category: "fitness",
    subcategory: "Barre",
    neighborhood: "Bushwick",
    address: "1095 Flushing Ave, Brooklyn",
    image: IMG.barre,
    price: 15, originalPrice: 30,
    rating: 4.8, reviews: 84,
    spotsLeft: 9, totalSpots: 14,
    when: "Tue · 6:30pm – 7:25pm",
    depositApplied: false,
    note: "55 minute barre to a live DJ set. Grippy socks required, available at the front desk.",
    collections: ["trending"],
    lat: 40.7049, lng: -73.9334
  },
  {
    id: "slowhand",
    name: "Slow Hand",
    descriptor: "Ramen omakase at the counter",
    category: "food",
    subcategory: "Ramen",
    neighborhood: "Bushwick",
    address: "77 Starr St, Brooklyn",
    image: IMG.ramen,
    price: 35, originalPrice: 65,
    rating: 4.8, reviews: 203,
    spotsLeft: 2, totalSpots: 6,
    when: "Wed · 7:00pm – 9:00pm",
    depositApplied: true,
    note: "A four course ramen omakase. Chef builds each bowl in front of you. Seasonal broth.",
    collections: ["ending", "trending"],
    lat: 40.7059, lng: -73.9275
  },
  {
    id: "bandit",
    name: "Bandit Coffee",
    descriptor: "Pour over flight, three origins",
    category: "food",
    subcategory: "Coffee",
    neighborhood: "Bushwick",
    address: "1080 Wyckoff Ave, Brooklyn",
    image: IMG.pourover,
    price: 12, originalPrice: 22,
    rating: 4.7, reviews: 61,
    spotsLeft: 7, totalSpots: 10,
    when: "Daily · 8:00am – 11:00am",
    depositApplied: false,
    note: "Three pour overs side by side. Guided by the roaster. Pastry from our bakery included.",
    collections: ["curated"],
    lat: 40.7001, lng: -73.9179
  },
];

const INITIAL_BOOKINGS = [
  {
    id: "bkg-1001",
    dealId: "velvet",
    when: "Tonight · 7:00pm",
    paid: 28,
    status: "upcoming",
  },
];

/* ============================================================
   SHARED UTILITIES
   ============================================================ */

const scrollToTop = () => {
  try { window.scrollTo({ top: 0, behavior: "instant" }); } catch (_) { window.scrollTo(0, 0); }
};

const formatPrice = (n) => `$${n}`;

/* ============================================================
   LOW-LEVEL COMPONENTS
   ============================================================ */

/* DealImage: tries the photo URL first, falls back to designed gradient art per deal.
   Drop-in replacement for <img> — accepts className and style and renders to fill its parent. */
function DealImage({ deal, className = "", style = {}, rounded = 0 }) {
  const [errored, setErrored] = useState(false);

  if (!errored && deal.image) {
    return (
      <img
        src={deal.image}
        alt={deal.name}
        className={className}
        style={{ ...style, borderRadius: rounded || style.borderRadius, objectFit: "cover" }}
        onError={() => setErrored(true)}
        loading="lazy"
      />
    );
  }

  // Fallback: deterministic gradient art per deal
  const PALETTES = {
    "Food & Drink": [
      { a: "#3a1d0a", b: "#a85a1e", c: "#f4c478", d: "#fde3a8" },
      { a: "#2b1206", b: "#8b3a14", c: "#e89854", d: "#fad5a0" },
      { a: "#4a2410", b: "#c97843", c: "#ffb87a", d: "#ffe2c0" },
      { a: "#321509", b: "#94481a", c: "#eba868", d: "#fbd9a0" },
    ],
    "Fitness": [
      { a: "#1a2a2e", b: "#3d6a6e", c: "#88b8b8", d: "#cce8e8" },
      { a: "#142028", b: "#3d5a78", c: "#7ba0c4", d: "#bcd6e8" },
      { a: "#1f2a26", b: "#4a7060", c: "#9cc4a8", d: "#d4ead8" },
    ],
    "Beauty": [
      { a: "#3d1c2a", b: "#8b4060", c: "#d490a8", d: "#f4d4dc" },
      { a: "#2e1f30", b: "#6e4868", c: "#b894a8", d: "#e4cdd4" },
      { a: "#3a1f24", b: "#9a5260", c: "#d894a0", d: "#f4d0d4" },
    ],
    "Experiences": [
      { a: "#1f2438", b: "#4a5078", c: "#8a90b8", d: "#c8cce0" },
      { a: "#2a2030", b: "#5d4470", c: "#9c84a8", d: "#d4c0d4" },
      { a: "#1f3038", b: "#406470", c: "#88a8b4", d: "#c8dce0" },
    ],
  };

  let h = 0;
  for (let i = 0; i < deal.name.length; i++) h = ((h * 31) + deal.name.charCodeAt(i)) | 0;
  const seed = Math.abs(h);

  const palettes = PALETTES[deal.category] || PALETTES["Food & Drink"];
  const p = palettes[seed % palettes.length];

  const x1 = 18 + (seed % 28);
  const y1 = 18 + ((seed >> 2) % 28);
  const x2 = 55 + (seed % 30);
  const y2 = 55 + ((seed >> 3) % 30);
  const x3 = 25 + ((seed >> 4) % 50);
  const y3 = 78 + ((seed >> 5) % 18);

  const initials = deal.name.split(" ").slice(0, 2).map(w => w[0]).join("");

  return (
    <div
      className={className}
      style={{
        ...style,
        borderRadius: rounded || style.borderRadius,
        background: `
          radial-gradient(ellipse 65% 55% at ${x1}% ${y1}%, ${p.d} 0%, transparent 50%),
          radial-gradient(ellipse 75% 65% at ${x2}% ${y2}%, ${p.c} 0%, transparent 55%),
          radial-gradient(ellipse 60% 50% at ${x3}% ${y3}%, ${p.b} 0%, transparent 60%),
          linear-gradient(135deg, ${p.a} 0%, ${p.b} 100%)
        `,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "120px 120px",
          opacity: 0.12,
          mixBlendMode: "overlay",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 600,
          fontSize: "30%",
          color: "rgba(255, 250, 240, 0.92)",
          letterSpacing: "-0.02em",
          textShadow: "0 2px 24px rgba(0,0,0,0.30)",
          pointerEvents: "none",
          lineHeight: 1,
        }}
      >
        {initials}
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.18) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

function HoneyButton({ children, onClick, disabled, size = "lg", fullWidth = true, className = "", style = {} }) {
  const sizes = {
    lg: { height: 54, fontSize: 16 },
    md: { height: 48, fontSize: 14 },
    sm: { height: 40, fontSize: 13 },
  };
  const s = sizes[size];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn-honey relative flex items-center justify-center gap-2 ${fullWidth ? "w-full" : ""} ${className}`}
      style={{ height: s.height, fontSize: s.fontSize, paddingLeft: 20, paddingRight: 20, ...style }}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
}

function GhostButton({ children, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-center gap-2 rounded-full transition-colors ${className}`}
      style={{
        height: 48,
        fontSize: 14,
        fontWeight: 600,
        color: "#2d3035",
        background: "rgba(255,255,255,0.5)",
        border: "1px solid rgba(185, 145, 70, 0.16)",
      }}
    >
      {children}
    </button>
  );
}

function HeartButton({ saved, onClick, size = 36 }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      className="rounded-full flex items-center justify-center transition-transform active:scale-90"
      style={{
        width: size, height: size,
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        boxShadow: "none",
        border: "1px solid rgba(40,24,6,0.06)",
      }}
      aria-label={saved ? "Unsave" : "Save"}
    >
      <Heart
        className={saved ? "heart-saved" : ""}
        style={{
          width: size * 0.5, height: size * 0.5,
          color: saved ? "#eab308" : "rgba(108,111,122,1)",
          fill: saved ? "#eab308" : "none",
          strokeWidth: 2,
          transition: "color 160ms ease, fill 160ms ease",
        }}
      />
    </button>
  );
}

function SpotsBadge({ spots, position = "bottom-center" }) {
  const posStyle = position === "top-left"
    ? { top: 10, left: 10 }
    : { bottom: 10, left: "50%", transform: "translateX(-50%)" };

  return (
    <div
      className="absolute rounded-full"
      style={{
        ...posStyle,
        padding: "4px 12px",
        background: "rgba(20, 10, 0, 0.38)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        border: "1px solid rgba(255,255,255,0.10)",
        fontSize: 11,
        fontWeight: 700,
        color: "#ffffff",
        letterSpacing: "0.01em",
        whiteSpace: "nowrap",
      }}
    >
      {spots} spot{spots === 1 ? "" : "s"} left
    </div>
  );
}

function StarRow({ rating, reviews, size = "md" }) {
  const sz = size === "sm" ? 11 : 12;
  const starSz = size === "sm" ? 12 : 14;
  return (
    <div className="flex items-center gap-1">
      <Star style={{ width: starSz, height: starSz, color: "#FFB300", fill: "#FFB300" }} />
      <span style={{ fontSize: sz, fontWeight: 500, color: "#2d3035" }}>{rating}</span>
      <span style={{ fontSize: sz, fontWeight: 300, color: "rgba(108,111,122,0.60)" }}>({reviews})</span>
    </div>
  );
}

function PriceRow({ price, originalPrice, size = "md" }) {
  const priceSz = size === "sm" ? 15 : 17;
  const origSz = size === "sm" ? 12 : 13;
  return (
    <div className="flex items-center gap-1.5">
      <span style={{ fontSize: priceSz, fontWeight: 800, color: "#2d3035", letterSpacing: "-0.02em" }}>{formatPrice(price)}</span>
      <span style={{ fontSize: origSz, fontWeight: 400, color: "rgba(108,111,122,0.45)", textDecoration: "line-through" }}>
        {formatPrice(originalPrice)}
      </span>
    </div>
  );
}

function DealCard({ deal, saved, onToggleSave, onOpen, variant = "standard", width }) {
  const compact = variant === "compact";
  const imgHeight = compact ? 110 : 160;
  const padding = compact ? { padding: "10px 12px 12px" } : { padding: "12px 16px 16px" };
  const nameSize = compact ? 13 : 15;
  const descSize = compact ? 10 : 11.5;

  return (
    <button
      onClick={onOpen}
      className="miel-card relative text-left block"
      style={{ width: width || "100%", flex: "0 0 auto" }}
    >
      <div className="relative" style={{ height: imgHeight }}>
        <DealImage
          deal={deal}
          className="w-full h-full"
          style={{ borderRadius: "15px 15px 0 0" }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius: "15px 15px 0 0",
            background: "linear-gradient(to top, rgba(20,12,4,0.28) 0%, rgba(20,12,4,0.04) 40%, transparent 70%)",
          }}
        />
        {deal.spotsLeft <= 3 && <SpotsBadge spots={deal.spotsLeft} position="top-left" />}
        <div className="absolute top-3 right-3 z-10">
          <HeartButton saved={saved} onClick={onToggleSave} />
        </div>
      </div>
      <div style={padding}>
        <div style={{ marginBottom: compact ? 4 : 6 }}>
          <StarRow rating={deal.rating} reviews={deal.reviews} size={compact ? "sm" : "md"} />
        </div>
        <div
          style={{
            fontSize: nameSize,
            fontWeight: 800,
            color: "#2d3035",
            letterSpacing: "-0.02em",
          }}
          className="truncate"
        >
          {deal.name}
        </div>
        <div
          style={{
            fontSize: descSize,
            fontWeight: 400,
            color: "rgba(108,111,122,0.78)",
            marginTop: 2,
            lineHeight: 1.35,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {compact
            ? `${deal.when.split("·")[0].trim()} · ${deal.spotsLeft} spots`
            : `${deal.descriptor} · ${deal.spotsLeft} spots`}
        </div>
        <div className="flex items-center justify-end" style={{ marginTop: compact ? 8 : 10 }}>
          <PriceRow price={deal.price} originalPrice={deal.originalPrice} size={compact ? "sm" : "md"} />
        </div>
      </div>
    </button>
  );
}

function CategoryPills({ active, onChange, categories = CATEGORIES }) {
  return (
    <div className="flex gap-2 px-5 overflow-x-auto no-scrollbar" style={{ paddingBottom: 4 }}>
      {categories.map((c) => {
        const isActive = c.id === active;
        return (
          <button
            key={c.id}
            onClick={() => onChange(c.id)}
            className="miel-pill flex-shrink-0 rounded-full"
            style={{
              padding: "8px 18px",
              fontSize: 13,
              background: isActive ? "rgba(200,165,80,0.12)" : "transparent",
              color: isActive ? "#4A3208" : "#7a6b5a",
              fontWeight: isActive ? 700 : 500,
              border: `1px solid ${isActive ? "rgba(175,145,50,0.18)" : "rgba(120,100,70,0.16)"}`,
              boxShadow: "none",
              whiteSpace: "nowrap",
              transition: "background 180ms ease, color 180ms ease, border-color 180ms ease",
            }}
          >
            {c.label}
          </button>
        );
      })}
    </div>
  );
}

function SectionHeader({ title, onSeeAll }) {
  return (
    <div className="flex items-center justify-between" style={{ padding: "0 20px", marginBottom: 12 }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, color: "#2d3035", letterSpacing: "-0.02em" }}>{title}</h2>
      {onSeeAll && (
        <button onClick={onSeeAll} className="flex items-center gap-1" style={{ fontSize: 13, fontWeight: 600, color: "#8C6914" }}>
          See all <ArrowRight style={{ width: 14, height: 14 }} />
        </button>
      )}
    </div>
  );
}

function SeeAllButton({ onClick }) {
  return (
    <button onClick={onClick} className="flex items-center gap-1" style={{ fontSize: 13, fontWeight: 600, color: "#8C6914" }}>
      See all <ArrowRight style={{ width: 14, height: 14 }} />
    </button>
  );
}

/* ============================================================
   LOCATION SELECTOR
   ============================================================ */

function LocationSelector({ value, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5"
        style={{ fontSize: 13, fontWeight: 600, color: "#2d3035" }}
      >
        <MapPin style={{ width: 14, height: 14, color: "#8C6914" }} />
        <span>{value}, New York</span>
        <ChevronDown style={{ width: 14, height: 14, color: "rgba(108,111,122,0.7)" }} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute left-0 z-50 miel-enter"
            style={{
              top: 28,
              minWidth: 200,
              background: "#fffefb",
              borderRadius: 14,
              boxShadow: "0 8px 28px rgba(40,24,6,0.14), 0 0 0 1px rgba(175,148,58,0.16)",
              padding: 6,
            }}
          >
            {NEIGHBORHOODS.map((n) => (
              <button
                key={n}
                onClick={() => { onChange(n); setOpen(false); }}
                className="w-full text-left rounded-lg transition-colors"
                style={{
                  padding: "10px 12px",
                  fontSize: 13,
                  fontWeight: n === value ? 700 : 500,
                  color: n === value ? "#8C6914" : "#2d3035",
                  background: n === value ? "rgba(245,228,188,0.5)" : "transparent",
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ============================================================
   BOTTOM NAVIGATION
   ============================================================ */

function BottomNav({ active, onChange }) {
  const items = [
    { id: "home", icon: Home, label: "Home" },
    { id: "explore", icon: Compass, label: "Explore" },
    { id: "saved", icon: Heart, label: "Saved" },
    { id: "bookings", icon: BookOpen, label: "Bookings" },
    { id: "profile", icon: User, label: "Profile" },
  ];
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40"
      style={{
        background: "rgba(251,249,244,0.75)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(175,148,58,0.16)",
      }}
    >
      <div className="mx-auto" style={{ maxWidth: 440, height: 64, padding: "8px 0 12px", display: "flex", justifyContent: "space-around" }}>
        {items.map((it) => {
          const Icon = it.icon;
          const isActive = active === it.id;
          return (
            <button
              key={it.id}
              onClick={() => onChange(it.id)}
              className="flex flex-col items-center gap-1"
              style={{ flex: 1 }}
            >
              <Icon
                style={{
                  width: 24, height: 24,
                  color: isActive ? "#8C6914" : "rgba(90,90,106,0.45)",
                  fill: "none",
                  strokeWidth: 2,
                }}
              />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: isActive ? 700 : 600,
                  color: isActive ? "#8C6914" : "rgba(90,90,106,0.45)",
                }}
              >
                {it.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   SCROLL REVEAL
   Wraps any section. On intersection enter: fades in + slides up.
   On exit at top: fades out + slides up. On exit at bottom: resets
   to below-fold state (no transition) so re-entry always animates.
   Uses a rootMargin so items fully enter before triggering.
   ============================================================ */

function ScrollReveal({ children, style = {}, delay = 0 }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    // Elements starting below the fold begin invisible
    const initialRect = el.getBoundingClientRect();
    if (initialRect.top > window.innerHeight * 0.92) {
      el.style.opacity = "0";
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transition = `opacity 480ms ease ${delay}ms`;
          el.style.opacity = "1";
        } else {
          const rect = el.getBoundingClientRect();
          if (rect.top < 0) {
            // Leaving through top — fade out
            el.style.transition = "opacity 320ms ease";
            el.style.opacity = "0";
          } else {
            // Below viewport — snap invisible, no animation
            el.style.transition = "none";
            el.style.opacity = "0";
          }
        }
      },
      { threshold: 0.08, rootMargin: "-32px 0px -48px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} style={style}>
      {children}
    </div>
  );
}

/* ============================================================
   HOME (DISCOVER)
   ============================================================ */

function HomeScreen({ location, setLocation, category, setCategory, savedIds, toggleSaved, openDeal, goTo }) {
  const deals = DEALS.filter((d) =>
    (category === "all" || d.category === category) && (!location || d.neighborhood === location)
  );
  const curated = deals.filter((d) => d.collections.includes("curated"));
  const ending = deals.filter((d) => d.collections.includes("ending"));
  const trending = deals.filter((d) => d.collections.includes("trending"));

  return (
    <div className="miel-enter">
      {/* Top bar */}
      <div style={{ padding: "16px 20px 14px" }}>
        <LocationSelector value={location} onChange={setLocation} />
      </div>

      {/* Category pills */}
      <div style={{ marginBottom: 28 }}>
        <CategoryPills active={category} onChange={setCategory} />
      </div>

      {/* Curated */}
      {curated.length > 0 && (
        <ScrollReveal style={{ marginBottom: 28 }}>
          <SectionHeader title="Curated for You" onSeeAll={() => goTo({ name: "explore" })} />
          <div className="flex gap-3 overflow-x-auto no-scrollbar miel-rail" style={{ padding: "2px 20px 8px" }}>
            {curated.map((d) => (
              <div key={d.id} style={{ width: "min(252px, calc((100vw - 56px) * 0.7))", flexShrink: 0 }}>
                <DealCard deal={d} saved={savedIds.has(d.id)} onToggleSave={() => toggleSaved(d.id)} onOpen={() => openDeal(d.id)} />
              </div>
            ))}
          </div>
        </ScrollReveal>
      )}

      {/* Ending Soon */}
      {ending.length > 0 && (
        <ScrollReveal style={{ marginBottom: 28 }}>
          <SectionHeader title="Ending Soon" onSeeAll={() => goTo({ name: "explore" })} />
          <div className="flex gap-3 overflow-x-auto no-scrollbar miel-rail" style={{ padding: "2px 20px 8px" }}>
            {ending.map((d) => (
              <div key={d.id} style={{ width: "min(360px, calc(100vw - 56px))", flexShrink: 0 }}>
                <DealCard deal={d} saved={savedIds.has(d.id)} onToggleSave={() => toggleSaved(d.id)} onOpen={() => openDeal(d.id)} />
              </div>
            ))}
          </div>
        </ScrollReveal>
      )}

      {/* Trending Now */}
      {trending.length > 0 && (
        <ScrollReveal style={{ marginBottom: 28 }}>
          <SectionHeader title="Trending Now" onSeeAll={() => goTo({ name: "explore" })} />
          <div className="flex gap-3 overflow-x-auto no-scrollbar miel-rail" style={{ padding: "2px 20px 8px" }}>
            {trending.map((d) => (
              <div key={d.id} style={{ width: "min(252px, calc((100vw - 56px) * 0.7))", flexShrink: 0 }}>
                <DealCard deal={d} saved={savedIds.has(d.id)} onToggleSave={() => toggleSaved(d.id)} onOpen={() => openDeal(d.id)} />
              </div>
            ))}
          </div>
        </ScrollReveal>
      )}

      {/* All Deals */}
      <div style={{ paddingBottom: 96 }}>
        <ScrollReveal>
          <SectionHeader title="All Deals" />
        </ScrollReveal>
        <div className="flex flex-col gap-3" style={{ padding: "0 20px" }}>
          {deals.map((d, i) => (
            <ScrollReveal key={d.id} delay={i < 4 ? i * 60 : 0}>
              <DealCard deal={d} saved={savedIds.has(d.id)} onToggleSave={() => toggleSaved(d.id)} onOpen={() => openDeal(d.id)} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   EXPLORE — list + map
   ============================================================ */

function ExploreScreen({ location, setLocation, savedIds, toggleSaved, openDeal }) {
  const [query, setQuery] = useState("");
  const [view, setView] = useState("list");
  const [sortOpen, setSortOpen] = useState(false);
  const [sort, setSort] = useState("recommended");

  const sortOptions = [
    { id: "recommended", label: "Recommended" },
    { id: "ending", label: "Ending soonest" },
    { id: "price-low", label: "Price, low to high" },
    { id: "price-high", label: "Price, high to low" },
    { id: "rating", label: "Highest rated" },
  ];

  const filtered = DEALS
    .filter((d) => d.neighborhood === location)
    .filter((d) => !query || (d.name + " " + d.descriptor + " " + d.subcategory).toLowerCase().includes(query.toLowerCase()));

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "price-low") return a.price - b.price;
    if (sort === "price-high") return b.price - a.price;
    if (sort === "rating") return b.rating - a.rating;
    if (sort === "ending") return a.spotsLeft - b.spotsLeft;
    return 0;
  });

  return (
    <div className="miel-enter">
      {/* Top bar */}
      <div style={{ padding: "16px 20px 10px" }}>
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-2 flex-1"
            style={{
              height: 44,
              padding: "0 14px",
              borderRadius: 12,
              background: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(175,148,58,0.16)",
              boxShadow: "0 1px 4px rgba(40,24,6,0.04)",
            }}
          >
            <Search style={{ width: 16, height: 16, color: "rgba(108,111,122,0.7)" }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${location}`}
              className="flex-1 bg-transparent outline-none"
              style={{ fontSize: 14, fontWeight: 500, color: "#2d3035" }}
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setSortOpen((o) => !o)}
              className="rounded-xl flex items-center justify-center"
              style={{
                width: 44, height: 44,
                background: "rgba(255,255,255,0.7)",
                border: "1px solid rgba(175,148,58,0.16)",
              }}
            >
              <SlidersHorizontal style={{ width: 16, height: 16, color: "#2d3035" }} />
            </button>
            {sortOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setSortOpen(false)} />
                <div
                  className="absolute right-0 z-50 miel-enter"
                  style={{
                    top: 52, minWidth: 220,
                    background: "#fffefb",
                    borderRadius: 14,
                    boxShadow: "0 8px 28px rgba(40,24,6,0.14), 0 0 0 1px rgba(175,148,58,0.16)",
                    padding: 6,
                  }}
                >
                  <div style={{ padding: "8px 12px 4px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "rgba(108,111,122,0.6)", letterSpacing: "0.1em" }}>Sort</div>
                  {sortOptions.map((o) => (
                    <button
                      key={o.id}
                      onClick={() => { setSort(o.id); setSortOpen(false); }}
                      className="w-full text-left rounded-lg"
                      style={{
                        padding: "10px 12px",
                        fontSize: 13,
                        fontWeight: sort === o.id ? 700 : 500,
                        color: sort === o.id ? "#8C6914" : "#2d3035",
                        background: sort === o.id ? "rgba(245,228,188,0.5)" : "transparent",
                      }}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <LocationSelector value={location} onChange={setLocation} />
        </div>
      </div>

      {/* List / Map toggle centered */}
      <div className="flex justify-center" style={{ padding: "4px 0 16px" }}>
        <div
          className="flex items-center"
          style={{
            padding: 4,
            borderRadius: 999,
            background: "rgba(255,255,255,0.6)",
            border: "1px solid rgba(175,148,58,0.16)",
            boxShadow: "inset 0 1px 2px rgba(40,24,6,0.04)",
          }}
        >
          {[
            { id: "list", icon: ListIcon, label: "List" },
            { id: "map", icon: MapIcon, label: "Map" },
          ].map((b) => {
            const Icon = b.icon;
            const active = view === b.id;
            return (
              <button
                key={b.id}
                onClick={() => setView(b.id)}
                className="flex items-center gap-1.5 rounded-full transition-all"
                style={{
                  padding: "6px 14px",
                  fontSize: 13,
                  fontWeight: active ? 700 : 500,
                  color: active ? "#4A3208" : "#6e5e4a",
                  background: active ? "rgba(200,165,80,0.12)" : "transparent",
                  boxShadow: active ? "0 1px 3px rgba(40,24,6,0.10)" : "none",
                }}
              >
                <Icon style={{ width: 13, height: 13 }} />
                {b.label}
              </button>
            );
          })}
        </div>
      </div>

      {view === "list" ? (
        <div style={{ paddingBottom: 96 }} className="miel-enter">
          <div className="grid grid-cols-2 gap-3" style={{ padding: "0 20px" }}>
            {sorted.map((d) => (
              <DealCard
                key={d.id}
                deal={d}
                saved={savedIds.has(d.id)}
                onToggleSave={() => toggleSaved(d.id)}
                onOpen={() => openDeal(d.id)}
                variant="compact"
              />
            ))}
          </div>
        </div>
      ) : (
        <ExploreMap
          deals={sorted}
          location={location}
          savedIds={savedIds}
          toggleSaved={toggleSaved}
          openDeal={openDeal}
        />
      )}
    </div>
  );
}

/* ============================================================
   MAP (stylized, no library)
   ============================================================ */

function ExploreMap({ deals, location, savedIds, toggleSaved, openDeal }) {
  const [selected, setSelected] = useState(deals[0]?.id || null);
  const selectedDeal = deals.find((d) => d.id === selected);

  // Project lat/lng into a relative x/y inside a soft area
  // Use min/max of the filtered deals
  const lats = deals.map((d) => d.lat);
  const lngs = deals.map((d) => d.lng);
  const minLat = Math.min(...lats) - 0.002;
  const maxLat = Math.max(...lats) + 0.002;
  const minLng = Math.min(...lngs) - 0.002;
  const maxLng = Math.max(...lngs) + 0.002;

  const project = (lat, lng) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = (1 - (lat - minLat) / (maxLat - minLat)) * 100;
    return { x, y };
  };

  return (
    <div className="miel-enter" style={{ padding: "0 20px 96px" }}>
      <div
        className="relative overflow-hidden"
        style={{
          height: 480,
          borderRadius: 20,
          background:
            "radial-gradient(circle at 30% 20%, #fef6e3 0%, #f6ebd4 40%, #ecdcb8 100%)",
          border: "1px solid rgba(175,148,58,0.16)",
          boxShadow: "0 8px 28px rgba(40,24,6,0.10), 0 0 0 1px rgba(175,148,58,0.16)",
        }}
      >
        {/* Streets / water stylization */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
          {/* Waterways (East River / Newtown Creek) */}
          <path d="M -5 15 Q 20 18 50 12 T 105 20" fill="none" stroke="#d7e4d6" strokeWidth="6" strokeLinecap="round" opacity="0.5" />
          <path d="M -5 15 Q 20 18 50 12 T 105 20" fill="none" stroke="#e6efe6" strokeWidth="3" strokeLinecap="round" opacity="0.9" />

          {/* Grid of soft streets */}
          {[25, 35, 45, 55, 65, 75, 85].map((y) => (
            <line key={`h${y}`} x1="0" y1={y} x2="100" y2={y} stroke="rgba(255,255,255,0.55)" strokeWidth="0.3" />
          ))}
          {[15, 25, 35, 45, 55, 65, 75, 85].map((x) => (
            <line key={`v${x}`} x1={x} y1="10" x2={x + 3} y2="95" stroke="rgba(255,255,255,0.55)" strokeWidth="0.3" />
          ))}

          {/* Parks */}
          <ellipse cx="68" cy="42" rx="6" ry="4" fill="#d9e5cf" opacity="0.5" />
          <ellipse cx="25" cy="72" rx="4" ry="3" fill="#d9e5cf" opacity="0.5" />
        </svg>

        {/* Neighborhood label */}
        <div
          className="absolute"
          style={{
            top: 14, left: 14,
            padding: "6px 12px",
            background: "rgba(255,254,251,0.9)",
            backdropFilter: "blur(8px)",
            borderRadius: 999,
            border: "1px solid rgba(175,148,58,0.16)",
            fontSize: 12,
            fontWeight: 700,
            color: "#2d3035",
            letterSpacing: "-0.01em",
          }}
        >
          {location}
        </div>

        {/* Markers */}
        {deals.map((d) => {
          const { x, y } = project(d.lat, d.lng);
          const isSelected = d.id === selected;
          return (
            <button
              key={d.id}
              onClick={() => setSelected(d.id)}
              className="absolute"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: `translate(-50%, -50%) ${isSelected ? "scale(1.08)" : ""}`,
                transition: "transform 200ms ease",
                zIndex: isSelected ? 10 : 1,
              }}
            >
              <div
                className="rounded-full overflow-hidden"
                style={{
                  width: 48, height: 48,
                  border: `3px solid ${isSelected ? "#8C6914" : "#fffefb"}`,
                  boxShadow: isSelected
                    ? "0 6px 16px rgba(175,145,50,0.45), 0 0 0 1px rgba(175,148,58,0.16)"
                    : "0 4px 10px rgba(40,24,6,0.22), 0 0 0 1px rgba(175,148,58,0.16)",
                }}
              >
                <DealImage deal={d} className="w-full h-full" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Preview card */}
      {selectedDeal && (
        <div className="miel-enter" style={{ marginTop: 14 }} key={selectedDeal.id}>
          <div className="miel-card flex gap-3" style={{ padding: 10 }}>
            <div className="relative flex-shrink-0">
              <DealImage
                deal={selectedDeal}
                style={{ width: 96, height: 96, borderRadius: 12 }}
              />
              {selectedDeal.spotsLeft <= 3 && (
                <div
                  className="absolute"
                  style={{
                    top: 6, left: 6,
                    padding: "2px 6px",
                    borderRadius: 999,
                    background: "rgba(20,10,0,0.4)",
                    backdropFilter: "blur(8px)",
                    fontSize: 9,
                    fontWeight: 700,
                    color: "#fff",
                  }}
                >
                  {selectedDeal.spotsLeft} left
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-between" style={{ padding: "2px 2px 2px 0" }}>
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#2d3035", letterSpacing: "-0.02em" }} className="truncate">
                    {selectedDeal.name}
                  </div>
                  <HeartButton saved={savedIds.has(selectedDeal.id)} onClick={() => toggleSaved(selectedDeal.id)} size={26} />
                </div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 400,
                    color: "rgba(108,111,122,0.78)",
                    marginTop: 2,
                    lineHeight: 1.35,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {selectedDeal.descriptor}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <PriceRow price={selectedDeal.price} originalPrice={selectedDeal.originalPrice} size="sm" />
                <button
                  onClick={() => openDeal(selectedDeal.id)}
                  className="flex items-center gap-1"
                  style={{ fontSize: 12, fontWeight: 700, color: "#8C6914" }}
                >
                  View deal <ChevronRight style={{ width: 12, height: 12 }} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   SAVED
   ============================================================ */

function SavedScreen({ savedIds, toggleSaved, openDeal, goTo }) {
  const deals = DEALS.filter((d) => savedIds.has(d.id));
  return (
    <div className="miel-enter">
      <div style={{ padding: "20px 20px 18px" }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#2d3035", letterSpacing: "-0.02em" }}>Saved deals</h1>
        <div style={{ fontSize: 13, fontWeight: 400, color: "rgba(108,111,122,0.65)", marginTop: 2 }}>
          {deals.length} saved
        </div>
      </div>
      {deals.length === 0 ? (
        <div style={{ padding: "60px 20px 96px" }} className="text-center">
          <div
            className="mx-auto flex items-center justify-center rounded-full"
            style={{
              width: 64, height: 64,
              background: "rgba(252,233,168,0.6)",
              border: "1px solid rgba(175,148,58,0.16)",
            }}
          >
            <Heart style={{ width: 28, height: 28, color: "#8C6914" }} />
          </div>
          <div style={{ fontSize: 17, fontWeight: 800, color: "#2d3035", marginTop: 18, letterSpacing: "-0.02em" }}>
            Nothing saved yet
          </div>
          <div style={{ fontSize: 13, fontWeight: 400, color: "rgba(108,111,122,0.55)", marginTop: 4, marginBottom: 22 }}>
            Tap the heart on deals you like
          </div>
          <div style={{ maxWidth: 240, margin: "0 auto" }}>
            <HoneyButton size="md" onClick={() => goTo({ name: "explore" })}>Find new deals</HoneyButton>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3" style={{ padding: "0 20px 96px" }}>
          {deals.map((d) => (
            <DealCard
              key={d.id}
              deal={d}
              saved={true}
              onToggleSave={() => toggleSaved(d.id)}
              onOpen={() => openDeal(d.id)}
              variant="compact"
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   DEAL DETAIL
   ============================================================ */

function DealDetailScreen({ dealId, savedIds, toggleSaved, goBack, goToCheckout }) {
  const deal = DEALS.find((d) => d.id === dealId);
  if (!deal) return null;
  const saved = savedIds.has(deal.id);

  return (
    <div className="miel-enter" style={{ paddingBottom: 120 }}>
      {/* Image header */}
      <div className="relative">
        <DealImage deal={deal} className="w-full" style={{ height: 340 }} />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, rgba(20,12,4,0.18) 0%, transparent 30%, transparent 75%, rgba(251,249,244,1) 100%)" }}
        />
        <button
          onClick={goBack}
          className="absolute rounded-full flex items-center justify-center"
          style={{
            top: 16, left: 16,
            width: 36, height: 36,
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(4px)",
            boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
          }}
        >
          <ChevronLeft style={{ width: 18, height: 18, color: "#2d3035" }} />
        </button>
        <div className="absolute" style={{ top: 16, right: 16 }}>
          <HeartButton saved={saved} onClick={() => toggleSaved(deal.id)} size={36} />
        </div>
        {deal.spotsLeft <= 3 && (
          <div
            className="absolute rounded-full"
            style={{
              bottom: 52,
              left: "50%",
              transform: "translateX(-50%)",
              padding: "5px 14px",
              background: "rgba(20, 10, 0, 0.50)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.14)",
              fontSize: 12,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "0.01em",
              whiteSpace: "nowrap",
              zIndex: 10,
            }}
          >
            {deal.spotsLeft} spot{deal.spotsLeft === 1 ? "" : "s"} left
          </div>
        )}
      </div>

      {/* Title block */}
      <div style={{ padding: "0 20px", marginTop: -36, position: "relative" }}>
        <div className="miel-card" style={{ padding: 20 }}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div style={{ fontSize: 11, fontWeight: 600, color: "#8C6914", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                {deal.subcategory} · {deal.neighborhood}
              </div>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: "#2d3035", letterSpacing: "-0.02em", marginTop: 4 }}>
                {deal.name}
              </h1>
              <div style={{ marginTop: 6 }}>
                <StarRow rating={deal.rating} reviews={deal.reviews} />
              </div>
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              fontSize: 14,
              fontWeight: 400,
              lineHeight: 1.55,
              color: "#3d4045",
            }}
          >
            {deal.note}
          </div>

          <div className="flex items-end gap-2" style={{ marginTop: 16 }}>
            <span style={{ fontSize: 28, fontWeight: 800, color: "#2d3035", letterSpacing: "-0.02em" }}>
              {formatPrice(deal.price)}
            </span>
            <span style={{ fontSize: 14, fontWeight: 400, color: "rgba(108,111,122,0.55)", textDecoration: "line-through", paddingBottom: 4 }}>
              {formatPrice(deal.originalPrice)}
            </span>
            <div
              style={{
                marginLeft: "auto",
                padding: "4px 10px",
                borderRadius: 999,
                background: "rgba(252,233,168,0.7)",
                border: "1px solid rgba(175,148,58,0.16)",
                fontSize: 11,
                fontWeight: 700,
                color: "#8C6914",
              }}
            >
              Save {Math.round((1 - deal.price / deal.originalPrice) * 100)}%
            </div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div style={{ padding: "20px 20px 0" }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: "rgba(108,111,122,0.7)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Details
        </h2>
        <div className="miel-card" style={{ marginTop: 12, padding: 4 }}>
          <DetailRow icon={Calendar} label="When" value={deal.when} />
          <Divider />
          <DetailRow icon={MapPin} label="Where" value={deal.address} />
          <Divider />
          <DetailRow icon={Info} label="Cancellation" value="Final sale. Non refundable." />
        </div>
      </div>

      {/* Sticky CTA */}
      <div
        className="fixed bottom-0 left-0 right-0 z-30"
        style={{
          background: "linear-gradient(to top, rgba(251,249,244,0.95) 60%, rgba(251,249,244,0))",
          backdropFilter: "blur(14px)",
          padding: "14px 20px 20px",
          borderTop: "1px solid rgba(175,148,58,0.16)",
        }}
      >
        <div className="mx-auto" style={{ maxWidth: 440 }}>
          <HoneyButton onClick={() => goToCheckout(deal.id)}>
            Reserve spot · {formatPrice(deal.price)}
          </HoneyButton>
          <div style={{ textAlign: "center", fontSize: 11, fontWeight: 400, color: "rgba(108,111,122,0.55)", marginTop: 8 }}>
            Deposit applied to your bill at the venue
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3" style={{ padding: "14px 16px" }}>
      <div
        className="rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ width: 34, height: 34, background: "rgba(200,165,80,0.12)" }}
      >
        <Icon style={{ width: 16, height: 16, color: "#8C6914" }} />
      </div>
      <div className="flex-1 min-w-0">
        <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(108,111,122,0.6)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          {label}
        </div>
        <div style={{ fontSize: 14, fontWeight: 500, color: "#2d3035", marginTop: 2 }}>
          {value}
        </div>
      </div>
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "rgba(175,148,58,0.16)", margin: "0 16px" }} />;
}

/* ============================================================
   CHECKOUT
   ============================================================ */

function CheckoutScreen({ dealId, goBack, completeBooking }) {
  const deal = DEALS.find((d) => d.id === dealId);
  const [processing, setProcessing] = useState(false);

  if (!deal) return null;

  const due = deal.price;
  const payAtVenue = Math.max(0, deal.originalPrice - deal.price);

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      completeBooking(deal.id, due);
    }, 900);
  };

  return (
    <div className="miel-enter" style={{ paddingBottom: 140 }}>
      <div className="flex items-center" style={{ padding: "16px 20px 8px" }}>
        <button
          onClick={goBack}
          className="rounded-full flex items-center justify-center"
          style={{
            width: 36, height: 36,
            background: "rgba(255,255,255,0.7)",
            border: "1px solid rgba(175,148,58,0.16)",
          }}
        >
          <ChevronLeft style={{ width: 18, height: 18, color: "#2d3035" }} />
        </button>
        <h1 style={{ fontSize: 17, fontWeight: 800, color: "#2d3035", letterSpacing: "-0.02em", marginLeft: 12 }}>
          Reserve Spot
        </h1>
      </div>

      {/* Summary card */}
      <div style={{ padding: "12px 20px 0" }}>
        <div className="miel-card" style={{ padding: 14 }}>
          <div className="flex gap-3">
            <DealImage deal={deal} style={{ width: 88, height: 88, borderRadius: 12 }} />
            <div className="flex-1 min-w-0">
              <div style={{ fontSize: 11, fontWeight: 600, color: "#8C6914", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {deal.subcategory}
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#2d3035", letterSpacing: "-0.02em", marginTop: 2 }} className="truncate">
                {deal.name}
              </div>
              <div style={{ fontSize: 12, fontWeight: 500, color: "rgba(108,111,122,0.75)", marginTop: 6 }}>
                {deal.when}
              </div>
              <div style={{ fontSize: 12, fontWeight: 500, color: "rgba(108,111,122,0.75)", marginTop: 2 }}>
                {deal.address}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div style={{ padding: "18px 20px 0" }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: "rgba(108,111,122,0.7)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Pricing
        </h2>
        <div className="miel-card" style={{ padding: "8px 16px", marginTop: 12 }}>
          <PriceLine label="Total value" value={formatPrice(deal.originalPrice)} strike />
          <Divider2 />
          <PriceLine label="Pay now" value={formatPrice(due)} />
          {payAtVenue > 0 && (
            <>
              <Divider2 />
              <PriceLine label="Pay at venue" value={formatPrice(payAtVenue)} muted />
            </>
          )}
          <Divider2 />
          <PriceLine label="Due now" value={formatPrice(due)} bold />
        </div>

        <div style={{ marginTop: 14, padding: "12px 14px", borderRadius: 12, background: "rgba(200,165,80,0.08)", border: "1px solid rgba(175,148,58,0.16)" }}>
          <div className="flex gap-2">
            <Sparkles style={{ width: 14, height: 14, color: "#8C6914", flexShrink: 0, marginTop: 2 }} />
            <div style={{ fontSize: 12, fontWeight: 500, color: "#4A3208", lineHeight: 1.5 }}>
              Deposit applied to your bill at the venue. Final sale.
            </div>
          </div>
        </div>
      </div>

      {/* Payment method stub */}
      <div style={{ padding: "18px 20px 0" }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: "rgba(108,111,122,0.7)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Payment
        </h2>
        <div className="miel-card flex items-center justify-between" style={{ padding: "14px 16px", marginTop: 12 }}>
          <div className="flex items-center gap-3">
            <div
              className="rounded-lg flex items-center justify-center"
              style={{ width: 34, height: 34, background: "rgba(200,165,80,0.12)" }}
            >
              <DollarSign style={{ width: 16, height: 16, color: "#8C6914" }} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#2d3035" }}>Apple Pay</div>
              <div style={{ fontSize: 11, fontWeight: 400, color: "rgba(108,111,122,0.55)" }}>Default method</div>
            </div>
          </div>
          <ChevronRight style={{ width: 16, height: 16, color: "rgba(108,111,122,0.55)" }} />
        </div>
      </div>

      {/* Sticky CTA */}
      <div
        className="fixed bottom-0 left-0 right-0 z-30"
        style={{
          background: "linear-gradient(to top, rgba(251,249,244,0.95) 60%, rgba(251,249,244,0))",
          backdropFilter: "blur(14px)",
          padding: "14px 20px 20px",
          borderTop: "1px solid rgba(175,148,58,0.16)",
        }}
      >
        <div className="mx-auto" style={{ maxWidth: 440 }}>
          <HoneyButton onClick={handlePay} disabled={processing}>
            {processing ? (
              <>
                <span style={{ display: "inline-block", width: 14, height: 14, borderRadius: 999, border: "2px solid rgba(45,48,53,0.3)", borderTopColor: "#2d3035", animation: "miel-spin 700ms linear infinite" }} />
                Processing
              </>
            ) : (
              <>Pay {formatPrice(due)}</>
            )}
          </HoneyButton>
        </div>
      </div>
    </div>
  );
}

function PriceLine({ label, value, muted, bold, strike }) {
  return (
    <div className="flex items-center justify-between" style={{ padding: "10px 0" }}>
      <span style={{ fontSize: 14, fontWeight: 500, color: "rgba(108,111,122,0.7)" }}>{label}</span>
      <span
        style={{
          fontSize: bold ? 16 : 14,
          fontWeight: bold ? 800 : 600,
          color: muted ? "rgba(108,111,122,0.55)" : "#2d3035",
          textDecoration: strike ? "line-through" : "none",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function Divider2() {
  return <div style={{ height: 1, background: "rgba(175,148,58,0.16)" }} />;
}

/* ============================================================
   BOOKING CONFIRMED
   ============================================================ */

function BookingConfirmedScreen({ booking, goToBookings, goToExplore }) {
  const deal = DEALS.find((d) => d.id === booking.dealId);
  if (!deal) return null;

  return (
    <div className="miel-enter" style={{ paddingBottom: 120 }}>
      <div style={{ padding: "48px 20px 0" }} className="text-center">
        <div
          className="mx-auto flex items-center justify-center rounded-full"
          style={{
            width: 72, height: 72,
            background: "linear-gradient(135deg, rgba(255,228,160,0.8), rgba(253,206,120,0.6))",
            border: "1px solid rgba(175,148,58,0.16)",
            boxShadow: "0 6px 20px rgba(253,206,146,0.35)",
          }}
        >
          <Check style={{ width: 32, height: 32, color: "#4A3208", strokeWidth: 3 }} />
        </div>
        <h1 style={{ fontSize: 30, fontWeight: 800, color: "#2d3035", letterSpacing: "-0.03em", marginTop: 24 }}>
          Booking confirmed
        </h1>
        <div style={{ fontSize: 14, fontWeight: 400, color: "rgba(108,111,122,0.65)", marginTop: 6 }}>
          A confirmation has been sent to your email
        </div>
      </div>

      {/* Summary card */}
      <div style={{ padding: "28px 20px 0" }}>
        <div className="miel-card" style={{ padding: 18 }}>
          <div className="flex gap-3">
            <DealImage deal={deal} style={{ width: 72, height: 72, borderRadius: 12 }} />
            <div className="flex-1 min-w-0">
              <div style={{ fontSize: 15, fontWeight: 800, color: "#2d3035", letterSpacing: "-0.02em" }} className="truncate">
                {deal.name}
              </div>
              <div style={{ fontSize: 12, fontWeight: 500, color: "rgba(108,111,122,0.75)", marginTop: 4 }}>
                {deal.when}
              </div>
              <div style={{ fontSize: 12, fontWeight: 500, color: "rgba(108,111,122,0.75)", marginTop: 2 }}>
                {deal.address}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 14, padding: "10px 12px", borderRadius: 10, background: "rgba(252,233,168,0.35)" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#8C6914", letterSpacing: "0.08em", textTransform: "uppercase" }}>Confirmation</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#2d3035", marginTop: 2, fontFamily: "'Space Grotesk', sans-serif" }}>
              {booking.id.toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* Payment summary */}
      <div style={{ padding: "18px 20px 0" }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: "rgba(108,111,122,0.7)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Payment
        </h2>
        <div className="miel-card" style={{ padding: "8px 16px", marginTop: 12 }}>
          <PriceLine label="Paid now" value={formatPrice(booking.paid)} />
          <Divider2 />
          <PriceLine label="At venue" value={formatPrice(Math.max(0, deal.originalPrice - booking.paid))} muted />
        </div>
      </div>

      {/* CTAs */}
      <div style={{ padding: "28px 20px 20px" }} className="flex flex-col gap-2.5">
        <HoneyButton onClick={goToBookings}>View my bookings</HoneyButton>
        <GhostButton onClick={goToExplore}>Explore more deals</GhostButton>
      </div>
    </div>
  );
}

/* ============================================================
   MY BOOKINGS
   ============================================================ */

function MyBookingsScreen({ bookings, openDeal, goTo }) {
  const [tab, setTab] = useState("upcoming");
  const upcoming = bookings.filter((b) => b.status === "upcoming");
  const past = bookings.filter((b) => b.status === "past");
  const list = tab === "upcoming" ? upcoming : past;

  return (
    <div className="miel-enter">
      <div style={{ padding: "20px 20px 4px" }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#2d3035", letterSpacing: "-0.02em" }}>My bookings</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 relative" style={{ padding: "14px 20px 0", borderBottom: "1px solid rgba(175,148,58,0.16)" }}>
        {[{ id: "upcoming", label: "Upcoming", count: upcoming.length }, { id: "past", label: "Past", count: past.length }].map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="relative"
              style={{
                paddingBottom: 12,
                fontSize: 14,
                fontWeight: active ? 700 : 500,
                color: active ? "#2d3035" : "rgba(108,111,122,0.6)",
                letterSpacing: "-0.01em",
              }}
            >
              {t.label} <span style={{ color: "rgba(108,111,122,0.5)" }}>({t.count})</span>
              {active && (
                <div
                  style={{
                    position: "absolute",
                    left: 0, right: 0, bottom: -1,
                    height: 2,
                    background: "#8C6914",
                    borderRadius: 2,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div style={{ padding: "16px 20px 96px" }}>
        {list.length === 0 ? (
          <div style={{ padding: "60px 20px 40px" }} className="text-center">
            <div
              className="mx-auto flex items-center justify-center rounded-full"
              style={{
                width: 64, height: 64,
                background: "rgba(252,233,168,0.6)",
                border: "1px solid rgba(175,148,58,0.16)",
              }}
            >
              <BookOpen style={{ width: 28, height: 28, color: "#8C6914" }} />
            </div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#2d3035", marginTop: 18, letterSpacing: "-0.02em" }}>
              No {tab} bookings
            </div>
            <div style={{ fontSize: 13, fontWeight: 400, color: "rgba(108,111,122,0.55)", marginTop: 4, marginBottom: 22 }}>
              Start exploring deals
            </div>
            <div style={{ maxWidth: 240, margin: "0 auto" }}>
              <HoneyButton size="md" onClick={() => goTo({ name: "explore" })}>Start exploring deals</HoneyButton>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {list.map((b) => {
              const deal = DEALS.find((d) => d.id === b.dealId);
              if (!deal) return null;
              return (
                <button
                  key={b.id}
                  onClick={() => openDeal(deal.id)}
                  className="miel-card flex gap-3 text-left"
                  style={{ padding: 12 }}
                >
                  <DealImage deal={deal} style={{ width: 76, height: 76, borderRadius: 12, flexShrink: 0 }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <div
                        style={{
                          width: 6, height: 6, borderRadius: 999,
                          background: b.status === "upcoming" ? "#8C6914" : "rgba(108,111,122,0.4)",
                        }}
                      />
                      <div style={{ fontSize: 11, fontWeight: 700, color: b.status === "upcoming" ? "#8C6914" : "rgba(108,111,122,0.55)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                        {b.status === "upcoming" ? "Confirmed" : "Completed"}
                      </div>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "#2d3035", marginTop: 3, letterSpacing: "-0.02em" }} className="truncate">
                      {deal.name}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: "rgba(108,111,122,0.75)", marginTop: 2 }}>
                      {deal.when}
                    </div>
                    <div className="flex items-center justify-between" style={{ marginTop: 6 }}>
                      <div style={{ fontSize: 11, fontWeight: 500, color: "rgba(108,111,122,0.55)" }}>
                        {deal.neighborhood}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: "#2d3035" }}>
                        {formatPrice(b.paid)} paid
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   PROFILE
   ============================================================ */

function ProfileScreen({ user, signOut, goTo }) {
  if (!user) {
    return (
      <div className="miel-enter">
        <div style={{ padding: "20px 20px 0" }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#2d3035", letterSpacing: "-0.02em" }}>Profile</h1>
        </div>

        <div style={{ padding: "32px 20px 0" }}>
          <div className="miel-card" style={{ padding: 24, textAlign: "center" }}>
            <div
              className="rounded-full"
              style={{
                width: 64, height: 64,
                margin: "0 auto 14px",
                background: "linear-gradient(135deg, #EDD9A8, #C9A96C)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <User style={{ width: 28, height: 28, color: "#8C6914" }} />
            </div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#2d3035", letterSpacing: "-0.02em" }}>
              Sign in to Miel
            </div>
            <div style={{ fontSize: 13, fontWeight: 400, color: "rgba(108,111,122,0.75)", marginTop: 6, lineHeight: 1.5 }}>
              Save your favorite spots and access them from anywhere
            </div>
            <div style={{ marginTop: 18 }}>
              <HoneyButton size="md" onClick={() => goTo({ name: "signin" })}>
                Sign in
              </HoneyButton>
            </div>
            <button
              onClick={() => goTo({ name: "signup" })}
              style={{
                marginTop: 12,
                fontSize: 13,
                fontWeight: 600,
                color: "#8C6914",
                background: "transparent",
              }}
            >
              Create an account
            </button>
          </div>
        </div>

        <div style={{ padding: "22px 20px 96px" }}>
          <h2 style={{ fontSize: 11, fontWeight: 700, color: "rgba(108,111,122,0.65)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            About
          </h2>
          <div className="miel-card" style={{ marginTop: 10, padding: 4 }}>
            <ProfileRow icon={Info} label="Help & support" />
          </div>
        </div>
      </div>
    );
  }

  const initial = (user.name || user.email).charAt(0).toUpperCase();

  return (
    <div className="miel-enter">
      <div style={{ padding: "20px 20px 0" }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#2d3035", letterSpacing: "-0.02em" }}>Profile</h1>
      </div>
      <div style={{ padding: "18px 20px 0" }}>
        <div className="miel-card flex items-center gap-3" style={{ padding: 16 }}>
          <div
            className="flex items-center justify-center rounded-full"
            style={{
              width: 52, height: 52,
              background: "linear-gradient(135deg, #EDD9A8, #C9A96C)",
              fontSize: 18, fontWeight: 800, color: "#4A3208",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            {initial}
          </div>
          <div className="flex-1" style={{ minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#2d3035", letterSpacing: "-0.02em" }} className="truncate">
              {user.name || user.email.split("@")[0]}
            </div>
            <div style={{ fontSize: 12, fontWeight: 500, color: "rgba(108,111,122,0.65)" }} className="truncate">
              {user.email}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "22px 20px 0" }}>
        <h2 style={{ fontSize: 11, fontWeight: 700, color: "rgba(108,111,122,0.65)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Account
        </h2>
        <div className="miel-card" style={{ marginTop: 10, padding: 4 }}>
          <ProfileRow icon={Settings} label="Settings" />
          <Divider />
          <ProfileRow icon={DollarSign} label="Payment methods" />
          <Divider />
          <ProfileRow icon={Info} label="Help & support" />
        </div>
      </div>

      <div style={{ padding: "22px 20px 96px" }}>
        <button
          onClick={signOut}
          className="w-full miel-card"
          style={{
            padding: "14px 16px",
            fontSize: 14,
            fontWeight: 600,
            color: "#8C4040",
            textAlign: "center",
            background: "#fffefb",
          }}
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

function ProfileRow({ icon: Icon, label, sub, onClick }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 text-left" style={{ padding: "14px 14px" }}>
      <div className="rounded-lg flex items-center justify-center" style={{ width: 34, height: 34, background: "rgba(200,165,80,0.12)" }}>
        <Icon style={{ width: 16, height: 16, color: "#8C6914" }} />
      </div>
      <div className="flex-1">
        <div style={{ fontSize: 14, fontWeight: 600, color: "#2d3035" }}>{label}</div>
        {sub && <div style={{ fontSize: 11, fontWeight: 400, color: "rgba(108,111,122,0.6)", marginTop: 1 }}>{sub}</div>}
      </div>
      <ChevronRight style={{ width: 16, height: 16, color: "rgba(108,111,122,0.55)" }} />
    </button>
  );
}

/* ============================================================
   AUTH SCREENS
   ============================================================ */

function AuthScreen({ mode, onSubmit, goBack, switchMode, error }) {
  const isSignUp = mode === "signup";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleSubmit = async () => {
    setLocalError("");
    if (!email.trim() || !password.trim()) {
      setLocalError("Please fill in all fields");
      return;
    }
    if (!email.includes("@")) {
      setLocalError("Please enter a valid email");
      return;
    }
    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return;
    }
    if (isSignUp && !name.trim()) {
      setLocalError("Please enter your name");
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({ name: name.trim(), email: email.trim().toLowerCase(), password });
    } catch (e) {
      setLocalError(e.message || "Something went wrong");
      setSubmitting(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 12,
    border: "1px solid rgba(120,100,70,0.18)",
    background: "rgba(255,255,255,0.85)",
    fontSize: 15,
    fontFamily: "inherit",
    color: "#2d3035",
    outline: "none",
    transition: "border-color 160ms ease, background 160ms ease",
  };

  const displayError = error || localError;

  return (
    <div className="miel-enter" style={{ minHeight: "100vh", paddingBottom: 48 }}>
      <div style={{ padding: "16px 20px 0" }}>
        <button
          onClick={goBack}
          className="rounded-full flex items-center justify-center"
          style={{
            width: 40, height: 40,
            background: "rgba(255,255,255,0.85)",
            border: "1px solid rgba(40,24,6,0.06)",
          }}
          aria-label="Back"
        >
          <ChevronLeft style={{ width: 18, height: 18, color: "#2d3035" }} />
        </button>
      </div>

      <div style={{ padding: "28px 24px 0" }}>
        <h1
          style={{
            fontSize: 32,
            fontWeight: 800,
            color: "#2d3035",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
          }}
        >
          {isSignUp ? "Create your account" : "Welcome back"}
        </h1>
        <p style={{ fontSize: 14, color: "rgba(108,111,122,0.85)", marginTop: 10, lineHeight: 1.5 }}>
          {isSignUp
            ? "Save spots, get reminders, and track your bookings."
            : "Sign in to access your saved spots and bookings."}
        </p>
      </div>

      <div style={{ padding: "32px 20px 0", display: "flex", flexDirection: "column", gap: 12 }}>
        {isSignUp && (
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(108,111,122,0.85)", marginLeft: 4 }}>
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Yuval"
              autoComplete="name"
              style={{ ...inputStyle, marginTop: 6 }}
              onFocus={(e) => { e.target.style.borderColor = "rgba(175,145,50,0.45)"; e.target.style.background = "#fff"; }}
              onBlur={(e) => { e.target.style.borderColor = "rgba(120,100,70,0.18)"; e.target.style.background = "rgba(255,255,255,0.85)"; }}
            />
          </div>
        )}

        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(108,111,122,0.85)", marginLeft: 4 }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            autoComplete="email"
            inputMode="email"
            style={{ ...inputStyle, marginTop: 6 }}
            onFocus={(e) => { e.target.style.borderColor = "rgba(175,145,50,0.45)"; e.target.style.background = "#fff"; }}
            onBlur={(e) => { e.target.style.borderColor = "rgba(120,100,70,0.18)"; e.target.style.background = "rgba(255,255,255,0.85)"; }}
          />
        </div>

        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(108,111,122,0.85)", marginLeft: 4 }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={isSignUp ? "At least 6 characters" : "Your password"}
            autoComplete={isSignUp ? "new-password" : "current-password"}
            style={{ ...inputStyle, marginTop: 6 }}
            onFocus={(e) => { e.target.style.borderColor = "rgba(175,145,50,0.45)"; e.target.style.background = "#fff"; }}
            onBlur={(e) => { e.target.style.borderColor = "rgba(120,100,70,0.18)"; e.target.style.background = "rgba(255,255,255,0.85)"; }}
          />
        </div>

        {displayError && (
          <div
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              background: "rgba(168,80,74,0.08)",
              border: "1px solid rgba(168,80,74,0.18)",
              fontSize: 13,
              fontWeight: 500,
              color: "#8C4040",
            }}
          >
            {displayError}
          </div>
        )}

        <div style={{ marginTop: 8 }}>
          <HoneyButton onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Please wait" : isSignUp ? "Create account" : "Sign in"}
          </HoneyButton>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3" style={{ marginTop: 16 }}>
          <div style={{ flex: 1, height: 1, background: "rgba(40,24,6,0.10)" }} />
          <span style={{ fontSize: 12, fontWeight: 500, color: "rgba(108,111,122,0.6)" }}>or</span>
          <div style={{ flex: 1, height: 1, background: "rgba(40,24,6,0.10)" }} />
        </div>

        {/* Google sign in */}
        <button
          onClick={() => onSubmit({ name: "Google User", email: "google@gmail.com", password: "__google__", isGoogle: true })}
          disabled={submitting}
          className="w-full flex items-center justify-center gap-3"
          style={{
            height: 50,
            borderRadius: 9999,
            background: "#fff",
            border: "1px solid rgba(40,24,6,0.12)",
            fontSize: 15,
            fontWeight: 600,
            color: "#2d3035",
            boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
            transition: "box-shadow 160ms ease",
            marginTop: 4,
          }}
        >
          {/* Google G icon */}
          <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            <path fill="none" d="M0 0h48v48H0z"/>
          </svg>
          Continue with Google
        </button>

        <div style={{ textAlign: "center", marginTop: 14, fontSize: 13, color: "rgba(108,111,122,0.85)" }}>
          {isSignUp ? "Already have an account? " : "New to Miel? "}
          <button
            onClick={switchMode}
            style={{ fontWeight: 700, color: "#8C6914", background: "transparent" }}
          >
            {isSignUp ? "Sign in" : "Create one"}
          </button>
        </div>
      </div>
    </div>
  );
}


/* ============================================================
   STORAGE HELPERS (window.storage with safe fallbacks)
   ============================================================ */

const storageGet = async (key) => {
  if (typeof window === "undefined" || !window.storage) return null;
  try {
    const result = await window.storage.get(key);
    return result ? result.value : null;
  } catch {
    return null;
  }
};

const storageSet = async (key, value) => {
  if (typeof window === "undefined" || !window.storage) return;
  try {
    await window.storage.set(key, value);
  } catch {
    /* swallow — non-critical */
  }
};

const storageDelete = async (key) => {
  if (typeof window === "undefined" || !window.storage) return;
  try {
    await window.storage.delete(key);
  } catch {
    /* swallow */
  }
};

/* ============================================================
   MAIN APP
   ============================================================ */

export default function App() {
  const [route, setRoute] = useState({ name: "home" });
  const [location, setLocation] = useState("Williamsburg");
  const [category, setCategory] = useState("all");
  const [savedIds, setSavedIds] = useState(new Set());
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState("");
  const [hydrated, setHydrated] = useState(false);

  // On mount: try to restore signed-in user and their saved deals
  useEffect(() => {
    (async () => {
      const currentEmail = await storageGet("miel:currentUser");
      if (currentEmail) {
        const userJson = await storageGet(`miel:user:${currentEmail}`);
        if (userJson) {
          try {
            const restoredUser = JSON.parse(userJson);
            setUser(restoredUser);
            const savedJson = await storageGet(`miel:user:${currentEmail}:saved`);
            if (savedJson) {
              try {
                const arr = JSON.parse(savedJson);
                if (Array.isArray(arr)) setSavedIds(new Set(arr));
              } catch {}
            }
          } catch {}
        }
      }
      setHydrated(true);
    })();
  }, []);

  // Persist saves whenever they change AND a user is signed in
  useEffect(() => {
    if (!hydrated || !user) return;
    storageSet(`miel:user:${user.email}:saved`, JSON.stringify([...savedIds]));
  }, [savedIds, user, hydrated]);

  const toggleSaved = (id) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // Scroll to top when changing routes
  useEffect(() => { scrollToTop(); }, [route]);

  const goTo = (next) => { setAuthError(""); setRoute(next); };
  const openDeal = (dealId) => setRoute({ name: "detail", dealId });
  const goToCheckout = (dealId) => setRoute({ name: "checkout", dealId });

  const completeBooking = (dealId, paid) => {
    const newBooking = {
      id: `bkg-${Math.floor(Math.random() * 9000) + 1000}`,
      dealId,
      when: DEALS.find((d) => d.id === dealId).when,
      paid,
      status: "upcoming",
    };
    setBookings((b) => [...b, newBooking]);
    setRoute({ name: "confirmed", bookingId: newBooking.id });
  };

  const handleSignUp = async ({ name, email, password, isGoogle }) => {
    setAuthError("");
    if (isGoogle) {
      // Mock Google auth — auto sign in/up with a Google account
      const googleEmail = "you@gmail.com";
      const existing = await storageGet(`miel:user:${googleEmail}`);
      const googleUser = existing ? JSON.parse(existing) : { name: "Google User", email: googleEmail, provider: "google" };
      if (!existing) {
        await storageSet(`miel:user:${googleEmail}`, JSON.stringify(googleUser));
      }
      await storageSet("miel:currentUser", googleEmail);
      const savedJson = await storageGet(`miel:user:${googleEmail}:saved`);
      if (savedJson) {
        try { const arr = JSON.parse(savedJson); if (Array.isArray(arr)) setSavedIds(new Set(arr)); } catch {}
      } else {
        await storageSet(`miel:user:${googleEmail}:saved`, JSON.stringify([...savedIds]));
      }
      setUser(googleUser);
      setRoute({ name: "profile" });
      return;
    }
    const existing = await storageGet(`miel:user:${email}`);
    if (existing) {
      setAuthError("An account with this email already exists. Try signing in instead.");
      throw new Error("exists");
    }
    const newUser = { name, email, password };
    await storageSet(`miel:user:${email}`, JSON.stringify(newUser));
    await storageSet("miel:currentUser", email);
    await storageSet(`miel:user:${email}:saved`, JSON.stringify([...savedIds]));
    setUser(newUser);
    setRoute({ name: "profile" });
  };

  const handleSignIn = async ({ email, password }) => {
    setAuthError("");
    const userJson = await storageGet(`miel:user:${email}`);
    if (!userJson) {
      setAuthError("No account found with this email. Want to create one?");
      throw new Error("nouser");
    }
    let stored;
    try { stored = JSON.parse(userJson); } catch {
      setAuthError("Could not read account. Please try again.");
      throw new Error("parse");
    }
    if (stored.password !== password) {
      setAuthError("Incorrect password. Please try again.");
      throw new Error("badpw");
    }
    await storageSet("miel:currentUser", email);
    setUser(stored);
    // Restore that user's saved deals (replaces in-memory state)
    const savedJson = await storageGet(`miel:user:${email}:saved`);
    if (savedJson) {
      try {
        const arr = JSON.parse(savedJson);
        if (Array.isArray(arr)) setSavedIds(new Set(arr));
      } catch {}
    } else {
      setSavedIds(new Set());
    }
    setRoute({ name: "profile" });
  };

  const handleSignOut = async () => {
    await storageDelete("miel:currentUser");
    setUser(null);
    setSavedIds(new Set());
  };

  // Determine which tab is "active" in the bottom nav
  const tabForRoute = {
    home: "home",
    explore: "explore",
    saved: "saved",
    bookings: "bookings",
    profile: "profile",
  }[route.name] || null;

  const showNav = ["home", "explore", "saved", "bookings", "profile"].includes(route.name);

  return (
    <>
      <GlobalStyles />
      <div className="miel-bg-ambient" />
      <div className="miel-bg-grain" />
      <div className="miel-bg-spotlight" />

      <div className="miel-app-shell" style={{ maxWidth: 440, margin: "0 auto" }}>
        {route.name === "home" && (
          <HomeScreen
            location={location}
            setLocation={setLocation}
            category={category}
            setCategory={setCategory}
            savedIds={savedIds}
            toggleSaved={toggleSaved}
            openDeal={openDeal}
            goTo={goTo}
          />
        )}
        {route.name === "explore" && (
          <ExploreScreen
            location={location}
            setLocation={setLocation}
            savedIds={savedIds}
            toggleSaved={toggleSaved}
            openDeal={openDeal}
          />
        )}
        {route.name === "saved" && (
          <SavedScreen savedIds={savedIds} toggleSaved={toggleSaved} openDeal={openDeal} goTo={goTo} />
        )}
        {route.name === "bookings" && (
          <MyBookingsScreen bookings={bookings} openDeal={openDeal} goTo={goTo} />
        )}
        {route.name === "profile" && (
          <ProfileScreen user={user} signOut={handleSignOut} goTo={goTo} />
        )}
        {route.name === "signin" && (
          <AuthScreen
            mode="signin"
            error={authError}
            onSubmit={handleSignIn}
            goBack={() => { setAuthError(""); setRoute({ name: "profile" }); }}
            switchMode={() => { setAuthError(""); setRoute({ name: "signup" }); }}
          />
        )}
        {route.name === "signup" && (
          <AuthScreen
            mode="signup"
            error={authError}
            onSubmit={handleSignUp}
            goBack={() => { setAuthError(""); setRoute({ name: "profile" }); }}
            switchMode={() => { setAuthError(""); setRoute({ name: "signin" }); }}
          />
        )}
        {route.name === "detail" && (
          <DealDetailScreen
            dealId={route.dealId}
            savedIds={savedIds}
            toggleSaved={toggleSaved}
            goBack={() => setRoute({ name: "home" })}
            goToCheckout={goToCheckout}
          />
        )}
        {route.name === "checkout" && (
          <CheckoutScreen
            dealId={route.dealId}
            goBack={() => setRoute({ name: "detail", dealId: route.dealId })}
            completeBooking={completeBooking}
          />
        )}
        {route.name === "confirmed" && (
          <BookingConfirmedScreen
            booking={bookings.find((b) => b.id === route.bookingId)}
            goToBookings={() => setRoute({ name: "bookings" })}
            goToExplore={() => setRoute({ name: "explore" })}
          />
        )}
      </div>

      {showNav && <BottomNav active={tabForRoute} onChange={(id) => setRoute({ name: id })} />}
    </>
  );
}
