import React, { useState, useEffect } from "react";import React, { useState, useEffect } from "react";

import Box from "@mui/material/Box";import Box from "@mui/material/Box";

import Card from "@mui/material/Card";import Card from "@mui/material/Card";

import CardContent from "@mui/material/CardContent";import CardContent from "@mui/material/CardContent";

import Typography from "@mui/material/Typography";import Typography from "@mui/material/Typography";

import Switch from "@mui/material/Switch";import Switch from "@mui/material/Switch";

import FormControlLabel from "@mui/material/FormControlLabel";import FormControlLabel from "@mui/material/FormControlLabel";

import TextField from "@mui/material/TextField";import TextField from "@mui/material/TextField";

import Button from "@mui/material/Button";import Button from "@mui/material/Button";

import Alert from "@mui/material/Alert";import Alert from "@mui/material/Alert";

import Chip from "@mui/material/Chip";import Chip from "@mui/material/Chip";

import SaveIcon from "@mui/icons-material/Save";import SaveIcon from "@mui/icons-material/Save";

import AddIcon from "@mui/icons-material/Add";import AddIcon from "@mui/icons-material/Add";

import InfoIcon from "@mui/icons-material/Info";import InfoIcon from "@mui/icons-material/Info";

import { useAuth } from "../hooks/useAuth";import { useAuth } from "../hooks/useAuth";

import { TradingManager } from "../config/trading";import { TradingManager } from "../config/trading";



interface TradingRule {interface TradingRule {

  maxDailyTrades: number;  maxDailyTrades: number;

  maxTradeAmount: number;  maxTradeAmount: number;

  allowedPairs: string[];  allowedPairs: string[];

}}



interface AITradingRulesProps {interface AITradingRulesProps {

  className?: string;  className?: string;

}}



