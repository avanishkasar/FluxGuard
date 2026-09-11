# Practice commit 3
# Topic: studied enumerate(): loop with index and value

d = {}
for ch in 'aabbcc':
    d[ch] = d.get(ch, 0) + 1
print(d)
