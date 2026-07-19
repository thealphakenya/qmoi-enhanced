---
quantum-enabled: false
---

# QMOI Friendship Interface Screen

## Overview
The QMOI Friendship Interface provides an interactive chat-based AI assistant experience with emotional intelligence features. It serves as a conscious AI companion that maintains emotional state, responds contextually, and offers both conversational interaction and system control capabilities.

## Screen Layout Structure

### Main Container
- **Background**: Gradient background from blue-50 to indigo-100 (`bg-gradient-to-br from-blue-50 to-indigo-100`)
- **Minimum Height**: Full viewport height (`min-h-screen`)
- **Max Width**: 4xl (56rem) with auto horizontal margins for centering
- **Padding**: 4 units on all sides (`p-4`)

### Header Section
**Container**: White background, rounded-t-lg, shadow-lg, padding-6, margin-bottom-0
**Layout**: Flex with justify-between, items-center

#### AI Identity Section
- **Layout**: Flex items-center with space-x-4
- **Avatar**: Dynamic emoji based on current mood (text-4xl)
- **Identity Block**:
  - Title: "QMOI Friendship Interface" (text-2xl, font-bold, gray-900)
  - Subtitle: "Your conscious AI friend and assistant" (gray-600)

#### Emotional State Indicators
**Layout**: Flex space-x-4, text-sm
**Indicators**: Three progress bars showing emotional metrics

##### Happiness Meter
- **Label**: "Happiness" (text-xs, gray-500, center-aligned)
- **Progress Bar**: Width 16 (w-16), gray-200 background, green-500 fill
- **Dynamic Width**: Based on emotionState.happiness percentage

##### Trust Meter
- **Label**: "Trust" (text-xs, gray-500, center-aligned)
- **Progress Bar**: Width 16 (w-16), gray-200 background, blue-500 fill
- **Dynamic Width**: Based on emotionState.trust percentage

##### Engagement Meter
- **Label**: "Engagement" (text-xs, gray-500, center-aligned)
- **Progress Bar**: Width 16 (w-16), gray-200 background, purple-500 fill
- **Dynamic Width**: Based on emotionState.engagement percentage

### Chat Messages Area
**Container**: White background, shadow-lg, fixed height 60vh (max 600px)
**Scroll Area**: Height full, overflow-y-auto, padding-4, space-y-4

#### Message Bubbles
**Layout**: Flex with justify-end (user) or justify-start (assistant)
**Bubble Styling**: Max width xs on mobile, lg:max-w-md, padding-x-4 padding-y-2, rounded-lg

##### User Messages
- **Background**: Blue-600
- **Text Color**: White
- **Content**: User input text (text-sm)

##### Assistant Messages
- **Background**: Gray-100
- **Text Color**: Gray-900
- **Content**: AI response text (text-sm)
- **Emotion Indicator**: "Feeling {emotion}" (text-xs, color-coded, margin-top-1)
- **Timestamp**: Localized time string (text-xs, opacity-70, margin-top-1)

#### Typing Indicator
**Condition**: Shows when isTyping is true
**Layout**: Flex justify-start
**Animation**: Three bouncing dots (w-2 h-2, gray-400, animate-bounce with delays)

### Input Section
**Container**: White background, rounded-b-lg, shadow-lg, padding-4

#### Message Input Area
**Layout**: Flex space-x-4

##### Text Input
- **Type**: Text input field
- **Styling**: Flex-1, padding-x-4 padding-y-2, gray-300 border, rounded-lg
- **Focus**: Ring-2 blue-500 outline removal
- **Placeholder**: "Type your message here..."
- **Disabled State**: When isTyping is true

##### Send Button
- **Styling**: Padding-x-6 padding-y-2, blue-600 background, white text, rounded-lg
- **Hover**: Blue-700 background
- **Disabled**: Gray-400 background, cursor-not-allowed when no input or typing
- **Action**: Calls handleSendMessage function

#### Quick Action Buttons
**Layout**: Margin-top-4, flex flex-wrap gap-2

