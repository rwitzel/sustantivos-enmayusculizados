#!/usr/bin/env bash

# call it from the project's root folder
# it contains only 2392 nouns, use a better source, like MCR (using WordNet 3.0 as ILI)
curl --output es-en.xml https://raw.githubusercontent.com/mananoreboton/en-es-en-Dic/master/src/main/resources/dic/es-en.xml

FILE=01_introduction/spanish_nouns.js
echo "const spanish_nouns = " > $FILE
cat es-en.xml | xq '.dic.l[].w[] | select( (.t | startswith("{f}") ) or (.t | startswith("{m}")) ) | .c' | jq -s >> $FILE
echo ";" >> $FILE

FILE=01_introduction/spanish_adjectives.js
echo "const spanish_adjectives = " > $FILE
cat es-en.xml | xq '.dic.l[].w[] | select( (.t | startswith("{f}") | not) and (.t | startswith("{m}") | not) ) | .c' | jq -s >> $FILE
echo ";" >> $FILE
