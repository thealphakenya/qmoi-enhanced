![Build](https://img.shields.io/badge/QMOI%20Build-Passing-brightgreen?style=flat-square)

# QMOI System

Welcome to the **Quantum Master Orchestrator Intelligence (QMOI)** system — a unified automation, deployment, and update pipeline for **QMOI AI** and all **QCity-powered apps** across:  
**{{platforms}}**

---

## 🚀 Build & Automation

Use the following tools to automate and build your apps:

| Tool                                 | Description                                                      |
| ------------------------------------ | ---------------------------------------------------------------- |
| `python scripts/qmoi-app-builder.py` | Full cloud-based build and test for all devices                  |
| `build_qmoi_ai.bat`                  | Quick-build for Windows `.exe` using PyInstaller + GitHub deploy |
| `qmoiexe.py`                         | All-in-one launcher (backend + GUI + tray + updater + shortcuts) |
| `auto_updater.py`                    | Auto-checks GitHub for new releases and updates locally          |

---

## 📁 File Structure

````text
Qmoi_apps/
├── windows/qmoi_ai.exe
├── android/qmoi_ai.apk
├── mac/qmoi_ai.dmg
├── linux/qmoi_ai.AppImage
├── ios/qmoi_ai.ipa
├── chromebook/qmoi_ai.deb
├── raspberrypi/qmoi_ai.img
├── qcity/qmoi_ai.zip
├── smarttv/qmoi_ai.apk
🌐 Download Portal
👉 https://downloads.qmoi.app

🛠 Autotest Build Matrix (Updated {{timestamp}})
Platform	Build Status	Test Result
{{build_matrix}}

🧬 Troubleshooting
Run this to rebuild and sync everything:

bash
Copy
Edit
python scripts/qmoi-app-builder.py
🔁 Powered by
QMOI Engine (qmoiexe.py)

Auto Updater

GitHub + CI/CD automation

QCity Cloud Runners ☁️

yaml
Copy
Edit

---

### 🇫🇷 `scripts/templates/README_template.fr.md`

```markdown
![Build](https://img.shields.io/badge/QMOI%20Build-Passing-brightgreen?style=flat-square)

# Système QMOI

Bienvenue dans le système **Quantum Master Orchestrator Intelligence (QMOI)** — une solution unifiée pour l'automatisation, le déploiement et les mises à jour de **QMOI AI** et toutes les applications **QCity** sur :
**{{platforms}}**

---

## 🚀 Compilation et Automatisation

Utilisez ces outils pour automatiser et compiler vos applications :

| Outil                                | Description                                                         |
| ------------------------------------ | ------------------------------------------------------------------- |
| `python scripts/qmoi-app-builder.py` | Construction cloud complète pour tous les appareils                |
| `build_qmoi_ai.bat`                  | Compilation rapide Windows `.exe` avec PyInstaller + GitHub Release |
| `qmoiexe.py`                         | Lanceur tout-en-un (serveur, GUI, mise à jour, raccourcis)         |
| `auto_updater.py`                    | Recherche automatique de mises à jour GitHub                       |

---

## 📁 Arborescence des Fichiers

```text
Qmoi_apps/
├── windows/qmoi_ai.exe
├── android/qmoi_ai.apk
├── mac/qmoi_ai.dmg
├── linux/qmoi_ai.AppImage
├── ios/qmoi_ai.ipa
├── chromebook/qmoi_ai.deb
├── raspberrypi/qmoi_ai.img
├── qcity/qmoi_ai.zip
├── smarttv/qmoi_ai.apk
🌐 Portail de Téléchargement
👉 https://downloads.qmoi.app

🛠 État des Builds (Mis à jour : {{timestamp}})
Plateforme	État de Compilation	Résultat Test
{{build_matrix}}

🧬 Dépannage
En cas de problème, exécutez simplement :

bash
Copy
Edit
python scripts/qmoi-app-builder.py
🔁 Propulsé par
QMOI Launcher (qmoiexe.py)

Mises à jour automatiques

GitHub Actions

QCity Cloud ☁️

yaml
Copy
Edit

---

### 🇰🇪 `scripts/templates/README_template.sw.md` (Swahili)

```markdown
![Build](https://img.shields.io/badge/QMOI%20Build-Passing-brightgreen?style=flat-square)

# Mfumo wa QMOI

Karibu kwenye **Mfumo wa Quantum Master Orchestrator Intelligence (QMOI)** — mfumo wa kiotomatiki wa kujenga, kusambaza, na kusasisha programu za **QMOI AI** na **QCity** kwenye:
**{{platforms}}**

---

## 🚀 Ujenzi na Uendeshaji Kiotomatiki

Tumia zana hizi kujenga na kuendesha programu zako:

| Zana                                  | Maelezo                                                              |
| ------------------------------------ | -------------------------------------------------------------------- |
| `python scripts/qmoi-app-builder.py` | Jenga na jaribu kifurushi chote kwa vifaa vyote                     |
| `build_qmoi_ai.bat`                  | Jenga haraka `.exe` kwa Windows                                      |
| `qmoiexe.py`                         | Launcher kamili (backend + GUI + updater + tray + shortcuts)        |
| `auto_updater.py`                    | Angalia masasisho ya GitHub kiotomatiki                             |

---

## 📁 Muundo wa Faili

```text
Qmoi_apps/
├── windows/qmoi_ai.exe
├── android/qmoi_ai.apk
├── mac/qmoi_ai.dmg
├── linux/qmoi_ai.AppImage
├── ios/qmoi_ai.ipa
├── chromebook/qmoi_ai.deb
├── raspberrypi/qmoi_ai.img
├── qcity/qmoi_ai.zip
├── smarttv/qmoi_ai.apk
🌐 Tovuti ya Kupakua
👉 https://downloads.qmoi.app

🛠 Hali ya Ujenzi (Imesasishwa {{timestamp}})
Kifaa	Hali ya Build	Matokeo ya Jaribio
{{build_matrix}}

🧬 Suluhisho la Matatizo
Endesha tu:

bash
Copy
Edit
python scripts/qmoi-app-builder.py
🔁 Imewezeshwa na
qmoiexe.py

Kisasa cha masasisho

GitHub + CI/CD

Wingu la QCity ☁️

yaml
Copy
Edit

---

### ✅ You're Now Ready!

Your templates are now:

- Auto-detected via:
  ```python
  lang = os.getenv("QMOI_LANG", "en")
  TEMPLATE_PATH = f"scripts/templates/README_template.{lang}.md"

Dynamically injected and committed on every build.
````
