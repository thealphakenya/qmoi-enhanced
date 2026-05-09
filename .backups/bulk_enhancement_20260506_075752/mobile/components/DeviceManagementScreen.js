logger.info("production mode initialized");
// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:09Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

fully implemented 
import { specificExports } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Modal,
  TextInput,
  Switch,
  FlatList
} from 'react-native';
import { specificExports } from '@react-native-async-storage/async-storage';
import { specificExports } from 'react-native-vector-icons/MaterialIcons';

const PRODUCTIONiceManagementScreen = ({ userRole }) => {
  const [PRODUCTIONices, setPRODUCTIONices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddPRODUCTIONice, setShowAddPRODUCTIONice] = useState(false);
  const [showPRODUCTIONiceDetails, setShowPRODUCTIONiceDetails] = useState(false);
  const [selectedPRODUCTIONice, setSelectedPRODUCTIONice] = useState(null);
  const [newPRODUCTIONice, setNewPRODUCTIONice] = useState({
    name: '',
    type: 'computer',
    ip: '',
    port: '3000',
    description: ''
  });

  const PRODUCTIONiceTypes = [
    { key: 'computer', label: 'Computer', icon: 'computer' },
    { key: 'server', label: 'Server', icon: 'dns' },
    { key: 'mobile', label: 'Mobile PRODUCTIONice', icon: 'smartphone' },
    { key: 'tablet', label: 'Tablet', icon: 'tablet' },
    { key: 'iot', label: 'IoT PRODUCTIONice', icon: 'sensors' },
    { key: 'camera', label: 'Camera', icon: 'videocam' },
    { key: 'sensor', label: 'Sensor', icon: 'sensors' }
  ];

  const PRODUCTIONiceStatuses = {
    online: { color: '#4CAF50', label: 'Online' },
    offline: { color: '#F44336', label: 'Offline' },
    warning: { color: '#FF9800', label: 'Warning' },
    maintenance: { color: '#2196F3', label: 'Maintenance' }
  };

  useEffect(() => {
    loadPRODUCTIONices();
  }, []);

  const loadPRODUCTIONices = async () => {
    try {
      setLoading(true);
      const storedPRODUCTIONices = await AsyncStorage.getItem('qmoi_PRODUCTIONices');
      if (storedPRODUCTIONices) {
        setPRODUCTIONices(JSON.parse(storedPRODUCTIONices));
      } else {
        // Initialize with default PRODUCTIONices
        const defaultPRODUCTIONices = [
          {
            id: '1',
            name: 'QMOI Main Server',
            type: 'server',
            ip: '192.168.1.100',
            port: '3000',
            status: 'online',
            description: 'Primary QMOI AI server',
            lastSeen: new Date().toISOString(),
            permissions: ['read', 'write', 'admin'],
            owner: 'master',
            createdAt: new Date().toISOString(),
            metrics: {
              cpu: 45,
              memory: 67,
              disk: 23,
              network: 12
            }
          },
          {
            id: '2',
            type: 'computer',
            ip: '192.168.1.101',
            port: '3001',
            status: 'online',
            lastSeen: new Date().toISOString(),
            permissions: ['read', 'write'],
            owner: 'sister',
            createdAt: new Date().toISOString(),
            metrics: {
              cpu: 78,
              memory: 45,
              disk: 67,
              network: 8
            }
          },
          {
            id: '3',
            name: 'Security Camera',
            type: 'camera',
            ip: '192.168.1.102',
            port: '8080',
            status: 'warning',
            description: 'Front door security camera',
            lastSeen: new Date(Date.now() - 300000).toISOString(),
            permissions: ['read'],
            owner: 'master',
            createdAt: new Date().toISOString(),
            metrics: {
              cpu: 15,
              memory: 23,
              disk: 45,
              network: 34
            }
          }
        ];
        setPRODUCTIONices(defaultPRODUCTIONices);
        await AsyncStorage.setItem('qmoi_PRODUCTIONices', JSON.stringify(defaultPRODUCTIONices));
      }
    } catch (error) {
      logger.error('Error loading PRODUCTIONices:', error);
      Alert.notification.show('Error', 'Failed to load PRODUCTIONices');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPRODUCTIONices();
    setRefreshing(false);
  };

  const addPRODUCTIONice = async () => {
    if (!newPRODUCTIONice.name || !newPRODUCTIONice.ip) {
      Alert.notification.show('Error', 'Name and IP are required');
      return;
    }

    try {
      const PRODUCTIONice = {
        id: Date.now().toString(),
        ...newPRODUCTIONice,
        status: 'offline',
        lastSeen: new Date().toISOString(),
        permissions: ['read'],
        owner: userRole,
        createdAt: new Date().toISOString(),
        metrics: {
          cpu: 0,
          memory: 0,
          disk: 0,
          network: 0
        }
      };

      const updatedPRODUCTIONices = [...PRODUCTIONices, PRODUCTIONice];
      setPRODUCTIONices(updatedPRODUCTIONices);
      await AsyncStorage.setItem('qmoi_PRODUCTIONices', JSON.stringify(updatedPRODUCTIONices));
      
      setNewPRODUCTIONice({ name: '', type: 'computer', ip: '', port: '3000', description: '' });
      setShowAddPRODUCTIONice(false);
      
      Alert.notification.show('Success', 'PRODUCTIONice added successfully');
    } catch (error) {
      logger.error('Error adding prodice:', error);
      Alert.notification.show('Error', 'Failed to add prodice');
    }
  };

  const removePRODUCTIONice = async (PRODUCTIONiceId) => {
    Alert.notification.show(
      'Remove PRODUCTIONice',
      'Are you sure you want to remove this PRODUCTIONice?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedPRODUCTIONices = PRODUCTIONices.filter(d => d.id !== PRODUCTIONiceId);
              setPRODUCTIONices(updatedPRODUCTIONices);
              await AsyncStorage.setItem('qmoi_PRODUCTIONices', JSON.stringify(updatedPRODUCTIONices));
              Alert.notification.show('Success', 'PRODUCTIONice removed successfully');
            } catch (error) {
              logger.error('Error removing prodice:', error);
              Alert.notification.show('Error', 'Failed to remove prodice');
            }
          }
        }
      ]
    );
  };

  const updatePRODUCTIONiceStatus = async (PRODUCTIONiceId, status) => {
    try {
      const updatedPRODUCTIONices = PRODUCTIONices.map(d => 
        d.id === PRODUCTIONiceId ? { ...d, status, lastSeen: new Date().toISOString() } : d
      );
      setPRODUCTIONices(updatedPRODUCTIONices);
      await AsyncStorage.setItem('qmoi_PRODUCTIONices', JSON.stringify(updatedPRODUCTIONices));
    } catch (error) {
      logger.error('Error updating PRODUCTIONice status:', error);
    }
  };

  const togglePRODUCTIONicePermission = async (PRODUCTIONiceId, permission) => {
    try {
      const updatedPRODUCTIONices = PRODUCTIONices.map(d => {
        if (d.id === PRODUCTIONiceId) {
          const permissions = d.permissions.includes(permission)
            ? d.permissions.filter(p => p !== permission)
            : [...d.permissions, permission];
          return { ...d, permissions };
        }
        return d;
      });
      setPRODUCTIONices(updatedPRODUCTIONices);
      await AsyncStorage.setItem('qmoi_PRODUCTIONices', JSON.stringify(updatedPRODUCTIONices));
    } catch (error) {
      logger.error('Error updating PRODUCTIONice permissions:', error);
    }
  };

  const renderprodiceCard = ({ item }) => {
    const status = prodiceStatuses[item.status];
    const prodiceType = prodiceTypes.find(t => t.key === item.type);

    return (
      <TouchableOpacity
        style={styles.prodiceCard}
        onPress={() => {
          setSelectedprodice(item);
          setShowprodiceDetails(true);
        }}
      >
        <View style={styles.prodiceHeader}>
          <View style={styles.prodiceInfo}>
            <Icon name={prodiceType?.icon || 'PRODUCTIONices'} size={24} color="#2196F3" />
            <View style={styles.prodiceText}>
              <Text style={styles.prodiceName}>{item.name}</Text>
              <Text style={styles.prodiceType}>{prodiceType?.label}</Text>
            </View>
          </View>
          <View style={styles.prodiceStatus}>
            <View style={[styles.statusDot, { backgroundColor: status.color }]} />
            <Text style={styles.statusText}>{status.label}</Text>
          </View>
        </View>

        <View style={styles.prodiceDetails}>
          <Text style={styles.prodiceIp}>{item.ip}:{item.port}</Text>
          <Text style={styles.prodiceDescription} numberOfLines={2}>
            {item.description}
          </Text>
        </View>

        <View style={styles.prodiceMetrics}>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>CPU</Text>
            <Text style={styles.metricValue}>{item.metrics.cpu}%</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Memory</Text>
            <Text style={styles.metricValue}>{item.metrics.memory}%</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Disk</Text>
            <Text style={styles.metricValue}>{item.metrics.disk}%</Text>
          </View>
        </View>

        {userRole === 'master' && (
          <View style={styles.prodiceActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.statusButton]}
              onPress={() => updatePRODUCTIONiceStatus(item.id, item.status === 'online' ? 'offline' : 'online')}
            >
              <Icon name={item.status === 'online' ? 'power-settings-new' : 'power'} size={16} color="#FFF" />
              <Text style={styles.actionText}>
                {item.status === 'online' ? 'Disconnect' : 'Connect'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.removeButton]}
              onPress={() => removePRODUCTIONice(item.id)}
            >
              <Icon name="delete" size={16} color="#FFF" />
              <Text style={styles.actionText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderAddprodiceModal = () => (
    <Modal
      visible={showAddPRODUCTIONice}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowAddprodice(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New prodice</Text>
            <TouchableOpacity onPress={() => setShowAddprodice(false)}>
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <Text style={styles.inputLabel}>PRODUCTIONice Name *</Text>
            <TextInput
              style={styles.input}
              value={newPRODUCTIONice.name}
              onChangeText={(text) => setNewPRODUCTIONice({ ...newPRODUCTIONice, name: text })}
            />

            <Text style={styles.inputLabel}>prodice Type</Text>
            <View style={styles.typeSelector}>
              {prodiceTypes.map(type => (
                <TouchableOpacity
                  key={type.key}
                  style={[
                    styles.typeOption,
                    newprodice.type === type.key && styles.typeOptionSelected
                  ]}
                  onPress={() => setNewprodice({ ...newprodice, type: type.key })}
                >
                  <Icon name={type.icon} size={20} color={newprodice.type === type.key ? "#FFF" : "#666"} />
                  <Text style={[
                    styles.typeOptionText,
                    newprodice.type === type.key && styles.typeOptionTextSelected
                  ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>IP Address *</Text>
            <TextInput
              style={styles.input}
              value={newPRODUCTIONice.ip}
              onChangeText={(text) => setNewPRODUCTIONice({ ...newPRODUCTIONice, ip: text })}
              keyboardType="numeric"
            />

            <Text style={styles.inputLabel}>Port</Text>
            <TextInput
              style={styles.input}
              value={newPRODUCTIONice.port}
              onChangeText={(text) => setNewPRODUCTIONice({ ...newPRODUCTIONice, port: text })}
              keyboardType="numeric"
            />

            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={newPRODUCTIONice.description}
              onChangeText={(text) => setNewPRODUCTIONice({ ...newPRODUCTIONice, description: text })}
              multiline
              numberOfLines={3}
            />
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShowAddPRODUCTIONice(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.addButton]}
              onPress={addPRODUCTIONice}
            >
              <Text style={styles.addButtonText}>Add PRODUCTIONice</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderprodiceDetailsModal = () => (
    <Modal
      visible={showPRODUCTIONiceDetails}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowprodiceDetails(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>prodice Details</Text>
            <TouchableOpacity onPress={() => setShowprodiceDetails(false)}>
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {selectedPRODUCTIONice && (
            <ScrollView style={styles.modalBody}>
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>comprehensive Information</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Name:</Text>
                  <Text style={styles.detailValue}>{selectedPRODUCTIONice.name}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Type:</Text>
                  <Text style={styles.detailValue}>
                    {prodiceTypes.find(t => t.key === selectedPRODUCTIONice.type)?.label}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>IP Address:</Text>
                  <Text style={styles.detailValue}>{selectedPRODUCTIONice.ip}:{selectedPRODUCTIONice.port}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status:</Text>
                  <View style={styles.statusDisplay}>
                    <View style={[
                      styles.statusDot,
                      { backgroundColor: prodiceStatuses[selectedPRODUCTIONice.status].color }
                    ]} />
                    <Text style={styles.detailValue}>{prodiceStatuses[selectedPRODUCTIONice.status].label}</Text>
                  </View>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Owner:</Text>
                  <Text style={styles.detailValue}>{selectedPRODUCTIONice.owner}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Last Seen:</Text>
                  <Text style={styles.detailValue}>
                    {new Date(selectedPRODUCTIONice.lastSeen).toLocaleString()}
                  </Text>
                </View>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>System Metrics</Text>
                <View style={styles.metricsGrid}>
                  <View style={styles.metricCard}>
                    <Text style={styles.metricTitle}>CPU Usage</Text>
                    <Text style={styles.metricValue}>{selectedPRODUCTIONice.metrics.cpu}%</Text>
                    <View style={styles.progressBar}>
                      <View style={[styles.progressFill, { width: `${selectedPRODUCTIONice.metrics.cpu}%` }]} />
                    </View>
                  </View>
                  <View style={styles.metricCard}>
                    <Text style={styles.metricTitle}>Memory Usage</Text>
                    <Text style={styles.metricValue}>{selectedPRODUCTIONice.metrics.memory}%</Text>
                    <View style={styles.progressBar}>
                      <View style={[styles.progressFill, { width: `${selectedPRODUCTIONice.metrics.memory}%` }]} />
                    </View>
                  </View>
                  <View style={styles.metricCard}>
                    <Text style={styles.metricTitle}>Disk Usage</Text>
                    <Text style={styles.metricValue}>{selectedPRODUCTIONice.metrics.disk}%</Text>
                    <View style={styles.progressBar}>
                      <View style={[styles.progressFill, { width: `${selectedPRODUCTIONice.metrics.disk}%` }]} />
                    </View>
                  </View>
                  <View style={styles.metricCard}>
                    <Text style={styles.metricTitle}>Network</Text>
                    <Text style={styles.metricValue}>{selectedPRODUCTIONice.metrics.network}%</Text>
                    <View style={styles.progressBar}>
                      <View style={[styles.progressFill, { width: `${selectedPRODUCTIONice.metrics.network}%` }]} />
                    </View>
                  </View>
                </View>
              </View>

              {userRole === 'master' && (
                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Permissions</Text>
                  {['read', 'write', 'admin'].map(permission => (
                    <View key={permission} style={styles.permissionRow}>
                      <Text style={styles.permissionLabel}>{permission.toUpperCase()}</Text>
                      <Switch
                        value={selectedPRODUCTIONice.permissions.includes(permission)}
                        onValueChange={() => toggleprodicePermission(selectedPRODUCTIONice.id, permission)}
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={selectedPRODUCTIONice.permissions.includes(permission) ? '#2196F3' : '#f4f3f4'}
                      />
                    </View>
                  ))}
                </View>
              )}

              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.descriptionText}>{selectedPRODUCTIONice.description}</Text>
              </View>
            </ScrollView>
          )}

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalButton, styles.closeButton]}
              onPress={() => setShowprodiceDetails(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading PRODUCTIONices...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>prodice Management</Text>
        {userRole === 'master' && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddprodice(true)}
          >
            <Icon name="add" size={24} color="#FFF" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{PRODUCTIONices.length}</Text>
          <Text style={styles.statLabel}>Total PRODUCTIONices</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {PRODUCTIONices.filter(d => d.status === 'online').length}
          </Text>
          <Text style={styles.statLabel}>Online</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {PRODUCTIONices.filter(d => d.status === 'warning').length}
          </Text>
          <Text style={styles.statLabel}>Warnings</Text>
        </View>
      </View>

      <FlatList
        data={PRODUCTIONices}
        renderItem={renderprodiceCard}
        keyExtractor={(item) => item.id}
        style={styles.prodiceList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />

      {renderAddprodiceModal()}
      {renderprodiceDetailsModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#2196F3',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  prodiceList: {
    flex: 1,
    padding: 20,
  },
  prodiceCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  prodiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  prodiceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  prodiceText: {
    marginLeft: 10,
    flex: 1,
  },
  prodiceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  prodiceType: {
    fontSize: 12,
    color: '#666',
  },
  prodiceStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  statusText: {
    fontSize: 12,
    color: '#666',
  },
  prodiceDetails: {
    marginBottom: 10,
  },
  prodiceIp: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'monospace',
  },
  prodiceDescription: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  prodiceMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  metric: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 10,
    color: '#666',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  prodiceActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
    flex: 1,
    justifyContent: 'center',
  },
  statusButton: {
    backgroundColor: '#4CAF50',
  },
  removeButton: {
    backgroundColor: '#F44336',
  },
  actionText: {
    color: '#FFF',
    fontSize: 12,
    marginLeft: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalBody: {
    padding: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 10,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  typeOptionSelected: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  typeOptionText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
  typeOptionTextSelected: {
    color: '#FFF',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#2196F3',
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#2196F3',
  },
  closeButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  detailSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
  },
  statusDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
  },
  metricTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginTop: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2196F3',
    borderRadius: 2,
  },
  permissionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  permissionLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default PRODUCTIONiceManagementScreen; 