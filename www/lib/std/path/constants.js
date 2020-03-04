// Copyright the Browserify authors. MIT License.
// Ported from https://github.com/browserify/path-browserify/
var build = Deno.build;
// Alphabet chars.
export var CHAR_UPPERCASE_A = 65; /* A */
export var CHAR_LOWERCASE_A = 97; /* a */
export var CHAR_UPPERCASE_Z = 90; /* Z */
export var CHAR_LOWERCASE_Z = 122; /* z */
// Non-alphabetic chars.
export var CHAR_DOT = 46; /* . */
export var CHAR_FORWARD_SLASH = 47; /* / */
export var CHAR_BACKWARD_SLASH = 92; /* \ */
export var CHAR_VERTICAL_LINE = 124; /* | */
export var CHAR_COLON = 58; /* : */
export var CHAR_QUESTION_MARK = 63; /* ? */
export var CHAR_UNDERSCORE = 95; /* _ */
export var CHAR_LINE_FEED = 10; /* \n */
export var CHAR_CARRIAGE_RETURN = 13; /* \r */
export var CHAR_TAB = 9; /* \t */
export var CHAR_FORM_FEED = 12; /* \f */
export var CHAR_EXCLAMATION_MARK = 33; /* ! */
export var CHAR_HASH = 35; /* # */
export var CHAR_SPACE = 32; /*   */
export var CHAR_NO_BREAK_SPACE = 160; /* \u00A0 */
export var CHAR_ZERO_WIDTH_NOBREAK_SPACE = 65279; /* \uFEFF */
export var CHAR_LEFT_SQUARE_BRACKET = 91; /* [ */
export var CHAR_RIGHT_SQUARE_BRACKET = 93; /* ] */
export var CHAR_LEFT_ANGLE_BRACKET = 60; /* < */
export var CHAR_RIGHT_ANGLE_BRACKET = 62; /* > */
export var CHAR_LEFT_CURLY_BRACKET = 123; /* { */
export var CHAR_RIGHT_CURLY_BRACKET = 125; /* } */
export var CHAR_HYPHEN_MINUS = 45; /* - */
export var CHAR_PLUS = 43; /* + */
export var CHAR_DOUBLE_QUOTE = 34; /* " */
export var CHAR_SINGLE_QUOTE = 39; /* ' */
export var CHAR_PERCENT = 37; /* % */
export var CHAR_SEMICOLON = 59; /* ; */
export var CHAR_CIRCUMFLEX_ACCENT = 94; /* ^ */
export var CHAR_GRAVE_ACCENT = 96; /* ` */
export var CHAR_AT = 64; /* @ */
export var CHAR_AMPERSAND = 38; /* & */
export var CHAR_EQUAL = 61; /* = */
// Digits
export var CHAR_0 = 48; /* 0 */
export var CHAR_9 = 57; /* 9 */
export var isWindows = build.os === "win";
export var EOL = isWindows ? "\r\n" : "\n";
export var SEP = isWindows ? "\\" : "/";
export var SEP_PATTERN = isWindows ? /[\\/]+/ : /\/+/;
//# sourceMappingURL=constants.js.map