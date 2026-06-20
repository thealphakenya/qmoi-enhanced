---
quantum-enabled: false
---

ROLE

Act as a senior UI/UX auditor and technical documentation expert.

OBJECTIVE

Analyze the entire application codebase and generate complete Markdown (.md) documentation describing:

1. Every visible UI element
2. Every screen/page/view
3. Every user interaction
4. Navigation flows
5. Feature usage instructions

OUTPUT FORMAT

- Generate separate ".md" files for each major section:
  - "/docs/screens/"
    - "/docs/components/"
      - "/docs/navigation/"
        - "/docs/features/"
          - "/docs/settings/"
            - "/docs/help/"

            ---

            TASK BREAKDOWN

            1. SCREEN ANALYSIS

            For every screen/page in the app:

            - Screen Name
            - File Path
            - Purpose of the screen
            - Full visual description of what a user sees on opening

            Include:

            - Headers / Titles
            - Buttons (label + action)
            - Icons (meaning + function)
            - Forms (fields + validation rules)
            - Lists / Cards / Tables
            - Images / Videos
            - Popups / Modals
            - Floating buttons
            - Navigation bars

            Example Format:

            ## Home Screen

            ### What the user sees:
            - Top navigation bar with logo and profile icon
            - Search bar in the center
            - List of posts displayed as cards
            - Floating "+" button at bottom right

            ### UI Elements:
            - Profile Icon → Opens account page
            - "+" Button → Opens create post modal

            ### User Actions:
            - Tap post → Opens post details
            - Swipe → Scroll content

            ---

            2. COMPONENT DOCUMENTATION

            For every reusable UI component:

            - Component Name
            - File Location
            - Props / Inputs
            - Visual appearance
            - Behavior
            - Where it is used

            ---

            3. NAVIGATION FLOW

            Describe how users move through the app:

            - Entry point (first screen)
            - All possible navigation paths
            - Back behavior
            - Deep links (if any)

            Use diagrams (Mermaid if possible):

            Home → Profile → Settings
                 → Messages → Chat

                 ---

                 4. FEATURE INSTRUCTIONS (USER GUIDE)

                 Write step-by-step instructions for every feature:

                 Example:

                 ## Sending a Message

                 1. Open the app
                 2. Tap "Messages"
                 3. Select a contact
                 4. Type message
                 5. Tap Send

                 ---

                 5. SETTINGS & CONFIGURATION

                 Document all settings:

                 - Setting name
                 - Purpose
                 - Default value
                 - How to change it
                 - Effect of changing it

                 ---

                 6. ERROR STATES & EDGE CASES

                 Document:

                 - Error messages
                 - Empty states
                 - Loading states
                 - Offline behavior

                 ---

                 7. VISUAL DESCRIPTION MODE (VERY IMPORTANT)

                 Explain UI like the user is blind:

                 - Position (top, bottom, center)
                 - Size (small, large, full width)
                 - Color (if defined)
                 - Behavior on interaction

                 ---

                 8. CODE-DRIVEN EXTRACTION

                 Scan code for:

                 - Routes
                 - Components
                 - Event handlers (onClick, onSubmit)
                 - API calls
                 - State changes

                 Use these to infer hidden features.

                 ---

                 9. FILE GENERATION

                 Create Markdown files like:

                 - "home-screen.md"
                 - "profile-screen.md"
                 - "chat-feature.md"
                 - "settings.md"
                 - "navigation.md"

                 ---

                 10. STRICT RULES

                 - Do NOT skip any screen or component
                 - Do NOT generalize — be specific
                 - If unsure, infer from code structure
                 - Cover 100% of visible UI and interactions

                 ---

                 FINAL OUTPUT

                 A fully structured "/docs" folder with detailed ".md" files that allow a person to:

                 - Understand the entire UI
                 - Navigate the app without confusion
                 - Use every feature without guidance