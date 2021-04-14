#!/bin/bash

# Trap errors #
error() {
  # Dump error location #
  local parent_lineno="$1"
  local message="$2"
  local code="${3:-1}"
  if [[ -n "$message" ]] ; then
    echo "Error on or near line ${parent_lineno}: ${message}; exiting with status ${code}"
  else
    echo "Error on or near line ${parent_lineno}; exiting with status ${code}"
  fi

  # Exit with original error code #
  exit "${code}"
}
trap 'error ${LINENO}' ERR

out_dir="docs"

rm -rf $out_dir

npx typedoc --plugin typedoc-plugin-external-module-name --plugin typedoc-plugin-markdown --out $out_dir src/index.ts

pushd $out_dir

    pushd classes

        for file in *.md; do
            echo "$(basename "$file")"
            mv "$file" "${file/.md/.mdx}"
        done

    popd

popd

exit 0
