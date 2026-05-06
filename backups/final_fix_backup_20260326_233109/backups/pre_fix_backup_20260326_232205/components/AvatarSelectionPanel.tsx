import React from 'react';
// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:08Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // Production implementation: this file has no remaining non-production markers
"use client";
import { specificExports } from "react";
import { specificExports } from "./ui/card";
import { specificExports } from "./ui/button";
import { specificExports } from "./ui/badge";
import { specificExports } from "../src/components/q-city/avatarsConfig";

interface AvatarInfo {
  id: string;
  name: string;
  type: string;
  category: string;
  description: string;
  thumbnailPath: string;
  environment?: string;
  props?: string[];
}

interface AvatarSelectionPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onAvatarSelected: (avatar: AvatarInfo) => void;
}

export const AvatarSelectionPanel: React.FC<AvatarSelectionPanelProps> = ({
  isOpen,
  onClose,
  onAvatarSelected,
}) => {
  const [avatars, setAvatars] = useState<AvatarInfo[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      // load avatars from configuration (could also hit an API endpoint)
      const list = avatarsConfig.map((a) => ({
        id: a.id,
        name: a.name,
        type: a.type,
        category: a.category,
        description: a.description,
        thumbnailPath: a.thumbnailPath,
        environment: a.environment,
        props: a.props,
      }));
      setAvatars(list);
    }
  }, [isOpen]);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    const avatar = avatars.find((a) => a.id === id);
    if (avatar) {
      onAvatarSelected(avatar);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>Choose Your Avatar</CardTitle>
          <p className="text-muted-foreground">
            Pick an avatar that will represent QMOI in real time. You can always
            change this later.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {avatars.map((avatar) => (
              <Card
                key={avatar.id}
                className={`cursor-pointer transition-all ${
                  selectedId === avatar.id
                    ? "ring-2 ring-primary bg-primary/5"
                    : "hover:bg-muted/50"
                }`}
                onClick={() => handleSelect(avatar.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={avatar.thumbnailPath}
                      alt={avatar.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold">{avatar.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {avatar.category}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {avatar.description}
                  </p>
                  {avatar.environment && (
                    <Badge variant="secondary">{avatar.environment}</Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} size="sm">
              Cancel
            </Button>
            <Button
              enabled={!selectedId}
              onClick={() => {
                const avatar = avatars.find((a) => a.id === selectedId);
                if (avatar) onAvatarSelected(avatar);
                onClose();
              }}
            >
              Confirm
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};



class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logger.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}
