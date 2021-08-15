const flattenColorPalette = require("tailwindcss/lib/util/flattenColorPalette").default;

module.exports = {
    purge: [
        "./**/*.html",
        "./**/*.tsx",
    ],
    theme: {
        container: {
            center: true,
            padding: "1rem",
        },
        extend: {
            colors: {
                "gray-1": "#777979",
                "gray-2": "#CCCCCC",
                "gray-3": "#ECEDEF",
                "gray-4": "#F2F2F6",
                "gray-5": "#FAFAFD",
                "ev-blue": "#4198DA",
            }
        }
    },
    variants: {},
    plugins: [
        ({addUtilities, e, theme, variants}) => {
            let colors = flattenColorPalette(theme("borderColor"));
            delete colors["default"];

            // Replace or Add custom colors
            if (this.theme?.extend?.colors !== undefined) {
                colors = Object.assign(colors, this.theme.extend.colors);
            }

            const colorMap = Object.keys(colors)
                .map(color => ({
                    [`.border-t-${color}`]: {borderTopColor: colors[color]},
                    [`.border-r-${color}`]: {borderRightColor: colors[color]},
                    [`.border-b-${color}`]: {borderBottomColor: colors[color]},
                    [`.border-l-${color}`]: {borderLeftColor: colors[color]},
                }));
            const utilities = Object.assign({}, ...colorMap);

            addUtilities(utilities, variants("borderColor"));
        },
        require("@tailwindcss/typography"),
    ],
};
