const spanish_no_nouns_set = new Set(spanish_no_nouns);
const spanish_nouns_adjectives = new Set(spanish_adjectives);
const spanish_nouns_set_narrow = new Set(spanish_nouns.filter(noun => !spanish_no_nouns_set.has(noun) && !spanish_nouns_adjectives.has(noun)))

function create_upppercase_rule(nouns_set, id, description) {

    function replace(word) {
        const lookup_word = word.match(/^(.*?)(es|s)?$/)[1]
        if (nouns_set.has(lookup_word)) {
            word = word.substring(0, 1).toUpperCase() + word.substring(1);
        }
        return word
    }

    return {
        "active": true,
        "id": id,
        "description": "Nouns are uppercase, using a dictionary with " + nouns_set.size + " Spanish nouns. " + description,
        "tags": [],
        "status": "INCOMPLETE",
        "applier": replace
    }
}


const rules = [
    create_upppercase_rule(spanish_nouns_set_narrow, "uppercase", "Only unambiguous nouns."), // nouns that are not adjectives
]

function to_sustmayo_objects(spanish_text, rules) {
    const spanish_text_parts = split_text(spanish_text);
    const applied_rules = {};
    const sustmayo_objects = spanish_text_parts.map((part) => {
        const sustmayo_object = { "original_word": part.part, "applied_rules": []};

        if (!part.is_word) {
            sustmayo_object.new_word = part.part;
            return sustmayo_object;
        }

        let word = part.part;

        for (let i = 0; i < rules.length; i++) {
            const rule = rules[i] ;
            if (rule.active) {
                new_word = rule.applier(word);
                if (new_word !== word) {
                    sustmayo_object.applied_rules.push(rule.id);
                    if (applied_rules[rule.id]) {
                        applied_rules[rule.id].push(word);
                    }
                    else {
                        applied_rules[rule.id] = [word];
                    }

                }
                word = new_word;
            }
        }
        sustmayo_object.new_word = word;
        return sustmayo_object;
    });
    return [sustmayo_objects, applied_rules];
}

function to_sustmayo_html(sustmayo_objects, highlight_transformed_words) {
    const sustmayo_words_as_html = sustmayo_objects.map((sustmayo_object) => {
        if (sustmayo_object.applied_rules.length == 0 || !highlight_transformed_words) {
            return sustmayo_object.new_word.replaceAll("\n", "<br/>");
        }
        else {
            return "<span class='modified' title='" + sustmayo_object.original_word
                      + ": " + sustmayo_object.applied_rules.join(",") + "'>" + sustmayo_object.new_word + "</span>";
        }
    });
    return sustmayo_words_as_html.join("");
}

// for temporary tests:
//console.log(to_sustmayo_objects(spanish_text_example, rules));