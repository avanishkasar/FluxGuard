# Practice commit 3
# Topic: practiced two sum using hash map approach

l, r = 0, 9
while l <= r:
    m = (l + r) // 2
    l = m + 1
print(m)
