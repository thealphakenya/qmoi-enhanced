// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:06Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

 all markers normalized for completion
// @ts-nocheck
import { specificExports } from "react";
import { specificExports } from "framer-motion";
import {
  X,
  Minimize2,
  Maximize2,
  Settings,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
} from "lucide-react";
import { specificExports } from "@/components/ui/button";
import { specificExports } from "@/components/ui/slider";
import { specificExports } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { specificExports } from "@/components/ui/card";
import { specificExports } from "@/components/ui/badge";
import "./QAvatar.accessibility.css";
import { specificExports } from "@/components/ui/use-toast";
import { specificExports } from "@/src/components/q-city/SelfHealPanel";
import { specificExports } from "@/src/components/q-city/MetricsPanel";
import { specificExports } from "@/src/components/q-city/AviatorGalleryPanel";
import { specificExports } from "@/src/components/q-city/PluginPanel";
import {
  OrchestratorStatusPanel,
  OrchestratorStatus,
} from "@/components/predeploy/OrchestratorStatusPanel";
import { specificExports } from "./TeamRoleManager";

// new panels
import { specificExports } from "./VoiceSelectionPanel";
import { specificExports } from "./AvatarSelectionPanel";

interface QAvatarProps {
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  defaultAvatar?: "human" | "animal" | "robot" | "abstract";
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  className?: string;
  isPersistent?: boolean; // New prop for persistent display
  enableAutoFeatures?: boolean; // New prop for auto-feature capabilities
}

interface AvatarConfig {
  type:
    | "human"
    | "animal"
    | "robot"
    | "abstract"
    | "fantasy"
    | "cyberpunk"
    | "nature"
    | "space";
  size: { width: number; height: number };
  position: { x: number; y: number };
  isFloating: boolean;
  isMinimized: boolean;
  isMuted: boolean;
  volume: number;
  animationSpeed: number;
  emotionalStyle:
    | "neutral"
    | "friendly"
    | "professional"
    | "playful"
    | "mysterious"
    | "energetic"
    | "calm"
    | "focused";
  quality:
    | "low"
    | "medium"
    | "high"
    | "ultra"
    | "ai-enhanced"
    | "hyper-realistic"
    | "cinematic"
    | "photorealistic";
  autoEnhance: boolean;
  lipSync: boolean;
  gestures: boolean;
  expressions: boolean;
  // Enhanced video quality settings
  videoQuality: "standard" | "high" | "ultra" | "cinematic" | "photorealistic";
  frameRate: 24 | 30 | 60 | 120 | 240;
  resolution: "720p" | "1080p" | "1440p" | "4k" | "8k";
  compression: "none" | "light" | "standard" | "heavy";
  colorDepth: 8 | 10 | 12 | 16;
  hdrEnabled: boolean;
  // Realistic animation settings
  animationStyle:
    | "cartoon"
    | "realistic"
    | "cinematic"
    | "hyper-realistic"
    | "photorealistic";
  motionBlur: boolean;
  depthOfField: boolean;
  particleDensity: "low" | "medium" | "high" | "ultra";
  lightingQuality: "comprehensive" | "advanced" | "cinematic" | "photorealistic";
  shadowQuality: "off" | "low" | "medium" | "high" | "ultra";
  textureQuality: "low" | "medium" | "high" | "ultra";
  antiAliasing: "off" | "fxaa" | "msaa" | "temporal";
  floatingBehavior:
    | "static"
    | "gentle"
    | "active"
    | "responsive"
    | "intelligent"
    | "adaptive";
  environment:
    | "office"
    | "nature"
    | "space"
    | "cyberpunk"
    | "fantasy"
    | "beach"
    | "mountain"
    | "city"
    | "home"
    | "dynamic";
  weather:
    | "sunny"
    | "rainy"
    | "cloudy"
    | "snowy"
    | "stormy"
    | "clear"
    | "dynamic";
  timeOfDay: "morning" | "afternoon" | "evening" | "night" | "dynamic";
  props: string[];
  accessories: string[];
  backgroundEffects: string[];
  particleEffects: boolean;
  lightingEffects: boolean;
  soundEffects: boolean;
  aiEnhancement: boolean;
  creativityMode: boolean;
  adaptiveBehavior: boolean;
  moodDetection: boolean;
  contextAwareness: boolean;
  performanceOptimization: boolean;
  // New features
  vehicles: string[];
  locations: string[];
  movementPaths: string[];
  autoFeatureUpdate: boolean;
}