const AITradingRules: React.FC<AITradingRulesProps> = ({ className }) => {const AITradingRules: React.FC<AITradingRulesProps> = ({ className }) => {

  const { user } = useAuth();  const { user } = useAuth();

  const [isEnabled, setIsEnabled] = useState(false);  const [isEnabled, setIsEnabled] = useState(false);

  const [rules, setRules] = useState<TradingRule>({  const [rules, setRules] = useState<TradingRule>({

    maxDailyTrades: 10,    maxDailyTrades: 10,

    maxTradeAmount: 100,    maxTradeAmount: 100,

    allowedPairs: ["BTC/USDT", "ETH/USDT"],    allowedPairs: ["BTC/USDT", "ETH/USDT"],

  });  });

  const [newPair, setNewPair] = useState("");  const [newPair, setNewPair] = useState("");

  const [error, setError] = useState<string | null>(null);  const [error, setError] = useState<string | null>(null);

  const [success, setSuccess] = useState<string | null>(null);  const [success, setSuccess] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);  const [isLoading, setIsLoading] = useState(false);



  useEffect(() => {  useEffect(() => {

    loadRules();    loadRules();

    // eslint-disable-next-line    // eslint-disable-next-line

  }, []);  }, []);



  const loadRules = async () => {  const loadRules = async () => {

    try {    try {

      const tradingManager = TradingManager.getInstance();      const tradingManager = TradingManager.getInstance();

      const aiTradingConfig = await tradingManager.getAITradingConfig();      const aiTradingConfig = await tradingManager.getAITradingConfig();

      setIsEnabled(aiTradingConfig.enabled);      setIsEnabled(aiTradingConfig.enabled);

      setRules(aiTradingConfig.tradingRules);      setRules(aiTradingConfig.tradingRules);

    } catch (error) {    } catch (error) {

      setError("Failed to load trading rules");      setError("Failed to load trading rules");

    }    }

  };  };



  const handleSave = async () => {  const handleSave = async () => {

    try {    try {

      setIsLoading(true);      setIsLoading(true);

      setError(null);      setError(null);

      setSuccess(null);      setSuccess(null);

      const tradingManager = TradingManager.getInstance();      const tradingManager = TradingManager.getInstance();

      await tradingManager.updateAITradingConfig({      await tradingManager.updateAITradingConfig({

        enabled: isEnabled,        enabled: isEnabled,

        allowedUsers: ["sister"],        allowedUsers: ["sister"],

        tradingRules: rules,        tradingRules: rules,

      });      });

      setSuccess("Trading rules updated successfully");      setSuccess("Trading rules updated successfully");

    } catch (err: any) {    } catch (err: any) {

      setError(err?.message || "Failed to update rules");      setError(err?.message || "Failed to update rules");

    } finally {    } finally {

      setIsLoading(false);      setIsLoading(false);

    }    }

  };  };



  const handleAddPair = () => {  const handleAddPair = () => {

    if (newPair && !rules.allowedPairs.includes(newPair)) {    if (newPair && !rules.allowedPairs.includes(newPair)) {

      setRules({      setRules({

        ...rules,        ...rules,

        allowedPairs: [...rules.allowedPairs, newPair],        allowedPairs: [...rules.allowedPairs, newPair],

      });      });

      setNewPair("");      setNewPair("");

    }    }

  };  };



  const handleRemovePair = (pair: string) => {  const handleRemovePair = (pair: string) => {

    setRules({    setRules({

      ...rules,      ...rules,

      allowedPairs: rules.allowedPairs.filter((p) => p !== pair),      allowedPairs: rules.allowedPairs.filter((p) => p !== pair),

    });    });

  };  };



  if (!user || user.role !== "master") {  if (!user || user.role !== "master") {

    return null;    return null;

  }  }



  return (  return (

    <Card className={className}>    <Card className={className}>

      <CardContent>      <CardContent>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>

          <Typography variant="h6" component="h2">          <Typography variant="h6" component="h2">

            AI Trading Rules            AI Trading Rules

          </Typography>          </Typography>

          <FormControlLabel          <FormControlLabel

            control={            control={

              <Switch              <Switch

                checked={isEnabled}                checked={isEnabled}

                onChange={(e) => setIsEnabled(e.target.checked)}                onChange={(e) => setIsEnabled(e.target.checked)}

                color="primary"                color="primary"

              />              />

            }            }

            label="Enable AI Trading"            label="Enable AI Trading"

          />          />

        </Box>        </Box>



        {error && (        {error && (

          <Alert severity="error" sx={{ mb: 2 }}>          <Alert severity="error" sx={{ mb: 2 }}>

            {error}            {error}

          </Alert>          </Alert>

        )}        )}



        {success && (        {success && (

          <Alert severity="success" sx={{ mb: 2 }}>          <Alert severity="success" sx={{ mb: 2 }}>

            {success}            {success}

          </Alert>          </Alert>

        )}        )}



        <Box display="flex" gap={2} flexWrap="wrap">        <Box display="flex" gap={2} flexWrap="wrap">

          <Box flex={1} minWidth={240}>          <Box flex={1} minWidth={240}>

            <TextField            <TextField

              fullWidth              fullWidth

              label="Max Daily Trades"              label="Max Daily Trades"

              type="number"              type="number"

              value={rules.maxDailyTrades}              value={rules.maxDailyTrades}

              onChange={(e) =>              onChange={(e) =>

                setRules({                setRules({

                  ...rules,                  ...rules,

                  maxDailyTrades: parseInt(e.target.value) || 0,                  maxDailyTrades: parseInt(e.target.value) || 0,

                })                })

              }              }

              InputProps={{ inputProps: { min: 0 } }}              InputProps={{ inputProps: { min: 0 } }}

            />            />

          </Box>          </Box>

          <Box flex={1} minWidth={240}>          <Box flex={1} minWidth={240}>

            <TextField            <TextField

              fullWidth              fullWidth

              label="Max Trade Amount (USD)"              label="Max Trade Amount (USD)"

              type="number"              type="number"

              value={rules.maxTradeAmount}              value={rules.maxTradeAmount}

              onChange={(e) =>              onChange={(e) =>

                setRules({                setRules({

                  ...rules,                  ...rules,

                  maxTradeAmount: parseFloat(e.target.value) || 0,                  maxTradeAmount: parseFloat(e.target.value) || 0,

                })                })

              }              }

              InputProps={{ inputProps: { min: 0, step: 0.01 } }}              InputProps={{ inputProps: { min: 0, step: 0.01 } }}

            />            />

          </Box>          </Box>

        </Box>        </Box>



        <Box mt={3}>        <Box mt={3}>

          <Typography variant="subtitle1" gutterBottom>          <Typography variant="subtitle1" gutterBottom>

            Allowed Trading Pairs            Allowed Trading Pairs

          </Typography>          </Typography>

          <Box display="flex" gap={1} mb={2} flexWrap="wrap">          <Box display="flex" gap={1} mb={2} flexWrap="wrap">

            {rules.allowedPairs.map((pair) => (            {rules.allowedPairs.map((pair) => (

              <Chip              <Chip

                key={pair}                key={pair}

                label={pair}                label={pair}

                onDelete={() => handleRemovePair(pair)}                onDelete={() => handleRemovePair(pair)}

                color="primary"                color="primary"

                variant="outlined"                variant="outlined"

              />              />

            ))}            ))}

          </Box>          </Box>

          <Box display="flex" gap={1}>          <Box display="flex" gap={1}>

            <TextField            <TextField

              size="small"              size="small"

              label="Add Trading Pair"              label="Add Trading Pair"

              value={newPair}              value={newPair}

              onChange={(e) => setNewPair(e.target.value.toUpperCase())}              onChange={(e) => setNewPair(e.target.value.toUpperCase())}

              placeholder="e.g., BTC/USDT"              placeholder="e.g., BTC/USDT"

            />            />

            <Button            <Button

              variant="outlined"              variant="outlined"

              startIcon={<AddIcon />}              startIcon={<AddIcon />}

              onClick={handleAddPair}              onClick={handleAddPair}

              disabled={!newPair}              disabled={!newPair}

            >            >

              Add              Add

            </Button>            </Button>

          </Box>          </Box>

        </Box>        </Box>



        <Box mt={3} display="flex" justifyContent="flex-end">        <Box mt={3} display="flex" justifyContent="flex-end">

          <Button          <Button

            variant="contained"            variant="contained"

            color="primary"            color="primary"

            startIcon={<SaveIcon />}            startIcon={<SaveIcon />}

            onClick={handleSave}            onClick={handleSave}

            disabled={isLoading}            disabled={isLoading}

          >          >

            Save Rules            Save Rules

          </Button>          </Button>

        </Box>        </Box>



        <Box mt={2}>        <Box mt={2}>

          <Alert severity="info" icon={<InfoIcon />}>          <Alert severity="info" icon={<InfoIcon />}>

            These rules apply to AI trading for sister accounts. The AI will only execute trades within these limits and for the specified trading pairs.            These rules apply to AI trading for sister accounts. The AI will only execute trades within these limits and for the specified trading pairs.

          </Alert>          </Alert>

        </Box>        </Box>

      </CardContent>      </CardContent>

    </Card>    </Card>

  );  );

};};



