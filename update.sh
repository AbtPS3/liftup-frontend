git checkout dev && git add . && git commit -m "$1"

git checkout main && git merge dev -m "Auto-merged by update script." && git push

