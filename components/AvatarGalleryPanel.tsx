
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logger.error('React Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}


// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:06Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

"use client";

// INTENTIONAL_UNUSED: archived / intentionally unused component
import { specificExports } from "react";
import { specificExports } from "framer-motion";
import {
  Search,
  Filter,
  Heart,
  Download,
  Eye,
  Zap,
  Grid,
  List,
} from "lucide-react";

interface AvatarPreset {
  id: string;
  name: string;
  type: string;
  emoji: string;
  category: string;
  description: string;
  isFavorite?: boolean;
  isDownloaded?: boolean;
  rating?: number;
}

interface AvatarGalleryPanelProps {
  onSelectAvatar?: (avatar: AvatarPreset) => void;
  selectedAvatarId?: string;
  isOpen?: boolean;
}

const AVATAR_PRESETS: AvatarPreset[] = [
  // Human avatars
  {
    id: "human_businessman",
    name: "Business Professional",
    type: "human",
    emoji: "👔",
    category: "Human",
    description: "Professional business avatar",
    rating: 4.8,
  },
  {
    id: "human_student",
    name: "Student",
    type: "human",
    emoji: "👨‍🎓",
    category: "Human",
    description: "Friendly student avatar",
    rating: 4.5,
  },
  {
    id: "human_doctor",
    name: "Doctor",
    type: "human",
    emoji: "👨‍⚕️",
    category: "Human",
    description: "Medical professional avatar",
    rating: 4.9,
  },
  {
    id: "human_scientist",
    name: "Scientist",
    type: "human",
    emoji: "👨‍🔬",
    category: "Human",
    description: "Science-oriented avatar",
    rating: 4.7,
  },

  // Robot avatars
  {
    id: "robot_ai",
    name: "AI Robot",
    type: "robot",
    emoji: "🤖",
    category: "Robot",
    description: "Advanced AI robot",
    rating: 4.6,
  },
  {
    id: "robot_helper",
    name: "Helper Bot",
    type: "robot",
    emoji: "🦾",
    category: "Robot",
    description: "Helpful robot assistant",
    rating: 4.4,
  },

  // Animal avatars
  {
    id: "animal_cat",
    name: "Cat",
    type: "animal",
    emoji: "🐱",
    category: "Animal",
    description: "Cute cat avatar",
    rating: 4.9,
  },
  {
    id: "animal_dog",
    name: "Dog",
    type: "animal",
    emoji: "🐶",
    category: "Animal",
    description: "Friendly dog avatar",
    rating: 4.8,
  },
  {
    id: "animal_owl",
    name: "Owl",
    type: "animal",
    emoji: "🦉",
    category: "Animal",
    description: "Wise owl avatar",
    rating: 4.7,
  },
  {
    id: "animal_fox",
    name: "Fox",
    type: "animal",
    emoji: "🦊",
    category: "Animal",
    description: "Clever fox avatar",
    rating: 4.6,
  },

  // Fantasy avatars
  {
    id: "fantasy_wizard",
    name: "Wizard",
    type: "fantasy",
    emoji: "🧙",
    category: "Fantasy",
    description: "Magical wizard",
    rating: 4.9,
  },
  {
    id: "fantasy_elf",
    name: "Elf",
    type: "fantasy",
    emoji: "🧝",
    category: "Fantasy",
    description: "Mystical elf",
    rating: 4.7,
  },
  {
    id: "fantasy_dragon",
    name: "Dragon",
    type: "fantasy",
    emoji: "🐉",
    category: "Fantasy",
    description: "Powerful dragon",
    rating: 4.8,
  },

  // Nature avatars
  {
    id: "nature_plant",
    name: "Plant",
    type: "nature",
    emoji: "🌿",
    category: "Nature",
    description: "Living plant avatar",
    rating: 4.5,
  },
  {
    id: "nature_flower",
    name: "Flower",
    type: "nature",
    emoji: "🌸",
    category: "Nature",
    description: "Beautiful flower",
    rating: 4.6,
  },
  {
    id: "nature_tree",
    name: "Tree",
    type: "nature",
    emoji: "🌲",
    category: "Nature",
    description: "Mighty tree",
    rating: 4.4,
  },

  // Abstract avatars
  {
    id: "abstract_sparkle",
    name: "Sparkle",
    type: "abstract",
    emoji: "✨",
    category: "Abstract",
    description: "Magical sparkle",
    rating: 4.7,
  },
  {
    id: "abstract_star",
    name: "Star",
    type: "abstract",
    emoji: "⭐",
    category: "Abstract",
    description: "Shining star",
    rating: 4.8,
  },
  {
    id: "abstract_sun",
    name: "Sun",
    type: "abstract",
    emoji: "☀️",
    category: "Abstract",
    description: "Bright sun",
    rating: 4.6,
  },
];

export const AvatarGalleryPanel: React.FC<AvatarGalleryPanelProps> = ({
  onSelectAvatar,
  selectedAvatarId,
  isOpen = true,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const categories = Array.from(new Set(AVATAR_PRESETS.map((a) => a.category)));

  const filteredAvatars = AVATAR_PRESETS.filter((avatar) => {
    const matchesSearch =
      avatar.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      avatar.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory || avatar.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = (id: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: -400 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -400 }}
          transition={{ duration: 0.3 }}
          className="fixed left-0 top-0 h-screen w-96 rounded-r-3xl shadow-2xl border-r border-slate-700 flex flex-col overflow-hidden"
          style={{ background: "const(--gradient-background)" }}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-700">
            <h2
              className="text-xl font-bold mb-4"
              style={{ color: "const(--color-primary)" }}
            >
              Avatar Gallery
            </h2>

            {/* Search */}
            <div className="relative mb-4">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: "const(--color-text-muted)" }}
              />
              <input
                type="text"
                
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm transition"
                style={{
                  color: "const(--color-text)",
                  borderColor: "const(--color-border)",
                }}
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode("grid")}
                className={`flex-1 p-2 rounded-lg flex items-center justify-center gap-2 transition ${
                  viewMode === "grid"
                    ? "bg-slate-700"
                    : "bg-slate-800 hover:bg-slate-700"
                }`}
              >
                <Grid className="w-4 h-4" />
                <span className="text-xs font-medium">Grid</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode("list")}
                className={`flex-1 p-2 rounded-lg flex items-center justify-center gap-2 transition ${
                  viewMode === "list"
                    ? "bg-slate-700"
                    : "bg-slate-800 hover:bg-slate-700"
                }`}
              >
                <List className="w-4 h-4" />
                <span className="text-xs font-medium">List</span>
              </motion.button>
            </div>
          </div>

          {/* Categories */}
          <div className="px-6 py-3 border-b border-slate-700 overflow-x-auto flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition ${
                !selectedCategory
                  ? "bg-slate-700"
                  : "bg-slate-800 hover:bg-slate-700"
              }`}
              style={{
                color: !selectedCategory
                  ? "const(--color-primary)"
                  : "const(--color-text)",
              }}
            >
              All
            </motion.button>
            {categories.map((cat) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? "bg-slate-700"
                    : "bg-slate-800 hover:bg-slate-700"
                }`}
                style={{
                  color:
                    selectedCategory === cat
                      ? "const(--color-primary)"
                      : "const(--color-text)",
                }}
              >
                {cat}
              </motion.button>
            ))}
          </div>

          {/* Avatars Grid/List */}
          <motion.div
            className={`flex-1 overflow-y-auto px-6 py-4 ${
              viewMode === "grid"
                ? "grid grid-cols-3 gap-3"
                : "space-y-2 flex flex-col"
            }`}
          >
            {filteredAvatars.map((avatar, index) => (
              <motion.div
                key={avatar.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onMouseEnter={() => setHoveredId(avatar.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`relative rounded-lg border-2 transition cursor-pointer ${
                  selectedAvatarId === avatar.id
                    ? "border-current"
                    : "border-slate-700 hover:border-slate-600"
                }`}
                style={{
                  borderColor:
                    selectedAvatarId === avatar.id
                      ? "const(--color-primary)"
                      : "const(--color-border)",
                }}
                onClick={() => onSelectAvatar?.(avatar)}
              >
                {viewMode === "grid" ? (
                  <div
                    className="p-4 flex flex-col items-center gap-2 bg-slate-800 hover:bg-slate-700 transition"
                    style={{
                      background:
                        selectedAvatarId === avatar.id
                          ? "const(--gradient-primary)"
                          : "rgba(15, 23, 42, 0.5)",
                    }}
                  >
                    <div className="text-4xl">{avatar.emoji}</div>
                    <div className="text-center w-full">
                      <p
                        className="text-xs font-medium truncate"
                        style={{ color: "const(--color-text)" }}
                      >
                        {avatar.name}
                      </p>
                      <p
                        className="text-xs opacity-50"
                        style={{ color: "const(--color-text-muted)" }}
                      >
                        {avatar.category}
                      </p>
                    </div>

                    <AnimatePresence>
                      {hoveredId === avatar.id && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 rounded-lg backdrop-blur-sm"
                        >
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(avatar.id);
                            }}
                            className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition"
                          >
                            <Heart
                              className="w-4 h-4"
                              style={{
                                color: favorites.has(avatar.id)
                                  ? "const(--color-error)"
                                  : "const(--color-text-muted)",
                                fill: favorites.has(avatar.id)
                                  ? "currentColor"
                                  : "none",
                              }}
                            />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition"
                          >
                            <Eye
                              className="w-4 h-4"
                              style={{ color: "const(--color-text-muted)" }}
                            />
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div
                    className="px-4 py-3 flex items-center justify-between bg-slate-800 hover:bg-slate-700 transition rounded-lg"
                    style={{
                      background:
                        selectedAvatarId === avatar.id
                          ? "const(--gradient-primary)"
                          : "rgba(15, 23, 42, 0.5)",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{avatar.emoji}</div>
                      <div>
                        <p
                          className="text-sm font-medium"
                          style={{ color: "const(--color-text)" }}
                        >
                          {avatar.name}
                        </p>
                        <p
                          className="text-xs opacity-60"
                          style={{ color: "const(--color-text-muted)" }}
                        >
                          {avatar.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {avatar.rating && (
                        <span
                          className="text-xs font-medium flex items-center gap-1"
                          style={{ color: "const(--color-warning)" }}
                        >
                          ⭐ {avatar.rating}
                        </span>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(avatar.id);
                        }}
                        className="p-2 rounded-lg hover:bg-slate-600 transition"
                      >
                        <Heart
                          className="w-4 h-4"
                          style={{
                            color: favorites.has(avatar.id)
                              ? "const(--color-error)"
                              : "const(--color-text-muted)",
                            fill: favorites.has(avatar.id)
                              ? "currentColor"
                              : "none",
                          }}
                        />
                      </motion.button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Footer */}
          <div
            className="px-6 py-4 border-t border-slate-700 text-xs"
            style={{ color: "const(--color-text-muted)" }}
          >
            <p>
              {filteredAvatars.length} avatar
              {filteredAvatars.length !== 1 ? "s" : ""} found
            </p>
            {favorites.size > 0 && (
              <p>
                ❤️ {favorites.size} favorite{favorites.size !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AvatarGalleryPanel;