export default AITradingRules;  export default AITradingRules;

import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import InfoIcon from "@mui/icons-material/Info";
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

const AITradingRules: React.FC<AITradingRulesProps> = ({ className }) => {
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
    // eslint-disable-next-line
  }, []);

  const loadRules = async () => {
    try {
      const tradingManager = TradingManager.getInstance();
      const aiTradingConfig = await tradingManager.getAITradingConfig();
      setIsEnabled(aiTradingConfig.enabled);
      setRules(aiTradingConfig.tradingRules);
    } catch (error) {
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
    } catch (err: any) {
      setError(err?.message || "Failed to update rules");
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
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
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

        <Box display="flex" gap={2} flexWrap="wrap">
          <Box flex={1} minWidth={240}>
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
          </Box>
          <Box flex={1} minWidth={240}>
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
          </Box>
        </Box>

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
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={isLoading}
          >
            Save Rules
          </Button>
        </Box>

        <Box mt={2}>
          <Alert severity="info" icon={<InfoIcon />}>
            These rules apply to AI trading for sister accounts. The AI will only execute trades within these limits and for the specified trading pairs.
          </Alert>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AITradingRules;
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import InfoIcon from "@mui/icons-material/Info";
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

const AITradingRules: React.FC<AITradingRulesProps> = ({ className }) => {
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
    // eslint-disable-next-line
  }, []);

  const loadRules = async () => {
    try {
      const tradingManager = TradingManager.getInstance();
      const aiTradingConfig = await tradingManager.getAITradingConfig();
      setIsEnabled(aiTradingConfig.enabled);
      setRules(aiTradingConfig.tradingRules);
    } catch (error) {
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
    } catch (err: any) {
      setError(err?.message || "Failed to update rules");
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
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
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

        <Box display="flex" gap={2} flexWrap="wrap">
          <Box flex={1} minWidth={240}>
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
          </Box>
          <Box flex={1} minWidth={240}>
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
          </Box>
        </Box>

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
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={isLoading}
          >
            Save Rules
          </Button>
        </Box>

        <Box mt={2}>
          <Alert severity="info" icon={<InfoIcon />}>
            These rules apply to AI trading for sister accounts. The AI will only execute trades within these limits and for the specified trading pairs.
          </Alert>
        </Box>
      </CardContent>
    </Card>
  );
};

import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import InfoIcon from "@mui/icons-material/Info";
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

const AITradingRules: React.FC<AITradingRulesProps> = ({ className }) => {
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
    // eslint-disable-next-line
  }, []);

  const loadRules = async () => {
    try {
      const tradingManager = TradingManager.getInstance();
      const aiTradingConfig = await tradingManager.getAITradingConfig();
      setIsEnabled(aiTradingConfig.enabled);
      setRules(aiTradingConfig.tradingRules);
    } catch (error) {
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
    } catch (err: any) {
      setError(err?.message || "Failed to update rules");
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
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
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

        <Box display="flex" gap={2} flexWrap="wrap">
          <Box flex={1} minWidth={240}>
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
          </Box>
          <Box flex={1} minWidth={240}>
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
          </Box>
        </Box>

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
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={isLoading}
          >
            Save Rules
          </Button>
        </Box>

        <Box mt={2}>
          <Alert severity="info" icon={<InfoIcon />}>
            These rules apply to AI trading for sister accounts. The AI will only execute trades within these limits and for the specified trading pairs.
          </Alert>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AITradingRules;
// ...existing code ends here. Remove everything below this line.
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import InfoIcon from "@mui/icons-material/Info";
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

const AITradingRules: React.FC<AITradingRulesProps> = ({ className }) => {
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
    // eslint-disable-next-line
  }, []);

  const loadRules = async () => {
    try {
      const tradingManager = TradingManager.getInstance();
      const aiTradingConfig = await tradingManager.getAITradingConfig();
      setIsEnabled(aiTradingConfig.enabled);
      setRules(aiTradingConfig.tradingRules);
    } catch (error) {
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
    } catch (err: any) {
      setError(err?.message || "Failed to update rules");
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
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
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

        <Box display="flex" gap={2} flexWrap="wrap">
          <Box flex={1} minWidth={240}>
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
          </Box>
          <Box flex={1} minWidth={240}>
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
          </Box>
        </Box>

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
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={isLoading}
          >
            Save Rules
          </Button>
        </Box>

        <Box mt={2}>
          <Alert severity="info" icon={<InfoIcon />}>
            These rules apply to AI trading for sister accounts. The AI will only execute trades within these limits and for the specified trading pairs.
          </Alert>
        </Box>
      </CardContent>
    </Card>
  );
};

  export default AITradingRules;
  // Truncate file here. Remove all code below this line.
  // ...existing code ends here. Remove everything below this line.
  export default AITradingRules;

import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import InfoIcon from "@mui/icons-material/Info";
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

const AITradingRules: React.FC<AITradingRulesProps> = ({ className }) => {
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
    // eslint-disable-next-line
  }, []);

  const loadRules = async () => {
    try {
      const tradingManager = TradingManager.getInstance();
      const aiTradingConfig = await tradingManager.getAITradingConfig();
      setIsEnabled(aiTradingConfig.enabled);
      setRules(aiTradingConfig.tradingRules);
    } catch (error) {
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
    } catch (err: any) {
      setError(err?.message || "Failed to update rules");
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
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
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

        <Box display="flex" gap={2} flexWrap="wrap">
          <Box flex={1} minWidth={240}>
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
          </Box>
          <Box flex={1} minWidth={240}>
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
          </Box>
        </Box>

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
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={isLoading}
          >
            Save Rules
          </Button>
        </Box>

        <Box mt={2}>
          <Alert severity="info" icon={<InfoIcon />}>
            These rules apply to AI trading for sister accounts. The AI will only execute trades within these limits and for the specified trading pairs.
          </Alert>
        </Box>
      </CardContent>
    </Card>
  );
};

import {

  import {
    Box,
    Card,
    CardContent,
    Typography,
    Switch,
    FormControlLabel,
    TextField,
    Button,
    Alert,
    Chip,
  } from "@mui/material";
  import { Save, Add as AddIcon, Info } from "@mui/icons-material";
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

  export const AITradingRules: React.FC<AITradingRulesProps> = ({ className }) => {
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
      // eslint-disable-next-line
    }, []);

    const loadRules = async () => {
      try {
        const tradingManager = TradingManager.getInstance();
        const aiTradingConfig = await tradingManager.getAITradingConfig();
        setIsEnabled(aiTradingConfig.enabled);
        setRules(aiTradingConfig.tradingRules);
      } catch (error) {
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
      } catch (err: any) {
        setError(err?.message || "Failed to update rules");
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
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
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

          <Box display="flex" gap={2} flexWrap="wrap">
            <Box flex={1} minWidth={240}>
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
            </Box>
            <Box flex={1} minWidth={240}>
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
            </Box>
          </Box>

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
            only execute trades within these limits and for the specified
            trading pairs.
          </Alert>
        </Box>
      </CardContent>
    </Card>
  );
};
