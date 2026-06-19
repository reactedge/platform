#!/bin/bash
set -e

WIDGET_NAME=$1

DEST="/var/www/widgets_src/widget-${WIDGET_NAME}"

ssh $SSH_USER@$SSH_HOST "
  mkdir -p $DEST/vite_project
"

rsync -av \
  --delete \
  vite_project/src/ \
  $SSH_USER@$SSH_HOST:$DEST/vite_project/src/

rsync -av \
  vite_project/package.json \
  vite_project/package-lock.json \
  $SSH_USER@$SSH_HOST:$DEST/vite_project/

ssh $SSH_USER@$SSH_HOST "
  cd $DEST/vite_project &&
  npm ci --omit=dev
"