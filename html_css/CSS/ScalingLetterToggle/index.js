import React, { StrictMode, useState } from "https://esm.sh/react";
import { createRoot } from "https://esm.sh/react-dom/client";

const h = React.createElement;

function ScalingLetterToggle({ label, checked = false }) {
	const [isChecked, setIsChecked] = useState(checked);

	return h(
		"label",
		{ className: "switch", "data-testid": "switch" },
		h("input", {
			className: "switch__input",
			type: "checkbox",
			role: "switch",
			checked: isChecked,
			onChange: () => setIsChecked((val) => !val),
			"data-testid": "switch-input",
		}),
		h("span", { className: "switch__letters", "aria-hidden": "true" }, "I"),
		h("span", { className: "switch__letters", "aria-hidden": "true" }, "O"),
		h("span", { className: "switch__sr" }, label)
	);
}

const rootElement = document.getElementById("root");
if (rootElement) {
	createRoot(rootElement).render(
		h(StrictMode, null, h(ScalingLetterToggle, { label: "Power" }))
	);
}
