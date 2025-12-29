I will implement the following fixes and improvements based on your feedback:

1. **Fix Translation Alignment:**

   * I will update `style.css` to ensure the Arabic translation in buttons and navigation is perfectly centered. I'll add strict positioning rules (`left: 0`, `right: 0`, `text-align: center`) to the `.lang-flip::after` element to prevent it from shifting to the right.

2. **Fix Navbar Hover (Blue Square):**

   * I will explicitly set `background: transparent !important` for `.nav-item:hover` in `style.css` to remove the unwanted blue background that appears on hover.

3. **Fix Experience Section Text Overlap:**

   * I will restructure the English/Arabic text in `index.html`. Instead of relying on the "flip" effect or pseudo-elements which caused the merging issue, I will separate the text into two distinct spans (`.en` and `.ar`).

   * I will update `style.css` to handle a smooth cross-fade: English will fade out (`opacity: 0`) and Arabic will fade in (`opacity: 1`) on hover, ensuring they never appear visually merged or cluttered.

4. **Improve Page Transition (Gradient Exit):**

   * I will update `script.js` to handle the "Entrance" animation. When you land on a new page (like moving from Home to MEPCO), the screen will start covered in the theme color (Orange/Blue) and then smoothly fade out to reveal the content. This prevents the "sudden disappearance" you noticed.

   * I will use `sessionStorage` to pass the color between pages so the transition is continuous.

5. **Files to be modified:** `style.css`, `index.html`, `script.js`.

