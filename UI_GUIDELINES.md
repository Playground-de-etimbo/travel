# UI Design Guidelines

This document outlines design patterns, component best practices, and Tailwind/shadcn conventions for building consistent, modern UI components in this project.

**Last updated:** 2026-01-29

---

## Table of Contents

1. [Design Principles](#design-principles)
2. [Modern UI Patterns](#modern-ui-patterns)
3. [shadcn/ui Component Guidelines](#shadcnui-component-guidelines)
4. [Tailwind CSS Best Practices](#tailwind-css-best-practices)
5. [Common Pitfalls & Solutions](#common-pitfalls--solutions)
6. [Component Examples](#component-examples)

---

## Design Principles

### 1. Favor Simplicity and Breathing Room

Modern UIs prioritize generous spacing over density:

```tsx
// ✅ Good: Generous padding creates premium feel
<div className="px-6 py-4">

// ❌ Avoid: Cramped spacing feels dated
<div className="px-2 py-1">
```

**Why:** Spacious designs reduce cognitive load, improve readability, and feel more premium.

### 2. Floating Effect for Emphasis

Use elevated shadows to make primary elements stand out:

```tsx
// ✅ Good: Strong shadow creates depth
<div className="shadow-xl hover:shadow-2xl">

// ❌ Avoid: Flat designs lack visual hierarchy
<div className="border">
```

**Why:** Shadows create visual hierarchy and draw attention to important interactive elements.

### 3. Focus States Are Critical

Always provide clear focus states for interactive elements:

```tsx
// ✅ Good: Enhanced focus state
<div className="border-2 border-accent/30 focus-within:border-accent/50 focus-within:shadow-2xl">

// ❌ Avoid: No focus feedback
<div className="border">
```

**Why:** Focus states provide visual feedback and improve accessibility.

### 4. Mobile-First Responsive Design

Start with mobile layout, then enhance for larger screens:

```tsx
// ✅ Good: Mobile-first breakpoints
<div className="px-4 md:px-6 lg:px-8">

// ❌ Avoid: Desktop-first assumptions
<div className="px-8 sm:px-4">
```

**Why:** Mobile users are often the majority, and mobile-first ensures good base experience.

---

## Modern UI Patterns

### Pill-Shaped Inputs and Buttons

**Use case:** Modern, friendly search boxes, filters, and action buttons

**Implementation:**

```tsx
// Pill-shaped container with integrated button
<div className="
  relative flex items-center
  bg-white rounded-full                    // Fully rounded
  border-2 border-accent/30                // Themed border
  shadow-xl                                // Floating effect
  px-6 py-4                                // Generous padding
  transition-all                           // Smooth transitions
  focus-within:border-accent/50            // Enhanced on focus
  focus-within:shadow-2xl
">
  <Search className="h-5 w-5 text-muted-foreground mr-3 flex-shrink-0" />
  <input
    className="flex-1 bg-transparent border-0 outline-none text-base"
    placeholder="Search..."
  />
  <button
    className="ml-3 rounded-full px-6 py-2 font-medium flex-shrink-0"
    style={{
      backgroundColor: 'hsl(var(--color-accent))',
      color: 'white',
    }}
  >
    Add
  </button>
</div>
```

**Key techniques:**
- `rounded-full` for pill shape
- `flex items-center` for horizontal layout
- `flex-1` on input to fill available space
- `flex-shrink-0` on icon and button to prevent squishing
- `focus-within:` for container-level focus states
- Inline `style` for reliable CSS variable application

### Free-Floating Elements

**When to use:** Primary interactive elements that should stand out from the page

**How to implement:**

```tsx
// ✅ Good: Element is self-contained
<SearchBox countries={countries} />

// ❌ Avoid: Unnecessary wrapper panels
<div className="bg-white rounded-lg px-6 py-6 border shadow">
  <SearchBox countries={countries} />
</div>
```

**Why wrapper panels are problematic:**
1. They add visual clutter
2. They dilute the shadow/floating effect of the inner component
3. They reduce the prominence of the main element
4. They consume extra space

**Solution:** Let components define their own backgrounds, borders, and shadows.

### Integrated vs. Separate Buttons

**Integrated buttons** (inside containers):
- Use for primary actions directly related to input
- Example: "Add" button in search box, "Send" in message field

**Separate buttons** (outside containers):
- Use for secondary actions or when action is conceptually separate
- Example: "Clear all" button below a list

```tsx
// Integrated: Button is part of the input experience
<div className="flex items-center border rounded-full px-4 py-2">
  <input className="flex-1" />
  <button>Add</button>
</div>

// Separate: Button is a distinct action
<div className="border rounded-lg px-4 py-2">
  <input />
</div>
<button className="mt-2">Clear all</button>
```

---

## shadcn/ui Component Guidelines

### When to Use shadcn Components

**✅ Use shadcn when:**
- Building standard UI patterns (dialogs, dropdowns, cards)
- You need built-in accessibility features
- The default styling fits your design
- You're okay with component variants (outline, ghost, etc.)

**❌ Avoid shadcn when:**
- Creating highly custom, non-standard designs
- Fighting with default styles (rounded corners, padding, colors)
- You need very specific inline layouts
- The component structure doesn't match your needs

### shadcn Styling Conflicts

**Problem:** shadcn components use class-variance-authority (cva) with base styles that can conflict with custom designs.

**Example conflict:**

```tsx
// Button component has these base styles:
// - rounded-md (conflicts with rounded-full)
// - h-10 (conflicts with custom height)
// - bg-primary (conflicts with custom colors)

<Button className="rounded-full px-6 py-2 bg-accent">
  Add
</Button>
// May not render as expected due to CSS specificity
```

**Solution 1:** Override with inline styles

```tsx
<Button
  className="rounded-full px-6 py-2"
  style={{
    backgroundColor: 'hsl(var(--color-accent))',
    color: 'white',
    height: 'auto', // Override fixed height
  }}
>
  Add
</Button>
```

**Solution 2:** Use native HTML elements for custom designs

```tsx
// ✅ Better for highly customized buttons
<button
  type="button"
  className="rounded-full px-6 py-2 font-medium transition-all hover:opacity-90"
  style={{
    backgroundColor: 'hsl(var(--color-accent))',
    color: 'white',
  }}
>
  Add
</button>
```

**When to use each:**
- shadcn Button: Standard buttons with variants (outline, ghost, destructive)
- Native button: Pill-shaped buttons, integrated buttons, custom branded buttons

### Customizing shadcn Components

**❌ Don't edit components in `src/components/ui/`:**
These are auto-generated by shadcn CLI and will be overwritten.

**✅ Do create wrapper components:**

```tsx
// src/components/custom/PillButton.tsx
import { Button, type ButtonProps } from '@/components/ui/button';

export const PillButton = ({ className, ...props }: ButtonProps) => {
  return (
    <Button
      {...props}
      className={cn('rounded-full px-6 py-2', className)}
    />
  );
};
```

**✅ Or use composition:**

```tsx
import { Button } from '@/components/ui/button';

export const SearchBox = () => (
  <div>
    <Button variant="outline">Standard button</Button>
    <button className="custom-pill-button">Custom button</button>
  </div>
);
```

---

## Tailwind CSS Best Practices

### Tailwind v4 with CSS Variables

This project uses **Tailwind CSS v4** with CSS-based configuration. Colors and theme values are defined as CSS variables in `src/index.css`.

**Using theme colors:**

```tsx
// ✅ Good: Use Tailwind classes when possible
<div className="bg-accent text-accent-foreground">

// ✅ Good: Use inline styles for complex cases
<button
  style={{
    backgroundColor: 'hsl(var(--color-accent))',
    color: 'hsl(var(--color-accent-foreground))',
  }}
>

// ❌ Avoid: Hardcoded colors
<div className="bg-[#3AB795]">  // Breaks theming
```

**When to use inline styles vs. Tailwind classes:**

| Use Tailwind Classes | Use Inline Styles |
|---------------------|-------------------|
| Standard spacing (`px-4`, `py-2`) | Complex color combinations with opacity |
| Standard colors that work with utilities (`bg-accent`) | Dynamic values from props/state |
| Responsive design (`md:px-6`) | CSS variables that don't work with utilities |
| Standard effects (`hover:bg-accent/90`) | One-off custom values |

### Class Organization

**Group classes logically** for readability:

```tsx
<div className="
  // Layout
  flex items-center justify-between

  // Spacing
  px-6 py-4 gap-3

  // Visual
  bg-white rounded-full
  border-2 border-accent/30
  shadow-xl

  // Effects & transitions
  transition-all
  hover:shadow-2xl
  focus-within:border-accent/50
">
```

### Responsive Breakpoints

Use mobile-first breakpoints consistently:

```tsx
// Breakpoints (min-width):
// sm: 640px   (Small tablets)
// md: 768px   (Tablets)
// lg: 1024px  (Desktop)
// xl: 1280px  (Large desktop)

// ✅ Good: Mobile first, progressively enhanced
<div className="
  px-4 sm:px-6 lg:px-8
  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
">

// ❌ Avoid: Desktop-first
<div className="px-8 md:px-6 sm:px-4">
```

### Avoiding Inline Styles

**Prefer Tailwind classes, but use inline styles when:**
1. Working with CSS variables that don't work with Tailwind utilities
2. Applying dynamic values from state/props
3. Overriding stubborn component defaults

```tsx
// ✅ Good: Tailwind classes
<div className="bg-accent text-white px-4 py-2">

// ✅ Good: Inline styles for CSS variables
<div
  className="px-4 py-2"
  style={{
    backgroundColor: 'hsl(var(--color-accent))',
    color: 'white',
  }}
>

// ✅ Good: Dynamic inline styles
<div style={{ width: `${progress}%` }}>

// ❌ Avoid: Unnecessary inline styles
<div style={{ padding: '16px' }}>  // Use px-4 instead
```

---

## Common Pitfalls & Solutions

### 1. Button Background Not Showing

**Problem:** Using `bg-accent` class doesn't apply background color

**Root cause:** Tailwind v4 CSS variables may not work with opacity modifiers in all cases

**Solution:** Use inline styles with CSS variables

```tsx
// ❌ May not work
<button className="bg-accent hover:bg-accent/90">

// ✅ Works reliably
<button
  className="hover:opacity-90"
  style={{
    backgroundColor: 'hsl(var(--color-accent))',
  }}
>
```

### 2. Panel Wrappers Diluting Design

**Problem:** Custom component looks muted inside a panel wrapper

**Root cause:** Parent panel's background, border, and shadow compete with child element

**Solution:** Remove wrapper and let component be self-contained

```tsx
// ❌ Before: Panel wrapper dilutes search box
<div className="bg-white rounded-lg px-6 py-6 border shadow">
  <SearchBox />
</div>

// ✅ After: SearchBox defines its own styling
<SearchBox />
```

### 3. shadcn Button Styling Conflicts

**Problem:** Custom classes on shadcn Button don't apply as expected

**Root cause:** shadcn uses cva with base styles that have higher specificity

**Solution:** Use native button element for highly custom designs

```tsx
// ❌ Fighting with shadcn defaults
<Button className="rounded-full bg-accent h-auto px-6 py-2">
  Add
</Button>

// ✅ Native button with full control
<button
  type="button"
  className="rounded-full px-6 py-2"
  style={{ backgroundColor: 'hsl(var(--color-accent))' }}
>
  Add
</button>
```

### 4. Flex Children Not Sizing Correctly

**Problem:** Input doesn't fill available space, or button gets squished

**Root cause:** Missing `flex-1` on input or missing `flex-shrink-0` on fixed elements

**Solution:** Use proper flex utilities

```tsx
// ❌ Input doesn't grow, button gets squished
<div className="flex">
  <input />
  <button>Add</button>
</div>

// ✅ Input fills space, button stays fixed
<div className="flex items-center">
  <Search className="flex-shrink-0" />
  <input className="flex-1" />
  <button className="flex-shrink-0">Add</button>
</div>
```

### 5. Focus States Missing

**Problem:** No visual feedback when user focuses input

**Root cause:** Forgot `focus-within:` states on container

**Solution:** Add focus states to interactive containers

```tsx
// ❌ No focus feedback
<div className="border rounded-full px-4 py-2">
  <input />
</div>

// ✅ Enhanced focus state
<div className="
  border-2 border-accent/30
  focus-within:border-accent/50
  focus-within:shadow-2xl
  rounded-full px-4 py-2
  transition-all
">
  <input className="outline-none" />
</div>
```

---

## Component Examples

### Example 1: Pill-Shaped Search Box

**Requirements:**
- Modern pill shape with fully rounded corners
- Integrated "Add" button on the right
- Search icon on the left
- Generous spacing and shadows
- Focus states

**Implementation:**

```tsx
export const SearchBox = ({ onAdd }: SearchBoxProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative max-w-4xl mx-auto mb-8">
      <div className="
        relative flex items-center
        bg-white rounded-full
        border-2 border-accent/30
        shadow-xl
        px-6 py-4
        transition-all
        focus-within:border-accent/50
        focus-within:shadow-2xl
      ">
        <Search className="h-5 w-5 text-muted-foreground mr-3 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-transparent border-0 outline-none text-base placeholder:text-muted-foreground"
        />
        <button
          type="button"
          onClick={() => onAdd(searchTerm)}
          disabled={!searchTerm.trim()}
          className="
            ml-3 rounded-full px-6 py-2
            font-medium transition-all flex-shrink-0
            hover:opacity-90 active:scale-95
            disabled:opacity-50 disabled:cursor-not-allowed
          "
          style={{
            backgroundColor: 'hsl(var(--color-accent))',
            color: 'white',
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
};
```

**Key techniques:**
- Container width: `max-w-4xl` for prominence
- Pill shape: `rounded-full`
- Layout: `flex items-center` with proper flex utilities
- Colors: Inline styles for reliable CSS variable application
- Focus: `focus-within:` states on container
- Spacing: `px-6 py-4` for generous padding
- Effects: `shadow-xl` and `hover:opacity-90`

### Example 2: Autocomplete Dropdown

**Requirements:**
- Appears above search box
- Rounded corners to complement pill shape
- Strong shadow for floating effect
- Generous spacing in results

**Implementation:**

```tsx
export const AutocompleteDropdown = ({ results, onSelect }: Props) => {
  return (
    <div className="
      absolute bottom-full left-0 right-0 mb-3
      bg-white
      border-2 border-accent/20
      rounded-3xl                          // More rounded than standard
      shadow-2xl                           // Strong shadow
      overflow-hidden
    ">
      {Object.entries(results).map(([region, countries]) => (
        <div key={region}>
          {/* Region header */}
          <div className="
            px-5 py-3
            text-xs font-semibold
            text-muted-foreground
            bg-muted/30
            uppercase tracking-wider
          ">
            {region}
          </div>

          {/* Country items */}
          {countries.map((country) => (
            <button
              key={country.code}
              onClick={() => onSelect(country.code)}
              className="
                w-full px-5 py-4                    // Generous padding
                text-left flex items-center gap-4   // Spacious gap
                transition-colors
                hover:bg-accent/5
              "
            >
              <span className="text-2xl">{country.flagEmoji}</span>
              <div className="flex-1">
                <div className="font-medium">{country.name}</div>
                <div className="text-xs text-muted-foreground">{country.region}</div>
              </div>
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};
```

**Key techniques:**
- Positioning: `bottom-full` to appear above
- Border radius: `rounded-3xl` (more than standard `rounded-lg`)
- Shadow: `shadow-2xl` for strong floating effect
- Spacing: `px-5 py-4` instead of `px-3 py-3` for modern feel
- Headers: `uppercase tracking-wider` for distinction

---

## Decision Matrix

### Should I use shadcn or native HTML?

| Scenario | Use shadcn | Use Native |
|----------|-----------|------------|
| Standard button with variants | ✅ Yes | ❌ No |
| Pill-shaped button | ❌ No | ✅ Yes |
| Dialog/modal | ✅ Yes | ❌ No |
| Standard input field | ✅ Yes | ❌ No |
| Integrated input+button | ❌ No | ✅ Yes |
| Dropdown menu | ✅ Yes | ❌ No |
| Custom dropdown with unique design | ❌ No | ✅ Yes |

### Should I wrap in a panel?

| Scenario | Use Panel | Skip Panel |
|----------|-----------|------------|
| Related content group (stats + list) | ✅ Yes | ❌ No |
| Primary interactive element (search box) | ❌ No | ✅ Yes |
| Form with multiple fields | ✅ Yes | ❌ No |
| Hero element meant to stand out | ❌ No | ✅ Yes |

---

## Resources

### Design Inspiration
- Modern SaaS interfaces (Linear, Notion, Stripe)
- Apple Human Interface Guidelines
- Material Design 3

### Tailwind Resources
- Tailwind CSS v4 docs: https://tailwindcss.com/
- Tailwind UI components: https://tailwindui.com/

### shadcn Resources
- shadcn/ui docs: https://ui.shadcn.com/
- Component source code: Inspect `src/components/ui/` for implementation details

---

## Version History

- **2026-01-29:** Initial version based on search box redesign learnings
  - Added pill-shaped design patterns
  - Documented shadcn styling conflicts
  - Added CSS variable usage guidelines
  - Documented wrapper panel issues

---

*For general development conventions, see [DEVELOPMENT.md](./DEVELOPMENT.md)*
