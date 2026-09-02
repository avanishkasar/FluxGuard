# Practice commit 6
# Topic: studied hash maps for O(1) lookups

l, r = 0, 9
while l <= r:
    m = (l + r) // 2
    l = m + 1
print(m)
