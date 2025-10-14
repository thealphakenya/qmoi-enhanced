import React, { useState, useEffect } from "react";
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
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";

const DeviceManagementScreen = ({ userRole }) => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [showDeviceDetails, setShowDeviceDetails] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [newDevice, setNewDevice] = useState({
    name: "",
    type: "computer",
    ip: "",
    port: "3000",
    description: "",
  });

  const deviceTypes = [
    { key: "computer", label: "Computer", icon: "computer" },
    { key: "server", label: "Server", icon: "dns" },
    { key: "mobile", label: "Mobile Device", icon: "smartphone" },
    { key: "tablet", label: "Tablet", icon: "tablet" },
    { key: "iot", label: "IoT Device", icon: "sensors" },
    { key: "camera", label: "Camera", icon: "videocam" },
    { key: "sensor", label: "Sensor", icon: "sensors" },
  ];

  const deviceStatuses = {
    online: { color: "#4CAF50", label: "Online" },
    offline: { color: "#F44336", label: "Offline" },
    warning: { color: "#FF9800", label: "Warning" },
    maintenance: { color: "#2196F3", label: "Maintenance" },
  };

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      setLoading(true);
      const storedDevices = await AsyncStorage.getItem("qmoi_devices");
      if (storedDevices) {
        setDevices(JSON.parse(storedDevices));
      } else {
        // Initialize with default devices
        const defaultDevices = [
          {
            id: "1",
            name: "QMOI Main Server",
            type: "server",
            ip: "192.168.1.100",
            port: "3000",
            status: "online",
            description: "Primary QMOI AI server",
            lastSeen: new Date().toISOString(),
            permissions: ["read", "write", "admin"],
            owner: "master",
            createdAt: new Date().toISOString(),
            metrics: {
              cpu: 45,
              memory: 67,
              disk: 23,
              network: 12,
            },
          },
          {
            id: "2",
            name: "Development Machine",
            type: "computer",
            ip: "192.168.1.101",
            port: "3001",
            status: "online",
            description: "Development environment",
            lastSeen: new Date().toISOString(),
            permissions: ["read", "write"],
            owner: "sister",
            createdAt: new Date().toISOString(),
            metrics: {
              cpu: 78,
              memory: 45,
              disk: 67,
              network: 8,
            },
          },
          {
            id: "3",
            name: "Security Camera",
            type: "camera",
            ip: "192.168.1.102",
            port: "8080",
            status: "warning",
            description: "Front door security camera",
            lastSeen: new Date(Date.now() - 300000).toISOString(),
            permissions: ["read"],
            owner: "master",
            createdAt: new Date().toISOString(),
            metrics: {
              cpu: 15,
              memory: 23,
              disk: 45,
              network: 34,
            },
          },
        ];
        setDevices(defaultDevices);
        await AsyncStorage.setItem(
          "qmoi_devices",
          JSON.stringify(defaultDevices),
        );
      }
    } catch (error) {
      console.error("Error loading devices:", error);
      Alert.alert("Error", "Failed to load devices");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDevices();
    setRefreshing(false);
  };

  const addDevice = async () => {
    if (!newDevice.name || !newDevice.ip) {
      Alert.alert("Error", "Name and IP are required");
      return;
    }

    try {
      const device = {
        id: Date.now().toString(),
        ...newDevice,
        status: "offline",
        lastSeen: new Date().toISOString(),
        permissions: ["read"],
        owner: userRole,
        createdAt: new Date().toISOString(),
        metrics: {
          cpu: 0,
          memory: 0,
          disk: 0,
          network: 0,
        },
      };

      const updatedDevices = [...devices, device];
      setDevices(updatedDevices);
      await AsyncStorage.setItem(
        "qmoi_devices",
        JSON.stringify(updatedDevices),
      );

      setNewDevice({
        name: "",
        type: "computer",
        ip: "",
        port: "3000",
        description: "",
      });
      setShowAddDevice(false);

      Alert.alert("Success", "Device added successfully");
    } catch (error) {
      console.error("Error adding device:", error);
      Alert.alert("Error", "Failed to add device");
    }
  };

  const removeDevice = async (deviceId) => {
    Alert.alert(
      "Remove Device",
      "Are you sure you want to remove this device?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              const updatedDevices = devices.filter((d) => d.id !== deviceId);
              setDevices(updatedDevices);
              await AsyncStorage.setItem(
                "qmoi_devices",
                JSON.stringify(updatedDevices),
              );
              Alert.alert("Success", "Device removed successfully");
            } catch (error) {
              console.error("Error removing device:", error);
              Alert.alert("Error", "Failed to remove device");
            }
          },
        },
      ],
    );
  };

  const updateDeviceStatus = async (deviceId, status) => {
    try {
      const updatedDevices = devices.map((d) =>
        d.id === deviceId
          ? { ...d, status, lastSeen: new Date().toISOString() }
          : d,
      );
      setDevices(updatedDevices);
      await AsyncStorage.setItem(
        "qmoi_devices",
        JSON.stringify(updatedDevices),
      );
    } catch (error) {
      console.error("Error updating device status:", error);
    }
  };

  const toggleDevicePermission = async (deviceId, permission) => {
    try {
      const updatedDevices = devices.map((d) => {
        if (d.id === deviceId) {
          const permissions = d.permissions.includes(permission)
            ? d.permissions.filter((p) => p !== permission)
            : [...d.permissions, permission];
          return { ...d, permissions };
        }
        return d;
      });
      setDevices(updatedDevices);
      await AsyncStorage.setItem(
        "qmoi_devices",
        JSON.stringify(updatedDevices),
      );
    } catch (error) {
      console.error("Error updating device permissions:", error);
    }
  };

  const renderDeviceCard = ({ item }) => {
    const status = deviceStatuses[item.status];
    const deviceType = deviceTypes.find((t) => t.key === item.type);

    return (
      <TouchableOpacity
        style={styles.deviceCard}
        onPress={() => {
          setSelectedDevice(item);
          setShowDeviceDetails(true);
        }}
      >
        <View style={styles.deviceHeader}>
          <View style={styles.deviceInfo}>
            <Icon
              name={deviceType?.icon || "devices"}
              size={24}
              color="#2196F3"
            />
            <View style={styles.deviceText}>
              <Text style={styles.deviceName}>{item.name}</Text>
              <Text style={styles.deviceType}>{deviceType?.label}</Text>
            </View>
          </View>
          <View style={styles.deviceStatus}>
            <View
              style={[styles.statusDot, { backgroundColor: status.color }]}
            />
            <Text style={styles.statusText}>{status.label}</Text>
          </View>
        </View>

        <View style={styles.deviceDetails}>
          <Text style={styles.deviceIp}>
            {item.ip}:{item.port}
          </Text>
          <Text style={styles.deviceDescription} numberOfLines={2}>
            {item.description}
          </Text>
        </View>

        <View style={styles.deviceMetrics}>
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

        {userRole === "master" && (
          <View style={styles.deviceActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.statusButton]}
              onPress={() =>
                updateDeviceStatus(
                  item.id,
                  item.status === "online" ? "offline" : "online",
                )
              }
            >
              <Icon
                name={item.status === "online" ? "power-settings-new" : "power"}
                size={16}
                color="#FFF"
              />
              <Text style={styles.actionText}>
                {item.status === "online" ? "Disconnect" : "Connect"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.removeButton]}
              onPress={() => removeDevice(item.id)}
            >
              <Icon name="delete" size={16} color="#FFF" />
              <Text style={styles.actionText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderAddDeviceModal = () => (
    <Modal
      visible={showAddDevice}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowAddDevice(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Device</Text>
            <TouchableOpacity onPress={() => setShowAddDevice(false)}>
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <Text style={styles.inputLabel}>Device Name *</Text>
            <TextInput
              style={styles.input}
              value={newDevice.name}
              onChangeText={(text) =>
                setNewDevice({ ...newDevice, name: text })
              }
              placeholder="Enter device name"
            />

            <Text style={styles.inputLabel}>Device Type</Text>
            <View style={styles.typeSelector}>
              {deviceTypes.map((type) => (
                <TouchableOpacity
                  key={type.key}
                  style={[
                    styles.typeOption,
                    newDevice.type === type.key && styles.typeOptionSelected,
                  ]}
                  onPress={() => setNewDevice({ ...newDevice, type: type.key })}
                >
                  <Icon
                    name={type.icon}
                    size={20}
                    color={newDevice.type === type.key ? "#FFF" : "#666"}
                  />
                  <Text
                    style={[
                      styles.typeOptionText,
                      newDevice.type === type.key &&
                        styles.typeOptionTextSelected,
                    ]}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>IP Address *</Text>
            <TextInput
              style={styles.input}
              value={newDevice.ip}
              onChangeText={(text) => setNewDevice({ ...newDevice, ip: text })}
              placeholder="192.168.1.100"
              keyboardType="numeric"
            />

            <Text style={styles.inputLabel}>Port</Text>
            <TextInput
              style={styles.input}
              value={newDevice.port}
              onChangeText={(text) =>
                setNewDevice({ ...newDevice, port: text })
              }
              placeholder="3000"
              keyboardType="numeric"
            />

            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={newDevice.description}
              onChangeText={(text) =>
                setNewDevice({ ...newDevice, description: text })
              }
              placeholder="Device description"
              multiline
              numberOfLines={3}
            />
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShowAddDevice(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.addButton]}
              onPress={addDevice}
            >
              <Text style={styles.addButtonText}>Add Device</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderDeviceDetailsModal = () => (
    <Modal
      visible={showDeviceDetails}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowDeviceDetails(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Device Details</Text>
            <TouchableOpacity onPress={() => setShowDeviceDetails(false)}>
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {selectedDevice && (
            <ScrollView style={styles.modalBody}>
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Basic Information</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Name:</Text>
                  <Text style={styles.detailValue}>{selectedDevice.name}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Type:</Text>
                  <Text style={styles.detailValue}>
                    {
                      deviceTypes.find((t) => t.key === selectedDevice.type)
                        ?.label
                    }
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>IP Address:</Text>
                  <Text style={styles.detailValue}>
                    {selectedDevice.ip}:{selectedDevice.port}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status:</Text>
                  <View style={styles.statusDisplay}>
                    <View
                      style={[
                        styles.statusDot,
                        {
                          backgroundColor:
                            deviceStatuses[selectedDevice.status].color,
                        },
                      ]}
                    />
                    <Text style={styles.detailValue}>
                      {deviceStatuses[selectedDevice.status].label}
                    </Text>
                  </View>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Owner:</Text>
                  <Text style={styles.detailValue}>{selectedDevice.owner}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Last Seen:</Text>
                  <Text style={styles.detailValue}>
                    {new Date(selectedDevice.lastSeen).toLocaleString()}
                  </Text>
                </View>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>System Metrics</Text>
                <View style={styles.metricsGrid}>
                  <View style={styles.metricCard}>
                    <Text style={styles.metricTitle}>CPU Usage</Text>
                    <Text style={styles.metricValue}>
                      {selectedDevice.metrics.cpu}%
                    </Text>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${selectedDevice.metrics.cpu}%` },
                        ]}
                      />
                    </View>
                  </View>
                  <View style={styles.metricCard}>
                    <Text style={styles.metricTitle}>Memory Usage</Text>
                    <Text style={styles.metricValue}>
                      {selectedDevice.metrics.memory}%
                    </Text>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${selectedDevice.metrics.memory}%` },
                        ]}
                      />
                    </View>
                  </View>
                  <View style={styles.metricCard}>
                    <Text style={styles.metricTitle}>Disk Usage</Text>
                    <Text style={styles.metricValue}>
                      {selectedDevice.metrics.disk}%
                    </Text>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${selectedDevice.metrics.disk}%` },
                        ]}
                      />
                    </View>
                  </View>
                  <View style={styles.metricCard}>
                    <Text style={styles.metricTitle}>Network</Text>
                    <Text style={styles.metricValue}>
                      {selectedDevice.metrics.network}%
                    </Text>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${selectedDevice.metrics.network}%` },
                        ]}
                      />
                    </View>
                  </View>
                </View>
              </View>

              {userRole === "master" && (
                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Permissions</Text>
                  {["read", "write", "admin"].map((permission) => (
                    <View key={permission} style={styles.permissionRow}>
                      <Text style={styles.permissionLabel}>
                        {permission.toUpperCase()}
                      </Text>
                      <Switch
                        value={selectedDevice.permissions.includes(permission)}
                        onValueChange={() =>
                          toggleDevicePermission(selectedDevice.id, permission)
                        }
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={
                          selectedDevice.permissions.includes(permission)
                            ? "#2196F3"
                            : "#f4f3f4"
                        }
                      />
                    </View>
                  ))}
                </View>
              )}

              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.descriptionText}>
                  {selectedDevice.description}
                </Text>
              </View>
            </ScrollView>
          )}

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalButton, styles.closeButton]}
              onPress={() => setShowDeviceDetails(false)}
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
        <Text style={styles.loadingText}>Loading devices...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Device Management</Text>
        {userRole === "master" && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddDevice(true)}
          >
            <Icon name="add" size={24} color="#FFF" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{devices.length}</Text>
          <Text style={styles.statLabel}>Total Devices</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {devices.filter((d) => d.status === "online").length}
          </Text>
          <Text style={styles.statLabel}>Online</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {devices.filter((d) => d.status === "warning").length}
          </Text>
          <Text style={styles.statLabel}>Warnings</Text>
        </View>
      </View>

      <FlatList
        data={devices}
        renderItem={renderDeviceCard}
        keyExtractor={(item) => item.id}
        style={styles.deviceList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />

      {renderAddDeviceModal()}
      {renderDeviceDetailsModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  addButton: {
    backgroundColor: "#2196F3",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  statsContainer: {
    flexDirection: "row",
    padding: 20,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2196F3",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  deviceList: {
    flex: 1,
    padding: 20,
  },
  deviceCard: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  deviceInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  deviceText: {
    marginLeft: 10,
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  deviceType: {
    fontSize: 12,
    color: "#666",
  },
  deviceStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  statusText: {
    fontSize: 12,
    color: "#666",
  },
  deviceDetails: {
    marginBottom: 10,
  },
  deviceIp: {
    fontSize: 14,
    color: "#666",
    fontFamily: "monospace",
  },
  deviceDescription: {
    fontSize: 12,
    color: "#999",
    marginTop: 5,
  },
  deviceMetrics: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  metric: {
    alignItems: "center",
  },
  metricLabel: {
    fontSize: 10,
    color: "#666",
  },
  metricValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  deviceActions: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
    flex: 1,
    justifyContent: "center",
  },
  statusButton: {
    backgroundColor: "#4CAF50",
  },
  removeButton: {
    backgroundColor: "#F44336",
  },
  actionText: {
    color: "#FFF",
    fontSize: 12,
    marginLeft: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    width: "90%",
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  modalBody: {
    padding: 20,
  },
  modalFooter: {
    flexDirection: "row",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    gap: 10,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  typeSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 10,
  },
  typeOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f9f9f9",
  },
  typeOptionSelected: {
    backgroundColor: "#2196F3",
    borderColor: "#2196F3",
  },
  typeOptionText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 5,
  },
  typeOptionTextSelected: {
    color: "#FFF",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
  },
  cancelButtonText: {
    color: "#666",
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#2196F3",
  },
  addButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: "#2196F3",
  },
  closeButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  detailSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 14,
    color: "#333",
  },
  statusDisplay: {
    flexDirection: "row",
    alignItems: "center",
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  metricCard: {
    width: "48%",
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 8,
  },
  metricTitle: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
  },
  progressBar: {
    height: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 2,
    marginTop: 5,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#2196F3",
    borderRadius: 2,
  },
  permissionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  permissionLabel: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  descriptionText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
});

export default DeviceManagementScreen;
