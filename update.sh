git checkout dev && git add . && git commit -m "$1"

git push && git checkout main && git merge dev && git push

