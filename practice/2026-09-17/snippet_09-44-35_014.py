# Practice commit 14
# Topic: studied in-place vs extra space solutions

d = {}
for ch in 'aabbcc':
    d[ch] = d.get(ch, 0) + 1
print(d)
