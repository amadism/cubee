#!/bin/bash
set -e

ROOT=$(git rev-parse --show-toplevel)
APP_DIR="$ROOT/app"

if [[ ! -f "$ROOT/dev.env" ]]; then
	echo "Missing \`dev.env\` file in project root. Run the following command to create the \`dev.env\` file:"
	echo
	echo "cp dev.env.example dev.env"
	exit 1
fi

$APP_DIR/scripts/install-parallel.sh

# Load the development environment.
set -a
. "$ROOT/dev.env"
set +a

if [[ -z $OPENAI_API_KEY ]]; then
	echo
	echo '`OPENAI_API_KEY` environment variable not filled in `dev.env`'
	exit 1
fi

SOURCE_LANG=de

# ALL_LANGS=("de" "en" "bg" "da" "es" "fi" "fr" "hu" "it" "nl" "nb" "pl" "ro" "ru" "sv" "tr" "uk" "hr")
ALL_LANGS=("de" "en" "fr" "it" "tr" "ru")
LANGS=${ALL_LANGS[@]}

DICTIONARY_ROOT="$APP_DIR/i18n"

FILES=$(find $DICTIONARY_ROOT -name "$SOURCE_LANG.json")

translate_file() {
	local source=$1
	local source_relative=$(sed "s#$DICTIONARY_ROOT/##" <<< $source)
	local source_lang=$(basename $source_relative .json)
	local name=$(sed "s#/$source_lang.json##" <<< $source_relative)

	for lang in $LANGS; do
		if [[ $lang == $source_lang ]]; then
			continue
		fi

		translate_file_to_lang $name $lang $source_lang
	done
}

translate_file_to_lang() {
	local name=$1
	local target_lang=$2
	local source_lang=$3

	if [[ $source_lang == $target_lang ]]; then
		echo "Source ($source_lang) and target ($target_lang) language are the same."
		return
	fi

	local source="$DICTIONARY_ROOT/$name/$source_lang.json"
	local target_short="$name/$target_lang.json"
	local target="$DICTIONARY_ROOT/$target_short"

	echo "Translating $target ..."
	cmd="dragoman $source \
		--out $target \
		--from '$source_lang (ISO)' \
		--to '$target_lang (ISO)' \
    --update \
		--format json_object \
		--openai-model gpt-4o \
		--openai-key $OPENAI_API_KEY"
	
	sem -j16 "$cmd"
}

for file in $FILES; do
	translate_file $file
done

echo "Waiting for translations to finish ..."
sem --wait

echo
echo "Done."
