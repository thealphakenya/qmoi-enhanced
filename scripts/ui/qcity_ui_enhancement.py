import tkinter as tk
from tkinter import ttk
import customtkinter as ctk
from PIL import Image, ImageTk
import json
import os
from typing import Dict, Any, Optional
import threading
import time
import psutil
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
import networkx as nx
from datetime import datetime
import logging


class QCityUI:
    def __init__(self, root: tk.Tk):
        self.root = root
        self.logger = self.setup_logger()
        self.config = self.load_config()

        # Initialize theme
        self.theme = self.config.get("theme", "light")
        self.setup_theme()

        # Initialize UI components
        self.setup_ui()

        # Initialize animations
        self.animations = {}
        self.setup_animations()

        # Initialize data structures
        self.resource_history = {"cpu": [], "memory": [], "disk": [], "network": []}
        self.max_history_points = 100

    def setup_logger(self) -> logging.Logger:
        """Setup logging configuration."""
        logger = logging.getLogger("QCityUI")
        logger.setLevel(logging.INFO)

        # Create handlers
        file_handler = logging.FileHandler("logs/ui.log")
        console_handler = logging.StreamHandler()

        # Create formatters
        formatter = logging.Formatter(
            "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        )
        file_handler.setFormatter(formatter)
        console_handler.setFormatter(formatter)

        # Add handlers
        logger.addHandler(file_handler)
        logger.addHandler(console_handler)

        return logger

    def load_config(self) -> Dict:
        """Load UI configuration."""
        try:
            with open("config/ui_config.json", "r") as f:
                return json.load(f)
        except FileNotFoundError:
            return {
                "theme": "light",
                "animations": True,
                "notifications": True,
                "graphs": True,
                "topology": True,
                "tasks": True,
                "settings": True,
                "logs": True,
                "analytics": True,
            }

    def save_config(self) -> None:
        """Save UI configuration."""
        os.makedirs("config", exist_ok=True)
        with open("config/ui_config.json", "w") as f:
            json.dump(self.config, f, indent=4)

    def setup_theme(self) -> None:
        """Setup UI theme."""
        if self.theme == "dark":
            self.colors = {
                "bg": "#1a1a1a",
                "fg": "#ffffff",
                "accent": "#007acc",
                "error": "#ff4444",
                "success": "#00c853",
                "warning": "#ffd600",
            }
        else:
            self.colors = {
                "bg": "#ffffff",
                "fg": "#000000",
                "accent": "#007acc",
                "error": "#ff4444",
                "success": "#00c853",
                "warning": "#ffd600",
            }

        # Configure ttk styles
        style = ttk.Style()
        style.configure("TFrame", background=self.colors["bg"])
        style.configure(
            "TLabel", background=self.colors["bg"], foreground=self.colors["fg"]
        )
        style.configure(
            "TButton", background=self.colors["accent"], foreground=self.colors["fg"]
        )

    def setup_ui(self) -> None:
        """Setup main UI components."""
        # Create main container
        self.main_container = ttk.Frame(self.root)
        self.main_container.pack(fill=tk.BOTH, expand=True)

        # Create sidebar
        self.setup_sidebar()

        # Create main content area
        self.setup_main_content()

        # Create status bar
        self.setup_status_bar()

        # Create notification system
        self.setup_notifications()

    def setup_sidebar(self) -> None:
        """Setup sidebar navigation."""
        self.sidebar = ttk.Frame(self.main_container, width=200)
        self.sidebar.pack(side=tk.LEFT, fill=tk.Y)

        # Add navigation buttons
        buttons = [
            ("Dashboard", self.show_dashboard),
            ("Resources", self.show_resources),
            ("Network", self.show_network),
            ("Tasks", self.show_tasks),
            ("Settings", self.show_settings),
            ("Logs", self.show_logs),
            ("Analytics", self.show_analytics),
        ]

        for text, command in buttons:
            btn = ttk.Button(self.sidebar, text=text, command=command)
            btn.pack(fill=tk.X, padx=5, pady=2)

    def setup_main_content(self) -> None:
        """Setup main content area."""
        self.content = ttk.Frame(self.main_container)
        self.content.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)

        # Create notebook for tabbed interface
        self.notebook = ttk.Notebook(self.content)
        self.notebook.pack(fill=tk.BOTH, expand=True)

        # Add tabs
        self.setup_dashboard_tab()
        self.setup_resources_tab()
        self.setup_network_tab()
        self.setup_tasks_tab()
        self.setup_settings_tab()
        self.setup_logs_tab()
        self.setup_analytics_tab()

    def setup_status_bar(self) -> None:
        """Setup status bar."""
        self.status_bar = ttk.Frame(self.root)
        self.status_bar.pack(side=tk.BOTTOM, fill=tk.X)

        # Add status labels
        self.status_label = ttk.Label(self.status_bar, text="Ready")
        self.status_label.pack(side=tk.LEFT, padx=5)

        self.time_label = ttk.Label(
            self.status_bar, text=datetime.now().strftime("%H:%M:%S")
        )
        self.time_label.pack(side=tk.RIGHT, padx=5)

        # Update time
        self.update_time()

    def setup_dashboard_tab(self) -> None:
        """Setup dashboard tab."""
        tab = ttk.Frame(self.notebook)
        self.notebook.add(tab, text="Dashboard")

        # Add resource graphs
        if self.config["graphs"]:
            self.setup_resource_graphs(tab)

        # Add network topology
        if self.config["topology"]:
            self.setup_network_topology(tab)

        # Add recent tasks
        if self.config["tasks"]:
            self.setup_recent_tasks(tab)

    def setup_resource_graphs(self, parent: ttk.Frame) -> None:
        """Setup resource monitoring graphs."""
        # Create figure
        fig = plt.Figure(figsize=(6, 4))
        canvas = FigureCanvasTkAgg(fig, parent)
        canvas.get_tk_widget().pack(fill=tk.BOTH, expand=True)

        # Add subplots
        ax1 = fig.add_subplot(221)  # CPU
        ax2 = fig.add_subplot(222)  # Memory
        ax3 = fig.add_subplot(223)  # Disk
        ax4 = fig.add_subplot(224)  # Network

        # Initialize data
        self.resource_data = {"cpu": [], "memory": [], "disk": [], "network": []}

        # Update graphs
        self.update_resource_graphs(fig, [ax1, ax2, ax3, ax4])

    def setup_network_topology(self, parent: ttk.Frame) -> None:
        """Setup network topology visualization."""
        # Create graph
        G = nx.Graph()

        # Add nodes and edges
        G.add_node("Q-City")
        G.add_node("Internet")
        G.add_node("Local Network")
        G.add_node("Devices")

        G.add_edge("Q-City", "Internet")
        G.add_edge("Q-City", "Local Network")
        G.add_edge("Local Network", "Devices")

        # Create figure
        fig = plt.Figure(figsize=(6, 4))
        canvas = FigureCanvasTkAgg(fig, parent)
        canvas.get_tk_widget().pack(fill=tk.BOTH, expand=True)

        # Draw graph
        ax = fig.add_subplot(111)
        pos = nx.spring_layout(G)
        nx.draw(
            G,
            pos,
            ax=ax,
            with_labels=True,
            node_color=self.colors["accent"],
            node_size=1000,
            font_size=10,
            font_color=self.colors["fg"],
        )

    def setup_recent_tasks(self, parent: ttk.Frame) -> None:
        """Setup recent tasks list."""
        # Create listbox
        self.tasks_listbox = tk.Listbox(
            parent,
            bg=self.colors["bg"],
            fg=self.colors["fg"],
            selectbackground=self.colors["accent"],
        )
        self.tasks_listbox.pack(fill=tk.BOTH, expand=True)

        # Add sample tasks
        tasks = [
            "System optimization completed",
            "Network scan finished",
            "Backup created",
            "Error fixed: Network connection",
        ]

        for task in tasks:
            self.tasks_listbox.insert(tk.END, task)

    def setup_resources_tab(self) -> None:
        """Setup resources tab."""
        tab = ttk.Frame(self.notebook)
        self.notebook.add(tab, text="Resources")

        # Add resource monitoring
        self.setup_resource_monitoring(tab)

    def setup_network_tab(self) -> None:
        """Setup network tab."""
        tab = ttk.Frame(self.notebook)
        self.notebook.add(tab, text="Network")

        # Add network monitoring
        self.setup_network_monitoring(tab)

    def setup_tasks_tab(self) -> None:
        """Setup tasks tab."""
        tab = ttk.Frame(self.notebook)
        self.notebook.add(tab, text="Tasks")

        # Add task management
        self.setup_task_management(tab)

    def setup_settings_tab(self) -> None:
        """Setup settings tab."""
        tab = ttk.Frame(self.notebook)
        self.notebook.add(tab, text="Settings")

        # Add settings management
        self.setup_settings_management(tab)

    def setup_logs_tab(self) -> None:
        """Setup logs tab."""
        tab = ttk.Frame(self.notebook)
        self.notebook.add(tab, text="Logs")

        # Add log viewer
        self.setup_log_viewer(tab)

    def setup_analytics_tab(self) -> None:
        """Setup analytics tab."""
        tab = ttk.Frame(self.notebook)
        self.notebook.add(tab, text="Analytics")

        # Add analytics dashboard
        self.setup_analytics_dashboard(tab)

    def setup_animations(self) -> None:
        """Setup UI animations."""
        self.animations = {
            "fade": self.animate_fade,
            "slide": self.animate_slide,
            "scale": self.animate_scale,
        }

    def animate_fade(self, widget: tk.Widget, duration: int = 500) -> None:
        """Fade animation."""
        alpha = 0.0
        step = 1.0 / (duration / 50)

        def update():
            nonlocal alpha
            if alpha < 1.0:
                alpha += step
                widget.configure(alpha=alpha)
                self.root.after(50, update)

        update()

    def animate_slide(
        self, widget: tk.Widget, direction: str = "right", duration: int = 500
    ) -> None:
        """Slide animation."""
        start = -100 if direction == "right" else 100
        end = 0
        step = (end - start) / (duration / 50)
        current = start

        def update():
            nonlocal current
            if current < end:
                current += step
                widget.place(x=current)
                self.root.after(50, update)

        update()

    def animate_scale(self, widget: tk.Widget, duration: int = 500) -> None:
        """Scale animation."""
        scale = 0.0
        step = 1.0 / (duration / 50)

        def update():
            nonlocal scale
            if scale < 1.0:
                scale += step
                widget.configure(scale=scale)
                self.root.after(50, update)

        update()

    def update_time(self) -> None:
        """Update time display."""
        self.time_label.configure(text=datetime.now().strftime("%H:%M:%S"))
        self.root.after(1000, self.update_time)

    def update_resource_graphs(self, fig: plt.Figure, axes: List[plt.Axes]) -> None:
        """Update resource monitoring graphs."""
        # Update data
        self.resource_data["cpu"].append(50)  # Sample data
        self.resource_data["memory"].append(60)
        self.resource_data["disk"].append(70)
        self.resource_data["network"].append(40)

        # Keep last 100 points
        for key in self.resource_data:
            if len(self.resource_data[key]) > 100:
                self.resource_data[key] = self.resource_data[key][-100:]

        # Update plots
        axes[0].clear()
        axes[0].plot(self.resource_data["cpu"])
        axes[0].set_title("CPU Usage")

        axes[1].clear()
        axes[1].plot(self.resource_data["memory"])
        axes[1].set_title("Memory Usage")

        axes[2].clear()
        axes[2].plot(self.resource_data["disk"])
        axes[2].set_title("Disk Usage")

        axes[3].clear()
        axes[3].plot(self.resource_data["network"])
        axes[3].set_title("Network Usage")

        fig.tight_layout()

        # Update every second
        self.root.after(1000, lambda: self.update_resource_graphs(fig, axes))

    def show_dashboard(self) -> None:
        """Show dashboard tab."""
        self.notebook.select(0)

    def show_resources(self) -> None:
        """Show resources tab."""
        self.notebook.select(1)

    def show_network(self) -> None:
        """Show network tab."""
        self.notebook.select(2)

    def show_tasks(self) -> None:
        """Show tasks tab."""
        self.notebook.select(3)

    def show_settings(self) -> None:
        """Show settings tab."""
        self.notebook.select(4)

    def show_logs(self) -> None:
        """Show logs tab."""
        self.notebook.select(5)

    def show_analytics(self) -> None:
        """Show analytics tab."""
        self.notebook.select(6)

    def setup_notifications(self):
        """Setup notification system."""
        self.notification_frame = ttk.Frame(self.root)
        self.notification_frame.place(relx=1.0, rely=0.0, anchor="ne")

        self.notifications = []

    def show_notification(self, message: str, level: str = "info"):
        """Show a notification."""
        colors = {
            "info": "blue",
            "success": "green",
            "warning": "orange",
            "error": "red",
        }

        notification = ttk.Frame(self.notification_frame)
        notification.pack(pady=5, padx=10)

        label = ttk.Label(
            notification, text=message, text_color=colors.get(level, "blue")
        )
        label.pack(pady=5, padx=10)

        self.notifications.append(notification)

        # Auto-remove notification after 5 seconds
        def remove_notification():
            time.sleep(5)
            notification.destroy()
            self.notifications.remove(notification)

        threading.Thread(target=remove_notification, daemon=True).start()

    def start_background_tasks(self):
        """Start background tasks for UI updates."""

        def update_ui():
            while True:
                self.update_resource_graphs(self.resource_fig, self.resource_ax)
                time.sleep(1)

        threading.Thread(target=update_ui, daemon=True).start()

    def run(self):
        """Run the UI."""
        self.root.mainloop()


if __name__ == "__main__":
    app = QCityUI()
    app.run()
