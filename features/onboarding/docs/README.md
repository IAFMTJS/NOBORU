# Onboarding Feature

## Purpose

Guides new climbers through the 7-step onboarding flow before entering the Foothills region.

## Responsibilities

- Welcome, goal, level, daily goal, theme, Yama, and region introduction screens
- Persist onboarding choices to `profiles` and `user_settings`
- Mark `onboarding_completed` and initialize Foothills as the starting region

## Flow

1. Welcome
2. Learning goal
3. Current level (JLPT placement)
4. Daily goal (minutes)
5. Theme preference
6. Meet Yama
7. Foothills region introduction → Begin Climb

## Dependencies

- `profiles` and `user_settings` tables
- Middleware redirects incomplete users to `/onboarding`

## Known Limitations

- Offline queue for partial onboarding not yet implemented
- Skip is not permitted by design
