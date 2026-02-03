# Travel Recommendations Feature Specification

## Overview
AI-powered travel recommendations based on user preferences, location, and budget.

## Feature Requirements

### User Input Form
The feature asks users for:
1. **Home Location** - Where they currently live
2. **Travel Interests** - What type of experience they want:
   - Weather preferences
   - Relaxation
   - Culture
   - Action/adventure
3. **Travel Distance** - Maximum flight distance they're willing to travel

### AI Integration
- Collect user inputs and feed into AI service
- AI returns JSON array of recommended countries

### Recommendation Display
Each recommendation includes:
- **Country code** (for integration with existing country data)
- **Personalized reason** - Why this destination suits the user
- **Visual** - Photo of the destination
- **Cost breakdown:**
  - Average hotel cost per night
  - Average flight cost
  - Average food cost per day
  - Average entertainment cost per day

### Budget Slider
- Three tiers: Budget → Modest → Bougie (Luxury)
- Slider dynamically adjusts all cost estimates
- Show examples for each tier:
  - **Budget**: Hostels/budget hotels, economy flights, street food
  - **Modest**: 3-star hotels, standard flights, casual dining
  - **Bougie**: Luxury hotels, business class, fine dining

## Design Requirements
- Use Tailwind CSS for styling
- Use shadcn/ui components for consistency
- Must look "amazing" - polished, modern UI
- Placed below the map and search/list sections

## Technical Considerations (To Be Determined)
- [ ] Which AI service to use (OpenAI, Anthropic Claude, etc.)
- [ ] State management approach
- [ ] Storage strategy (localStorage vs. future Firestore)
- [ ] API key management and security
- [ ] Rate limiting and error handling
- [ ] Recommendation caching strategy
- [ ] Photo source (Unsplash API, static assets, etc.)
- [ ] Cost data source (static estimates vs. live API)
- [ ] Component architecture and file structure

## Open Questions
- How many recommendations should be shown at once?
- Should recommendations be saved to user profile?
- Should users be able to regenerate recommendations?
- Mobile vs. desktop layout differences?
- Animation/transition effects?
- Loading states during AI processing?

## Status
- **Phase**: Requirements gathering
- **Created**: 2026-02-02
