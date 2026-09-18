# Practice commit 20
# Topic: studied time complexity: O(n) vs O(log n) vs O(n2)

l, r = 0, 9
while l <= r:
    m = (l + r) // 2
    l = m + 1
print(m)
