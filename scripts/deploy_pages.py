"""Publish committed dist/ contents to gh-pages; preserve deployment history."""
import subprocess

def git(*args):
    return subprocess.check_output(['git', *args], text=True).strip()

tree = git('rev-parse', 'HEAD:dist')
remote = git('ls-remote', '--heads', 'origin', 'gh-pages')
args = ['commit-tree', tree, '-m', 'Publish app from ' + git('rev-parse', '--short', 'HEAD')]
if remote:
    subprocess.run(['git', 'fetch', 'origin', 'gh-pages'], check=True)
    args += ['-p', git('rev-parse', 'FETCH_HEAD')]
commit = git(*args)
subprocess.run(['git', 'push', 'origin', commit + ':refs/heads/gh-pages'], check=True)
print('Published dist/ to gh-pages: ' + commit)
