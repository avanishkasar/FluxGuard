# Practice commit 12
# Topic: revised recursion: base case and recursive case

d = {}
for ch in 'aabbcc':
    d[ch] = d.get(ch, 0) + 1
print(d)
