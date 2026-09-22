import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Grid,
  Alert,
  Chip,
  // IconButton,
  // Tooltip,
} from "@mui/material";
import {
  Save,
  Add as AddIcon,
  // Delete,
  Info,
  // Edit as EditIcon,
} from "@mui/icons-material";
import { useAuth } from "../hooks/useAuth";
import { TradingManager } from "../config/trading";

interface TradingRule {
  maxDailyTrades: number;
  maxTradeAmount: number;
  allowedPairs: string[];
}

interface AITradingRulesProps {
  className?: string;
}

export const AITradingRules: React.FC<AITradingRulesProps> = ({
  className,
}) => {
  const { user } = useAuth();
  const [isEnabled, setIsEnabled] = useState(false);
  const [rules, setRules] = useState<TradingRule>({
    maxDailyTrades: 10,
    maxTradeAmount: 100,
    allowedPairs: ["BTC/USDT", "ETH/USDT"],
  });
  const [newPair, setNewPair] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = async () => {
    try {
      const tradingManager = TradingManager.getInstance();
      const aiTradingConfig = await tradingManager.getAITradingConfig();
      setIsEnabled(aiTradingConfig.enabled);
      setRules(aiTradingConfig.tradingRules);
    } catch (err) {
      setError("Failed to load trading rules");
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      const tradingManager = TradingManager.getInstance();
      await tradingManager.updateAITradingConfig({
        enabled: isEnabled,
        allowedUsers: ["sister"],
        tradingRules: rules,
      });

      setSuccess("Trading rules updated successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update rules");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPair = () => {
    if (newPair && !rules.allowedPairs.includes(newPair)) {
      setRules({
        ...rules,
        allowedPairs: [...rules.allowedPairs, newPair],
      });
      setNewPair("");
    }
  };

  const handleRemovePair = (pair: string) => {
    setRules({
      ...rules,
      allowedPairs: rules.allowedPairs.filter((p) => p !== pair),
    });
  };

  if (!user || user.role !== "master") {
    return null;
  }

  return (
    <Card className={className}>
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6" component="h2">
            AI Trading Rules
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={isEnabled}
                onChange={(e) => setIsEnabled(e.target.checked)}
                color="primary"
              />
            }
            label="Enable AI Trading"
          />
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Max Daily Trades"
              type="number"
              value={rules.maxDailyTrades}
              onChange={(e) =>
                setRules({
                  ...rules,
                  maxDailyTrades: parseInt(e.target.value) || 0,
                })
              }
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Max Trade Amount (USD)"
              type="number"
              value={rules.maxTradeAmount}
              onChange={(e) =>
                setRules({
                  ...rules,
                  maxTradeAmount: parseFloat(e.target.value) || 0,
                })
              }
              InputProps={{ inputProps: { min: 0, step: 0.01 } }}
            />
          </Grid>
        </Grid>

        <Box mt={3}>
          <Typography variant="subtitle1" gutterBottom>
            Allowed Trading Pairs
          </Typography>
          <Box display="flex" gap={1} mb={2} flexWrap="wrap">
            {rules.allowedPairs.map((pair) => (
              <Chip
                key={pair}
                label={pair}
                onDelete={() => handleRemovePair(pair)}
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
          <Box display="flex" gap={1}>
            <TextField
              size="small"
              label="Add Trading Pair"
              value={newPair}
              onChange={(e) => setNewPair(e.target.value.toUpperCase())}
              placeholder="e.g., BTC/USDT"
            />
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddPair}
              disabled={!newPair}
            >
              Add
            </Button>
          </Box>
        </Box>

        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            startIcon={<Save />}
            onClick={handleSave}
            disabled={isLoading}
          >
            Save Rules
          </Button>
        </Box>

        <Box mt={2}>
          <Alert severity="info" icon={<Info />}>
            These rules apply to AI trading for sister accounts. The AI will
            only execute trades within these limits and for the specified
            trading pairs.
          </Alert>
        </Box>
      </CardContent>
    </Card>
  );
};
