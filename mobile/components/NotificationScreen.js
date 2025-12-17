import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  Switch,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function NotificationScreen({ route }) {
  const [notifications, setNotifications] = useState([]);
  const [prefs, setPrefs] = useState({
    slack: false,
    discord: false,
    pushover: false,
  });
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const role = route.params?.role || "other";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const notifRes = await axios.get(
          "http://localhost:4200/api/notification-history",
        );
        setNotifications(notifRes.data || []);
        await AsyncStorage.setItem(
          "qmoiNotifications",
          JSON.stringify(notifRes.data || []),
        );
        setOffline(false);
        const prefsRes = await axios.get(
          "http://localhost:4200/api/notification-prefs",
        );
        setPrefs({
          slack: prefsRes.data.slack?.enabled || false,
          discord: prefsRes.data.discord?.enabled || false,
          pushover: prefsRes.data.pushover?.enabled || false,
        });
      } catch {
        setOffline(true);
        const cached = await AsyncStorage.getItem("qmoiNotifications");
        setNotifications(cached ? JSON.parse(cached) : []);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const updatePref = async (channel, value) => {
    setPrefs((p) => ({ ...p, [channel]: value }));
    try {
      await axios.post("http://localhost:4200/api/notification-prefs", {
        [channel]: { enabled: value },
      });
    } catch {}
  };

  const handleAcknowledge = async (id) => {
    setNotifications((n) =>
      n.map((notif) =>
        notif.id === id ? { ...notif, status: "acknowledged" } : notif,
      ),
    );
    try {
      await axios.post("http://localhost:4200/api/acknowledge-notification", {
        id,
      });
    } catch {}
  };

  const handleDelete = async (id) => {
    setNotifications((n) => n.filter((notif) => notif.id !== id));
    try {
      await axios.post("http://localhost:4200/api/delete-notification", { id });
    } catch {}
  };

  const handleRespond = async (id) => {
    Alert.prompt("Respond to Notification", "", async (text) => {
      if (text) {
        try {
          await axios.post("http://localhost:4200/api/respond-notification", {
            id,
            response: text,
          });
        } catch {}
      }
    });
  };

  if (loading) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Notifications {offline ? "(Offline)" : ""}
      </Text>
      {role === "master" && (
        <View style={styles.prefsRow}>
          <Text>Slack</Text>
          <Switch
            value={prefs.slack}
            onValueChange={(v) => updatePref("slack", v)}
          />
          <Text>Discord</Text>
          <Switch
            value={prefs.discord}
            onValueChange={(v) => updatePref("discord", v)}
          />
          <Text>Pushover</Text>
          <Switch
            value={prefs.pushover}
            onValueChange={(v) => updatePref("pushover", v)}
          />
        </View>
      )}
      <FlatList
        data={notifications.slice(-20).reverse()}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.notifItem}>
            <Text style={styles.notifTitle}>{item.title}</Text>
            <Text>{item.message}</Text>
            <Text style={styles.notifMeta}>
              {item.type} | {item.status} | {item.timestamp}
            </Text>
            <View style={styles.actionRow}>
              {(role === "master" || role === "sister") && (
                <TouchableOpacity
                  onPress={() => handleAcknowledge(item.id)}
                  style={styles.actionBtn}
                >
                  <Text>Ack</Text>
                </TouchableOpacity>
              )}
              {role === "master" && (
                <TouchableOpacity
                  onPress={() => handleDelete(item.id)}
                  style={styles.actionBtn}
                >
                  <Text>Delete</Text>
                </TouchableOpacity>
              )}
              {(role === "master" || role === "sister") && (
                <TouchableOpacity
                  onPress={() => handleRespond(item.id)}
                  style={styles.actionBtn}
                >
                  <Text>Respond</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  prefsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    flexWrap: "wrap",
  },
  notifItem: { borderBottomWidth: 1, borderColor: "#eee", paddingVertical: 8 },
  notifTitle: { fontWeight: "bold" },
  notifMeta: { fontSize: 12, color: "#888" },
  actionRow: { flexDirection: "row", marginTop: 8 },
  actionBtn: {
    backgroundColor: "#eee",
    borderRadius: 6,
    padding: 6,
    marginRight: 8,
  },
});
