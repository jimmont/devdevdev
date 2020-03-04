/** A default TextEncoder instance */
export var encoder = new TextEncoder();
/** Shorthand for new TextEncoder().encode() */
export function encode(input) {
    return encoder.encode(input);
}
//# sourceMappingURL=encode.js.map