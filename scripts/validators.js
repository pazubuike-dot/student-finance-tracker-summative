export function compileRegex(input, flags = 'i') {
    try {
        return input ? new RegExp(input, flags) : null;
    } catch {
        return null;
    }
}

export const REGEX_DESCRIPTION = /^\S(?:.*\S)?$/;
export const REGEX_AMOUNT = /^(0|[1-9]\d*)(\.\d{1,2})?$/;
export const REGEX_DATE = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
export const REGEX_CATEGORY = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;
export const REGEX_DUPLICATE = /\b(\w+)\s+\1\b/i;

export function validateField(name, value) {
    const trimmed = String(value).trim();
    
    if (!trimmed) {
        return "This entry field cannot be left blank.";
    }

    switch (name) {
        case 'description':
            if (!REGEX_DESCRIPTION.test(value)) {
                return "Description cannot have leading/trailing spaces.";
            }
            if (REGEX_DUPLICATE.test(value)) {
                return "Duplicate consecutive tracking words detected (e.g., 'food food').";
            }
            return null;

        case 'amount':
            if (!REGEX_AMOUNT.test(trimmed)) {
                return "Must be a positive integer or decimal value with up to 2 decimal places.";
            }
            return null;

        case 'date':
            if (!REGEX_DATE.test(trimmed)) {
                return "Date format must adhere strictly to YYYY-MM-DD sequence layout.";
            }
            return null;

        case 'category':
            if (!REGEX_CATEGORY.test(trimmed)) {
                return "Category must contain only letters, single spaces, or hyphens.";
            }
            return null;

        default:
            return null;
    }
}