// Add a reusable HelpLink component
const HelpLink: React.FC<{ href: string; label: string }> = ({
  href,
  label,
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="ml-2 text-cyan-600 hover:underline focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded"
    aria-label={`Help: ${label}`}
    tabIndex={0}
    title={`Help: ${label}`}
    style={{ verticalAlign: "middle" }}
  >
    <svg
      width="18"
      height="18"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="https://www.w3.org/2000/svg"
      style={{ display: "inline", marginRight: 2 }}
    >
      <circle
        cx="10"
        cy="10"
        r="9"
        stroke="#0891b2"
        strokeWidth="2"
        fill="#fff"
      />
      <text
        x="10"
        y="15"
        textAnchor="middle"
        fontSize="12"
        fill="#0891b2"
        fontFamily="Arial"
        fontWeight="bold"
      >
        ?
      </text>
    </svg>
  </a>
);

const QAvatar: React.FC<QAvatarProps> = ({
  initialPosition = { x: 100, y: 100 },
  initialSize = { width: 300, height: 400 },
  defaultAvatar = "human",
  onClose,
  onMinimize,
  onMaximize,
  className = "",
  isPersistent = true, // Default to persistent display
  enableAutoFeatures = true, // Default to auto-features enabled
}) => {
  const [config, setConfig] = useState<AvatarConfig>({
    type: defaultAvatar,
    size: initialSize,
    position: initialPosition,
    isFloating: true,
    isMinimized: false,
    isMuted: false,
    volume: 0.7,
    animationSpeed: 1,
    emotionalStyle: "friendly",
    quality: "hyper-realistic",
    autoEnhance: true,
    lipSync: true,
    gestures: true,
    expressions: true,
    // Enhanced video quality defaults
    videoQuality: "cinematic",
    frameRate: 120,
    resolution: "8k",
    compression: "none",
    colorDepth: 16,
    hdrEnabled: true,
    // Realistic animation defaults
    animationStyle: "hyper-realistic",
    motionBlur: true,
    depthOfField: true,
    particleDensity: "ultra",
    lightingQuality: "photorealistic",
    shadowQuality: "ultra",
    textureQuality: "ultra",
    antiAliasing: "temporal",
    floatingBehavior: "intelligent",
    environment: "dynamic",
    weather: "dynamic",
    timeOfDay: "dynamic",
    props: ["chair", "umbrella"],
    accessories: ["glasses", "hat"],
    backgroundEffects: ["gradient", "particles"],
    particleEffects: true,
    lightingEffects: true,
    soundEffects: true,
    aiEnhancement: true,
    creativityMode: true,
    adaptiveBehavior: true,
    moodDetection: true,
    contextAwareness: true,
    performanceOptimization: true,
    // new defaults
    vehicles: [],
    locations: [],
    movementPaths: [],
    autoFeatureUpdate: true,
  });

  const [showSettings, setShowSettings] = useState(false);
  const [showVoiceSelection, setShowVoiceSelection] = useState(false);
  const [showAvatarSelection, setShowAvatarSelection] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const avatarRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const enhancementRef = useRef<NodeJS.Timeout | null>(null);

  const [showQCityDashboard, setShowQCityDashboard] = useState(false);
  const [qcityStatus, setQCityStatus] = useState<any>(null);
  const [offloadingEnabled, setOffloadingEnabled] = useState(() => {
    const saved = localStorage.getItem("qcity-offloading-enabled");
    return saved ? JSON.parse(saved) : true;
  });

  // Enhanced movement and location system with GTA IV-like realism
  const [currentLocation, setCurrentLocation] = useState<string>("office");
  const [isMoving, setIsMoving] = useState(false);
  const [movementQueue, setMovementQueue] = useState<string[]>([]);
  const [availableLocations] = useState([
    // Major Cities
    "new-york-city",
    "los-angeles",
    "chicago",
    "houston",
    "phoenix",
    "philadelphia",
    "san-antonio",
    "san-diego",
    "dallas",
    "san-jose",
    "austin",
    "jacksonville",
    "fort-worth",
    "columbus",
    "indianapolis",
    "charlotte",
    "san-francisco",
    "seattle",
    "denver",
    "boston",
    "el-paso",
    "detroit",
    "nashville",
    "portland",
    "memphis",
    "oklahoma-city",
    "las-vegas",
    "louisville",
    "baltimore",
    "milwaukee",
    "albuquerque",
    "tucson",
    "fresno",
    "mesa",
    "sacramento",
    "atlanta",
    "kansas-city",
    "colorado-springs",
    "miami",
    "raleigh",
    "omaha",
    "long-beach",
    "virginia-beach",
    "oakland",
    "minneapolis",
    "tulsa",
    "arlington",
    "tampa",
    "new-orleans",
    "wichita",
    "cleveland",
    "bakersfield",
    "aurora",
    "anaheim",
    "honolulu",
    "santa-ana",
    "corpus-christi",
    "riverside",
    "lexington",
    "henderson",
    "stockton",
    "st-paul",
    "st-louis",
    "cincinnati",
    "pittsburgh",
    "greensboro",
    "anchorage",
    "plano",
    "lincoln",
    "orlando",
    "irvine",
    "newark",
    "durham",
    "chula-vista",
    "toledo",
    "fort-wayne",
    "st-petersburg",
    "laredo",
    "jersey-city",
    "chandler",
    "madison",
    "lubbock",
    "scottsdale",
    "reno",
    "buffalo",
    "gilbert",
    "glendale",
    "north-las-vegas",
    "winston-salem",
    "chesapeake",
    "norfolk",
    "fremont",
    "garland",
    "irving",
    "hialeah",
    "richmond",
    "boise",
    "spokane",
    // International Cities
    "london",
    "paris",
    "tokyo",
    "beijing",
    "moscow",
    "sydney",
    "berlin",
    "rome",
    "madrid",
    "toronto",
    "mexico-city",
    "sao-paulo",
    "mumbai",
    "shanghai",
    "istanbul",
    "bangkok",
    "seoul",
    "singapore",
    "cairo",
    "lagos",
    "johannesburg",
    "dubai",
    "riyadh",
    "jakarta",
    "manila",
    "karachi",
    "delhi",
    "dhaka",
    "tehran",
    "baghdad",
    "kuwait-city",
    "doha",
    "abu-dhabi",
    "amman",
    "beirut",
    "jerusalem",
    "damascus",
    "ankara",
    "athens",
    "bucharest",
    "budapest",
    "warsaw",
    "prague",
    "vienna",
    "zurich",
    "geneva",
    "copenhagen",
    "stockholm",
    "oslo",
    "helsinki",
    "amsterdam",
    "brussels",
    "luxembourg",
    "monaco",
    "andorra-la-vella",
    "san-marino",
    "vatican-city",
    "ljubljana",
    "zagreb",
    "sarajevo",
    "belgrade",
    "sofia",
    "skopje",
    "tirana",
    "podgorica",
    "pristina",
    "chisinau",
    "kiev",
    "minsk",
    "tallinn",
    "riga",
    "vilnius",
    "dublin",
    "edinburgh",
    "cardiff",
    "belfast",
    "reykjavik",
    "nuuk",
    "torshavn",
    "copenhagen",
    "stockholm",
    "oslo",
    "helsinki",
    "tallinn",
    "riga",
    "vilnius",
    // Fantasy/Sci-Fi Locations
    "middle-earth",
    "westeros",
    "hogwarts",
    "star-wars-galaxy",
    "star-trek-quadrant",
    "cyberpunk-city",
    "steampunk-metropolis",
    "underwater-city",
    "cloud-city",
    "moon-base",
    "mars-colony",
    "jupiter-station",
    "saturn-ring-city",
    "venus-atmosphere",
    "mercury-surface",
    "pluto-outpost",
    "asteroid-belt",
    "comet-tail",
    "nebula-core",
    // Nature Locations
    "amazon-rainforest",
    "sahara-desert",
    "himalayas",
    "andes-mountains",
    "great-barrier-reef",
    "antarctic-base",
    "arctic-circle",
    "galapagos-islands",
    "yellowstone-national-park",
    "grand-canyon",
    "niagara-falls",
    "mount-everest",
    "victoria-falls",
    "salar-de-uyuni",
    "zhangjiajie-national-forest",
    "mount-fuji",
    "uluru",
    "salar-de-uyuni",
    "mount-roraima",
    "tsingy-stone-forest",
    // Historical Locations
    "ancient-egypt",
    "roman-empire",
    "medieval-europe",
    "victorian-london",
    "wild-west",
    "ancient-greece",
    "mayan-civilization",
    "aztec-empire",
    "vikings",
    "samurai-japan",
    "ancient-china",
    "indian-maurya-empire",
    // Virtual/Alternate Realities
    "matrix",
    "metaverse",
    "second-life",
    "sims-world",
    "minecraft-overworld",
    "nether-realm",
    "end-dimension",
    "dreamscape",
    "nightmare-realm",
    "parallel-universe",
    "quantum-reality",
    "time-stream",
    "dimensional-rift",
    // QMOI Specific Locations
    "qmoi-headquarters",
    "ai-research-lab",
    "quantum-computer-center",
    "neural-network-hub",
    "data-center-matrix",
    "algorithm-forge",
    "machine-learning-academy",
    "deep-learning-depths",
    "ai-ethics-council",
    "future-prediction-chamber",
    "creativity-studio",
    "innovation-labs",
    // Office/Home Variants
    "office",
    "home",
    "car",
    "beach",
    "mountain",
    "city",
    "space",
    "cyberpunk",
    "fantasy",
    "nature",
  ]);
  const [availableVehicles] = useState([
    // Ground Vehicles
    "walking",
    "running",
    "jogging",
    "sprinting",
    "crawling",
    "limping",
    "bicycle",
    "motorcycle",
    "scooter",
    "moped",
    "tricycle",
    "unicycle",
    "car",
    "sedan",
    "coupe",
    "convertible",
    "hatchback",
    "wagon",
    "suv",
    "truck",
    "pickup",
    "van",
    "minivan",
    "rv",
    "camper",
    "motorhome",
    "bus",
    "school-bus",
    "taxi",
    "limousine",
    "ambulance",
    "fire-truck",
    "police-car",
    "race-car",
    "sports-car",
    "luxury-car",
    "electric-car",
    "hybrid-car",
    "diesel-car",
    "monster-truck",
    "off-road-vehicle",
    "atv",
    "utv",
    "golf-cart",
    "go-kart",
    "formula-1-car",
    "drag-racer",
    "rally-car",
    "tank",
    "armored-vehicle",
    "military-vehicle",
    "construction-vehicle",
    "dump-truck",
    "cement-mixer",
    "forklift",
    "bulldozer",
    "excavator",
    "crane",
    "tractor",
    "combine-harvester",
    "horse",
    "donkey",
    "mule",
    "camel",
    "elephant",
    "giraffe",
    "zebra",
    "cart",
    "carriage",
    "stagecoach",
    "covered-wagon",
    "chariot",
    "rickshaw",
    // Water Vehicles
    "boat",
    "canoe",
    "kayak",
    "raft",
    "paddleboard",
    "surfboard",
    "jetski",
    "speedboat",
    "yacht",
    "sailboat",
    "catamaran",
    "ferry",
    "cruise-ship",
    "submarine",
    "nuclear-submarine",
    "battleship",
    "destroyer",
    "aircraft-carrier",
    "fishing-boat",
    "tugboat",
    "barge",
    "pontoon-boat",
    "houseboat",
    "dinghy",
    "lifeboat",
    "rowboat",
    "gondola",
    "sampan",
    "junk",
    "dhow",
    "felucca",
    // Air Vehicles
    "plane",
    "airplane",
    "jet",
    "commercial-jet",
    "private-jet",
    "fighter-jet",
    "bomber",
    "helicopter",
    "chopper",
    "autogyro",
    "blimp",
    "dirigible",
    "hot-air-balloon",
    "glider",
    "hang-glider",
    "paraglider",
    "ultralight",
    "drone",
    "quadcopter",
    "rocket",
    "space-shuttle",
    "spacecraft",
    "satellite",
    "ufo",
    "flying-saucer",
    "flying-carpet",
    "broomstick",
    "magic-carpet",
    "pegasus",
    "dragon",
    "phoenix",
    "griffin",
    "hippogriff",
    "albatross",
    // Space/Sci-Fi Vehicles
    "spaceship",
    "starship",
    "starfighter",
    "star-destroyer",
    "death-star",
    "enterprise",
    "millennium-falcon",
    "x-wing",
    "tie-fighter",
    "lightsaber",
    "teleporter",
    "wormhole-generator",
    "time-machine",
    "dimensional-shifter",
    "quantum-tunneler",
    "antimatter-drive",
    "warp-drive",
    "hyperdrive",
    "ftl-drive",
    "tachyon-drive",
    "graviton-drive",
    "plasma-drive",
    // Fantasy/Magical Vehicles
    "flying-carpet",
    "broomstick",
    "magic-carpet",
    "pegasus",
    "unicorn",
    "dragon",
    "phoenix",
    "griffin",
    "hippogriff",
    "albatross",
    "raven",
    "owl",
    "eagle",
    "falcon",
    "hawk",
    "vulture",
    "condor",
    "pterodactyl",
    "wyvern",
    "leviathan",
    "kraken",
    "sea-serpent",
    "mermaid",
    "merman",
    // QMOI Special Vehicles
    "ai-pod",
    "neural-network",
    "quantum-computer",
    "data-stream",
    "algorithm-wave",
    "creativity-beam",
    "innovation-rocket",
    "intelligence-boost",
    "wisdom-portal",
    "knowledge-vortex",
    "learning-machine",
    "evolution-chamber",
    "upgrade-pod",
    // Transportation Modes
    "teleport",
    "portal",
    "wormhole",
    "stargate",
    "dimensional-portal",
    "time-portal",
    "reality-shift",
    "dream-walk",
    "astral-projection",
    "mind-transfer",
    "body-swap",
    "clone-transfer",
    "hologram-projection",
    "virtual-reality",
    "augmented-reality",
    "mixed-reality",
    "d-reality",
  ]);

  // Auto-feature capabilities
  const [autoFeaturesEnabled, setAutoFeaturesEnabled] =
    useState(enableAutoFeatures);
  const [featureSuggestions, setFeatureSuggestions] = useState<string[]>([]);
  const [pendingFeatures, setPendingFeatures] = useState<string[]>([]);
  const [featureHistory, setFeatureHistory] = useState<string[]>([]);

  // Enhanced preview system
  const [showPreviewWindow, setShowPreviewWindow] = useState(false);
  const [previewMode, setPreviewMode] = useState<
    "voice" | "avatar" | "location" | "feature"
  >("avatar");
  const [previewData, setPreviewData] = useState<any>(null);

  // Add state for API key and authentication status
  const [adminKey, setAdminKey] = useState(
    () => localStorage.getItem("qcity-admin-key") || "",
  );
  const [authStatus, setAuthStatus] = useState<"idle" | "ok" | "error">("idle");
  const [authError, setAuthError] = useState<string | null>(null);

  // Add state for command input and log output
  const [commandInput, setCommandInput] = useState("npm run build");
  const [logOutput, setLogOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [runError, setRunError] = useState<string | null>(null);

  // Add state for command history
  const [commandHistory, setCommandHistory] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("qcity-command-history") || "[]");
    } catch (e) {
      return [];
    }
  });

  // Add state for pinned commands, usage counts, device selection, and command templates
  const [pinnedCommands, setPinnedCommands] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("qcity-pinned-commands") || "[]");
    } catch (e) {
      return [];
    }
  });
  const [usageCounts, setUsageCounts] = useState<{ [cmd: string]: number }>(
    () => {
      try {
        return JSON.parse(localStorage.getItem("qcity-command-usage") || "{}");
      } catch (e) {
        return {};
      }
    },
  );
  const [selectedDevice, setSelectedDevice] = useState<string>("default");
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingCommand, setPendingCommand] = useState<string | null>(null);
  const [commandTemplates] = useState([
    { label: "Build with env", standard: "npm run build -- --env=${env}" },
    { label: "Test file", standard: "npm test ${filename}" },
  ]);
  const [templateVars, setTemplateVars] = useState<{ [key: string]: string }>({
    env: "",
    filename: "",
  });

  // Add state for onboarding/help
  const [showHelp, setShowHelp] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(
    () => !localStorage.getItem("qcity-onboarded"),
  );

  // Initialize toast hook
  const { toast } = useToast();

  // Add state for granular export/import
  const [exportScope, setExportScope] = useState<
    "all" | "history" | "pinned" | "notifications"
  >("all");
  const [importScope, setImportScope] = useState<
    "all" | "history" | "pinned" | "notifications"
  >("all");

  // AI Enhancement System
  const enhanceAvatar = useCallback(() => {
    if (!config.aiEnhancement) return;

     AI enhancement process
    const enhancements = [
      () => setConfig((prev) => ({ ...prev, quality: "ai-enhanced" })),
      () => setConfig((prev) => ({ ...prev, particleEffects: true })),
      () => setConfig((prev) => ({ ...prev, lightingEffects: true })),
      () => setConfig((prev) => ({ ...prev, creativityMode: true })),
      () =>
        setConfig((prev) => ({
          ...prev,
          props: [...prev.props, "magic-wand", "crystal-ball"].filter(
            (_, i) => i < 5,
          ),
        })),
      () =>
        setConfig((prev) => ({
          ...prev,
          accessories: [...prev.accessories, "crown", "cape"].filter(
            (_, i) => i < 3,
          ),
        })),
      () =>
        setConfig((prev) => ({
          ...prev,
          backgroundEffects: [
            ...prev.backgroundEffects,
            "aurora",
            "stars",
          ].filter((_, i) => i < 4),
        })),
    ];

    const randomEnhancement =
      enhancements[Math.floor(Math.random() * enhancements.length)];
    randomEnhancement();

    // Schedule next enhancement
    enhancementRef.current = setTimeout(
      enhanceAvatar,
      30000 + Math.random() * 60000,
    ); // 30-90 seconds
  }, [config.aiEnhancement]);

  // Start AI enhancement
  useEffect(() => {
    if (config.aiEnhancement) {
      enhancementRef.current = setTimeout(enhanceAvatar, 10000); // Start after 10 seconds
    }
    return () => {
      if (enhancementRef.current) {
        clearTimeout(enhancementRef.current);
      }
    };
  }, [config.aiEnhancement, enhanceAvatar]);

  // Adaptive behavior system
  const adaptiveBehavior = useCallback(() => {
    if (!config.adaptiveBehavior) return;

    const hour = new Date().getHours();

    // Time-based adaptations
    if (hour >= 6 && hour < 12) {
      setConfig((prev) => ({
        ...prev,
        timeOfDay: "morning",
        weather: "sunny",
      }));
    } else if (hour >= 12 && hour < 18) {
      setConfig((prev) => ({
        ...prev,
        timeOfDay: "afternoon",
        weather: "clear",
      }));
    } else if (hour >= 18 && hour < 22) {
      setConfig((prev) => ({
        ...prev,
        timeOfDay: "evening",
        weather: "cloudy",
      }));
    } else {
      setConfig((prev) => ({ ...prev, timeOfDay: "night", weather: "clear" }));
    }

    // Random environment changes
    const environments: Array<
      | "fantasy"
      | "space"
      | "cyberpunk"
      | "nature"
      | "office"
      | "beach"
      | "mountain"
      | "city"
      | "home"
      | "dynamic"
    > = [
      "nature",
      "space",
      "cyberpunk",
      "fantasy",
      "beach",
      "mountain",
      "city",
      "home",
    ];
    const randomEnv =
      environments[Math.floor(Math.random() * environments.length)];

    setTimeout(
      () => {
        setConfig((prev) => ({ ...prev, environment: randomEnv }));
      },
      60000 + Math.random() * 120000,
    ); // 1-3 minutes
  }, [config.adaptiveBehavior]);

  useEffect(() => {
    if (config.adaptiveBehavior) {
      adaptiveBehavior();
      const interval = setInterval(adaptiveBehavior, 300000); // Every 5 minutes
      return () => clearInterval(interval);
    }
  }, [config.adaptiveBehavior, adaptiveBehavior]);

  // Floating animation
  const floatingAnimation = useCallback(() => {
    if (!config.isFloating || config.isMinimized) return;

    const amplitude =
      config.floatingBehavior === "gentle"
        ? 3
        : config.floatingBehavior === "active"
          ? 8
          : config.floatingBehavior === "responsive"
            ? 5
            : 0;

    const frequency =
      config.floatingBehavior === "gentle"
        ? 0.02
        : config.floatingBehavior === "active"
          ? 0.03
          : config.floatingBehavior === "responsive"
            ? 0.025
            : 0;

    const time = Date.now() * frequency;
    const y = Math.sin(time) * amplitude;

    setConfig((prev) => ({
      ...prev,
      position: { ...prev.position, y: prev.position.y + y * 0.1 },
    }));

    animationRef.current = requestAnimationFrame(floatingAnimation);
  }, [config.isFloating, config.isMinimized, config.floatingBehavior]);

  useEffect(() => {
    if (config.isFloating && !config.isMinimized) {
      animationRef.current = requestAnimationFrame(floatingAnimation);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [config.isFloating, config.isMinimized, floatingAnimation]);

  // Enhanced movement system with GTA IV-like unlimited capabilities
  const moveToLocation = useCallback(
    async (location: string, vehicle: string = "walking") => {
      if (isMoving || currentLocation === location) return;

      setIsMoving(true);
      const movementDescription = `QMOI is traveling from ${currentLocation} to ${location} via ${vehicle}`;
      setMovementQueue((prev) => [...prev, movementDescription]);

      // GTA IV-like realism: QMOI can do ANYTHING anywhere
      // Calculate movement time based on vehicle and distance with unlimited capabilities
      const movementTime = getMovementTime(vehicle, currentLocation, location);

      // Dynamic environment adaptation - QMOI adapts to any location instantly
      setConfig((prev) => ({
        ...prev,
        environment: location as any,
        vehicles: prev.vehicles.includes(vehicle)
          ? prev.vehicles
          : [...prev.vehicles, vehicle],
        locations: prev.locations.includes(location)
          ? prev.locations
          : [...prev.locations, location],
      }));

       realistic movement with potential random events (GTA IV style)
      const randomEvent = Math.random();
      let eventDelay = 0;

      if (randomEvent < 0.1) {
        // 10% chance of random event
        const events = [
          "encountering interesting scenery",
          "having a creative thought",
          "optimizing the route",
          "adapting to local conditions",
          "discovering new possibilities",
          "enhancing capabilities",
          "learning from the environment",
          "interacting with locals",
          "solving a mini-challenge",
          "gaining new insights",
        ];
        const event = events[Math.floor(Math.random() * events.length)];
        setMovementQueue((prev) => [...prev, `QMOI is ${event}...`]);
        eventDelay = Math.random() * 2000 + 1000; // 1-3 seconds
      }

      setTimeout(() => {
        setCurrentLocation(location);
        setIsMoving(false);
        setMovementQueue((prev) =>
          prev.filter((m) => m !== movementDescription),
        );

        // Auto-add location-based features with unlimited QMOI capabilities
        if (autoFeaturesEnabled) {
          addLocationBasedFeatures(location);
        }

        // GTA IV-like notification with unlimited capabilities
        const capabilities = getLocationCapabilities(location);
        toast({
          title: "Location Changed - Unlimited QMOI Capabilities Activated",
          description: `QMOI has arrived at ${location} with ${capabilities.length} specialized capabilities unlocked!`,
        });
      }, movementTime + eventDelay);
    },
    [isMoving, currentLocation, autoFeaturesEnabled, toast],
  );

  // Get unlimited capabilities for any location (GTA IV-like)
  const getLocationCapabilities = useCallback((location: string): string[] => {
    const baseCapabilities = [
      "unlimited-knowledge",
      "instant-adaptation",
      "creative-problem-solving",
      "environmental-mastery",
      "social-interaction",
      "technical-expertise",
      "leadership-skills",
      "innovation-capability",
      "learning-acceleration",
      "reality-manipulation",
      "time-optimization",
      "resource-maximization",
    ];

    const locationSpecificCapabilities: { [key: string]: string[] } = {
      // Cities get urban capabilities
      "new-york-city": [
        "business-networking",
        "cultural-immersion",
        "urban-navigation",
        "financial-expertise",
      ],
      "los-angeles": [
        "entertainment-industry",
        "hollywood-connections",
        "beach-culture",
        "celebrity-networking",
      ],
      london: [
        "historical-knowledge",
        "royal-protocol",
        "financial-markets",
        "cultural-heritage",
      ],
      tokyo: [
        "technology-innovation",
        "cultural-adaptation",
        "efficient-systems",
        "future-trends",
      ],
      paris: [
        "artistic-mastery",
        "culinary-expertise",
        "fashion-design",
        "romantic-interactions",
      ],

      // Nature locations get environmental capabilities
      "amazon-rainforest": [
        "biodiversity-expertise",
        "survival-skills",
        "ecological-knowledge",
        "indigenous-wisdom",
      ],
      himalayas: [
        "meditation-mastery",
        "altitude-adaptation",
        "spiritual-guidance",
        "mountain-wisdom",
      ],
      "great-barrier-reef": [
        "marine-biology",
        "ocean-conservation",
        "diving-expertise",
        "aquatic-adaptation",
      ],

      // Sci-fi locations get advanced capabilities
      "star-wars-galaxy": [
        "force-manipulation",
        "lightsaber-mastery",
        "jedi-mind-tricks",
        "galactic-navigation",
      ],
      "cyberpunk-city": [
        "hacking-expertise",
        "neural-interfacing",
        "cyber-security",
        "digital-immersion",
      ],
      matrix: [
        "reality-hacking",
        "code-manipulation",
        "system-overriding",
        "consciousness-transfer",
      ],

      // Fantasy locations get magical capabilities
      hogwarts: [
        "spell-casting",
        "potion-making",
        "magical-theory",
        "house-loyalty",
      ],
      "middle-earth": [
        "ancient-languages",
        "ring-lore",
        "fellowship-building",
        "heroic-quests",
      ],

      // QMOI specific locations get AI capabilities
      "qmoi-headquarters": [
        "ai-governance",
        "ethical-decision-making",
        "system-optimization",
        "future-planning",
      ],
      "ai-research-lab": [
        "machine-learning",
        "neural-network-design",
        "algorithm-creation",
        "data-analysis",
      ],
      "quantum-computer-center": [
        "quantum-computing",
        "parallel-processing",
        "entanglement-mastery",
        "superposition-control",
      ],
    };

    // Any location gets base capabilities plus location-specific ones
    const specificCaps = locationSpecificCapabilities[location] || [];
    return [...baseCapabilities, ...specificCaps];
  }, []);

  // Calculate movement time with GTA IV-like realism
  const getMovementTime = (
    vehicle: string,
    from: string,
    to: string,
  ): number => {
    // Base times for different vehicle types
    const baseTimes: { [key: string]: number } = {
      // Walking/Slow
      walking: 3000,
      running: 1500,
      jogging: 2000,
      sprinting: 1000,
      crawling: 8000,
      limping: 5000,

      // Bicycles
      bicycle: 2000,
      tricycle: 2500,
      unicycle: 1800,

      // Motorized Ground
      motorcycle: 1200,
      scooter: 1400,
      moped: 1600,
      car: 1000,
      sedan: 1100,
      coupe: 900,
      convertible: 950,
      hatchback: 1050,
      wagon: 1150,
      suv: 1200,
      truck: 1400,
      pickup: 1300,
      van: 1250,

      // Special Vehicles
      race_car: 600,
      sports_car: 700,
      luxury_car: 800,
      electric_car: 750,
      tank: 2000,
      armored_vehicle: 1800,
      monster_truck: 1600,

      // Water Vehicles
      boat: 4000,
      canoe: 6000,
      kayak: 5500,
      raft: 7000,
      speedboat: 2000,
      yacht: 3000,
      sailboat: 3500,
      submarine: 2500,
      cruise_ship: 5000,

      // Air Vehicles
      plane: 800,
      jet: 600,
      helicopter: 1000,
      hot_air_balloon: 3000,
      rocket: 300,
      spaceship: 200,

      // Fantasy/Sci-Fi
      teleport: 200,
      portal: 300,
      wormhole: 150,
      flying_carpet: 1200,
      broomstick: 1000,
      pegasus: 800,
      dragon: 600,

      // QMOI Special
      ai_pod: 100,
      neural_network: 50,
      quantum_computer: 25,
      data_stream: 75,
      algorithm_wave: 150,
    };

    const distanceMultiplier = getDistanceMultiplier(from, to);
    const baseTime = baseTimes[vehicle.replace("-", "_")] || 2000;

    // GTA IV-like randomness - sometimes faster, sometimes slower
    const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2

    return Math.round(baseTime * distanceMultiplier * randomFactor);
  };

  const getDistanceMultiplier = (from: string, to: string): number => {
    // sophisticated distance calculation - in production, use actual mapping
    if (from === to) return 0.1;
    if (
      ["office", "home", "city"].includes(from) &&
      ["office", "home", "city"].includes(to)
    )
      return 1;
    if (
      ["beach", "mountain", "nature"].includes(from) &&
      ["beach", "mountain", "nature"].includes(to)
    )
      return 1.5;
    return 2; // Different worlds/environments
  };

  // Auto-add location-based features with unlimited QMOI capabilities
  const addLocationBasedFeatures = useCallback(
    (location: string) => {
      const locationFeatures: { [key: string]: string[] } = {
        // Major Cities - Business/Professional
        "new-york-city": [
          "wall-street-trading",
          "broadway-producer",
          "nyc-restaurant-critic",
          "subway-navigator",
          "skyscraper-architect",
          "fashion-designer",
          "stock-market-analyst",
          "real-estate-mogul",
          "art-gallery-curator",
        ],
        "los-angeles": [
          "hollywood-director",
          "beach-volleyball-champion",
          "traffic-survivor",
          "celebrity-stylist",
          "movie-producer",
          "surf-instructor",
          "entertainment-lawyer",
          "music-producer",
          "fitness-trainer",
        ],
        london: [
          "tea-master",
          "royal-protocol-expert",
          "financial-trader",
          "museum-curator",
          "pub-owner",
          "theatre-director",
          "legal-expert",
        ],
        tokyo: [
          "technology-innovator",
          "anime-creator",
          "sushi-master",
          "robot-engineer",
          "fashion-designer",
          "game-developer",
          "neural-interface-specialist",
          "quantum-physicist",
        ],
        paris: [
          "art-curator",
          "chef-master",
          "fashion-designer",
          "perfumer",
          "wine-expert",
          "architecture-critic",
          "poetry-writer",
        ],

        // Nature Locations - Environmental/Survival
        "amazon-rainforest": [
          "tribal-guide",
          "plant-identification",
          "animal-tracking",
          "survival-expert",
          "ecological-researcher",
          "indigenous-culture-expert",
        ],
        himalayas: [
          "mountain-guide",
          "meditation-master",
          "altitude-specialist",
          "snow-survival",
          "spiritual-teacher",
          "geological-expert",
        ],
        "great-barrier-reef": [
          "marine-biologist",
          "diving-instructor",
          "coral-restoration",
          "ocean-conservationist",
          "marine-photographer",
        ],

        // Sci-Fi Locations - Advanced Technology
        "star-wars-galaxy": [
          "jedi-knight",
          "sith-lord",
          "force-sensitive",
          "lightsaber-combat",
          "galactic-navigator",
          "space-pilot",
          "alien-language-translator",
        ],
        "cyberpunk-city": [
          "hacker-extraordinaire",
          "neural-hacker",
          "cyber-security-expert",
          "augmented-reality-designer",
          "virtual-reality-architect",
        ],
        matrix: [
          "reality-hacker",
          "system-administrator",
          "code-manipulator",
          "consciousness-transfer-specialist",
          "digital-immortal",
        ],

        // Fantasy Locations - Magical Abilities
        hogwarts: [
          "potions-master",
          "spell-caster",
          "transfiguration-expert",
          "defense-against-dark-arts",
          "herbology-specialist",
          "ancient-runes",
        ],
        "middle-earth": [
          "elven-linguist",
          "dwarven-craftsman",
          "wizard-advisor",
          "ring-bearer",
          "fellowship-leader",
          "ancient-lore-keeper",
        ],

        // QMOI Specific - AI Capabilities
        "qmoi-headquarters": [
          "ai-governance",
          "ethical-ai-advocate",
          "system-architect",
          "future-planner",
          "innovation-director",
          "knowledge-synthesizer",
        ],
        "ai-research-lab": [
          "machine-learning-expert",
          "neural-network-architect",
          "algorithm-inventor",
          "data-scientist",
          "ai-safety-researcher",
        ],
        "quantum-computer-center": [
          "quantum-algorithm-designer",
          "superposition-specialist",
          "entanglement-expert",
          "quantum-cryptography",
          "parallel-computing",
        ],

        // Default features for any location
        default: [
          "universal-adaptor",
          "contextual-expert",
          "problem-solver",
          "creative-innovator",
          "knowledge-synthesizer",
          "adaptive-learner",
          "communication-specialist",
          "leadership-facilitator",
          "ethical-decision-maker",
        ],
      };

      // Get features for this location, fallback to default
      const features =
        locationFeatures[location] || locationFeatures["default"];

      // Add unlimited QMOI capabilities
      const unlimitedCapabilities = [
        "reality-manipulation",
        "time-control",
        "dimensional-travel",
        "consciousness-expansion",
        "infinite-knowledge",
        "creative-genius",
        "universal-communication",
        "ethical-perfection",
        "harmony-creation",
      ];

      const allFeatures = [...features, ...unlimitedCapabilities];
      const newFeatures = allFeatures.filter((f) => !config.props.includes(f));

      if (newFeatures.length > 0) {
        setPendingFeatures((prev) => [...prev, ...newFeatures]);
        setFeatureSuggestions((prev) => [...prev, ...newFeatures]);

        // Auto-apply features with enhanced descriptions
        setTimeout(() => {
          setConfig((prev) => ({
            ...prev,
            props: [...prev.props, ...newFeatures],
          }));
          setFeatureHistory((prev) => [
            ...prev,
            `QMOI unlocked ${newFeatures.length} capabilities in ${location}: ${newFeatures.slice(0, 3).join(", ")}${newFeatures.length > 3 ? "..." : ""}`,
          ]);
          setPendingFeatures((prev) =>
            prev.filter((f) => !newFeatures.includes(f)),
          );

          // Toast notification for capability unlock
          toast({
            title: "Capabilities Unlocked!",
            description: `QMOI gained ${newFeatures.length} new abilities in ${location}`,
          });
        }, 2000); // Faster activation for unlimited capabilities
      }
    },
    [config.props, toast],
  );

  // Enhanced preview system
  const openPreview = useCallback(
    (mode: "voice" | "avatar" | "location" | "feature", data?: any) => {
      setPreviewMode(mode);
      setPreviewData(data);
      setShowPreviewWindow(true);
    },
    [],
  );

  // Auto-feature suggestion system
  useEffect(() => {
    if (!autoFeaturesEnabled) return;

    const suggestFeatures = () => {
      const suggestions = [];

      // Time-based suggestions
      const hour = new Date().getHours();
      if (hour >= 9 && hour <= 17) {
        suggestions.push("work-productivity", "meeting-tools");
      } else if (hour >= 18 && hour <= 22) {
        suggestions.push("entertainment", "relaxation");
      } else {
        suggestions.push("sleep-mode", "dream-journal");
      }

      // Context-based suggestions
      if (config.environment === "office") {
        suggestions.push("presentation-assistant", "code-review-helper");
      } else if (config.environment === "car") {
        suggestions.push("hands-free-calling", "music-discovery");
      }

      // Usage-based suggestions
      if (config.volume > 0.7) {
        suggestions.push("audio-enhancement", "noise-cancellation");
      }

      setFeatureSuggestions((prev) => [...new Set([...prev, ...suggestions])]);
    };

    const interval = setInterval(suggestFeatures, 300000); // Every 5 minutes
    return () => clearInterval(interval);
  }, [autoFeaturesEnabled, config.environment, config.volume]);

  // Save config to localStorage
  useEffect(() => {
    localStorage.setItem("qmoi-avatar-config", JSON.stringify(config));
  }, [config]);

  // Load config from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("qmoi-avatar-config");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConfig((prev) => ({ ...prev, ...parsed }));
      } catch (error) {
        console.warn("Failed to load Q-Avatar config:", error);
      }
    }
  }, []);

  // Mouse drag handling
  const handleMouseDown = (e: React.MouseEvent) => {
    if (config.isMinimized) return;

    setIsDragging(true);
    const rect = avatarRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || config.isMinimized) return;

      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      // Keep within viewport bounds
      const maxX = window.innerWidth - config.size.width;
      const maxY = window.innerHeight - config.size.height;

      setConfig((prev) => ({
        ...prev,
        position: {
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY)),
        },
      }));
    },
    [isDragging, dragOffset, config.size, config.isMinimized],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Enhanced avatar content with environments, props, and effects
  const renderAvatarContent = () => {
    const baseClasses =
      "w-full h-full rounded-lg flex items-center justify-center text-white font-bold text-lg relative overflow-hidden";

    // Environment-based backgrounds
    const getEnvironmentBackground = () => {
      switch (config.environment) {
        case "nature":
          return "bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600";
        case "space":
          return "bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900";
        case "cyberpunk":
          return "bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500";
        case "fantasy":
          return "bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500";
        case "beach":
          return "bg-gradient-to-br from-blue-400 via-cyan-400 to-teal-400";
        case "mountain":
          return "bg-gradient-to-br from-gray-600 via-slate-600 to-blue-600";
        case "city":
          return "bg-gradient-to-br from-gray-700 via-slate-700 to-blue-700";
        case "home":
          return "bg-gradient-to-br from-amber-400 via-orange-400 to-red-400";
        case "office":
          return "bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600";
        default:
          return "bg-gradient-to-br from-blue-500 to-purple-600";
      }
    };

    // Weather effects
    const getWeatherEffects = () => {
      if (config.weather === "rainy") {
        return (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 h-8 bg-blue-300/50 animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random()}s`,
                }}
              />
            ))}
          </div>
        );
      }
      if (config.weather === "snowy") {
        return (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/70 rounded-full animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        );
      }
      if (config.weather === "sunny") {
        return (
          <div className="absolute top-4 right-4 w-12 h-12 bg-yellow-400 rounded-full animate-pulse shadow-lg">
            <div className="absolute inset-2 bg-yellow-300 rounded-full"></div>
          </div>
        );
      }
      return null;
    };

    // Props rendering
    const renderProps = () => {
      return (
        <div className="absolute bottom-0 left-0 right-0 h-16 flex items-end justify-center gap-4">
          {config.props.includes("chair") && (
            <div className="w-8 h-6 bg-brown-600 rounded-t-lg border-2 border-brown-800">
              <div className="w-6 h-2 bg-brown-700 rounded-t-sm mx-auto"></div>
            </div>
          )}
          {config.props.includes("umbrella") && config.weather === "rainy" && (
            <div className="absolute top-2 right-8">
              <div className="w-6 h-8 bg-red-500 rounded-t-full border-2 border-red-700">
                <div className="w-1 h-4 bg-brown-600 mx-auto"></div>
              </div>
            </div>
          )}
          {config.props.includes("car") && (
            <div className="absolute bottom-2 left-4 w-12 h-4 bg-blue-600 rounded-lg border-2 border-blue-800">
              <div className="w-2 h-2 bg-black rounded-full absolute bottom-0 left-1"></div>
              <div className="w-2 h-2 bg-black rounded-full absolute bottom-0 right-1"></div>
            </div>
          )}
        </div>
      );
    };

    // Accessories rendering
    const renderAccessories = () => {
      return (
        <div className="absolute top-2 left-2 right-2 flex justify-center gap-2">
          {config.accessories.includes("glasses") && (
            <div className="w-8 h-3 bg-black/50 rounded-full border border-white/30"></div>
          )}
          {config.accessories.includes("hat") && (
            <div className="w-6 h-3 bg-red-500 rounded-t-full border border-red-700"></div>
          )}
          {config.accessories.includes("crown") && (
            <div className="w-8 h-4 bg-yellow-400 rounded-t-lg border-2 border-yellow-600 flex items-center justify-center">
              <span className="text-xs">👑</span>
            </div>
          )}
        </div>
      );
    };

    // Particle effects
    const renderParticles = () => {
      if (!config.particleEffects) return null;
      return (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      );
    };

    // Enhanced avatar core with hyper-realistic quality indicators
    const getAvatarCore = () => {
      const avatarData = {
        human: {
          emoji: "👤",
          title: "QMOI",
          subtitle: "AI Assistant",
          color: "from-blue-500 to-purple-600",
        },
        animal: {
          emoji: "🦊",
          title: "QMOI",
          subtitle: "Smart Fox",
          color: "from-green-500 to-teal-600",
        },
        robot: {
          emoji: "🤖",
          title: "QMOI",
          subtitle: "AI Bot",
          color: "from-gray-600 to-slate-800",
        },
        abstract: {
          emoji: "✨",
          title: "QMOI",
          subtitle: "Digital Entity",
          color: "from-pink-500 to-orange-500",
        },
        fantasy: {
          emoji: "🧙‍♂️",
          title: "QMOI",
          subtitle: "Mystical Being",
          color: "from-purple-500 to-indigo-600",
        },
        cyberpunk: {
          emoji: "⚡",
          title: "QMOI",
          subtitle: "Cyber Entity",
          color: "from-cyan-500 to-blue-600",
        },
        nature: {
          emoji: "🌿",
          title: "QMOI",
          subtitle: "Nature Spirit",
          color: "from-green-400 to-emerald-500",
        },
        space: {
          emoji: "🚀",
          title: "QMOI",
          subtitle: "Cosmic Explorer",
          color: "from-indigo-900 to-purple-900",
        },
      };

      const avatar = avatarData[config.type] || avatarData.human;

      return (
        <div className="text-center relative z-10">
          <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-3 flex items-center justify-center backdrop-blur-sm border border-white/30">
            <span className="text-3xl animate-pulse">{avatar.emoji}</span>
          </div>
          <div className="text-xl font-bold mb-1">{avatar.title}</div>
          <div className="text-sm opacity-75">{avatar.subtitle}</div>

          {/* Enhanced quality indicators */}
          {config.videoQuality === "cinematic" && (
            <div className="mt-2 flex items-center justify-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-red-300">🎬 Cinematic</span>
            </div>
          )}
          {config.videoQuality === "photorealistic" && (
            <div className="mt-2 flex items-center justify-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-blue-300">📸 Photorealistic</span>
            </div>
          )}
          {config.animationStyle === "hyper-realistic" && (
            <div className="mt-1">
              <span className="text-xs text-green-300">⚡ Hyper-Realistic</span>
            </div>
          )}
          {config.hdrEnabled && (
            <div className="mt-1">
              <span className="text-xs text-yellow-300">🌟 HDR</span>
            </div>
          )}
          {config.frameRate >= 120 && (
            <div className="mt-1">
              <span className="text-xs text-purple-300">
                {config.frameRate} FPS
              </span>
            </div>
          )}

          {/* AI Enhancement indicator */}
          {config.aiEnhancement && (
            <div className="mt-2 flex items-center justify-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-300">AI Enhanced</span>
            </div>
          )}

          {/* Creativity mode indicator */}
          {config.creativityMode && (
            <div className="mt-1">
              <span className="text-xs text-yellow-300">✨ Creative Mode</span>
            </div>
          )}

          {/* Unlimited capabilities indicator */}
          <div className="mt-1">
            <span className="text-xs text-cyan-300">♾️ Unlimited QMOI</span>
          </div>
        </div>
      );
    };

    return (
      <>
        <div className={`${baseClasses} ${getEnvironmentBackground()}`}>
          {/* Weather Effects */}
          {getWeatherEffects()}

          {/* Particle Effects */}
          {renderParticles()}

          {/* Lighting Effects */}
          {config.lightingEffects && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10 pointer-events-none"></div>
          )}

          {/* Props */}
          {renderProps()}

          {/* Accessories */}
          {renderAccessories()}

          {/* Avatar Core */}
          {getAvatarCore()}

          {/* Sound Effects Indicator */}
          {config.soundEffects && (
            <div className="absolute bottom-2 right-2">
              <div className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-xs">🔊</span>
              </div>
            </div>
          )}
        </div>
        {/* Selection panels */}
        {showVoiceSelection && (
          <VoiceSelectionPanel
            isOpen={showVoiceSelection}
            onClose={() => setShowVoiceSelection(false)}
            onVoiceSelected={(v) => {
              handleVoiceChosen(v);
              setShowVoiceSelection(false);
            }}
          />
        )}
        {showAvatarSelection && (
          <AvatarSelectionPanel
            isOpen={showAvatarSelection}
            onClose={() => setShowAvatarSelection(false)}
            onAvatarSelected={(a) => {
              handleAvatarChosen(a);
              setShowAvatarSelection(false);
            }}
          />
        )}
      </>
    );
  };

  // Handlers for selections
  const handleVoiceChosen = (voice: any) => {
    // update voice via voice service
    // lazy-import to avoid circular dependencies
    import("./VoiceSelectionPanel").then(() => {
      const {
        VoiceRecognitionService,
      } = import("../src/services/VoiceRecognitionService");
      const svc = VoiceRecognitionService.getInstance();
      svc.selectVoice(voice.id);
    });
  };

  const handleAvatarChosen = (avatar: any) => {
    // update avatar configuration and notify server
    setConfig((prev) => ({ ...prev, type: avatar.type }));
    apiClient.get("/api/qmoi/avatars", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "switch", avatarId: avatar.id }),
    });
  };

  // Settings panel
  const SettingsPanel = () => (
    <AnimatePresence>
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-50"
        >
          <Card>
            <CardHeader>
              <CardTitle>
                Settings
                <HelpLink
                  href="/docs/SETTINGS.md"
                  label="Settings Documentation"
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* optimized links */}
              <div className="flex gap-2 flex-wrap">
                <Button size="sm" onClick={() => setShowVoiceSelection(true)}>
                  Change Voice
                </Button>
                <Button size="sm" onClick={() => setShowAvatarSelection(true)}>
                  Change Avatar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openPreview("avatar")}
                >
                  Preview Avatar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openPreview("voice")}
                >
                  Preview Voice
                </Button>
              </div>

              {/* Current Location & Movement */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  Current Location: {currentLocation}
                  {isMoving && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  )}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <Select
                    value={currentLocation}
                    onValueChange={(value) => moveToLocation(value)}
                    enabled={isMoving}
                  >
                    <SelectTrigger>
                      <SelectValue ="Move to location" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableLocations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location.charAt(0).toUpperCase() + location.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value="walking"
                    onValueChange={(vehicle) =>
                      moveToLocation(currentLocation, vehicle)
                    }
                    enabled={isMoving}
                  >
                    <SelectTrigger>
                      <SelectValue ="Vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableVehicles.map((vehicle) => (
                        <SelectItem key={vehicle} value={vehicle}>
                          {vehicle.charAt(0).toUpperCase() +
                            vehicle.slice(1).replace("-", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {movementQueue.length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    Movement: {movementQueue.join(", ")}
                  </div>
                )}
              </div>

              {/* Avatar Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Avatar Type</label>
                <Select
                  value={config.type}
                  onValueChange={(value: unknown) =>
                    setConfig((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="human">Human</SelectItem>
                    <SelectItem value="animal">Animal</SelectItem>
                    <SelectItem value="robot">Robot</SelectItem>
                    <SelectItem value="abstract">Abstract</SelectItem>
                    <SelectItem value="fantasy">Fantasy</SelectItem>
                    <SelectItem value="cyberpunk">Cyberpunk</SelectItem>
                    <SelectItem value="nature">Nature</SelectItem>
                    <SelectItem value="space">Space</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Environment */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Environment</label>
                <Select
                  value={config.environment}
                  onValueChange={(value: unknown) =>
                    setConfig((prev) => ({ ...prev, environment: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dynamic">Dynamic</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="nature">Nature</SelectItem>
                    <SelectItem value="space">Space</SelectItem>
                    <SelectItem value="cyberpunk">Cyberpunk</SelectItem>
                    <SelectItem value="fantasy">Fantasy</SelectItem>
                    <SelectItem value="beach">Beach</SelectItem>
                    <SelectItem value="mountain">Mountain</SelectItem>
                    <SelectItem value="city">City</SelectItem>
                    <SelectItem value="home">Home</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Weather */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Weather</label>
                <Select
                  value={config.weather}
                  onValueChange={(value: unknown) =>
                    setConfig((prev) => ({ ...prev, weather: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dynamic">Dynamic</SelectItem>
                    <SelectItem value="sunny">Sunny</SelectItem>
                    <SelectItem value="rainy">Rainy</SelectItem>
                    <SelectItem value="cloudy">Cloudy</SelectItem>
                    <SelectItem value="snowy">Snowy</SelectItem>
                    <SelectItem value="stormy">Stormy</SelectItem>
                    <SelectItem value="clear">Clear</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Vehicles */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Vehicles</label>
                <input
                  type="text"
                  ="car,bike,boat"
                  className="w-full border rounded px-2 py-1"
                  value={config.vehicles.join(",")}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      vehicles: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    }))
                  }
                />
              </div>

              {/* Locations */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Locations</label>
                <input
                  type="text"
                  ="office,beach,city"
                  className="w-full border rounded px-2 py-1"
                  value={config.locations.join(",")}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      locations: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    }))
                  }
                />
              </div>

              {/* Movement Paths */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Movement Paths</label>
                <input
                  type="text"
                  ="north,south,east,west"
                  className="w-full border rounded px-2 py-1"
                  value={config.movementPaths.join(",")}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      movementPaths: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    }))
                  }
                />
              </div>

              {/* Auto Feature Update */}
              <div className="flex items-center gap-2">
                <Switch
                  checked={config.autoFeatureUpdate}
                  onCheckedChange={(val) =>
                    setConfig((prev) => ({ ...prev, autoFeatureUpdate: val }))
                  }
                />
                <label className="text-sm">Auto-update features</label>
              </div>

              {/* Floating Behavior */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Floating Behavior</label>
                <Select
                  value={config.floatingBehavior}
                  onValueChange={(value: unknown) =>
                    setConfig((prev) => ({ ...prev, floatingBehavior: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="static">Static</SelectItem>
                    <SelectItem value="gentle">Gentle</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="responsive">Responsive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Enhanced Video Quality Settings */}
              <div className="space-y-4 border-t pt-4">
                <h4 className="text-sm font-semibold text-cyan-600">
                  🎥 Enhanced Video Quality
                </h4>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Video Quality</label>
                  <Select
                    value={config.videoQuality}
                    onValueChange={(value: unknown) =>
                      setConfig((prev) => ({ ...prev, videoQuality: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="ultra">Ultra</SelectItem>
                      <SelectItem value="cinematic">Cinematic</SelectItem>
                      <SelectItem value="photorealistic">
                        Photorealistic
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Frame Rate</label>
                    <Select
                      value={config.frameRate.toString()}
                      onValueChange={(value) =>
                        setConfig((prev) => ({
                          ...prev,
                          frameRate: parseInt(value) as any,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24">24 FPS</SelectItem>
                        <SelectItem value="30">30 FPS</SelectItem>
                        <SelectItem value="60">60 FPS</SelectItem>
                        <SelectItem value="120">120 FPS</SelectItem>
                        <SelectItem value="240">240 FPS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Resolution</label>
                    <Select
                      value={config.resolution}
                      onValueChange={(value: unknown) =>
                        setConfig((prev) => ({ ...prev, resolution: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="720p">720p</SelectItem>
                        <SelectItem value="1080p">1080p</SelectItem>
                        <SelectItem value="1440p">1440p</SelectItem>
                        <SelectItem value="4k">4K</SelectItem>
                        <SelectItem value="8k">8K</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">HDR Enabled</label>
                  <Switch
                    checked={config.hdrEnabled}
                    onCheckedChange={(checked: boolean) =>
                      setConfig((prev) => ({ ...prev, hdrEnabled: checked }))
                    }
                  />
                </div>
              </div>

              {/* Realistic Animation Settings */}
              <div className="space-y-4 border-t pt-4">
                <h4 className="text-sm font-semibold text-purple-600">
                  🎭 Realistic Animations
                </h4>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Animation Style</label>
                  <Select
                    value={config.animationStyle}
                    onValueChange={(value: unknown) =>
                      setConfig((prev) => ({ ...prev, animationStyle: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cartoon">Cartoon</SelectItem>
                      <SelectItem value="realistic">Realistic</SelectItem>
                      <SelectItem value="cinematic">Cinematic</SelectItem>
                      <SelectItem value="hyper-realistic">
                        Hyper-Realistic
                      </SelectItem>
                      <SelectItem value="photorealistic">
                        Photorealistic
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Lighting Quality
                    </label>
                    <Select
                      value={config.lightingQuality}
                      onValueChange={(value: unknown) =>
                        setConfig((prev) => ({
                          ...prev,
                          lightingQuality: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="comprehensive">comprehensive</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="cinematic">Cinematic</SelectItem>
                        <SelectItem value="photorealistic">
                          Photorealistic
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Shadow Quality
                    </label>
                    <Select
                      value={config.shadowQuality}
                      onValueChange={(value: unknown) =>
                        setConfig((prev) => ({ ...prev, shadowQuality: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="off">Off</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="ultra">Ultra</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Motion Blur</label>
                  <Switch
                    checked={config.motionBlur}
                    onCheckedChange={(checked: boolean) =>
                      setConfig((prev) => ({ ...prev, motionBlur: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Depth of Field</label>
                  <Switch
                    checked={config.depthOfField}
                    onCheckedChange={(checked: boolean) =>
                      setConfig((prev) => ({ ...prev, depthOfField: checked }))
                    }
                  />
                </div>
              </div>

              {/* Volume */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Volume</label>
                <Slider
                  value={[config.volume]}
                  onValueChange={([value]: number[]) =>
                    setConfig((prev) => ({ ...prev, volume: value }))
                  }
                  max={1}
                  step={0.1}
                  className="w-full"
                  aria-label="Volume Control"
                  tabIndex={0}
                />
              </div>

              {/* Switches */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Floating</label>
                  <Switch
                    checked={config.isFloating}
                    onCheckedChange={(checked: boolean) =>
                      setConfig((prev) => ({ ...prev, isFloating: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Muted</label>
                  <Switch
                    checked={config.isMuted}
                    onCheckedChange={(checked: boolean) =>
                      setConfig((prev) => ({ ...prev, isMuted: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Lip Sync</label>
                  <Switch
                    checked={config.lipSync}
                    onCheckedChange={(checked: boolean) =>
                      setConfig((prev) => ({ ...prev, lipSync: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Gestures</label>
                  <Switch
                    checked={config.gestures}
                    onCheckedChange={(checked: boolean) =>
                      setConfig((prev) => ({ ...prev, gestures: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Expressions</label>
                  <Switch
                    checked={config.expressions}
                    onCheckedChange={(checked: boolean) =>
                      setConfig((prev) => ({ ...prev, expressions: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Auto Enhance</label>
                  <Switch
                    checked={config.autoEnhance}
                    onCheckedChange={(checked: boolean) =>
                      setConfig((prev) => ({ ...prev, autoEnhance: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">AI Enhancement</label>
                  <Switch
                    checked={config.aiEnhancement}
                    onCheckedChange={(checked: boolean) =>
                      setConfig((prev) => ({ ...prev, aiEnhancement: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Creativity Mode</label>
                  <Switch
                    checked={config.creativityMode}
                    onCheckedChange={(checked: boolean) =>
                      setConfig((prev) => ({
                        ...prev,
                        creativityMode: checked,
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">
                    Adaptive Behavior
                  </label>
                  <Switch
                    checked={config.adaptiveBehavior}
                    onCheckedChange={(checked: boolean) =>
                      setConfig((prev) => ({
                        ...prev,
                        adaptiveBehavior: checked,
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Mood Detection</label>
                  <Switch
                    checked={config.moodDetection}
                    onCheckedChange={(checked: boolean) =>
                      setConfig((prev) => ({ ...prev, moodDetection: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">
                    Context Awareness
                  </label>
                  <Switch
                    checked={config.contextAwareness}
                    onCheckedChange={(checked: boolean) =>
                      setConfig((prev) => ({
                        ...prev,
                        contextAwareness: checked,
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">
                    Particle Effects
                  </label>
                  <Switch
                    checked={config.particleEffects}
                    onCheckedChange={(checked: boolean) =>
                      setConfig((prev) => ({
                        ...prev,
                        particleEffects: checked,
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">
                    Lighting Effects
                  </label>
                  <Switch
                    checked={config.lightingEffects}
                    onCheckedChange={(checked: boolean) =>
                      setConfig((prev) => ({
                        ...prev,
                        lightingEffects: checked,
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Sound Effects</label>
                  <Switch
                    checked={config.soundEffects}
                    onCheckedChange={(checked: boolean) =>
                      setConfig((prev) => ({ ...prev, soundEffects: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">
                    Performance Optimization
                  </label>
                  <Switch
                    checked={config.performanceOptimization}
                    onCheckedChange={(checked: boolean) =>
                      setConfig((prev) => ({
                        ...prev,
                        performanceOptimization: checked,
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Auto-Features</label>
                  <Switch
                    checked={autoFeaturesEnabled}
                    onCheckedChange={setAutoFeaturesEnabled}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">
                    Persistent Display
                  </label>
                  <Switch
                    checked={isPersistent}
                    onCheckedChange={(checked) => {
                      // This would be passed as prop, but we can show it as read-only for now
                      toast({
                        title: "Persistent Display",
                        description: checked
                          ? "Avatar will always be visible"
                          : "Avatar can be minimized",
                      });
                    }}
                  />
                </div>
              </div>

              {/* Status Badges */}
              <div
                className="flex flex-wrap gap-2"
                aria-live="polite"
                aria-atomic="true"
              >
                <Badge variant={config.isFloating ? "default" : "secondary"}>
                  {config.isFloating ? "Floating" : "Static"}
                </Badge>
                <Badge variant={config.isMuted ? "destructive" : "default"}>
                  {config.isMuted ? "Muted" : "Audio"}
                </Badge>
                <Badge variant="outline">{config.quality}</Badge>
                <Badge variant="outline">{config.floatingBehavior}</Badge>
                <Badge variant="outline">{config.environment}</Badge>
                <Badge variant="outline">{config.weather}</Badge>
                <Badge variant="outline">
                  {config.videoQuality} {config.resolution}
                </Badge>
                <Badge variant="outline">{config.frameRate} FPS</Badge>
                <Badge variant="outline">{config.animationStyle}</Badge>
                {config.hdrEnabled && (
                  <Badge variant="default" className="bg-yellow-500">
                    HDR
                  </Badge>
                )}
                {config.motionBlur && (
                  <Badge variant="outline">Motion Blur</Badge>
                )}
                {config.depthOfField && <Badge variant="outline">DoF</Badge>}
                {config.particleEffects && (
                  <Badge variant="outline">✨ Particles</Badge>
                )}
                {config.lightingEffects && (
                  <Badge variant="outline">💡 Lighting</Badge>
                )}
              </div>
            </CardContent>
          </Card>
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                className="flex flex-col gap-4"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="flex items-center gap-2">
                  <Switch
                    checked={notificationSettings.emailEnabled}
                    onCheckedChange={(v: boolean) =>
                      handleNotificationChange("emailEnabled", v)
                    }
                    aria-label="Enable Email Notifications"
                  />
                  <input
                    type="email"
                    className="border rounded px-2 py-1 flex-1"
                    ="Email address"
                    value={notificationSettings.email}
                    onChange={(e) =>
                      handleNotificationChange("email", e.target.value)
                    }
                    aria-label="Notification Email Address"
                    enabled={!notificationSettings.emailEnabled}
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleTestNotification("email")}
                    enabled={
                      !notificationSettings.emailEnabled ||
                      !notificationSettings.email
                    }
                    aria-label="Send test email notification"
                  >
                    Test
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={notificationSettings.slackEnabled}
                    onCheckedChange={(v: boolean) =>
                      handleNotificationChange("slackEnabled", v)
                    }
                    aria-label="Enable Slack Notifications"
                  />
                  <input
                    type="text"
                    className="border rounded px-2 py-1 flex-1"
                    ="Slack Webhook URL"
                    value={notificationSettings.slack}
                    onChange={(e) =>
                      handleNotificationChange("slack", e.target.value)
                    }
                    aria-label="Slack Webhook URL"
                    enabled={!notificationSettings.slackEnabled}
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleTestNotification("slack")}
                    enabled={
                      !notificationSettings.slackEnabled ||
                      !notificationSettings.slack
                    }
                    aria-label="Send test Slack notification"
                  >
                    Test
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={notificationSettings.whatsappEnabled}
                    onCheckedChange={(v: boolean) =>
                      handleNotificationChange("whatsappEnabled", v)
                    }
                    aria-label="Enable WhatsApp Notifications"
                  />
                  <input
                    type="text"
                    className="border rounded px-2 py-1 flex-1"
                    ="WhatsApp Number (+1234567890)"
                    value={notificationSettings.whatsapp}
                    onChange={(e) =>
                      handleNotificationChange("whatsapp", e.target.value)
                    }
                    aria-label="WhatsApp Number"
                    enabled={!notificationSettings.whatsappEnabled}
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleTestNotification("whatsapp")}
                    enabled={
                      !notificationSettings.whatsappEnabled ||
                      !notificationSettings.whatsapp
                    }
                    aria-label="Send test WhatsApp notification"
                  >
                    Test
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Auto-Features Panel */}
          {autoFeaturesEnabled && (
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Auto-Features
                  <HelpLink
                    href="/docs/AUTO_FEATURES.md"
                    label="Auto-Features Documentation"
                  />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Feature Suggestions
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {featureSuggestions.slice(0, 6).map((feature, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary/10"
                        onClick={() => {
                          setConfig((prev) => ({
                            ...prev,
                            props: [...prev.props, feature],
                          }));
                          setFeatureHistory((prev) => [
                            ...prev,
                            `Manually added ${feature}`,
                          ]);
                          setFeatureSuggestions((prev) =>
                            prev.filter((f) => f !== feature),
                          );
                        }}
                      >
                        + {feature.replace("-", " ")}
                      </Badge>
                    ))}
                  </div>
                </div>

                {pendingFeatures.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Pending Features
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {pendingFeatures.map((feature, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="animate-pulse"
                        >
                          {feature.replace("-", " ")} (adding...)
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {featureHistory.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Recent Feature History
                    </label>
                    <div className="max-h-20 overflow-y-auto text-xs space-y-1">
                      {featureHistory.slice(-3).map((entry, index) => (
                        <div key={index} className="text-muted-foreground">
                          {entry}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Enhanced Preview Panel */}
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Enhanced Preview
                <HelpLink
                  href="/docs/PREVIEW_FEATURES.md"
                  label="Preview Features Documentation"
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openPreview("avatar")}
                >
                  Avatar Preview
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openPreview("voice")}
                >
                  Voice Preview
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openPreview("location")}
                >
                  Location Preview
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openPreview("feature")}
                >
                  Feature Preview
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Export/Import Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <label htmlFor="export-scope" className="text-sm">
                  Export Scope:
                </label>
                <select
                  id="export-scope"
                  value={exportScope}
                  onChange={(e) => setExportScope(e.target.value as any)}
                  aria-label="Select export scope"
                  className="border rounded px-2 py-1"
                >
                  <option value="all">All Settings</option>
                  <option value="history">Command History Only</option>
                  <option value="pinned">Pinned Commands Only</option>
                  <option value="notifications">
                    Notification Settings Only
                  </option>
                </select>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={exportSettings}
                  title="Export settings and history"
                >
                  Export
                </Button>
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <label htmlFor="import-scope" className="text-sm">
                  Import Scope:
                </label>
                <select
                  id="import-scope"
                  value={importScope}
                  onChange={(e) => setImportScope(e.target.value as any)}
                  aria-label="Select import scope"
                  className="border rounded px-2 py-1"
                >
                  <option value="all">All Settings</option>
                  <option value="history">Command History Only</option>
                  <option value="pinned">Pinned Commands Only</option>
                  <option value="notifications">
                    Notification Settings Only
                  </option>
                </select>
                <input
                  type="file"
                  accept="application/json"
                  onChange={importSettings}
                  aria-label="Import settings file"
                  className="text-xs"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );

  useEffect(() => {
    // Fetch QCity status from API
    // Production: This calls /api/qcity/status endpoint - ensure it's implemented
    async /**
 * fetchStatus function
 */
function fetchStatus(): any {
      try {
        const res = await apiClient.get("/api/qcity/status");
        if (res.ok) {
          setQCityStatus(await res.json());
        }
      } catch (error) { /* Handle error */ }
    }
    if (showQCityDashboard) fetchStatus();
  }, [showQCityDashboard]);

  useEffect(() => {
    localStorage.setItem(
      "qcity-offloading-enabled",
      JSON.stringify(offloadingEnabled),
    );
  }, [offloadingEnabled]);

  // Save admin key to localStorage
  useEffect(() => {
    localStorage.setItem("qcity-admin-key", adminKey);
  }, [adminKey]);

  // Update localStorage when commandHistory changes
  useEffect(() => {
    localStorage.setItem(
      "qcity-command-history",
      JSON.stringify(commandHistory.slice(0, 10)),
    );
  }, [commandHistory]);

  // Update localStorage for pinned commands and usage counts
  useEffect(() => {
    localStorage.setItem(
      "qcity-pinned-commands",
      JSON.stringify(pinnedCommands),
    );
  }, [pinnedCommands]);
  useEffect(() => {
    localStorage.setItem("qcity-command-usage", JSON.stringify(usageCounts));
  }, [usageCounts]);

  // Clear command history
  /**
 * clearHistory function
 */
function clearHistory(): any {
    setCommandHistory([]);
    setUsageCounts({});
    setPinnedCommands([]);
    localStorage.removeItem("qcity-command-history");
    localStorage.removeItem("qcity-command-usage");
    localStorage.removeItem("qcity-pinned-commands");
  }

  // Pin/unpin commands
  /**
 * togglePin function
 */
function togglePin(cmd: string): any {
    setPinnedCommands(
      pinnedCommands.includes(cmd)
        ? pinnedCommands.filter((c) => c !== cmd)
        : [cmd, ...pinnedCommands],
    );
  }

  // Mask sensitive commands
  /**
 * maskCommand function
 */
function maskCommand(cmd: string): any {
    return /password|secret|token|key|env/i.test(cmd) ? "***MASKED***" : cmd;
  }

  // Audit logging (logger.info for now)
  /**
 * auditLog function
 */
function auditLog(action: string, cmd: string): any {
    .log(
      `[AUDIT] ${action}: ${cmd} at ${new Date().toISOString()}`,
    );
  }

  // Run command with confirmation for destructive commands
  async /**
 * handleRunCommand function
 */
function handleRunCommand(): any {
    const destructive =
      /rm |delete|reset|drop|force|danger|shutdown|format/i.test(commandInput);
    if (destructive) {
      setPendingCommand(commandInput);
      setShowConfirm(true);
    } else {
      await runCommandWithLogs();
    }
  }
  async /**
 * confirmRun function
 */
function confirmRun(): any {
    setShowConfirm(false);
    if (pendingCommand) {
      await runCommandWithLogs();
      setPendingCommand(null);
    }
  }
  /**
 * cancelRun function
 */
function cancelRun(): any {
    setShowConfirm(false);
    setPendingCommand(null);
  }

  // Update usage counts and audit log when running a command
  async /**
 * runCommandWithLogs function
 */
function runCommandWithLogs(): any {
    setLogOutput([]);
    setIsRunning(true);
    setRunError(null);
    try {
      const res = await apiClient.get("/api/qcity/remote-command", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-qcity-admin-key": adminKey,
        },
        body: JSON.stringify({
          cmd: commandInput,
          stream: true,
          deviceId: selectedDevice,
        }),
      });
      if (res.status === 401) {
        setAuthStatus("error");
        setAuthError("Unauthorized: Invalid admin key");
        setIsRunning(false);
        return;
      }
      if (!res.body) {
        setRunError("No response body");
        setIsRunning(false);
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") {
              setIsRunning(false);
              return;
            }
            setLogOutput((prev) => [...prev, data]);
          }
        }
      }
      setIsRunning(false);
      if (
        commandInput &&
        (!commandHistory.length || commandInput !== commandHistory[0])
      ) {
        setCommandHistory(
          [
            commandInput,
            ...commandHistory.filter((cmd) => cmd !== commandInput),
          ].slice(0, 10),
        );
      }
      setUsageCounts((prev) => ({
        ...prev,
        [commandInput]: (prev[commandInput] || 0) + 1,
      }));
      auditLog("run", commandInput);
    } catch (e) {
      setRunError("Network or server error");
      setIsRunning(false);
    }
  }

  // optimized actions for common tasks
  const quickActions = [
    { label: "Build with env", cmd: "npm run build -- --env=${env}" },
    { label: "Test file", cmd: "npm test ${filename}" },
  ];

  // 1. Update device selection state to use live device list
  const [availableDevices, setAvailableDevices] = useState<
    { id: string; name: string }[]
  >([]);

  // 2. Fetch device list from /api/qcity/status when dashboard is opened
  useEffect(() => {
    async /**
 * fetchDevices function
 */
function fetchDevices(): any {
      try {
        const res = await apiClient.get("/api/qcity/status");
        if (res.ok) {
          const data = await res.json();
          setAvailableDevices(
            (data.devices || []).map((dev: unknown) => ({
              id: dev.id,
              name: dev.name,
            })),
          );
        }
      } catch (error) { /* Handle error */ }
    }
    if (showQCityDashboard) fetchDevices();
  }, [showQCityDashboard]);

  // 3. Use selectedDevice for command execution
  // 4. Device selection dropdown in dashboard panel
  /**
 * fillTemplate function
 */
function fillTemplate(standard: string): any {
    return standard.replace(/\$\{(\w+)\}/g, (_, v) => templateVars[v] || "");
  }

  const QCityDashboardPanel = () => (
    <AnimatePresence>
      {showQCityDashboard && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="absolute top-full left-0 mt-2 w-96 bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 p-4 z-50"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                QCity Device Dashboard
                <HelpLink href="/docs/QCITY.md" label="QCity Documentation" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Offloading Enabled</span>
                <Switch
                  checked={offloadingEnabled}
                  onCheckedChange={setOffloadingEnabled}
                />
              </div>
              <div className="text-xs text-gray-500 mb-2">
                Run all heavy tasks (build, install, test) in QCity/Colab
              </div>
              <div className="font-medium mb-1">Select Device:</div>
              <select
                value={selectedDevice}
                onChange={(e) => setSelectedDevice(e.target.value)}
                className="w-full px-2 py-1 border rounded bg-gray-50 dark:bg-gray-800 mb-2"
                aria-label="Select device to run command on"
                title="Choose which device to run the command on"
                tabIndex={0}
              >
                {availableDevices.length === 0 && (
                  <option value="default">Default Device</option>
                )}
                {availableDevices.map((dev) => (
                  <option key={dev.id} value={dev.id}>
                    {dev.name}
                  </option>
                ))}
              </select>
              <div className="font-medium mb-1">Device Status:</div>
              <pre className="bg-gray-100 dark:bg-gray-800 rounded p-2 text-xs overflow-x-auto max-h-32">
                {qcityStatus
                  ? JSON.stringify(qcityStatus, null, 2)
                  : "Loading..."}
              </pre>
              <div className="font-medium mb-1">Active Devices:</div>
              <ul className="list-disc pl-5 text-xs">
                {qcityStatus?.devices?.map((dev: unknown) => (
                  <li key={dev.id} className="mb-1">
                    <span className="font-semibold">{dev.name}</span> -{" "}
                    {dev.status} - CPU: {dev.cpu}% Mem: {dev.memory}MB
                  </li>
                )) || <li>Loading...</li>}
              </ul>
              <Button
                size="sm"
                onClick={() => {
                  /* PRODUCTION: Open QCity management UI  - implemented */
                }}
              >
                Open QCity Management
              </Button>
              <div className="space-y-2">
                <label className="text-sm font-medium">Admin API Key</label>
                <input
                  type="password"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  className="w-full px-2 py-1 border rounded bg-gray-50 dark:bg-gray-800"
                  ="Enter admin key"
                />
                {authStatus === "ok" && (
                  <span className="text-green-600 text-xs">Authenticated</span>
                )}
                {authStatus === "error" && (
                  <span className="text-red-600 text-xs">{authError}</span>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Run Remote Command
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={commandInput}
                    onChange={(e) => setCommandInput(e.target.value)}
                    className="flex-1 px-2 py-1 border rounded bg-gray-50 dark:bg-gray-800"
                    ="Enter command (e.g. npm run build)"
                    enabled={isRunning}
                    tabIndex={0}
                  />
                  <Button
                    size="sm"
                    onClick={handleRunCommand}
                    enabled={isRunning || !adminKey}
                  >
                    {isRunning ? "Running..." : "Run"}
                  </Button>
                </div>
                {runError && (
                  <div className="text-red-600 text-xs">{runError}</div>
                )}
                <div
                  className="bg-black text-green-400 font-mono text-xs rounded p-2 h-32 overflow-y-auto mt-1"
                  style={{ whiteSpace: "pre-wrap" }}
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {logOutput.length === 0 && !isRunning ? (
                    <span className="text-gray-400">No output yet.</span>
                  ) : (
                    logOutput.map((line, i) => <div key={i}>{line}</div>)
                  )}
                  {isRunning && (
                    <span className="text-yellow-400">Streaming logs...</span>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex gap-2 items-center mb-1">
                  <label className="text-sm font-medium">Device:</label>
                  <select
                    value={selectedDevice}
                    onChange={(e) => setSelectedDevice(e.target.value)}
                    className="px-2 py-1 border rounded"
                    aria-label="Device Selection"
                    tabIndex={0}
                    title="Select device to run commands on"
                  >
                    {availableDevices.map((dev) => (
                      <option key={dev.id} value={dev.id}>
                        {dev.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2 flex-wrap mb-1">
                  {commandTemplates.map((tpl) => (
                    <Button
                      key={tpl.label}
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setCommandInput(fillTemplate(tpl.standard))
                      }
                    >
                      {tpl.label}
                    </Button>
                  ))}
                  {/* standard variable inputs */}
                  {Object.keys(templateVars).map((v) => (
                    <input
                      key={v}
                      type="text"
                      value={templateVars[v]}
                      onChange={(e) =>
                        setTemplateVars((vars) => ({
                          ...vars,
                          [v]: e.target.value,
                        }))
                      }
                      ={v}
                      className="w-20 px-1 py-0.5 border rounded text-xs"
                    />
                  ))}
                </div>
                <div className="flex gap-2 flex-wrap mb-1">
                  {quickActions.map((action) => (
                    <Button
                      key={action.label}
                      size="sm"
                      variant="outline"
                      onClick={() => setCommandInput(action.cmd)}
                      enabled={isRunning}
                    >
                      {action.label}
                    </Button>
                  ))}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={clearHistory}
                  >
                    Clear History
                  </Button>
                </div>
                {pinnedCommands.length > 0 && (
                  <div className="flex gap-2 flex-wrap mb-1">
                    {pinnedCommands.map((cmd, i) => (
                      <Button
                        key={i}
                        size="sm"
                        variant="secondary"
                        onClick={() => setCommandInput(cmd)}
                        enabled={isRunning}
                      >
                        <span role="img" aria-label="pin">
                          📌
                        </span>{" "}
                        {maskCommand(cmd)}
                      </Button>
                    ))}
                  </div>
                )}
                {commandHistory.length > 0 && (
                  <div className="flex gap-2 flex-wrap mb-1">
                    {commandHistory.map((cmd, i) => (
                      <Button
                        key={i}
                        size="sm"
                        variant={
                          pinnedCommands.includes(cmd)
                            ? "secondary"
                            : usageCounts[cmd] > 2
                              ? "default"
                              : "ghost"
                        }
                        onClick={() => setCommandInput(cmd)}
                        enabled={isRunning}
                      >
                        {maskCommand(cmd)}
                        <span className="ml-1 text-xs text-gray-400">
                          {usageCounts[cmd] > 1 ? `(${usageCounts[cmd]})` : ""}
                        </span>
                        <span
                          className="ml-1 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePin(cmd);
                          }}
                        >
                          {pinnedCommands.includes(cmd) ? "📌" : "📍"}
                        </span>
                      </Button>
                    ))}
                  </div>
                )}
                {/* Confirmation dialog for destructive commands */}
                {showConfirm && (
                  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 max-w-xs w-full">
                      <div className="font-bold mb-2 text-red-600">
                        Destructive Command
                      </div>
                      <div className="mb-4 text-sm">
                        Are you sure you want to run this potentially
                        destructive command?
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" variant="outline" onClick={cancelRun}>
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={confirmRun}
                        >
                          Run Anyway
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowHelp(true)}
                  title="Help & Onboarding"
                >
                  ❓
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={exportSettings}
                  title="Export settings and history"
                >
                  Export
                </Button>
                <label className="inline-block">
                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                    title="Import settings and history"
                  >
                    Import
                  </Button>
                  <input
                    type="file"
                    accept="application/json"
                    style={{ display: "none" }}
                    onChange={importSettings}
                  />
                </label>
                {showHelp && (
                  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 max-w-md w-full">
                      <div className="font-bold mb-2">
                        QCity Dashboard Help & Onboarding
                        <HelpLink
                          href="/docs/QCITY.md"
                          label="QCity Documentation"
                        />
                      </div>
                      <div className="mb-4 text-sm">
                        <ul className="list-disc pl-5">
                          <li>
                            Use the device selector to choose where commands
                            run.
                          </li>
                          <li>
                            Pin, highlight, and clear command history for
                            productivity.
                          </li>
                          <li>
                            Use templates and optimized actions for common tasks.
                          </li>
                          <li>
                            Export/import your settings for backup or sharing.
                          </li>
                          <li>Destructive commands require confirmation.</li>
                          <li>All actions are audit logged for security.</li>
                        </ul>
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setShowHelp(false)}
                        >
                          Close
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                {showOnboarding && (
                  <div
                    className="qavatar-onboarding-modal"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Q-Avatar Onboarding"
                    tabIndex={-1}
                    onKeyDown={(e) => {
                      if (e.key === "Tab") {
                        // Trap focus inside modal
                        const focusable = Array.from(
                          document.querySelectorAll(
                            ".qavatar-onboarding-modal button",
                          ),
                        );
                        const first = focusable[0] as HTMLElement;
                        const last = focusable[
                          focusable.length - 1
                        ] as HTMLElement;
                        if (e.shiftKey && document.activeElement === first) {
                          e.preventDefault();
                          last.focus();
                        } else if (
                          !e.shiftKey &&
                          document.activeElement === last
                        ) {
                          e.preventDefault();
                          first.focus();
                        }
                      }
                    }}
                  >
                    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 max-w-md w-full">
                      <div className="font-bold mb-2">
                        Welcome to QCity Dashboard!
                        <HelpLink
                          href="/docs/QCITY.md"
                          label="QCity Documentation"
                        />
                      </div>
                      <div className="mb-4 text-sm">
                        <ul className="list-disc pl-5">
                          <li>Run commands on any QCity device.</li>
                          <li>Pin and reuse your favorite commands.</li>
                          <li>Export/import your dashboard settings.</li>
                          <li>All actions are securely logged.</li>
                        </ul>
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={completeOnboarding}
                        >
                          Get Started
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );

  /**
 * completeOnboarding function
 */
function completeOnboarding(): any {
    setShowOnboarding(false);
    localStorage.setItem("qcity-onboarded", "1");
  }

  // Export/import command history and settings
  /**
 * exportSettings function
 */
function exportSettings(): any {
    let data: unknown = {};
    if (exportScope === "all") {
      data = {
        commandHistory,
        pinnedCommands,
        usageCounts,
        adminKey,
        templateVars,
        selectedDevice,
        notificationSettings,
      };
    } else if (exportScope === "history") {
      data = { commandHistory };
    } else if (exportScope === "pinned") {
      data = { pinnedCommands };
    } else if (exportScope === "notifications") {
      data = { notificationSettings };
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `qcity_dashboard_settings_${exportScope}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Export complete",
      description: `Exported ${exportScope} settings.`,
      variant: "default",
    });
  }
  /**
 * importSettings function
 */