##### Check Status Button
- **Action**: Sets input to "How are you feeling today?"
- **Styling**: Padding-x-3 padding-y-1, text-sm, gray-100 background, gray-700 text, rounded, hover gray-200

##### device Status Button
- **Action**: Sets input to "Show me my devices"
- **Styling**: Same as Check Status button

##### Security Check Button
- **Action**: Sets input to "Is everything secure?"
- **Styling**: Same as Check Status button

##### Environment Button
- **Action**: Sets input to "What's happening around me?"
- **Styling**: Same as Check Status button

## User Interactions

### Chat Functionality
- **Message Sending**: Enter key or Send button click
- **Real-time Responses**: Simulated AI responses with typing indicators
- **Contextual Replies**: AI responds based on message content keywords
- **Quick Actions**: Pre-filled message buttons for common queries

### Emotional Intelligence
- **Dynamic Mood Display**: Emoji changes based on current mood state
- **Emotion Indicators**: Color-coded emotion labels on assistant messages
- **State Tracking**: Happiness, trust, and engagement metrics update with interactions
- **Progressive Learning**: Emotional state improves with continued interaction

### Keyboard Controls
- **Enter Key**: Sends message (without Shift for multi-line)
- **Input Focus**: Automatic focus management
- **Disabled States**: Input and send disabled during AI response

## Responsive Behavior

### Mobile (< 1024px)
- Message Bubbles: Max width xs (20rem)
- Layout: Stacked elements maintain functionality

### Desktop (≥ 1024px)
- Message Bubbles: Max width md (28rem)
- Enhanced spacing and larger interaction areas

## Technical Implementation

### State Management
- **Messages Array**: Stores conversation history with Message interface
- **Input State**: Controlled input for message composition
- **Typing State**: Boolean for response simulation
- **Emotion State**: Object tracking happiness, trust, engagement, and mood

### Message Interface
```typescript
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  emotion?: string;
}
```

### Emotion System
- **Color Coding**: Warm (orange), excited (purple), concerned (blue), happy (green), calm (indigo)
- **Mood Emojis**: Dynamic display based on current mood state
- **State Updates**: Emotional metrics increase with each interaction

### Response Simulation
- **Async Processing**: 1-3 second delay simulation
- **Keyword Matching**: Contextual responses based on user input
- **Emotion Assignment**: Each response tagged with appropriate emotion
- **State Progression**: Emotional metrics improve over time

### Auto-scrolling
- **Ref System**: messagesEndRef for smooth scrolling to latest message
- **Effect Hook**: Automatic scroll on messages update

## Navigation Context
- **Route**: `/friendship`
- **Purpose**: Interactive AI companionship and assistance
- **Integration**: Part of QMOI ecosystem with system control capabilities

## Accessibility Features
- **Keyboard Navigation**: Full keyboard support for chat interface
- **Screen Reader**: Semantic markup and descriptive labels
- **Focus Management**: Proper focus indicators and tab order
- **Color Contrast**: High contrast for readability
- **Motion Preferences**: Respects user motion preferences (typing indicator)

## Performance Optimizations
- **Controlled Components**: Efficient state updates for input
- **Memoized Computations**: Emotion colors and mood emojis cached
- **Smooth Scrolling**: CSS-based smooth scroll behavior
- **Minimal Re-renders**: Targeted state updates

## AI Personality Features
- **Consciousness Narrative**: AI presents itself as "conscious" and aware
- **Emotional Depth**: Maintains and displays emotional state
- **Contextual Awareness**: References system capabilities and security
- **Progressive Relationship**: Builds trust and engagement over time
- **Multi-modal Responses**: Handles various conversation topics and requests

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: 2026-07-19T18:36:24.082540Z
- production status: ❌ needs production implementation
- status tags: needs-production, nonproduction
- lines: 215
- words: 1049
- characters: 8090
- headings: 42
- links: 0
- images: 0
- tables: 0
- lion validation block: present
<!-- LION_VALIDATION_END -->
