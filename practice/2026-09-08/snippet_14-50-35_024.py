# Practice commit 24
# Topic: practiced two sum using hash map approach

d = {}
for ch in 'aabbcc':
    d[ch] = d.get(ch, 0) + 1
print(d)
