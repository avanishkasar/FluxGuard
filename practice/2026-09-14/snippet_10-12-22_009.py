# Practice commit 9
# Topic: reviewed nested loops and multiplication table

l, r = 0, 9
while l <= r:
    m = (l + r) // 2
    l = m + 1
print(m)
