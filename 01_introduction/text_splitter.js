function split_text(text) {
    const text_parts = [];
    while (text.length > 0) {
        const parts = text.match(/^([^\p{Letter}]*)((\p{Letter}+)(.*))?$/us);
        if (parts[2]) {
            if (parts[1].length > 0) {
                text_parts.push({"is_word": false, "part": parts[1]});
            }
            text_parts.push({"is_word": true, "part": parts[3]});
            text = parts[4];
        }
        else {
            text_parts.push({"is_word": false, "part": parts[1]});
            text = "";
        }
    }
    return text_parts;
}
/*
// for temporary tests:
console.log("1", split_text("ab  cd"));
console.log("2", split_text("  ab  cd"));
console.log("3", split_text("ab  cd   "));
console.log("4", split_text("abcd"));
console.log("5", split_text("ab.  'cd!'"));
 */