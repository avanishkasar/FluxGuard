# Practice commit 4
# Topic: revised dynamic programming overlapping subproblems

d = {}
for ch in 'aabbcc':
    d[ch] = d.get(ch, 0) + 1
print(d)