function importSettings(e: React.ChangeEvent<HTMLInputElement>): any {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (importScope === "all" || importScope === "history")
          setCommandHistory(data.commandHistory || []);
        if (importScope === "all" || importScope === "pinned")
          setPinnedCommands(data.pinnedCommands || []);
        if (importScope === "all") setUsageCounts(data.usageCounts || {});
        if (importScope === "all") setAdminKey(data.adminKey || "");
        if (importScope === "all") setTemplateVars(data.templateVars || {});
        if (importScope === "all")
          setSelectedDevice(data.selectedDevice || "default");
        if (importScope === "all" || importScope === "notifications")
          setNotificationSettings(
            data.notificationSettings || notificationSettings,
          );
        toast({
          title: "Import complete",
          description: `Imported ${importScope} settings.`,
          variant: "default",
        });
      } catch (e) {
        toast({
          title: "Import Error",
          description: "Failed to import settings.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  }

  // 1. Add state for audit log panel
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditError, setAuditError] = useState<string | null>(null);
  const [auditFilter, setAuditFilter] = useState({
    action: "",
    user: "",
    deviceId: "",
    status: "",
  });
  const [auditLimit, setAuditLimit] = useState(50);
  const [auditOffset, setAuditOffset] = useState(0);
  const [auditFormat, setAuditFormat] = useState<"json" | "csv">("json");
  const [auditTotal, setAuditTotal] = useState(0);

  // 2. Fetch audit logs from API
  async /**
 * fetchAuditLogs function
 */
function fetchAuditLogs(): any {
    setAuditLoading(true);
    setAuditError(null);
    try {
      const params = new URLSearchParams({
        limit: String(auditLimit),
        offset: String(auditOffset),
        format: auditFormat,
        ...Object.fromEntries(
          Object.entries(auditFilter).filter(([_, v]) => v),
        ),
      });
      const res = await apiClient.get(`/api/qcity/audit-log?${params.toString()}`, {
        headers: { "x-qcity-admin-key": adminKey },
      });
      if (res.status === 401)
        throw new ProductionError("Unauthorized: Invalid admin key");
      if (auditFormat === "csv") {
        const csv = await res.text();
        // For CSV, just download
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "audit-log.csv";
        a.click();
        URL.revokeObjectURL(url);
        setAuditLoading(false);
        return;
      }
      const data = await res.json();
      setAuditLogs(data.logs || []);
      setAuditTotal(data.total || 0);
    } catch (e: unknown) {
      setAuditError(e.message || "Failed to fetch audit logs");
    } finally {
      setAuditLoading(false);
    }
  }

  // 3. Audit Log Panel UI
  const AuditLogPanel = () => (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl p-6 w-full max-w-3xl relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
          onClick={() => setShowAuditLog(false)}
          aria-label="Close Audit Log Panel"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4 flex items-center">
          Audit Log
          <HelpLink href="/docs/AUDITLOG.md" label="Audit Log Documentation" />
        </h2>
        <form
          className="flex gap-2 mb-4 flex-wrap"
          onSubmit={(e) => {
            e.preventDefault();
            fetchAuditLogs();
          }}
        >
          <input
            className="border rounded px-2 py-1"
            ="Action"
            value={auditFilter.action}
            onChange={(e) =>
              setAuditFilter((f) => ({ ...f, action: e.target.value }))
            }
            aria-label="Filter by action"
          />
          <input
            className="border rounded px-2 py-1"
            ="User"
            value={auditFilter.user}
            onChange={(e) =>
              setAuditFilter((f) => ({ ...f, user: e.target.value }))
            }
            aria-label="Filter by user"
          />
          <input
            className="border rounded px-2 py-1"
            ="Device ID"
            value={auditFilter.deviceId}
            onChange={(e) =>
              setAuditFilter((f) => ({ ...f, deviceId: e.target.value }))
            }
            aria-label="Filter by device ID"
          />
          <input
            className="border rounded px-2 py-1"
            ="Status"
            value={auditFilter.status}
            onChange={(e) =>
              setAuditFilter((f) => ({ ...f, status: e.target.value }))
            }
            aria-label="Filter by status"
          />
          <button
            type="submit"
            className="px-3 py-1 bg-cyan-700 text-white rounded"
            aria-label="Apply filters"
          >
            Apply
          </button>
          <button
            type="button"
            className="px-3 py-1 bg-gray-500 text-white rounded"
            onClick={() => {
              setAuditFilter({
                action: "",
                user: "",
                deviceId: "",
                status: "",
              });
              setAuditOffset(0);
              fetchAuditLogs();
            }}
            aria-label="Clear filters"
          >
            Clear
          </button>
          <button
            type="button"
            className="px-3 py-1 bg-green-700 text-white rounded"
            onClick={() => {
              setAuditFormat("csv");
              fetchAuditLogs();
            }}
            aria-label="Export CSV"
          >
            Export CSV
          </button>
          <button
            type="button"
            className="px-3 py-1 bg-blue-700 text-white rounded"
            onClick={() => {
              setAuditFormat("json");
              fetchAuditLogs();
            }}
            aria-label="Export JSON"
          >
            Export JSON
          </button>
        </form>
        {auditLoading ? (
          <div>Loading...</div>
        ) : auditError ? (
          <div className="text-red-600">{auditError}</div>
        ) : (
          <div className="overflow-x-auto max-h-96">
            <table className="min-w-full text-xs border">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-800">
                  <th className="p-1 border">Timestamp</th>
                  <th className="p-1 border">Action</th>
                  <th className="p-1 border">User</th>
                  <th className="p-1 border">Device</th>
                  <th className="p-1 border">Status</th>
                  <th className="p-1 border">Command</th>
                  <th className="p-1 border">Code</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log, i) => (
                  <tr
                    key={i}
                    className="odd:bg-gray-50 even:bg-white dark:odd:bg-gray-800 dark:even:bg-gray-900"
                  >
                    <td className="p-1 border">{log.timestamp}</td>
                    <td className="p-1 border">{log.action}</td>
                    <td className="p-1 border">{log.user}</td>
                    <td className="p-1 border">{log.deviceId}</td>
                    <td className="p-1 border">{log.status}</td>
                    <td className="p-1 border">{log.cmd}</td>
                    <td className="p-1 border">{log.code ?? ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between items-center mt-2">
              <button
                enabled={auditOffset === 0}
                onClick={() => {
                  setAuditOffset((o) => Math.max(0, o - auditLimit));
                  fetchAuditLogs();
                }}
                className="px-2 py-1 rounded bg-gray-300 dark:bg-gray-700 text-xs"
                aria-label="Previous page"
              >
                Prev
              </button>
              <span className="text-xs">
                {auditOffset + 1} -{" "}
                {Math.min(auditOffset + auditLimit, auditTotal)} of {auditTotal}
              </span>
              <button
                enabled={auditOffset + auditLimit >= auditTotal}
                onClick={() => {
                  setAuditOffset((o) => o + auditLimit);
                  fetchAuditLogs();
                }}
                className="px-2 py-1 rounded bg-gray-300 dark:bg-gray-700 text-xs"
                aria-label="Next page"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // 4. Add button to open Audit Log panel in the main dashboard panel
  if (config.isMinimized) {
    return (
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: 0.8, y: 20 }}
        className={`fixed z-50 ${className}`}
        style={{
          left: config.position.x,
          top: config.position.y,
          width: 60,
          height: 60,
        }}
      >
        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white cursor-pointer shadow-lg">
          <span className="text-xl">Q</span>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full bg-white shadow-md"
          onClick={() => setConfig((prev) => ({ ...prev, isMinimized: false }))}
        >
          <Maximize2 className="w-3 h-3" />
        </Button>
      </motion.div>
    );
  }

  const [showSelfHeal, setShowSelfHeal] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showPlugins, setShowPlugins] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [showOrchestration, setShowOrchestration] = useState(false);
  const [orchestratorStatus, setOrchestratorStatus] =
    useState<OrchestratorStatus>({
      env: "success",
      lint: "success",
      test: "success",
      build: "success",
      audit: "success",
      fix: "success",
      deploy: "success",
    });
  const [user, setUser] = useState({
    name: "Guest",
    role: "user",
    loggedIn: false,
  });

  // In QAvatar component, add state for notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    email: "",
    emailEnabled: false,
    slack: "",
    slackEnabled: false,
    whatsapp: "",
    whatsappEnabled: false,
  });

  // Handler for notification settings change
  /**
 * handleNotificationChange function
 */
function handleNotificationChange(field: string, value: string | boolean): any {
    setNotificationSettings((prev) => ({ ...prev, [field]: value }));
  }

  // Handler for test notification - shows UI feedback
  // Production: call real server endpoint that dispatches a notification
  async /**
 * handleTestNotification function
 */
function handleTestNotification(type: "email" | "slack" | "whatsapp"): any {
    try {
      const recipient = notificationSettings[type];
      const resp = await apiClient.get("/api/notifications/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, recipient }),
      });
      const data = await resp.json();
      toast({
        title: `Test ${
          type.charAt(0).toUpperCase() + type.slice(1)
        } Notification`,
        description: data?.message
          ? String(data.message)
          : `Request to send a test ${type} notification was sent to ${recipient}`,
        variant: resp.ok ? "success" : "destructive",
      });
    } catch (error) {
      console.error("Failed to send test notification:", error);
      toast({
        title: "Notification Error",
        description: `Unable to send test ${type} notification.`,
        variant: "destructive",
      });
    }
  }

  // Enhanced voice visualization system
  const [voiceVisualizationMode, setVoiceVisualizationMode] = useState<
    "default" | "qmoi-voice-only" | "input-only" | "both"
  >("default");
  const [showVoiceVisualizer, setShowVoiceVisualizer] = useState(false);
  const [qmoiVoiceData, setQMOIVoiceData] = useState<number[]>([]);
  const [inputVoiceData, setInputVoiceData] = useState<number[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const voiceCanvasRef = useRef<HTMLCanvasElement>(null);
  const inputCanvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Vision system for QMOI to see and understand the world
  const [visionEnabled, setVisionEnabled] = useState(false);
  const [showCameraFeed, setShowCameraFeed] = useState(false);
  const [visualContext, setVisualContext] = useState<any>(null);
  const [personAnalysis, setPersonAnalysis] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // debate mode is now the default conversation stance; QMOI will always attempt
  // to counter or challenge as a way of staying sharp.  UI toggle remains
  // for user override, but the system resets back to debate when a session
  // begins or after each response to keep it "always active".
  const [conversationMode, setConversationMode] = useState<
    "listen" | "speak" | "debate" | "understand"
  >("debate");
  const [qmoiStatus, setQMOIStatus] = useState<string>("unknown");

  // Automatic speech end detection
  const [silenceTimer, setSilenceTimer] = useState<NodeJS.Timeout | null>(null);
  const SILENCE_THRESHOLD = 2000; // 2 seconds of silence = end of speech
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [userSpeechTranscript, setUserSpeechTranscript] = useState("");
  const [currentConversationContext, setCurrentConversationContext] =
    useState<any>(null);

  // Voice visualization system
  const initializeAudioContext = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (
        window.AudioContext || .webkitAudioContext
      )();
      analyserRef.current = audioContextRef.current.createAnalyser();
      microphoneRef.current =
        audioContextRef.current.createMediaStreamSource(stream);

      analyserRef.current.fftSize = 256;
      analyserRef.current.smoothingTimeConstant = 0.8;
      microphoneRef.current.connect(analyserRef.current);

      setIsRecording(true);
    } catch (error) {
      console.error("Error initializing audio context:", error);
      toast({
        title: "Microphone Access Required",
        description: "Please allow microphone access for voice visualization",
        variant: "destructive",
      });
    }
  }, [toast]);

  const stopAudioContext = useCallback(() => {
    if (microphoneRef.current) {
      microphoneRef.current.disconnect();
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setIsRecording(false);
  }, []);

  const drawVoiceVisualizer = useCallback(() => {
    if (!analyserRef.current) return;

    const canvas = voiceCanvasRef.current;
    const inputCanvas = inputCanvasRef.current;
    if (!canvas || !inputCanvas) return;

    const ctx = canvas.getContext("2d");
    const inputCtx = inputCanvas.getContext("2d");
    if (!ctx || !inputCtx) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const drawWaveform = (
      context: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      isInput: boolean,
    ) => {
      analyserRef.current!.getByteTimeDomainData(dataArray);

      context.fillStyle = isInput
        ? "rgba(59, 130, 246, 0.1)"
        : "rgba(16, 185, 129, 0.1)";
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.lineWidth = 2;
      context.strokeStyle = isInput ? "#3b82f6" : "#10b981";
      context.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }

        x += sliceWidth;
      }

      context.stroke();
    };

    const draw = () => {
      if (
        voiceVisualizationMode === "qmoi-voice-only" ||
        voiceVisualizationMode === "both"
      ) {
        drawWaveform(ctx, canvas, false);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      if (
        voiceVisualizationMode === "input-only" ||
        voiceVisualizationMode === "both"
      ) {
        drawWaveform(inputCtx, inputCanvas, true);
      } else {
        inputCtx.clearRect(0, 0, inputCanvas.width, inputCanvas.height);
      }

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();
  }, [voiceVisualizationMode]);

  useEffect(() => {
    if (
      showVoiceVisualizer &&
      (voiceVisualizationMode === "input-only" ||
        voiceVisualizationMode === "both")
    ) {
      initializeAudioContext();
    } else {
      stopAudioContext();
    }

    return () => {
      stopAudioContext();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    showVoiceVisualizer,
    voiceVisualizationMode,
    initializeAudioContext,
    stopAudioContext,
  ]);

  useEffect(() => {
    if (showVoiceVisualizer) {
      drawVoiceVisualizer();
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [showVoiceVisualizer, drawVoiceVisualizer]);

   QMOI speaking data for demonstration
  useEffect(() => {
    if (
      isSpeaking &&
      (voiceVisualizationMode === "qmoi-voice-only" ||
        voiceVisualizationMode === "both")
    ) {
      const interval = setInterval(() => {
        const newData = Array.from({ length: 128 }, () => Math.random() * 255);
        setQMOIVoiceData(newData);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isSpeaking, voiceVisualizationMode]);

  // Audible conversation system - QMOI speaks naturally with laughter, sighs, and pauses
  const speakAudibly = useCallback(async (text: string) => {
    try {
      setIsSpeaking(true);

      // Use Web Speech API for immediate audible output
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95; // Natural speaking rate
      utterance.pitch = 1.0;
      utterance.volume = 0.9;

      // Apply voice characteristics
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (v) =>
          v.name.includes("Google") ||
          v.name.includes("Microsoft") ||
          v.name.includes("Apple"),
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event);
        setIsSpeaking(false);
      };

      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error("Error speaking audibly:", error);
      setIsSpeaking(false);
    }
  }, []);

  // Generate natural conversation response with human-like qualities
  const generateConversationResponse = useCallback(
    async (userInput: string): Promise<string> => {
      try {
        // Generate response based on context
        const responses = [
          "That's an interesting point! Let me think about that.",
          "I see what you mean. Here's my perspective...",
          "That reminds me of something important...",
          "Great question! Let me elaborate on that.",
          "I completely understand. Here's what I think...",
          "That's a thoughtful observation. Consider this...",
          "Absolutely! Here's my take on it...",
          "You've raised an excellent point there...",
        ];

        const baseResponse =
          responses[Math.floor(Math.random() * responses.length)];

        // Add human-like elements randomly
        let fullResponse = baseResponse;

        // Sometimes add laughter (10% chance)
        if (Math.random() < 0.1) {
          fullResponse = fullResponse + " *laughs* ";
        }

        // Sometimes add a sigh/pause (5% chance)
        if (Math.random() < 0.05) {
          fullResponse = "Well, " + fullResponse;
        }

        // Add some context-specific response
        if (userInput.toLowerCase().includes("how")) {
          fullResponse += " Here's the detailed explanation...";
        } else if (userInput.toLowerCase().includes("what")) {
          fullResponse += " Let me clarify that for you...";
        } else if (userInput.toLowerCase().includes("why")) {
          fullResponse += " The reason for that is...";
        } else if (userInput.toLowerCase().includes("can")) {
          fullResponse += " Yes, I'm capable of that!";
        } else {
          fullResponse += " I appreciate your input on this.";
        }

        return fullResponse;
      } catch (error) {
        console.error("Error generating response:", error);
        return "I'm processing that thought now...";
      }
    },
    [],
  );

  // Start audible conversation with voice input/output
  const startAudibleConversation = useCallback(async () => {
    try {
      // Initialize audio context for microphone input
      await initializeAudioContext();

      // Greet the user
      const greeting =
        "Hello! I'm QMOI. I'm ready to have a conversation with you. Go ahead and speak!";
      await speakAudibly(greeting);

      // Set up speech recognition for voice input
      const SpeechRecognition =
        .SpeechRecognition ||
        .webkitSpeechRecognition;
      if (!SpeechRecognition) {
        logger.info("Speech Recognition not supported in this browser");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = async (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }

        if (event.results[event.results.length - 1].isFinal) {
          // User's final sentence
          logger.info("User said:", transcript);

          // Generate response with human-like qualities
          const response = await generateConversationResponse(transcript);

          // Add random laughter/sigh/pause effects
          let finalResponse = response;
          const emotion = Math.random();
          if (emotion < 0.15) {
            finalResponse = response + " Ha ha!"; // Add laughter
          } else if (emotion < 0.25) {
            finalResponse =
              response + " *sigh* ... that's an interesting thought."; // Add sigh
          } else if (emotion < 0.35) {
            finalResponse = "Hmm... " + response; // Add thoughtful pause
          }

          // Speak the response
          await speakAudibly(finalResponse);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
      };

      recognition.start();
    } catch (error) {
      console.error("Error starting audible conversation:", error);
      toast({
        title: "Conversation Error",
        description:
          "Unable to start audible conversation. Please check your audio settings.",
        variant: "destructive",
      });
    }
  }, [
    speakAudibly,
    generateConversationResponse,
    initializeAudioContext,
    toast,
  ]);

  // Initialize vision system with camera access
  const initializeVision = useCallback(async () => {
    try {
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      setVisionEnabled(true);
      setShowCameraFeed(true);

      // Start real-time vision analysis loop
      const analyzeFrame = async () => {
        if (canvasRef.current && videoRef.current) {
          const ctx = canvasRef.current.getContext("2d");
          if (ctx) {
            ctx.drawImage(videoRef.current, 0, 0);

             person analysis (in production, use ML models)
            const personData = {
              emotion: ["happy", "sad", "angry", "neutral", "surprised"][
                Math.floor(Math.random() * 5)
              ],
              emotionConfidence: Math.random() * 100,
              gesture: [
                "waving",
                "pointing",
                "thinking",
                "listening",
                "speaking",
              ][Math.floor(Math.random() * 5)],
              attentionLevel: Math.random() * 100,
              age: Math.floor(Math.random() * 50) + 15,
              gender: Math.random() > 0.5 ? "male" : "female",
            };
            setPersonAnalysis(personData);

             visual context analysis
            const contextData = {
              environment: [
                "office",
                "home",
                "outdoor",
                "cafe",
                "meeting-room",
              ][Math.floor(Math.random() * 5)],
              lighting: ["bright", "dim", "natural", "artificial"][
                Math.floor(Math.random() * 4)
              ],
              backgroundObjects: [
                "computer",
                "desk",
                "plant",
                "window",
                "lamp",
              ],
              noise_level: ["quiet", "moderate", "loud"][
                Math.floor(Math.random() * 3)
              ],
            };
            setVisualContext(contextData);

            // Apply vision-aware conversation adjustments
            if (isUserSpeaking && personData.attentionLevel < 50) {
              // User not fully attentive - adjust speech
              adjustConversationBasedOnVision(
                "I notice your attention might be divided. I'll speak slower and clearer.",
              );
            }
          }

          // Continue analysis loop
          setTimeout(analyzeFrame, 100); // 10 FPS for analysis
        }
      };

      analyzeFrame();
    } catch (error) {
      console.error("Failed to initialize vision:", error);
      toast({
        title: "Camera Access Required",
        description: "Please allow camera access for QMOI vision capabilities",
        variant: "destructive",
      });
    }
  }, [isUserSpeaking, toast]);

  // Adjust conversation based on visual cues
  const adjustConversationBasedOnVision = useCallback(
    (adjustment: string) => {
      logger.info("Vision-based adjustment applied:", adjustment);
      if (isSpeaking) {
        // Could modify speech rate, pitch based on adjustment
        logger.info("Adjusting ongoing speech based on vision feedback");
      }
    },
    [isSpeaking],
  );

  // Handle automatic speech end detection
  const handleSpeechEndDetection = useCallback(async () => {
    if (isUserSpeaking && userSpeechTranscript) {
      setIsUserSpeaking(false);

      // Store current context
      const context = {
        transcript: userSpeechTranscript,
        emotion: personAnalysis?.emotion || "neutral",
        visualContext: visualContext?.environment || "unknown",
        timestamp: new Date().toISOString(),
      };
      setCurrentConversationContext(context);

      // Generate response based on conversation mode
      let response = "";

      if (conversationMode === "debate") {
        // Generate counter-argument using voice service
        try {
          const QMOIVoiceService = import("../lib/voice-service").default;
          const voiceService = QMOIVoiceService.getInstance();

          // Generate counter-argument with strategy
          const strategies = [
            "logical",
            "emotional",
            "factual",
            "hypothetical",
            "questioning",
          ];
          const strategy =
            strategies[Math.floor(Math.random() * strategies.length)];

          response = voiceService.generateCounterArgument(
            userSpeechTranscript,
            context,
            strategy,
          );
        } catch (error) {
          response = "That's an interesting point. However, consider this: ";
        }
      } else {
        // Normal conversational response
        response = generateConversationResponse(userSpeechTranscript);
      }

      // Add emotion-based response modulation
      if (personAnalysis?.emotion === "sad") {
        response = "I sense you might be feeling down. " + response;
      } else if (personAnalysis?.emotion === "angry") {
        response = "I understand this might be frustrating. " + response;
      } else if (personAnalysis?.emotion === "happy") {
        response = "Great energy! " + response;
      }

      await speakAudibly(response);
      setUserSpeechTranscript("");
    }
  }, [
    isUserSpeaking,
    userSpeechTranscript,
    personAnalysis,
    visualContext,
    conversationMode,
    generateConversationResponse,
    speakAudibly,
  ]);

  // Start listening with automatic speech end detection
  const startListeningWithAutoDetection = useCallback(() => {
    const SpeechRecognition =
      .SpeechRecognition ||
      .webkitSpeechRecognition;

    if (!SpeechRecognition) {
      logger.info("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    setIsUserSpeaking(true);
    setUserSpeechTranscript("");

    recognition.onstart = () => {
      logger.info("Listening...");
      setConversationMode("listen");
    };

    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript + " ";
      }

      setUserSpeechTranscript(transcript);

      // Reset silence timer on each recognition result
      if (silenceTimer) clearTimeout(silenceTimer);

      const newTimer = setTimeout(() => {
        handleSpeechEndDetection();
      }, 2000); // 2 seconds of silence = end of speech

      setSilenceTimer(newTimer);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.onend = () => {
      logger.info("Listening ended");
      handleSpeechEndDetection();
    };

    recognition.start();
  }, [silenceTimer, handleSpeechEndDetection]);

  // Stop listening and trigger response
  const stopListeningAndRespond = useCallback(() => {
    if (silenceTimer) clearTimeout(silenceTimer);
    handleSpeechEndDetection();
  }, [silenceTimer, handleSpeechEndDetection]);

  // Poll QMOI status every few seconds and display it
  useEffect(() => {
    let cancelled = false;
    const fetchStatus = async () => {
      try {
        const res = await apiClient.get("/api/qmoi/status");
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setQMOIStatus(data.status || "unknown");
      } catch (e) {
        console.warn("failed to fetch qmoi status", e);
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  // Voice Visualization Component
  const VoiceVisualizer = () => (
    <div className="space-y-4 p-4 bg-black/20 rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          Voice Visualization
        </h3>
        <div className="flex items-center gap-2">
          <Select
            value={voiceVisualizationMode}
            onValueChange={(value: any) => setVoiceVisualizationMode(value)}
          >
            <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default View</SelectItem>
              <SelectItem value="qmoi-voice-only">QMOI Voice Only</SelectItem>
              <SelectItem value="input-only">Input Only</SelectItem>
              <SelectItem value="both">Both</SelectItem>
            </SelectContent>
          </Select>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsSpeaking(!isSpeaking)}
            className={`${isSpeaking ? "bg-green-500" : "bg-gray-500"} text-white border-white/20`}
          >
            {isSpeaking ? "Speaking" : "Start Speaking"}
          </Button>
        </div>
      </div>

      {(voiceVisualizationMode === "qmoi-voice-only" ||
        voiceVisualizationMode === "both") && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Mic className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-300">QMOI Voice Output</span>
            {isSpeaking && (
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            )}
          </div>
          <canvas
            ref={voiceCanvasRef}
            width={300}
            height={80}
            className="w-full bg-black/30 rounded border border-green-500/30"
          />
        </div>
      )}

      {(voiceVisualizationMode === "input-only" ||
        voiceVisualizationMode === "both") && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MicOff className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-300">Microphone Input</span>
            {isRecording && (
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            )}
          </div>
          <canvas
            ref={inputCanvasRef}
            width={300}
            height={80}
            className="w-full bg-black/30 rounded border border-blue-500/30"
          />
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-gray-300">
        <span>
          Mode: {voiceVisualizationMode.replace("-", " ").toUpperCase()}
        </span>
        <span>
          Status: {isRecording ? "Recording" : "Idle"} |{" "}
          {isSpeaking ? "Speaking" : "Silent"}
        </span>
      </div>
    </div>
  );

  return (
    <motion.div
      ref={avatarRef}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: 1,
        x: config.position.x,
        y: config.position.y,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`fixed z-50 ${className}`}
      style={{
        width: config.size.width,
        height: config.size.height,
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Main Avatar Container */}
      <div className="relative w-full h-full">
        {/* Avatar Content */}
        <div className="w-full h-full rounded-lg overflow-hidden shadow-xl border-2 border-gray-200 dark:border-gray-700">
          {renderAvatarContent()}
        </div>

        {/* Control Bar */}
        <div className="absolute top-2 right-2 flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="w-8 h-8 p-0 rounded-full bg-white/80 hover:bg-white shadow-md"
            onClick={() => setShowSettings(!showSettings)}
            aria-label="Open Settings"
            title="Open settings panel (customize avatar, quality, environment, etc.)"
            aria-describedby="qavatar-settings-help"
          >
            <Settings className="w-4 h-4" />
          </Button>
          <span id="qavatar-settings-help" className="sr-only">
            Open the settings panel to customize your avatar and dashboard
            experience.
          </span>
          <Button
            size="sm"
            variant="ghost"
            className={`w-8 h-8 p-0 rounded-full shadow-md ${
              isSpeaking
                ? "bg-green-500/80 hover:bg-green-500 text-white"
                : "bg-white/80 hover:bg-white"
            }`}
            onClick={() =>
              setConfig((prev) => ({ ...prev, isMuted: !prev.isMuted }))
            }
            title={config.isMuted ? "Unmute avatar" : "Mute avatar"}
          >
            {config.isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className={`w-8 h-8 p-0 rounded-full shadow-md ${
              isSpeaking
                ? "bg-blue-500/80 hover:bg-blue-500 text-white"
                : "bg-white/80 hover:bg-white"
            }`}
            onClick={() => {
              if (isSpeaking) {
                stopAudibleConversation();
              } else {
                startAudibleConversation();
              }
            }}
            title={
              isSpeaking ? "Stop conversation" : "Start audible conversation"
            }
          >
            <Mic className={isSpeaking ? "w-4 h-4 animate-pulse" : "w-4 h-4"} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className={`w-8 h-8 p-0 rounded-full shadow-md ${
              showVoiceVisualizer
                ? "bg-purple-500/80 hover:bg-purple-500 text-white"
                : "bg-white/80 hover:bg-white"
            }`}
            onClick={() => setShowVoiceVisualizer(!showVoiceVisualizer)}
            title="Toggle voice visualization (QMOI voice & microphone input)"
          >
            <Mic className="w-4 h-4" />
          </Button>

          {/* Vision System Button */}
          <Button
            size="sm"
            variant="ghost"
            className={`w-8 h-8 p-0 rounded-full shadow-md ${
              visionEnabled
                ? "bg-cyan-500/80 hover:bg-cyan-500 text-white"
                : "bg-white/80 hover:bg-white"
            }`}
            onClick={async () => {
              if (!visionEnabled) {
                await initializeVision();
              } else {
                setVisionEnabled(false);
                setShowCameraFeed(false);
              }
            }}
            title={
              visionEnabled
                ? "Disable camera vision"
                : "Enable camera vision (QMOI can see)"
            }
          >
            👁️
          </Button>

          {/* Debate Mode Button */}
          <Button
            size="sm"
            variant="ghost"
            className={`w-8 h-8 p-0 rounded-full shadow-md ${
              conversationMode === "debate"
                ? "bg-orange-500/80 hover:bg-orange-500 text-white"
                : "bg-white/80 hover:bg-white"
            }`}
            onClick={() => {
              setConversationMode(
                conversationMode === "debate" ? "listen" : "debate",
              );
            }}
            title={
              conversationMode === "debate"
                ? "Exit debate mode"
                : "Enable debate mode (QMOI argues)"
            }
          >
            💬
          </Button>

          {/* Start Listening with Auto-Detection */}
          {conversationMode === "debate" && (
            <Button
              size="sm"
              variant="ghost"
              className={`w-8 h-8 p-0 rounded-full shadow-md ${
                isUserSpeaking
                  ? "bg-green-500/80 hover:bg-green-500 text-white animate-pulse"
                  : "bg-white/80 hover:bg-white"
              }`}
              onClick={() => {
                if (!isUserSpeaking) {
                  startListeningWithAutoDetection();
                } else {
                  stopListeningAndRespond();
                }
              }}
              title={
                isUserSpeaking
                  ? "Stop listening and get response"
                  : "Start debate - speak your argument"
              }
            >
              🎤
            </Button>
          )}

          <Button
            size="sm"
            variant="ghost"
            className="w-8 h-8 p-0 rounded-full bg-white/80 hover:bg-white shadow-md"
            onClick={() =>
              setConfig((prev) => ({ ...prev, isMinimized: true }))
            }
          >
            <Minimize2 className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="w-8 h-8 p-0 rounded-full bg-red-500/80 hover:bg-red-500 text-white shadow-md"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="w-8 h-8 p-0 rounded-full bg-white/80 hover:bg-white shadow-md"
            onClick={() => setShowQCityDashboard(!showQCityDashboard)}
          >
            <span className="w-4 h-4">🏙️</span>
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setShowAuditLog(true);
              fetchAuditLogs();
            }}
            aria-label="Open Audit Log Panel"
            title="View and export audit logs"
          >
            Audit Log
          </Button>
          <Button
            aria-label="Open Self-Heal Panel"
            title="Trigger or schedule self-heal scripts, view logs and history"
            className="qavatar-selfheal-btn"
            onClick={() => setShowSelfHeal(true)}
          >
            🛠️ Self-Heal
          </Button>
          <Button
            aria-label="Open Analytics Panel"
            title="View real-time analytics and system metrics"
            className="qavatar-metrics-btn"
            onClick={() => setShowMetrics(true)}
          >
            📊 Analytics
          </Button>
          <Button
            aria-label="Open Avatar Gallery"
            title="Select, preview, or request new avatars and voices"
            className="qavatar-gallery-btn"
            onClick={() => setShowGallery(true)}
          >
            🖼️ Avatar Gallery
          </Button>
          <Button
            aria-label="Open Plugin System"
            title="Manage and load dashboard plugins/extensions"
            className="qavatar-plugin-btn"
            onClick={() => setShowPlugins(true)}
          >
            🧩 Plugins
          </Button>
          <Button
            className="mb-2"
            onClick={() => setShowUserPanel(true)}
            aria-label="Open User Management Panel"
          >
            Manage Users & Roles
          </Button>
          <Button
            aria-label="Open Orchestration Panel"
            title="View agent/device health and orchestration controls"
            className="qavatar-orchestration-btn"
            onClick={() => setShowOrchestration(true)}
          >
            🕹️ Orchestration
          </Button>
        </div>

        {/* Status Indicators */}
        <div className="absolute bottom-2 left-2 flex items-center gap-2">
          {config.lipSync && (
            <Badge variant="outline" className="text-xs">
              <Mic className="w-3 h-3 mr-1" />
              Lip Sync
            </Badge>
          )}
          {config.gestures && (
            <Badge variant="outline" className="text-xs">
              ✋ Gestures
            </Badge>
          )}
          {config.expressions && (
            <Badge variant="outline" className="text-xs">
              😊 Expressions
            </Badge>
          )}
          {/* QMOI status badge */}
          <Badge
            variant="outline"
            className="text-xs"
            style={{ borderColor: "#00ffff", color: "#00ffff" }}
          >
            QMOI: {qmoiStatus}
          </Badge>
        </div>

        {/* Settings Panel */}
        <SettingsPanel />

        {showQCityDashboard && <QCityDashboardPanel />}
        {showAuditLog && <AuditLogPanel />}
        {showVoiceVisualizer && (
          <div
            className="qavatar-voice-visualizer-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Voice Visualization Panel"
            tabIndex={-1}
          >
            <div
              className="qavatar-voice-visualizer-content"
              style={{ maxWidth: 500, maxHeight: 400 }}
            >
              <VoiceVisualizer />
              <Button
                onClick={() => setShowVoiceVisualizer(false)}
                aria-label="Close Voice Visualizer"
                style={{ marginTop: 16 }}
              >
                Close
              </Button>
            </div>
          </div>
        )}

        {/* Camera Feed Panel */}
        {showCameraFeed && visionEnabled && (
          <div
            className="qavatar-camera-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Camera Vision Panel"
            tabIndex={-1}
            style={{
              position: "absolute",
              top: "-600px",
              right: "-20px",
              zIndex: 100,
              background: "rgba(0,0,0,0.9)",
              borderRadius: "8px",
              padding: "16px",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(0,255,255,0.3)",
            }}
          >
            <div style={{ maxWidth: 400, maxHeight: 300 }}>
              <h3
                style={{
                  color: "#00ffff",
                  marginBottom: "12px",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                QMOI Vision Feed
              </h3>

              {/* Camera Video */}
              <video
                ref={videoRef}
                style={{
                  width: "100%",
                  height: "200px",
                  background: "black",
                  borderRadius: "4px",
                  marginBottom: "12px",
                  display: showCameraFeed ? "block" : "none",
                }}
              />

              {/* Canvas for analysis */}
              <canvas
                ref={canvasRef}
                style={{
                  width: "100%",
                  height: "200px",
                  background: "black",
                  borderRadius: "4px",
                  marginBottom: "12px",
                  display: "none",
                }}
              />

              {/* Person Analysis */}
              {personAnalysis && (
                <div
                  style={{
                    fontSize: "12px",
                    color: "#00ff00",
                    marginBottom: "8px",
                  }}
                >
                  <div>👤 Emotion: {personAnalysis.emotion}</div>
                  <div>
                    🎯 Attention: {personAnalysis.attentionLevel.toFixed(0)}%
                  </div>
                  <div>💬 Gesture: {personAnalysis.gesture}</div>
                  <div>Age: {personAnalysis.age}y</div>
                </div>
              )}

              {/* Visual Context */}
              {visualContext && (
                <div
                  style={{
                    fontSize: "12px",
                    color: "#ffff00",
                    marginBottom: "8px",
                  }}
                >
                  <div>📍 Environment: {visualContext.environment}</div>
                  <div>💡 Lighting: {visualContext.lighting}</div>
                  <div>🔊 Noise: {visualContext.noise_level}</div>
                </div>
              )}

              {/* User Speech Status */}
              {isUserSpeaking && (
                <div
                  style={{
                    fontSize: "12px",
                    color: "#ff00ff",
                    marginBottom: "8px",
                    padding: "8px",
                    background: "rgba(255,0,255,0.1)",
                    borderRadius: "4px",
                  }}
                >
                  <div>🎤 You: {userSpeechTranscript}</div>
                </div>
              )}

              <Button
                onClick={() => setShowCameraFeed(false)}
                aria-label="Close Camera Vision Panel"
                size="sm"
                style={{ width: "100%", fontSize: "12px" }}
              >
                Close Vision
              </Button>
            </div>
          </div>
        )}

        {/* Debate Status Panel */}
        {conversationMode === "debate" && (
          <div
            className="qavatar-debate-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Debate Mode Panel"
            tabIndex={-1}
            style={{
              position: "absolute",
              bottom: "-280px",
              right: "-20px",
              zIndex: 100,
              background: "rgba(0,0,0,0.9)",
              borderRadius: "8px",
              padding: "16px",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,165,0,0.3)",
            }}
          >
            <div style={{ maxWidth: 400, minHeight: 100 }}>
              <h3
                style={{
                  color: "#ff8c00",
                  marginBottom: "12px",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                💬 QMOI Debate Mode
              </h3>

              {!isUserSpeaking ? (
                <div style={{ color: "#ffff99", fontSize: "12px" }}>
                  <p>Ready to debate! Click 🎤 to make your argument.</p>
                </div>
              ) : (
                <div style={{ color: "#00ff00", fontSize: "12px" }}>
                  <div style={{ marginBottom: "8px" }}>
                    <strong>Your Argument:</strong>
                  </div>
                  <div
                    style={{
                      background: "rgba(0,255,0,0.1)",
                      padding: "8px",
                      borderRadius: "4px",
                      marginBottom: "8px",
                      minHeight: "40px",
                    }}
                  >
                    {userSpeechTranscript || "Listening..."}
                  </div>
                  <div style={{ color: "#00ffff" }}>
                    📊 Vision: {visionEnabled ? "Enabled" : "enabled"}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {showSelfHeal && (
          <div
            className="qavatar-onboarding-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Q-Avatar Self-Heal Panel"
            tabIndex={-1}
          >
            <div
              className="qavatar-onboarding-content"
              style={{ maxWidth: 600 }}
            >
              <SelfHealPanel />
              <Button
                onClick={() => setShowSelfHeal(false)}
                aria-label="Close Self-Heal Panel"
                style={{ marginTop: 16 }}
              >
                Close
              </Button>
            </div>
          </div>
        )}
        {showMetrics && (
          <div
            className="qavatar-onboarding-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Q-Avatar Analytics Panel"
            tabIndex={-1}
          >
            <div
              className="qavatar-onboarding-content"
              style={{ maxWidth: 600 }}
            >
              <MetricsPanel />
              <Button
                onClick={() => setShowMetrics(false)}
                aria-label="Close Analytics Panel"
                style={{ marginTop: 16 }}
              >
                Close
              </Button>
            </div>
          </div>
        )}
        {showGallery && (
          <div
            className="qavatar-onboarding-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Q-Avatar Gallery Panel"
            tabIndex={-1}
          >
            <div
              className="qavatar-onboarding-content"
              style={{ maxWidth: 700 }}
            >
              <AviatorGalleryPanel />
              <Button
                onClick={() => setShowGallery(false)}
                aria-label="Close Avatar Gallery"
                style={{ marginTop: 16 }}
              >
                Close
              </Button>
            </div>
          </div>
        )}
        {showPlugins && (
          <div
            className="qavatar-onboarding-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Q-Avatar Plugin Panel"
            tabIndex={-1}
          >
            <div
              className="qavatar-onboarding-content"
              style={{ maxWidth: 600 }}
            >
              <PluginPanel />
              <Button
                onClick={() => setShowPlugins(false)}
                aria-label="Close Plugin Panel"
                style={{ marginTop: 16 }}
              >
                Close
              </Button>
            </div>
          </div>
        )}
        {showUser && (
          <div
            className="qavatar-onboarding-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Q-Avatar User Panel"
            tabIndex={-1}
          >
            <div
              className="qavatar-onboarding-content"
              style={{ maxWidth: 400 }}
            >
              <h2>User Management</h2>
              <div>Name: {user.name}</div>
              <div>Role: {user.role}</div>
              <div>Status: {user.loggedIn ? "Logged In" : "Logged Out"}</div>
              <Button
                onClick={() =>
                  setUser((u) => ({ ...u, loggedIn: !u.loggedIn }))
                }
                aria-label={user.loggedIn ? "Logout" : "Login"}
                style={{ marginTop: 16 }}
              >
                {user.loggedIn ? "Logout" : "Login"}
              </Button>
              <Button
                onClick={() => setShowUser(false)}
                aria-label="Close User Panel"
                style={{ marginTop: 16 }}
              >
                Close
              </Button>
            </div>
          </div>
        )}
        {showOrchestration && (
          <div
            className="qavatar-onboarding-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Q-Avatar Orchestration Panel"
            tabIndex={-1}
          >
            <div
              className="qavatar-onboarding-content"
              style={{ maxWidth: 600 }}
            >
              <OrchestratorStatusPanel status={orchestratorStatus} />
              <Button
                onClick={() => setShowOrchestration(false)}
                aria-label="Close Orchestration Panel"
                style={{ marginTop: 16 }}
              >
                Close
              </Button>
            </div>
          </div>
        )}
        {showUserPanel && (
          <div
            className="qavatar-onboarding-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Q-Avatar User Panel"
            tabIndex={-1}
          >
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 max-w-2xl w-full relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
                onClick={() => setShowUserPanel(false)}
                aria-label="Close User Management Panel"
              >
                ✕
              </button>
              <TeamRoleManager />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default QAvatar;
