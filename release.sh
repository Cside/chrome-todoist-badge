#!/usr/bin/env bash
set -x

version=${1?Version is required}

read -rp "タグ打って package.json 更新した？ (y/n)" YN
if [ "${YN}" != "y" ]; then
  exit 1
fi

git pull
yarn run check
yarn run zip
git push --tags

gh release create "v$version" --generate-notes --title "v$version"
open "$(git url)/releases"

open "https://chrome.google.com/webstore/devconsole/a66eb7ce-b7b6-4d92-a9cb-35d11a33896a/fdcbelgkjlfcknnpdljnnndcgommlale/edit/package"
open .output
