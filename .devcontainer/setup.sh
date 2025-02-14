#!/bin/bash

BRANCH_NAME=$(git symbolic-ref --short HEAD)

# clone backend repo and checkout branch
if [ ! -d "/workspaces/skillpath-pro-api" ]; then
  git clone https://github.com/${GITHUB_USER}/skillpath-pro-api /workspaces/skillpath-pro-api
  cd /workspaces/skillpath-pro-api
  git checkout $BRANCH_NAME || git checkout main
  cd -
fi

# frontend repo install
npm install

# backend repo install
if [ -f "/workspaces/skillpath-pro-api/pom.xml" ]; then
  mvn clean install -f /workspaces/skillpath-pro-api/pom.xml
fi

# set-up git config
git config --global merge.conflictstyle "diff3"
git config --global merge.verbosity 3
git config --global push.default "simple"
git config --global push.followTags true
git config --global status.relativePaths false
git config --global status.showUntrackedFiles "all"
git config --global diff.renames "copy"
git config --global diff.context 5
git config --global diff.statGraphWidth 10
git config --global diff.wsErrorHighlight "old,new"
git config --global fetch.prune true
git config --global grep.lineNumber true
git config --global grep.extendedRegexp true
git config --global log.follow true
git config --global log.date "format-local:%Y-%m-%d %H:%M:%S"
git config --global blame.date "format-local:%Y-%m-%d %H:%M:%S"
git config --global color.ui "always"
git config --global color.diff "auto"
# The aligned & simple format works best if the window have at least 200 width
git config --global pretty.aligned "format:%C(auto)%>|(20)%h %<|(136,trunc)%s %C(yellow)%<(22,trunc)%ad%x08%x08| %C(green)%cd %C(cyan)%<|(195,trunc)%an%x08%x08%C(bold blue)(%C(bold blue)%<|(202,trunc)%cn%x08%x08)%C(auto)%n%>|(23)          %<|(156,trunc)%d"
git config --global pretty.simple "format:%C(auto)%h%d %<|(162,trunc)%s %C(green)(%cd) %C(cyan)%<|(199,trunc)%an"
git config --global pretty.detail "format:%C(yellow) commit %C(auto)%H%d%n Author: %C(cyan)%an <%ae> %C(yellow)(%aD)%n%C(auto) Commit: %C(bold blue)%cn <%ce> %C(nobold green)(%cD)%n%n%w(0,1,2)%C(bold normal)%B%n"
git config --global pretty.stashsimple "format:%C(auto)%h %C(bold)%gd: %gs %C(nobold green)(%ad) %C(nobold cyan)%an%n"
git config --global pretty.stashmsg "format:%C(bold)%gd: %gs"
# Should use together with "git log -g --date=<format>" to show the timestamp format, see alias.rl
git config --global pretty.simplereflog "format:%C(auto)%h% %<(33,trunc)%d %C(green)%>>(22,ltrunc)%gd%C(auto) %<|(195,trunc)%gs%>>|(142)%x20%x08   %x08%C(dim white)%<|(199,trunc)%s"
git config --global alias.br "branch --all -vv --sort=-committerdate --sort=-HEAD"
# Show status with 2 level log from HEAD
git config --global alias.s '!num=$(git rev-parse HEAD^@ | wc -l); lg="git log --graph --date-order --pretty=aligned HEAD -n 3"; for i in $(seq 1 1 $num); do lg="$lg HEAD^$(($i))~^!"; done; eval $lg; echo; git status; exit 0;'
# Show detailed status with 2 level log from HEAD & diff patch
git config --global alias.sd '!num=$(git rev-parse HEAD^@ | wc -l); lg="git log --graph --date-order --pretty=aligned HEAD -n 3"; for i in $(seq 1 1 $num); do lg="$lg HEAD^$(($i))~^!"; done; eval $lg; echo; git add -N .; git status --show-stash; df=$(git diff --cached --stat --ita-invisible-in-index); if [ -n "$df" ]; then echo "Changes to be committed:"; echo; git -c color.diff.meta="cyan" diff -D --cached --ita-invisible-in-index; fi; df=$(git diff --stat); if [ -n "$df" ]; then echo; echo "Changes not staged for commit:"; echo; git diff -C -D --ita-invisible-in-index; fi; exit 0;'
# Show details of one commit, similar to git show, usage: git sh [<ref>]
git config --global alias.sh '!git -c color.diff.meta="cyan" log -C -D -p --cc --stat=200 --pretty=detail -n 1'
git config --global alias.shst "log -C -D --stat=200 --pretty=detail -n 1"
git config --global alias.ps "push -u origin HEAD"
git config --global alias.cm "commit -m"
git config --global alias.ca "commit --amend"
# Add all files to index & amend commit, using existing commit message
git config --global alias.caa "commit -a --amend -C HEAD --reset-author"
git config --global alias.pff 'pull --ff-only'
git config --global alias.co "checkout"
git config --global alias.chp "cherry-pick"
git config --global alias.cfl "config --global -l"
git config --global alias.cfla "var -l"
git config --global alias.cfu "config --global --unset"
git config --global alias.lg "log --graph --date-order --pretty=aligned"
git config --global alias.lgr "log --graph --pretty=aligned -n 15"
# Show log for all commits, include stash & reflog
git config --global alias.lga "log --graph --date-order --pretty=simple --all --reflog"
git config --global alias.lgd "log --graph --date-order --stat=180 --stat-count=20 --pretty=detail"
git config --global alias.lgda "log --graph --date-order --stat=180 --stat-count=20 --pretty=detail --all --reflog"
# Show messages of all commits for PR in Stash, usage: git lgs [<branch>], example: git lgs improvement/BS-12345
git config --global alias.lgs '!if [ -n "$1" ]; then ref="$1@{upstream}"; else ref="HEAD@{upstream}"; fi; echo; git log --no-merges --reverse --pretty="format:* %B" origin/HEAD..$ref; exit 0;'
git config --global alias.lgp "shortlog origin/HEAD..HEAD"
git config --global alias.df "diff -C -D"
git config --global alias.dfc '!git -c color.diff.meta="cyan" diff -C -D --cached'
git config --global alias.dfst '!if [ -z "$1" ]; then printf "On branch "; git rev-parse --abbrev-ref HEAD; echo; echo "Changes to be committed:"; echo; git --no-pager diff --cached --stat=200; echo; echo "Changes not staged for commit:"; echo; fi; git --no-pager diff --stat=200'
# Show diff from current branch's previous location, useful after git pull
# Note @{1} cannot be changed to HEAD@{1}, as the former means previous location of current branch, the latter means where HEAD used to be 1 moves ago
git config --global alias.dfr '!git -c color.diff.meta="cyan" log -C -D --no-merges --stat=200 --stat-count=20 --pretty=detail @{1}..HEAD'
git config --global alias.dfrp '!git -c color.diff.meta="cyan" log -C -D -p --no-merges --stat=200 --stat-count=20 --pretty=detail @{1}..HEAD'
git config --global alias.stm "stash push -u -m"
# Stash with interactively selecting patch
git config --global alias.stmp "stash push -p --no-keep-index -m"
git config --global alias.sta "stash apply"
git config --global alias.stl "stash list --stat=200 --stat-count=20 --pretty=stashsimple"
# Stash show, usage: git sts [<stash>|<stash_num>], example: git sts 0, git sts stash@{0}
git config --global alias.sts '!if [ -n "$1" ]; then num="$1"; else num="0"; fi; num=$(echo "$num" | sed "s/^\([0-9][0-9]*\)$\|^stash@\([0-9][0-9]*\)$/\1\2/"); rev=$(git rev-parse "stash@{$num}") || exit 1; git stash list --pretty=stashmsg -n 1 --skip "$num"; echo; lg="git log --graph --pretty=aligned $rev $rev~1^!"; eval $lg; echo; git diff -C -D -p --stat=200 "$rev~..$rev"; exit 0;'
# Stash rename, usage: git stash-rename <stash>|<stash_num> <message>, example: git stash-rename stash@{1} 'Changed message'
# See https://stackoverflow.com/a/25935360 for stash rename, regex replace is to fix a bug of mingw git-bash
git config --global alias.stash-rename '!if [ -n "$1" ]; then ref="$1"; else ref="stash@{0}"; fi; ref=$(echo "$ref" | sed "s/^\([0-9][0-9]*\)$\|^stash@\([0-9][0-9]*\)$/stash@{\1\2}/"); rev=$(git rev-parse "$ref") && git stash drop "$ref" || exit 1; git stash store -m "$2" "$rev"; exit 0;'
# Show remote brach tracking details
git config --global alias.sr "remote show origin"
git config --global alias.ff "merge --ff-only"
git config --global alias.rl "log -g --pretty=simplereflog --date=format:%Y-%m-%dT%H:%M:%S"
# Show reflog of current branch, note @{now} cannot be changed to @{0} or @ or HEAD@{now} or HEAD@{0} or ommited
git config --global alias.rlc "log -g --pretty=simplereflog @{now} --date=format:%Y-%m-%dT%H:%M:%S -n 30"
# Blame one file's line history at current version, usage: git bl <blamed_file_path>
git config --global alias.bl "blame -fnwC --"
# Blame one file's history, usually combined with query string, usage: git blh -S"<blamed_text>" [[<start_commit>..]<until_commit>] -- <blamed_file_path>
git config --global alias.blh '!git -c color.diff.meta="cyan" log -C -M -p --follow --ignore-space-at-eol --pretty=detail -F'

# Optional configuration
# Allow pull when current branch can be fast-forwarded only, cannot auto merge or rebase on pull
git config --global pull.ff "only"

