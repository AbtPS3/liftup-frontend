#!/bin/bash
git checkout main && git merge dev -m "Auto-merged by update script." && git push
