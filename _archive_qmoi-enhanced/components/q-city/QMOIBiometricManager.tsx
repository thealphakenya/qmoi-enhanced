import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Face,
  Mic,
  Fingerprint,
  Visibility,
  VisibilityOff,
  Security,
  AccountCircle,
  Lock,
  Refresh,
  Add,
  Delete,
  Edit,
  Download,
  Upload,
  QrCode,
  CameraAlt,
  MicNone,
  TouchApp,
  Visibility as IrisIcon
} from '@mui/icons-material';

interface BiometricTemplate {
  id: number;
  type: string;
  quality: number;
  created_at: string;
  status: string;
}

interface AccountCreationLog {
  id: number;
  platform: string;
  username: string;
  email: string;
  purpose: string;
  reason: string;
  age: number;
  created_at: string;
  status: string;
}

interface PasswordRecoveryLog {
  id: number;
  username: string;
  recovery_method: string;
  status: string;
  created_at: string;
  completed_at?: string;
}

interface QMOIBiometricManagerProps {
  isMaster: boolean;
}

const QMOIBiometricManager: React.FC<QMOIBiometricManagerProps> = ({ isMaster }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [biometricTemplates, setBiometricTemplates] = useState<BiometricTemplate[]>([]);
  const [accountLogs, setAccountLogs] = useState<AccountCreationLog[]>([]);
  const [recoveryLogs, setRecoveryLogs] = useState<PasswordRecoveryLog[]>([]);
  const [enrollmentDialog, setEnrollmentDialog] = useState(false);
  const [recoveryDialog, setRecoveryDialog] = useState(false);
  const [accountCreationDialog, setAccountCreationDialog] = useState(false);
  const [selectedBiometricType, setSelectedBiometricType] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [biometricSettings, setBiometricSettings] = useState({
    face: { enabled: true, threshold: 0.6 },
    voice: { enabled: true, threshold: 0.7 },
    fingerprint: { enabled: true, threshold: 0.8 },
    iris: { enabled: true, threshold: 0.9 }
  });

  useEffect(() => {
    if (isMaster) {
      loadBiometricData();
      loadAccountLogs();
      loadRecoveryLogs();
    }
  }, [isMaster]);

  const loadBiometricData = async () => {
    try {
      // Simulate API call to load biometric templates
      const templates = [
        { id: 1, type: 'face', quality: 0.95, created_at: '2024-01-15T10:30:00Z', status: 'active' },
        { id: 2, type: 'voice', quality: 0.88, created_at: '2024-01-15T10:35:00Z', status: 'active' },
        { id: 3, type: 'fingerprint', quality: 0.92, created_at: '2024-01-15T10:40:00Z', status: 'active' },
        { id: 4, type: 'iris', quality: 0.98, created_at: '2024-01-15T10:45:00Z', status: 'active' }
      ];
      setBiometricTemplates(templates);
    } catch (error) {
      console.error('Error loading biometric data:', error);
    }
  };

  const loadAccountLogs = async () => {
    try {
      // Simulate API call to load account creation logs
      const logs = [
        {
          id: 1,
          platform: 'GitHub',
          username: 'qmoi_github_user',
          email: 'qmoi_github@qmoi.com',
          purpose: 'QMOI automation',
          reason: 'Automated GitHub integration',
          age: 25,
          created_at: '2024-01-15T10:30:00Z',
          status: 'created'
        },
        {
          id: 2,
          platform: 'GitLab',
          username: 'qmoi_gitlab_user',
          email: 'qmoi_gitlab@qmoi.com',
          purpose: 'QMOI CI/CD',
          reason: 'Automated GitLab integration',
          age: 25,
          created_at: '2024-01-15T10:35:00Z',
          status: 'created'
        },
        {
          id: 3,
          platform: 'Discord',
          username: 'qmoi_discord_bot',
          email: 'qmoi_discord@qmoi.com',
          purpose: 'QMOI notifications',
          reason: 'Automated Discord integration',
          age: 25,
          created_at: '2024-01-15T10:40:00Z',
          status: 'created'
        }
      ];
      setAccountLogs(logs);
    } catch (error) {
      console.error('Error loading account logs:', error);
    }
  };

  const loadRecoveryLogs = async () => {
    try {
      // Simulate API call to load password recovery logs
      const logs = [
        {
          id: 1,
          username: 'testuser',
          recovery_method: 'face',
          status: 'success',
          created_at: '2024-01-15T10:30:00Z',
          completed_at: '2024-01-15T10:32:00Z'
        },
        {
          id: 2,
          username: 'admin',
          recovery_method: 'voice',
          status: 'success',
          created_at: '2024-01-15T10:35:00Z',
          completed_at: '2024-01-15T10:37:00Z'
        }
      ];
      setRecoveryLogs(logs);
    } catch (error) {
      console.error('Error loading recovery logs:', error);
    }
  };

  const handleEnrollBiometric = async () => {
    try {
      // Simulate biometric enrollment
      const result = await enrollBiometric(username, selectedBiometricType);
      if (result.status === 'success') {
        setSnackbar({ open: true, message: 'Biometric enrollment successful!', severity: 'success' });
        setEnrollmentDialog(false);
        loadBiometricData();
      } else {
        setSnackbar({ open: true, message: 'Biometric enrollment failed!', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Error during enrollment!', severity: 'error' });
    }
  };

  const handlePasswordRecovery = async () => {
    try {
      // Simulate password recovery
      const result = await recoverPassword(username, selectedBiometricType);
      if (result.status === 'success') {
        setSnackbar({ open: true, message: 'Password recovery successful!', severity: 'success' });
        setRecoveryDialog(false);
        loadRecoveryLogs();
      } else {
        setSnackbar({ open: true, message: 'Password recovery failed!', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Error during recovery!', severity: 'error' });
    }
  };

  const handleCreateAccount = async () => {
    try {
      // Simulate account creation
      const result = await createAccount(username, selectedBiometricType);
      if (result.status === 'success') {
        setSnackbar({ open: true, message: 'Account created successfully!', severity: 'success' });
        setAccountCreationDialog(false);
        loadAccountLogs();
      } else {
        setSnackbar({ open: true, message: 'Account creation failed!', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Error creating account!', severity: 'error' });
    }
  };

  // Simulated API functions
  const enrollBiometric = async (username: string, type: string) => {
    return { status: 'success', message: 'Enrollment completed' };
  };

  const recoverPassword = async (username: string, type: string) => {
    return { status: 'success', message: 'Password recovered' };
  };

  const createAccount = async (username: string, type: string) => {
    return { status: 'success', message: 'Account created' };
  };

  const getBiometricIcon = (type: string) => {
    switch (type) {
      case 'face': return <Face />;
      case 'voice': return <Mic />;
      case 'fingerprint': return <Fingerprint />;
      case 'iris': return <IrisIcon />;
      default: return <Security />;
    }
  };

  const getBiometricColor = (type: string) => {
    switch (type) {
      case 'face': return 'primary';
      case 'voice': return 'secondary';
      case 'fingerprint': return 'success';
      case 'iris': return 'warning';
      default: return 'default';
    }
  };

  if (!isMaster) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h4" color="error">
            🔒 Master Access Required
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            This feature is only available to QMOI masters.
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h3" gutterBottom>
          🔐 QMOI Biometric Management System
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Master-only biometric authentication, account management, and password recovery system
        </Typography>

        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
          <Tab label="Biometric Templates" />
          <Tab label="Account Creation Logs" />
          <Tab label="Password Recovery Logs" />
          <Tab label="Settings" />
        </Tabs>

        {/* Biometric Templates Tab */}
        {activeTab === 0 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h5">Biometric Templates</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setEnrollmentDialog(true)}
              >
                Enroll New Biometric
              </Button>
            </Box>

            <Grid container spacing={3}>
              {biometricTemplates.map((template) => (
                <Grid item xs={12} sm={6} md={3} key={template.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        {getBiometricIcon(template.type)}
                        <Typography variant="h6" sx={{ ml: 1 }}>
                          {template.type.charAt(0).toUpperCase() + template.type.slice(1)}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Quality: {(template.quality * 100).toFixed(1)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Created: {new Date(template.created_at).toLocaleDateString()}
                      </Typography>
                      <Chip
                        label={template.status}
                        color={template.status === 'active' ? 'success' : 'error'}
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Account Creation Logs Tab */}
        {activeTab === 1 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h5">Account Creation Logs</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setAccountCreationDialog(true)}
              >
                Create New Account
              </Button>
            </Box>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Platform</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Purpose</TableCell>
                    <TableCell>Reason</TableCell>
                    <TableCell>Age</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {accountLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{log.platform}</TableCell>
                      <TableCell>{log.username}</TableCell>
                      <TableCell>{log.email}</TableCell>
                      <TableCell>{log.purpose}</TableCell>
                      <TableCell>{log.reason}</TableCell>
                      <TableCell>{log.age}</TableCell>
                      <TableCell>{new Date(log.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Chip
                          label={log.status}
                          color={log.status === 'created' ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Password Recovery Logs Tab */}
        {activeTab === 2 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h5">Password Recovery Logs</Typography>
              <Button
                variant="contained"
                startIcon={<Lock />}
                onClick={() => setRecoveryDialog(true)}
              >
                Password Recovery
              </Button>
            </Box>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Username</TableCell>
                    <TableCell>Recovery Method</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Completed</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recoveryLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{log.username}</TableCell>
                      <TableCell>
                        <Chip
                          icon={getBiometricIcon(log.recovery_method)}
                          label={log.recovery_method}
                          color={getBiometricColor(log.recovery_method)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={log.status}
                          color={log.status === 'success' ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{new Date(log.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {log.completed_at ? new Date(log.completed_at).toLocaleDateString() : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Settings Tab */}
        {activeTab === 3 && (
          <Box>
            <Typography variant="h5" sx={{ mb: 3 }}>Biometric Settings</Typography>
            
            <Grid container spacing={3}>
              {Object.entries(biometricSettings).map(([type, settings]) => (
                <Grid item xs={12} md={6} key={type}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        {getBiometricIcon(type)}
                        <Typography variant="h6" sx={{ ml: 1 }}>
                          {type.charAt(0).toUpperCase() + type.slice(1)} Recognition
                        </Typography>
                      </Box>
                      
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.enabled}
                            onChange={(e) => setBiometricSettings(prev => ({
                              ...prev,
                              [type]: { ...prev[type as keyof typeof prev], enabled: e.target.checked }
                            }))}
                          />
                        }
                        label="Enabled"
                      />
                      
                      <Typography variant="body2" sx={{ mt: 2 }}>
                        Threshold: {settings.threshold}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Enrollment Dialog */}
        <Dialog open={enrollmentDialog} onClose={() => setEnrollmentDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Enroll New Biometric</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ mb: 2, mt: 1 }}
            />
            
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Select Biometric Type:
            </Typography>
            
            <Grid container spacing={2}>
              {Object.entries(biometricSettings).map(([type, settings]) => (
                <Grid item xs={6} key={type}>
                  <Button
                    variant={selectedBiometricType === type ? "contained" : "outlined"}
                    startIcon={getBiometricIcon(type)}
                    fullWidth
                    onClick={() => setSelectedBiometricType(type)}
                    disabled={!settings.enabled}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEnrollmentDialog(false)}>Cancel</Button>
            <Button onClick={handleEnrollBiometric} variant="contained" disabled={!selectedBiometricType}>
              Enroll
            </Button>
          </DialogActions>
        </Dialog>

        {/* Password Recovery Dialog */}
        <Dialog open={recoveryDialog} onClose={() => setRecoveryDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Password Recovery</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ mb: 2, mt: 1 }}
            />
            
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Select Recovery Method:
            </Typography>
            
            <Grid container spacing={2}>
              {Object.entries(biometricSettings).map(([type, settings]) => (
                <Grid item xs={6} key={type}>
                  <Button
                    variant={selectedBiometricType === type ? "contained" : "outlined"}
                    startIcon={getBiometricIcon(type)}
                    fullWidth
                    onClick={() => setSelectedBiometricType(type)}
                    disabled={!settings.enabled}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRecoveryDialog(false)}>Cancel</Button>
            <Button onClick={handlePasswordRecovery} variant="contained" disabled={!selectedBiometricType}>
              Recover Password
            </Button>
          </DialogActions>
        </Dialog>

        {/* Account Creation Dialog */}
        <Dialog open={accountCreationDialog} onClose={() => setAccountCreationDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Create New Account</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  sx={{ mb: 2, mt: 1 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Platform"
                  defaultValue="GitHub"
                  sx={{ mb: 2, mt: 1 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Purpose"
                  defaultValue="QMOI automation"
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Reason"
                  defaultValue="Automated account creation"
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Age"
                  type="number"
                  defaultValue={25}
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAccountCreationDialog(false)}>Cancel</Button>
            <Button onClick={handleCreateAccount} variant="contained">
              Create Account
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default QMOIBiometricManager; 