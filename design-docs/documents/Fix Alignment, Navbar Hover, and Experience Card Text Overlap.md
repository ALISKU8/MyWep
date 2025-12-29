I will fix the issues you mentioned by modifying the `style.css` file as follows:

1. **Fix Translation Text Alignment (Action Pill & Navbar):**

   * I will add `right: 0 !important;` and `left: 0 !important;` to the `.action-pill .lang-flip::after` and `.nav-item.lang-flip::after` selectors.

   * I will also ensure `text-align: center !important;` and `justify-content: center !important;` are set.

   * Critically, I will add `width: 100% !important;` to ensure the absolute positioned element spans the full width of the parent, correcting the off-center issue caused by RTL text flow default behavior.

2. **Fix Navbar Hover Background Color:**

   * I will modify the `.nav-item:hover` selector to remove any background color change if it exists, or ensure it only affects the text color/underline. I'll inspect the CSS to see why a "blue square" appears. It might be a default browser style or an unintended background property. I will explicitly set `background: transparent;` on hover if needed.

3. **Fix Experience Section Hover Overlap:**

   * I will modify the `.experience-card:hover .exp-desc` rule. Instead of keeping the English text *and* showing Arabic (which causes overlap), I will revert to a cleaner "Flip" or "Swap" mechanic but ensuring the English is **always visible by default** and only swapped/moved when hovered, but strictly separating them.

   * **User Requirement:** "Make English always visible, and Arabic appears when hovering... and English disappears".

   * Wait, the user says: "Make English always visible and Arabic appears when hovering... and English disappears" -> This effectively describes the **Flip** effect again.

   * Let's re-read carefully: "خلي الانجليزي دائما ظاهر والعربي يظهر اذا المستخدم قرب الماوس ... والانجليزي يختفي" (Make English always visible, and Arabic appears if user nears mouse... and English disappears).

   * This is contradictory: "English always visible" vs "English disappears".

   * Interpretation: The user likely means "English is the *default* state (always visible *before* hover). When hovering, Arabic appears and English disappears."

   * The *problem* they described is "Arabic and English are merged and overlapping". This happens because currently I have English moving up (`translateY(-20px)`) and Arabic fading in *below* it (`top: 100%`).

   * **Fix:** I will change it so English fades out (`opacity: 0`) and Arabic fades in (`opacity: 1`) at the *same position*. This avoids overlap.

**Plan Steps:**

1. Update `style.css` to force absolute centering on translation text.
2. Update `style.css` to fix navbar hover background.
3. Update `style.css` to fix experience card hover (Swap instead of Overlap).

